pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract IFulcrum is IERC20 {
    function tokenPrice() external view returns (uint256 price);
    function mint(address receiver, uint256 amount) external returns (uint256 minted);
    function burn(address receiver, uint256 amount) external returns (uint256 burned);
}
