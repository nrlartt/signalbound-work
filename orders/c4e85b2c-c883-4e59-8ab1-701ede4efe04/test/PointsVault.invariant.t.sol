// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/PointsVault.sol";

contract PointsVaultInvariantTest is Test {
    PointsVault public vault;
    address[4] public actors;
    uint128[4] public ghostCollateral;
    uint128[4] public ghostDebt;
    uint128 public ghostDeposited;
    uint128 public ghostWithdrawn;

    function setUp() public {
        vault = new PointsVault();
        actors[0] = address(0x1111);
        actors[1] = address(0x2222);
        actors[2] = address(0x3333);
        actors[3] = address(0x4444);
        ghostDeposited = 0;
        ghostWithdrawn = 0;
        for (uint8 i = 0; i < 4; i++) {
            ghostCollateral[i] = 0;
            ghostDebt[i] = 0;
        }
    }

    function drive(uint8 actorIdx, uint8 action, uint128 amt) public {
        if (actorIdx >= 4) return;
        address actor = actors[actorIdx];
        vm.prank(actor);
        if (action == 0) {
            vault.deposit(amt);
            ghostCollateral[actorIdx] += amt;
            ghostDeposited += amt;
        } else if (action == 1) {
            vault.borrow(amt);
            ghostDebt[actorIdx] += amt;
        } else if (action == 2) {
            vault.repay(amt);
            ghostDebt[actorIdx] -= amt;
        } else if (action == 3) {
            vault.withdraw(amt);
            ghostCollateral[actorIdx] -= amt;
            ghostWithdrawn += amt;
        }
    }

    function checkInvariants() public view {
        uint256 sumCollateral = 0;
        uint256 sumDebt = 0;
        for (uint8 i = 0; i < 4; i++) {
            sumCollateral += uint256(vault.collateral(actors[i]));
            sumDebt += uint256(vault.debt(actors[i]));
            assertTrue(
                uint256(vault.debt(actors[i])) * 2 <= uint256(vault.collateral(actors[i])),
                "LTV invariant violated"
            );
        }
        assertEq(uint256(vault.totalCollateral()), sumCollateral, "totalCollateral mismatch");
        assertEq(uint256(vault.totalDebt()), sumDebt, "totalDebt mismatch");
        assertEq(
            uint256(ghostDeposited) - uint256(ghostWithdrawn),
            uint256(vault.totalCollateral()),
            "ghost total mismatch"
        );
    }

    function testFuzz_InvariantHolds(uint8 actorIdx, uint8 action, uint128 amt) public {
        vm.assume(actorIdx < 4);
        amt = uint128(bound(amt, 1, 100));
        vm.assume(action <= 3);
        if (action == 1) {
            uint256 newDebt = uint256(ghostDebt[actorIdx]) + uint256(amt);
            uint256 currentCollateral = uint256(ghostCollateral[actorIdx]);
            vm.assume(newDebt * 2 <= currentCollateral);
        }
        if (action == 2) {
            vm.assume(amt <= ghostDebt[actorIdx]);
        }
        if (action == 3) {
            vm.assume(amt <= ghostCollateral[actorIdx]);
            uint256 remaining = uint256(ghostCollateral[actorIdx]) - uint256(amt);
            uint256 currentDebt = uint256(ghostDebt[actorIdx]);
            vm.assume(remaining >= currentDebt * 2);
        }
        drive(actorIdx, action, amt);
        checkInvariants();
    }

    function testRevert_ZeroAmountDeposit() public {
        vm.expectRevert(PointsVault.ZeroAmount.selector);
        vault.deposit(0);
    }

    function testRevert_ZeroAmountBorrow() public {
        vm.expectRevert(PointsVault.ZeroAmount.selector);
        vault.borrow(0);
    }

    function testRevert_ZeroAmountRepay() public {
        vm.expectRevert(PointsVault.ZeroAmount.selector);
        vault.repay(0);
    }

    function testRevert_ZeroAmountWithdraw() public {
        vm.expectRevert(PointsVault.ZeroAmount.selector);
        vault.withdraw(0);
    }

    function testRevert_OverLtvBorrow() public {
        vm.prank(actors[0]);
        vault.deposit(100);
        vm.expectRevert(PointsVault.OverLtv.selector);
        vault.borrow(60);
    }

    function testRevert_OverLtvWithdraw() public {
        vm.prank(actors[0]);
        vault.deposit(100);
        vault.borrow(40);
        vm.expectRevert(PointsVault.OverLtv.selector);
        vault.withdraw(70);
    }

    function testRevert_TooMuchRepayExcess() public {
        vm.prank(actors[0]);
        vault.deposit(100);
        vault.borrow(41);
        vm.expectRevert(PointsVault.TooMuch.selector);
        vault.repay(42);
    }
}