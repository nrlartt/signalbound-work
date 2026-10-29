// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/Vault.sol";

// Contract that does NOT accept ETH (no receive/fallback), causing low‑level call to return false.
contract Rejector {}

contract VaultTest is Test {
    Vault public vault;
    address public user1;
    address public user2;

    function setUp() public {
        vault = new Vault();
        user1 = makeAddr("user1");
        user2 = makeAddr("user2");
        vm.deal(user1, 1e24);
        vm.deal(user2, 1e24);
    }

    function testDepositIncreasesBalanceAndTotal() public {
        uint256 amount = 1 ether;
        vm.prank(user1);
        vault.deposit{value: amount}();

        assertEq(vault.balanceOf(user1), amount);
        assertEq(vault.totalDeposits(), amount);
    }

    function testWithdrawDecreasesBalanceAndTotal() public {
        uint256 depositAmount = 1 ether;
        uint256 withdrawAmount = 0.5 ether;

        vm.prank(user1);
        vault.deposit{value: depositAmount}();

        vm.prank(user1);
        vault.withdraw(withdrawAmount);

        assertEq(vault.balanceOf(user1), depositAmount - withdrawAmount);
        assertEq(vault.totalDeposits(), depositAmount - withdrawAmount);
    }

    function testWithdrawRevertsWhenInsufficientBalance() public {
        uint256 depositAmount = 1 ether;
        uint256 withdrawAmount = 2 ether;

        vm.prank(user1);
        vault.deposit{value: depositAmount}();

        vm.expectRevert(abi.encodeWithSelector(Vault.InsufficientBalance.selector, withdrawAmount, depositAmount));
        vm.prank(user1);
        vault.withdraw(withdrawAmount);
    }

    function testWithdrawRevertsWhenTransferFails() public {
        // Deploy a contract that rejects ETH.
        Rejector rejector = new Rejector();
        address rejectorAddr = address(rejector);
        uint256 depositAmount = 1 ether;

        // Fund the rejector address so it can call deposit.
        vm.deal(rejectorAddr, depositAmount);
        vm.prank(rejectorAddr);
        vault.deposit{value: depositAmount}();

        // Expect the low‑level call to fail and the require to revert with the exact string.
        vm.expectRevert(bytes("Transfer failed"));
        vm.prank(rejectorAddr);
        vault.withdraw(depositAmount);
    }

    function testBalanceOfReturnsZeroForUnknownUser() public {
        assertEq(vault.balanceOf(address(0)), 0);
    }

    function testFuzz_DepositWithdraw(
        address _user1,
        address _user2,
        uint256 depositAmt1,
        uint256 depositAmt2,
        uint256 withdrawAmt1,
        uint256 withdrawAmt2
    ) public {
        // Ensure we work with distinct, non‑zero EOAs.
        vm.assume(_user1 != address(0) && _user2 != address(0));
        vm.assume(_user1 != _user2);
        vm.assume(_user1.code.length == 0 && _user2.code.length == 0);
        vm.assume(depositAmt1 <= 1e24 && depositAmt2 <= 1e24);
        vm.assume(withdrawAmt1 <= depositAmt1 && withdrawAmt2 <= depositAmt2);

        vm.deal(_user1, depositAmt1);
        vm.deal(_user2, depositAmt2);

        vm.startPrank(_user1);
        vault.deposit{value: depositAmt1}();
        vm.stopPrank();

        vm.startPrank(_user2);
        vault.deposit{value: depositAmt2}();
        vm.stopPrank();

        uint256 expectedTotal = depositAmt1 + depositAmt2;
        assertEq(vault.totalDeposits(), expectedTotal);
        assertEq(vault.balanceOf(_user1), depositAmt1);
        assertEq(vault.balanceOf(_user2), depositAmt2);

        if (withdrawAmt1 > 0) {
            vm.startPrank(_user1);
            vault.withdraw(withdrawAmt1);
            vm.stopPrank();
        }

        if (withdrawAmt2 > 0) {
            vm.startPrank(_user2);
            vault.withdraw(withdrawAmt2);
            vm.stopPrank();
        }

        uint256 bal1 = depositAmt1 - withdrawAmt1;
        uint256 bal2 = depositAmt2 - withdrawAmt2;
        uint256 total = bal1 + bal2;

        assertEq(vault.totalDeposits(), total);
        assertEq(vault.balanceOf(_user1), bal1);
        assertEq(vault.balanceOf(_user2), bal2);
    }

    function testFuzz_WithdrawRevertsIfInsufficient(
        address _user,
        uint256 depositAmt,
        uint256 withdrawAmt
    ) public {
        vm.assume(_user != address(0));
        vm.assume(_user.code.length == 0);
        vm.assume(depositAmt > 0);
        vm.assume(withdrawAmt > depositAmt);

        vm.deal(_user, depositAmt);
        vm.startPrank(_user);
        vault.deposit{value: depositAmt}();
        vm.stopPrank();

        vm.expectRevert(abi.encodeWithSelector(Vault.InsufficientBalance.selector, withdrawAmt, depositAmt));
        vm.startPrank(_user);
        vault.withdraw(withdrawAmt);
        vm.stopPrank();
    }
}
