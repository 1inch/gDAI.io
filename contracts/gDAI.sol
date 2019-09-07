pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "@openzeppelin/contracts/GSN/GSNRecipient.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";

import "./GasDiscounter.sol";
import "./EarnedInterestERC20.sol";
import "./IKyber.sol";

contract gDAI is Ownable, EarnedInterestERC20, ERC20Detailed, GasDiscounter, GSNRecipient {

    using SafeMath for uint256;
    using SafeERC20 for IERC20;
    using SafeERC20 for IGasToken;

    address feeReceiver;

    IERC20 public eth = IERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    IERC20 public dai = IERC20(0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359);
    IFulcrum public fulcrum = IFulcrum(0x14094949152EDDBFcd073717200DA82fEd8dC960);
    IKyber public kyber = IKyber(0x818E6FECD516Ecc3849DAf6845e3EC868087B755);

    modifier compensateGas {
        uint256 gasProvided = gasleft();
        _;
        if (_msgSender() == msg.sender && tx.origin == msg.sender) {
            _makeGasDiscount(gasProvided.sub(gasleft()));
        }
    }

    constructor(
        address _feeReceiver
    ) public ERC20Detailed("Gasless DAI", "gDAI", 18) {

        feeReceiver = _feeReceiver;
        dai.approve(address(fulcrum), uint256(- 1));
    }

    function setFeeReceiver(address _feeReceiver) public onlyOwner {

        feeReceiver = _feeReceiver;
    }

    function() external payable {

        // Allow get eth from subcalls only
        require(msg.sender != tx.origin);
    }

    function preRelayedCall(bytes calldata /*context*/) external returns (bytes32) {

        return "";
    }

    function postRelayedCall(
        bytes calldata /*context*/,
        bool /*success*/,
        uint actualCharge,
        bytes32 /*preRetVal*/
    ) external {

        (uint256 ethPrice,) = kyber.getExpectedRate(eth, dai, actualCharge);
        uint256 daiNeeded = actualCharge.mul(1e18).div(ethPrice);

        uint256 daiExtracted = _getFromFulcrum(daiNeeded);
        uint256 interest = earnedInterest(_msgSender());
        if (daiExtracted < interest) {
            _setEarnedInteres(_msgSender(), interest.sub(daiExtracted));
        } else {
            _setEarnedInteres(_msgSender(), 0);
            _burn(_msgSender(), daiExtracted.sub(interest));
        }

        kyber.tradeWithHint(
            dai,
            daiExtracted,
            eth,
            address(this),
            1 << 255,
            1,
            feeReceiver,
            ""
        );

        IRelayHub(getHubAddr()).depositFor.value(address(this).balance)(address(this));
    }

    function deposit(uint256 amount) public compensateGas {

        uint256 earned = earnedInterest(_msgSender());

        _mint(_msgSender(), amount);
        dai.safeTransferFrom(_msgSender(), address(this), amount);
        _putToFulcrum();

        _setEarnedInteres(_msgSender(), earned);
    }

    function withdraw(uint256 amount) public compensateGas {

        uint256 earned = earnedInterest(_msgSender());

        _burn(_msgSender(), amount);
        _getFromFulcrum(amount); // Get with extra
        dai.safeTransfer(_msgSender(), amount);
        _putToFulcrum(); // Return some extra

        _setEarnedInteres(_msgSender(), earned);
    }

    function transfer(address to, uint256 amount) public compensateGas returns (bool) {

        uint256 earnedFrom = earnedInterest(_msgSender());
        uint256 earnedTo = earnedInterest(to);

        bool res = super.transfer(to, amount);
        _setEarnedInteres(_msgSender(), earnedFrom);
        _setEarnedInteres(to, earnedTo);

        return res;
    }

    function transferFrom(address from, address to, uint256 amount) public compensateGas returns (bool) {

        uint256 earnedFrom = earnedInterest(from);
        uint256 earnedTo = earnedInterest(to);

        bool res = super.transferFrom(from, to, amount);

        _setEarnedInteres(from, earnedFrom);
        _setEarnedInteres(to, earnedTo);

        return res;
    }

    function approve(address to, uint256 amount) public compensateGas returns (bool) {

        return super.approve(to, amount);
    }

    // Check user have enough balance for gas compensation and method is allowed (have modifiers)
    function acceptRelayedCall(
        address /*relay*/,
        address from,
        bytes calldata encodedFunction,
        uint256 /*transactionFee*/,
        uint256 /*gasPrice*/,
        uint256 /*gasLimit*/,
        uint256 /*nonce*/,
        bytes calldata /*approvalData*/,
        uint256 maxPossibleCharge
    )
    external
    view
    returns (uint256, bytes memory)
    {

        address sender = from;
        // Avoid "Stack too deep" error
        (uint256 ethPrice,) = kyber.getExpectedRate(eth, dai, maxPossibleCharge);

        if (balanceOf(sender).add(earnedInterest(sender)) < maxPossibleCharge.mul(1e18).div(ethPrice)) {

            return (1, "Not enough gDAI to pay for Tx");
        }

        if (!compareBytesWithSelector(encodedFunction, this.transfer.selector) &&
        !compareBytesWithSelector(encodedFunction, this.transferFrom.selector) &&
        !compareBytesWithSelector(encodedFunction, this.approve.selector) &&
        !compareBytesWithSelector(encodedFunction, this.deposit.selector) &&
        !compareBytesWithSelector(encodedFunction, this.withdraw.selector))
        {
            return (2, "This gDAI function can't ba called via GSN");
        }

        return (0, "");
    }

    function withdrawFromRelayHub(uint256 amount) public onlyOwner {

        _withdrawDeposits(amount, msg.sender);
    }

    function withdrawGasToken(uint256 amount) public onlyOwner {

        gasToken.safeTransfer(msg.sender, amount);
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
}
