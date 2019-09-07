pragma solidity ^0.5.0;

import "@openzeppelin/contracts/ownership/Ownable.sol";
import "./GasDiscounter.sol";
import "./EarnedInterestERC20.sol";

contract gDAI is Ownable, EarnedInterestERC20, ERC20Detailed, GasDiscounter {

}
