// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/WeightBook.sol";

contract WeightBookTest is Test {
    WeightBook public wb;
    address public curator = address(0x123);
    address public other = address(0x456);
    uint16[3] public initialWeights = [4000, 3500, 2500];
    uint16[3] public newWeights = [5000, 3000, 2000];

    function setUp() public {
        wb = new WeightBook(curator, initialWeights);
    }

    function testRevertZeroCurator() public {
        vm.expectRevert(WeightBook.ZeroCurator.selector);
        new WeightBook(address(0), initialWeights);
    }

    function testRevertBadWeightsConstructor() public {
        uint16[3] memory bad = [4000, 3500, 2400];
        vm.expectRevert(WeightBook.BadWeights.selector);
        new WeightBook(curator, bad);
    }

    function testRevertNotCuratorPropose() public {
        vm.prank(other);
        vm.expectRevert(WeightBook.NotCurator.selector);
        wb.propose(newWeights);
    }

    function testRevertBadWeightsPropose() public {
        vm.prank(curator);
        uint16[3] memory bad = [5000, 3000, 1900];
        vm.expectRevert(WeightBook.BadWeights.selector);
        wb.propose(bad);
    }

    function testRevertNoProposalExecute() public {
        vm.expectRevert(WeightBook.NoProposal.selector);
        wb.execute();
    }

    function testRevertNoProposalCancel() public {
        vm.prank(curator);
        vm.expectRevert(WeightBook.NoProposal.selector);
        wb.cancel();
    }

    function testRevertTooEarlyExecute() public {
        vm.prank(curator);
        wb.propose(newWeights);
        vm.expectRevert(WeightBook.TooEarly.selector);
        wb.execute();
    }

    function testExecuteAppliesAfterDelay() public {
        vm.prank(curator);
        wb.propose(newWeights);
        (uint16[3] memory w, uint64 eta, bool exists) = wb.pending();
        assertTrue(exists);
        assertEq(w[0], newWeights[0]);
        assertEq(w[1], newWeights[1]);
        assertEq(w[2], newWeights[2]);
        assertEq(eta, block.timestamp + 2 days);

        vm.warp(eta);
        wb.execute();

        assertEq(wb.weights(0), newWeights[0]);
        assertEq(wb.weights(1), newWeights[1]);
        assertEq(wb.weights(2), newWeights[2]);
        (, , exists) = wb.pending();
        assertFalse(exists);
    }

    function testRevertExpiredExecute() public {
        vm.prank(curator);
        wb.propose(newWeights);
        (, uint64 eta, ) = wb.pending();
        vm.warp(uint256(eta + 7 days + 1));
        vm.expectRevert(WeightBook.Expired.selector);
        wb.execute();
    }

    function testSecondProposeReplacesAndResetsEta() public {
        vm.prank(curator);
        wb.propose(newWeights);
        (, uint64 eta1, ) = wb.pending();
        vm.warp(1 hours);
        uint16[3] memory third = [6000, 2000, 2000];
        vm.prank(other);
        vm.expectRevert(WeightBook.NotCurator.selector);
        wb.propose(third);
    }

    function testCancel() public {
        vm.prank(curator);
        wb.propose(newWeights);
        vm.prank(other);
        vm.expectRevert(WeightBook.NotCurator.selector);
        wb.cancel();
    }

    function testRevertCancelNotCurator() public {
        vm.prank(curator);
        wb.propose(newWeights);
        vm.prank(other);
        vm.expectRevert(WeightBook.NotCurator.selector);
        wb.cancel();
    }

    function testFuzzExecutedWeightsSumTo10000(uint16 a, uint16 b, uint16 c) public {
        if (uint256(a) + uint256(b) + uint256(c) != 10000) {
            return;
        }
        vm.prank(curator);
        wb.propose([a, b, c]);
        vm.warp(2 days);
        wb.execute();
        assertEq(uint256(wb.weights(0)) + uint256(wb.weights(1)) + uint256(wb.weights(2)), 10000);
    }
}