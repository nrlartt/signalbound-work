// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import {Vault} from "src/Vault.sol";

contract VaultTest is Test {
    Vault vault;
    address user;
    address user2;

    function setUp() public {
        vault = new Vault();
        user = makeAddr("user");
        user2 = makeAddr("user2");
        vm.deal(user, 50 ether);
        vm.deal(user2, 60 ether);
    }

    function test_deposit_success() public {
        uint256 amount = 2 ether;
        vm.prank(user);
        vault.deposit{value: amount}();
        assertEq(vault.balances(user), amount);
        assertEq(vault.totalDeposited(), amount);
        assertEq(address(vault).balance, amount);
    }

    function test_deposit_multiple() public {
        vm.prank(user);
        vault.deposit{value: 1 ether}();
        vm.prank(user);
        vault.deposit{value: 3 ether}();
        vm.prank(user2);
        vault.deposit{value: 4 ether}();
        assertEq(vault.balances(user), 4 ether);
        assertEq(vault.balances(user2), 4 ether);
        assertEq(vault.totalDeposited(), 1 ether + 3 ether + 4 ether);
        assertEq(address(vault).balance, 4 ether + 4 ether);
    }

    function test_deposit_zero_reverts() public {
        vm.prank(user);
        vm.expectRevert(bytes("Cannot deposit zero"));
        vault.deposit{value: 0}();
    }

    function test_withdraw_success() public {
        vm.prank(user);
        vault.deposit{value: 5 ether}();
        uint256 balBefore = user.balance;
        vm.prank(user);
        vault.withdraw(1.5 ether);
        assertEq(vault.balances(user), 3.5 ether);
        assertEq(vault.totalDeposited(), 5 ether);
        assertEq(address(vault).balance, 3.5 ether);
        assertEq(user.balance, balBefore + 1.5 ether);
    }

    function test_withdraw_full_balance() public {
        vm.prank(user2);
        vault.deposit{value: 2 ether}();
        vm.prank(user2);
        vault.withdraw(2 ether);
        assertEq(vault.balances(user2), 0);
        assertEq(vault.totalDeposited(), 2 ether);
        assertEq(address(vault).balance, 0);
    }

    function test_withdraw_zero_reverts() public {
        vm.prank(user);
        vault.deposit{value: 2 ether}();
        vm.prank(user);
        vm.expectRevert(bytes("Cannot withdraw zero"));
        vault.withdraw(0);
    }

    function test_withdraw_exceeds_balance_reverts() public {
        vm.prank(user);
        vault.deposit{value: 2 ether}();
        vm.prank(user);
        vm.expectRevert(bytes("Insufficient balance"));
        vault.withdraw(3 ether);
    }

    function test_withdraw_when_balance_zero_reverts() public {
        vm.prank(user);
        vm.expectRevert(bytes("Insufficient balance"));
        vault.withdraw(1 ether);
    }

    function test_withdraw_transfer_failure_reverts() public {
        // Deploy a contract that always reverts on ETH receive
        RejectETHMock rejector = new RejectETHMock();
        // Give rejector ETH so they can deposit
        vm.deal(address(rejector), 2 ether);
        // Have rejector deposit ETH into vault (via call because deposit() is not payable by a contract directly)
        vm.prank(address(rejector));
        vault.deposit{value: 2 ether}();
        // Ensure vault has enough ETH for withdrawal (it does: 2 ether from rejector)

        // On withdraw to RejectETHMock, transfer fails and we should revert with message
        vm.prank(address(rejector));
        vm.expectRevert(bytes("ETH transfer failed"));
        vault.withdraw(2 ether);
    }

    function test_getBalance_view() public {
        vm.prank(user);
        vault.deposit{value: 2 ether}();
        vm.prank(user2);
        vault.deposit{value: 3 ether}();
        assertEq(vault.getBalance(user), 2 ether);
        assertEq(vault.getBalance(user2), 3 ether);
        address other = makeAddr("other");
        assertEq(vault.getBalance(other), 0);
    }

    function test_vaultBalance_view() public {
        vm.prank(user);
        vault.deposit{value: 2 ether}();
        vm.prank(user2);
        vault.deposit{value: 8 ether}();
        assertEq(vault.vaultBalance(), 10 ether);
        vm.prank(user2);
        vault.withdraw(3 ether);
        assertEq(vault.vaultBalance(), 7 ether);
    }

    function test_invariant_sum_balances_equals_vault() public {
        vm.prank(user);
        vault.deposit{value: 10 ether}();
        vm.prank(user2);
        vault.deposit{value: 6 ether}();
        vm.prank(user);
        vault.withdraw(2 ether);
        vm.prank(user2);
        vault.withdraw(1 ether);
        uint256 sum = vault.balances(user) + vault.balances(user2);
        assertLe(sum, vault.totalDeposited());
        assertEq(address(vault).balance, sum);
    }
}

contract RejectETHMock {
    receive() external payable {
        revert("rejected");
    }
    fallback() external payable {
        revert("rejected");
    }
}
