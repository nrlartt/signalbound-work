// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/PiggyVault.sol";

contract RejectingReceiver {
    function deposit() external payable {
        payable(msg.sender).transfer(msg.value);
    }

    receive() external payable {
        revert("RejectingReceiver does not accept ETH");
    }
}

contract PiggyVaultFuzz is Test {
    PiggyVault public vault;
    address[] public actors;
    mapping(address => uint256) public expectedBalances;
    uint256 public expectedTotalDeposits;

    function setUp() public {
        vault = new PiggyVault();
        actors = new address[](3);
        actors[0] = makeAddr("actor0");
        actors[1] = makeAddr("actor1");
        actors[2] = makeAddr("actor2");
        expectedTotalDeposits = 0;
    }

    function testFuzz_InvariantsHold(
        uint256 actorIndex,
        uint256 depositAmount,
        uint256 withdrawAmount
    ) public {
        actorIndex = bound(actorIndex, 0, 2);
        depositAmount = bound(depositAmount, 1 wei, 100 ether);
        withdrawAmount = bound(withdrawAmount, 1 wei, 100 ether);

        address actor = actors[actorIndex];
        vm.deal(actor, depositAmount);
        vm.prank(actor);
        vault.deposit{value: depositAmount}();
        expectedBalances[actor] += depositAmount;
        expectedTotalDeposits += depositAmount;

        if (withdrawAmount <= vault.balanceOf(actor)) {
            vm.prank(actor);
            vault.withdraw(withdrawAmount);
            expectedBalances[actor] -= withdrawAmount;
            expectedTotalDeposits -= withdrawAmount;
        } else {
            vm.expectRevert(PiggyVault.InsufficientBalance.selector);
            vm.prank(actor);
            vault.withdraw(withdrawAmount);
        }

        assertEq(address(vault).balance, expectedTotalDeposits, "vault ETH balance must equal totalDeposits");

        uint256 sum = 0;
        for (uint256 i = 0; i < actors.length; i++) {
            sum += expectedBalances[actors[i]];
        }
        assertEq(sum, expectedTotalDeposits, "sum of balanceOf must equal totalDeposits");

        assertEq(vault.balanceOf(actor), expectedBalances[actor], "actor cannot withdraw more than deposited");
    }

    function testRevert_WithdrawMoreThanBalance() public {
        address actor = actors[0];
        vm.deal(actor, 1 ether);
        vm.prank(actor);
        vault.deposit{value: 1 ether}();
        expectedBalances[actor] += 1 ether;
        expectedTotalDeposits += 1 ether;

        vm.expectRevert(PiggyVault.InsufficientBalance.selector);
        vm.prank(actor);
        vault.withdraw(2 ether);
    }
}
