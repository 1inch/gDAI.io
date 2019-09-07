pragma solidity ^0.5.0;

interface IGasToken {
    function freeUpTo(uint256 value) external returns (uint256 freed);
    function safeTransfer(address to, uint256 value) external;
}
