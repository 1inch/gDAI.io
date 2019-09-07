pragma solidity ^0.5.0;

import "./IFulcrum.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EarnedInterestERC20 is ERC20 {

    using SafeMath for uint256;

    IFulcrum private fulcrum = IFulcrum(0x14094949152EDDBFcd073717200DA82fEd8dC960);
    mapping(address => uint256) private priceOf;

    function earnedInterest(address user) public view returns (uint256) {

        if (priceOf[user] == 0) {

            return 0;
        }

        return balanceOf(user).mul(fulcrum.tokenPrice().sub(priceOf[user])).div(1e18);
    }

    function _setEarnedInteres(address user, uint256 interest) internal {

        priceOf[user] = fulcrum.tokenPrice().add(
            interest.mul(1e18).div(balanceOf(user))
        );
    }
}
