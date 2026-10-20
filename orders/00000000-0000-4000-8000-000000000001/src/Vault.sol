// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

contract Vault { uint256 public total; function deposit() external payable { total += msg.value; } }
