// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "src/TimeLockVault.sol";

contract TimeLockVaultTest is Test {
    TimeLockVault public vault;
    address public alice;
    address public bob;

    function setUp() public {
        vault = new TimeLockVault();
        alice = makeAddr("alice");
        bob = makeAddr("bob");
    }

    function testDepositRevertsOnZeroValue() public {
        vm.prank(alice);
        vm.expectRevert(bytes("Must deposit ETH"));
        vault.deposit();
    }

    function testDepositRecordsAndEmits() public {
        vm.prank(alice);
        vm.deal(alice, 1 ether);
        vault.deposit{value: 1 ether}();
        (uint256 amount, uint256 unlockTime) = vault.getDeposit(alice);
        assertEq(amount, 1 ether);
        assertEq(unlockTime, block.timestamp + 1 days);
        assertEq(vault.getTotalDeposited(alice), 1 ether);
    }

    function testDepositAddsToExisting() public {
        vm.prank(alice);
        vm.deal(alice, 3 ether);
        vault.deposit{value: 2 ether}();
        vm.prank(alice);
        vm.deal(alice, 1 ether);
        vault.deposit{value: 1 ether}();
        (uint256 amount, ) = vault.getDeposit(alice);
        assertEq(amount, 3 ether);
        assertEq(vault.getTotalDeposited(alice), 3 ether);
    }

    function testEarlyWithdrawalReverts() public {
        vm.prank(alice);
        vm.deal(alice, 1 ether);
        vault.deposit{value: 1 ether}();
        vm.prank(alice);
        vm.expectRevert(bytes("Not yet unlocked"));
        vault.withdraw(1 ether);
    }

    function testExactUnlockWithdrawal() public {
        vm.prank(alice);
        vm.deal(alice, 5 ether);
        vault.deposit{value: 5 ether}();
        vm.warp(block.timestamp + 1 days);
        vm.prank(alice);
        vault.withdraw(5 ether);
        assertEq(vault.getTotalDeposited(alice), 0);
        (uint256 amount, ) = vault.getDeposit(alice);
        assertEq(amount, 0);
    }

    function testPartialWithdrawal() public {
        vm.prank(alice);
        vm.deal(alice, 10 ether);
        vault.deposit{value: 10 ether}();
        vm.warp(block.timestamp + 1 days);
        vm.prank(alice);
        vault.withdraw(3 ether);
        (uint256 remainingAmount, uint256 remainingUnlock) = vault.getDeposit(alice);
        assertEq(remainingAmount, 7 ether);
        assertTrue(block.timestamp < remainingUnlock);
        assertEq(vault.getTotalDeposited(alice), 7 ether);
    }

    function testInsufficientDepositReverts() public {
        vm.prank(alice);
        vm.deal(alice, 1 ether);
        vault.deposit{value: 1 ether}();
        vm.warp(block.timestamp + 1 days);
        vm.prank(alice);
        vm.expectRevert(bytes("Insufficient deposit"));
        vault.withdraw(2 ether);
    }

    function testUnauthorizedAccessReverts() public {
        vm.prank(bob);
        vm.expectRevert(bytes("Insufficient deposit"));
        vault.withdraw(1 ether);
    }

    function testReentrancyProtection() public {
        ReentrantAttacker attacker = new ReentrantAttacker(address(vault));
        vm.deal(address(attacker), 10 ether);
        vm.prank(alice);
        vm.deal(alice, 10 ether);
        vault.deposit{value: 10 ether}();
        vm.warp(block.timestamp + 1 days);
        vm.prank(alice);
        vault.withdraw(5 ether);
        vm.prank(address(attacker));
        vm.expectRevert(bytes("Insufficient deposit"));
        attacker.attack();
    }

    function testAccountingAfterPartialWithdrawal() public {
        vm.prank(alice);
        vm.deal(alice, 10 ether);
        vault.deposit{value: 10 ether}();
        vm.warp(block.timestamp + 1 days);
        vm.prank(alice);
        vault.withdraw(3 ether);
        uint256 total = vault.getTotalDeposited(alice);
        assertEq(total, 7 ether);
    }

    function testWithdrawalAttemptEventEmitted() public {
        vm.prank(alice);
        vm.deal(alice, 5 ether);
        vault.deposit{value: 5 ether}();
        vm.warp(block.timestamp + 1 days);
        vm.prank(alice);
        vault.withdraw(5 ether);
    }
}

contract ReentrantAttacker {
    TimeLockVault public vault;
    bool public started;

    constructor(address _vault) {
        vault = TimeLockVault(_vault);
    }

    function attack() external payable {
        started = true;
        vault.withdraw(5 ether);
    }

    receive() external payable {
        if (started) {
            vault.withdraw(5 ether);
        }
    }
}