pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract IGasToken is IERC20 {
    function freeUpTo(uint256 value) external returns (uint256 freed);
}
