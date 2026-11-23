/// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PiggyVault {
    mapping(address => uint256) public balanceOf;
    uint256 public totalDeposits;

    error InsufficientBalance();
    error TransferFailed();

    constructor() {
    }

    function deposit() external payable {
        balanceOf[msg.sender] += msg.value;
        totalDeposits += msg.value;
    }

    function withdraw(uint256 amount) external {
        if (amount > balanceOf[msg.sender]) {
            revert InsufficientBalance();
        }
        balanceOf[msg.sender] -= amount;
        totalDeposits -= amount;
        (bool success, ) = payable(msg.sender).call{value: amount}(new bytes(0));
        if (!success) {
            revert TransferFailed();
        }
    }
}