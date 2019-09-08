pragma solidity ^0.5.0;

import "./IFulcrum.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract EarnedInterestERC20 is ERC20 {

    using SafeMath for uint256;

    IFulcrum private fulcrum = IFulcrum(0x14094949152EDDBFcd073717200DA82fEd8dC960);
    mapping(address => int256) public priceOf;

    function earnedInterest(address user) public view returns (uint256) {
        if (balanceOf(user) == 0) {
            return uint256(priceOf[user]);
        }
        return balanceOf(user) * uint256(int256(fulcrum.tokenPrice()) - priceOf[user]) / 1e18;
    }

    function _setEarnedInteres(address user, uint256 earned) internal {
        if (balanceOf(user) == 0) {
            priceOf[user] = int256(earned);
            return;
        }
        priceOf[user] = int256(fulcrum.tokenPrice()) - int256(earned * 1e18 / balanceOf(user));
    }

    function _transferEarnedInterestFirst(address from, address to, uint256 amount) internal {
        uint256 earned = earnedInterest(from);

        if (amount < earned) {
            _setEarnedInteres(from, earned.sub(amount));
        } else {
            _setEarnedInteres(from, 0);
            _burn(from, amount.sub(earned));
            _mint(to, amount);
        }
    }
}
