pragma solidity ^0.5.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IKyber {
    function getExpectedRate(IERC20 src, IERC20 dest, uint srcQty) external view
    returns (uint expectedRate, uint slippageRate);

    function tradeWithHint(
        IERC20 src,
        uint srcAmount,
        IERC20 dest,
        address destAddress,
        uint maxDestAmount,
        uint minConversionRate,
        address walletId,
        bytes calldata hint
    ) external payable returns (uint);
}
