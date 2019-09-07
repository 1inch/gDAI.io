pragma solidity ^0.5.0;

import "./IGasToken.sol";

contract GasDiscounter {
    IGasToken public constant gasToken = IGasToken(0x0000000000b3F879cb30FE243b4Dfee438691c04);

    modifier gasDiscount() {
        uint256 initialGasLeft = gasleft();
        _;
        _makeGasDiscount(initialGasLeft - gasleft());
    }

    function _makeGasDiscount(uint256 gasSpent) internal {
        uint256 tokens = (gasSpent + 14154) / 41130;
        gasToken.freeUpTo(tokens);
    }
}
