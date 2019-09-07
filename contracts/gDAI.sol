pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./GasDiscounter.sol";
import "./EarnedInterestERC20.sol";
import "./IKyber.sol";

contract gDAI is Ownable, EarnedInterestERC20, ERC20Detailed, GasDiscounter {

    using SafeMath for uint256;
    using SafeERC20 for IERC20;

    IERC20 public eth = IERC20(0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE);
    IERC20 public dai = IERC20(0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359);
    IFulcrum public fulcrum = IFulcrum(0x14094949152EDDBFcd073717200DA82fEd8dC960);
    IKyber public kyber = IKyber(0x818E6FECD516Ecc3849DAf6845e3EC868087B755);

    modifier compensateGas {

        uint256 gasProvided = gasleft();
        _;

        if (getSender() != msg.sender) {

            _compensateGas(gasProvided.sub(gasleft()));
        } else {
            
            _makeGasDiscount(gasProvided.sub(gasleft()));
        }
    }

    constructor() public ERC20Detailed("Gasless DAI", "gDAI", 18) {

        dai.approve(address(fulcrum), uint256(- 1));
    }

    function() external payable {

        // Allow get eth from subcalls only
        require(msg.sender != tx.origin);
    }
}
