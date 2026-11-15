// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

struct Deposit {
    uint256 amount;
    uint256 unlockTime;
}

contract TimeLockVault is Ownable, ReentrancyGuard {
    mapping(address => Deposit) public deposits;
    uint256 public constant ONE_DAY = 1 days;

    event DepositMade(address indexed depositor, uint256 amount, uint256 unlockTime);
    event WithdrawalAttempt(address indexed depositor, uint256 amount, bool success);

    constructor() Ownable(msg.sender) {}

    function deposit() external payable nonReentrant {
        require(msg.value > 0, "Must deposit ETH");

        uint256 newUnlockTime = block.timestamp + ONE_DAY;
        Deposit storage dep = deposits[msg.sender];
        dep.amount += msg.value;
        dep.unlockTime = newUnlockTime;

        emit DepositMade(msg.sender, msg.value, newUnlockTime);
    }

    function withdraw(uint256 amount) external nonReentrant {
        Deposit storage dep = deposits[msg.sender];
        require(dep.amount >= amount, "Insufficient deposit");
        require(block.timestamp >= dep.unlockTime, "Not yet unlocked");

        uint256 remaining = dep.amount - amount;
        dep.amount = remaining;

        if (remaining > 0) {
            dep.unlockTime = block.timestamp + ONE_DAY;
        } else {
            delete deposits[msg.sender];
        }

        payable(msg.sender).transfer(amount);

        emit WithdrawalAttempt(msg.sender, amount, true);
    }

    function getDeposit(address depositor) external view returns (uint256, uint256) {
        Deposit storage dep = deposits[depositor];
        return (dep.amount, dep.unlockTime);
    }

    function getTotalDeposited(address depositor) external view returns (uint256) {
        return deposits[depositor].amount;
    }
}
