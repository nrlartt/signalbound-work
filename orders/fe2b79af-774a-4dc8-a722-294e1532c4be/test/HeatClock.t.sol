// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/HeatClock.sol";

contract HeatClockTest is Test {
    HeatClock public clock;
    address public keeper0 = address(0x1111);
    address public keeper1 = address(0x2222);
    address public keeper2 = address(0x3333);
    address public notKeeper = address(0x9999);
    bytes32 public constant HEAT = bytes32(uint256(1));

    function setUp() public {
        vm.deal(keeper0, 1 ether);
        vm.deal(keeper1, 1 ether);
        vm.deal(keeper2, 1 ether);
        vm.deal(notKeeper, 1 ether);
        address[3] memory _keepers;
        _keepers[0] = keeper0;
        _keepers[1] = keeper1;
        _keepers[2] = keeper2;
        clock = new HeatClock(_keepers);
    }

    function testBadKeepersZero() public {
        address[3] memory _keepers;
        _keepers[0] = address(0);
        _keepers[1] = keeper1;
        _keepers[2] = keeper2;
        vm.expectRevert(HeatClock.BadKeepers.selector);
        new HeatClock(_keepers);
    }

    function testBadKeepersDuplicate() public {
        address[3] memory _keepers;
        _keepers[0] = keeper0;
        _keepers[1] = keeper0;
        _keepers[2] = keeper2;
        vm.expectRevert(HeatClock.BadKeepers.selector);
        new HeatClock(_keepers);
    }

    function testReportNotKeeper() public {
        vm.prank(notKeeper);
        vm.expectRevert(HeatClock.NotKeeper.selector);
        clock.report(HEAT, 5000);
    }

    function testReportZeroTime() public {
        vm.prank(keeper0);
        vm.expectRevert(HeatClock.ZeroTime.selector);
        clock.report(HEAT, 0);
    }

    function testReportAlreadyReported() public {
        vm.prank(keeper0);
        clock.report(HEAT, 5000);
        vm.prank(keeper0);
        vm.expectRevert(HeatClock.AlreadyReported.selector);
        clock.report(HEAT, 6000);
    }

    function testOfficialTimeOpenBeforeFinalisation() public {
        vm.prank(keeper0);
        clock.report(HEAT, 5000);
        vm.expectRevert(HeatClock.Open.selector);
        clock.officialTime(HEAT);
    }

    function testMedian9000_4000_5000Is5000() public {
        vm.prank(keeper0);
        clock.report(HEAT, 9000);
        vm.prank(keeper1);
        clock.report(HEAT, 4000);
        vm.prank(keeper2);
        clock.report(HEAT, 5000);
        assertEq(clock.officialTime(HEAT), 5000, "median should be 5000");
    }

    function testMedian1200_1200_8000Is1200() public {
        bytes32 heat = bytes32(uint256(2));
        vm.prank(keeper0);
        clock.report(heat, 1200);
        vm.prank(keeper1);
        clock.report(heat, 1200);
        vm.prank(keeper2);
        clock.report(heat, 8000);
        assertEq(clock.officialTime(heat), 1200, "median should be 1200");
    }

    function testMedian3000_3000_3000Is3000() public {
        bytes32 heat = bytes32(uint256(3));
        vm.prank(keeper0);
        clock.report(heat, 3000);
        vm.prank(keeper1);
        clock.report(heat, 3000);
        vm.prank(keeper2);
        clock.report(heat, 3000);
        assertEq(clock.officialTime(heat), 3000, "median should be 3000");
    }

    function testEmitsReportedAndOfficial() public {
        vm.prank(keeper0);
        clock.report(HEAT, 5000);
        vm.prank(keeper1);
        clock.report(HEAT, 4000);
        vm.prank(keeper2);
        clock.report(HEAT, 3000);
        vm.expectRevert(HeatClock.AlreadyReported.selector);
        vm.prank(keeper0);
        clock.report(HEAT, 5000);
    }

    function testFuzzMedianIsOneOfReportedAndBetweenMinMax(bytes32 heat, uint32 t0, uint32 t1, uint32 t2) public {
        if (t0 == 0 || t1 == 0 || t2 == 0) {
            return;
        }
        vm.prank(keeper0);
        clock.report(heat, t0);
        vm.prank(keeper1);
        clock.report(heat, t1);
        vm.prank(keeper2);
        clock.report(heat, t2);

        uint32 official = clock.officialTime(heat);
        bool isOneOf = official == t0 || official == t1 || official == t2;
        uint32 mn = t0 < t1 ? (t0 < t2 ? t0 : t2) : (t1 < t2 ? t1 : t2);
        uint32 mx = t0 > t1 ? (t0 > t2 ? t0 : t2) : (t1 > t2 ? t1 : t2);
        assertTrue(isOneOf, "official must equal one of the reported values");
        assertTrue(official >= mn && official <= mx, "official must lie between min and max");
    }
}

contract HeatCardTest is Test {
    HeatClock public clock;
    HeatCard public card;
    address public keeper0 = address(0x1111);
    address public keeper1 = address(0x2222);
    address public keeper2 = address(0x3333);
    bytes32 public constant HEAT = bytes32(uint256(42));

    function setUp() public {
        vm.deal(keeper0, 1 ether);
        vm.deal(keeper1, 1 ether);
        vm.deal(keeper2, 1 ether);
        address[3] memory _keepers;
        _keepers[0] = keeper0;
        _keepers[1] = keeper1;
        _keepers[2] = keeper2;
        clock = new HeatClock(_keepers);
        card = new HeatCard(address(clock));
    }

    function testTimeOfReturnsOfficialTime() public {
        vm.prank(keeper0);
        clock.report(HEAT, 7000);
        vm.prank(keeper1);
        clock.report(HEAT, 2000);
        vm.prank(keeper2);
        clock.report(HEAT, 5000);
        assertEq(card.timeOf(HEAT), 5000, "consumer should read official time");
    }

    function testTimeOfRevertsWhenOpen() public {
        vm.expectRevert(HeatClock.Open.selector);
        card.timeOf(HEAT);
    }
}
