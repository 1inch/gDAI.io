pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/GSN/GSNRecipient.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./GasDiscounter.sol";
import "./EarnedInterestERC20.sol";
import "./IUniswap.sol";

contract gDAI is Ownable, EarnedInterestERC20, ERC20Detailed, GasDiscounter, GSNRecipient {

    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using SafeERC20 for IGasToken;

    address public feeReceiver;

    IERC20 public eth = IERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    IERC20 public dai = IERC20(0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359);
    IFulcrum public fulcrum = IFulcrum(0x14094949152EDDBFcd073717200DA82fEd8dC960);
    IUniswap public uniswap = IUniswap(0x09cabEC1eAd1c0Ba254B09efb3EE13841712bE14);

    modifier compensateGas {
        uint256 gasProvided = gasleft();
        _;
        if (_msgSender() == msg.sender) {
            if (tx.origin == msg.sender) {
                _makeGasDiscount(gasProvided.sub(gasleft()));
            }
        } else {
            _compensateGas(gasProvided.sub(gasleft()));
        }
    }

    constructor() public ERC20Detailed("Gasless DAI", "gDAI", 18) {

        dai.approve(address(fulcrum), uint256(- 1));
        dai.approve(address(uniswap), uint256(- 1));
    }

    function() external payable {

        if (msg.value != 0) {
            IRelayHub(getHubAddr()).depositFor.value(msg.value)(address(this));
            return;
        }

        if (msg.sender == owner()) {
            _withdrawDeposits(IRelayHub(getHubAddr()).balanceOf(address(this)), msg.sender);
            gasToken.safeTransfer(msg.sender, gasToken.balanceOf(address(this)));
        }
    }

    function preRelayedCall(bytes calldata /*context*/) external returns (bytes32) {
    }

    function postRelayedCall(bytes calldata /*context*/, bool /*success*/, uint /*actualCharge*/, bytes32 /*preRetVal*/) external {
    }

    function deposit(uint256 amount) public compensateGas {

        uint256 earned = earnedInterest(_msgSender());

        _mint(_msgSender(), amount);
        dai.safeTransferFrom(_msgSender(), address(this), amount);
        _putToFulcrum();

        _setEarnedInteres(_msgSender(), earned);
    }

    function withdrawAll() public compensateGas {
        withdraw(balanceOf(msg.sender));
    }

    function withdraw(uint256 amount) public compensateGas {

        uint256 earned = earnedInterest(_msgSender());

        _burn(_msgSender(), amount);
        _getFromFulcrum(amount);
        dai.safeTransfer(_msgSender(), amount);

        _setEarnedInteres(_msgSender(), earned);
    }

    function transfer(address to, uint256 amount) public compensateGas returns (bool) {

        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public compensateGas returns (bool) {

        return super.transferFrom(from, to, amount);
    }

    function approve(address to, uint256 amount) public compensateGas returns (bool) {

        return super.approve(to, amount);
    }

    function _transfer(address from, address to, uint256 amount) internal {

        uint256 earnedFrom = earnedInterest(from);
        uint256 earnedTo = earnedInterest(to);

        super._transfer(from, to, amount);

        _setEarnedInteres(from, earnedFrom);
        _setEarnedInteres(to, earnedTo);
    }

    // Check user have enough balance for gas compensation and method is allowed (have modifiers)
    function acceptRelayedCall(
        address /*relay*/,
        address from,
        bytes memory encodedFunction,
        uint256 /*transactionFee*/,
        uint256 /*gasPrice*/,
        uint256 /*gasLimit*/,
        uint256 /*nonce*/,
        bytes memory /*approvalData*/,
        uint256 maxPossibleCharge
    )
    public
    view
    returns (uint256, bytes memory)
    {
        // Avoid "Stack too deep" error
        address sender = from;

        uint256 ethPrice = uniswap.getEthToTokenInputPrice(maxPossibleCharge);

        uint256 subAmount;
        if (compareBytesWithSelector(encodedFunction, this.transfer.selector)) {

            assembly {
                subAmount := sload(add(encodedFunction, 68))
            }
        }

        if (compareBytesWithSelector(encodedFunction, this.withdraw.selector)) {

            assembly {
                subAmount := sload(add(encodedFunction, 36))
            }
        }

        if (balanceOf(sender).sub(subAmount).add(earnedInterest(sender)) < maxPossibleCharge.mul(1e18).div(ethPrice)) {

            return (1, "Not enough gDAI to pay for Tx");
        }

        if (!compareBytesWithSelector(encodedFunction, this.transfer.selector) &&
            !compareBytesWithSelector(encodedFunction, this.transferFrom.selector) &&
            !compareBytesWithSelector(encodedFunction, this.approve.selector) &&
            !compareBytesWithSelector(encodedFunction, this.deposit.selector) &&
            !compareBytesWithSelector(encodedFunction, this.withdraw.selector) &&
            !compareBytesWithSelector(encodedFunction, this.withdrawAll.selector))
        {
            return (2, "This gDAI function can't ba called via GSN");
        }

        return (0, "");
    }

    function compareBytesWithSelector(bytes memory data, bytes4 sel) internal pure returns (bool) {

        return data[0] == sel[0]
            && data[1] == sel[1]
            && data[2] == sel[2]
            && data[3] == sel[3];
    }

    function _putToFulcrum() internal {

        fulcrum.mint(address(this), dai.balanceOf(address(this)));
    }

    function _getFromFulcrum(uint256 amount) internal returns (uint256 actualAmount) {

        uint256 iDAIAmount = amount.add(1e16).mul(fulcrum.tokenPrice()).div(1e18);
        return fulcrum.burn(address(this), iDAIAmount);
    }

    function _compensateGas(uint256 gasSpent) internal {
        uint256 actualCharge = tx.gasprice.mul(gasSpent);
        uint256 ethPrice = uniswap.getEthToTokenInputPrice(actualCharge);
        uint256 daiNeeded = actualCharge.mul(1e18).div(ethPrice);

        // If relay balance > 10 transactions
        if (IRelayHub(getHubAddr()).balanceOf(address(this)) > tx.gasprice.mul(gasSpent).mul(10)) {

            _transferEarnedInterestFirst(_msgSender(), address(this), daiNeeded);
            return;
        }

        actualCharge = actualCharge.add(tx.gasprice.mul(100000)); // +100K for Uniswap
        daiNeeded = actualCharge.mul(1e18).div(ethPrice);
        _transferEarnedInterestFirst(_msgSender(), address(this), daiNeeded);

        _getFromFulcrum(daiNeeded);

        uniswap.tokenToEthSwapInput(
            dai.balanceOf(address(this)),
            1,
            block.number + 1
        );
    }
}
