// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract PointsVault {
    error ZeroAmount();
    error OverLtv();
    error TooMuch();

    mapping(address => uint128) public collateral;
    mapping(address => uint128) public debt;
    uint128 public totalCollateral;
    uint128 public totalDebt;

    function deposit(uint128 amt) public {
        if (amt == 0) revert ZeroAmount();
        collateral[msg.sender] += amt;
        totalCollateral += amt;
    }

    function borrow(uint128 amt) public {
        if (amt == 0) revert ZeroAmount();
        uint256 newDebt = uint256(debt[msg.sender]) + uint256(amt);
        if (newDebt * 2 > uint256(totalCollateral)) revert OverLtv();
        debt[msg.sender] = uint128(newDebt);
        totalDebt += amt;
    }

    function repay(uint128 amt) public {
        if (amt == 0) revert ZeroAmount();
        if (amt > debt[msg.sender]) revert TooMuch();
        debt[msg.sender] -= amt;
        totalDebt -= amt;
    }

    function withdraw(uint128 amt) public {
        if (amt == 0) revert ZeroAmount();
        if (amt > collateral[msg.sender]) revert OverLtv();
        uint256 remaining = uint256(collateral[msg.sender]) - uint256(amt);
        if (remaining < uint256(totalDebt) * 2) revert OverLtv();
        collateral[msg.sender] = uint128(remaining);
        totalCollateral -= amt;
    }
}