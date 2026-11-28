// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";

contract MockCoxswain {
    address public coxswain;
    uint32 public maxAge;
    uint32 public maxJump;

    constructor(address _coxswain, uint32 _maxAge, uint32 _maxJump) {
        coxswain = _coxswain;
        maxAge = _maxAge;
        maxJump = _maxJump;
    }
}
