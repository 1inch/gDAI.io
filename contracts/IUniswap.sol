pragma solidity ^0.5.0;

contract IUniswap {
    function getEthToTokenInputPrice(uint256 eth_sold) external view returns (uint256 tokens_bought);
}
