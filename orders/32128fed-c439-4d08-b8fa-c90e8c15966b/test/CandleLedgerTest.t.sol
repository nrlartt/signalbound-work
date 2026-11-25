// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/CandleLedger.sol";

contract CandleLedgerTest is Test {
    CandleLedger public ledger;
    Handler public handler;
    address public beneficiary;
    address[3] public actors;

    function setUp() public {
        beneficiary = makeAddr("beneficiary");
        ledger = new CandleLedger(beneficiary);
        handler = new Handler(ledger);
        actors[0] = makeAddr("actor1");
        actors[1] = makeAddr("actor2");
        actors[2] = makeAddr("actor3");
        for (uint256 i = 0; i < 3; i++) {
            handler.registerActor(actors[i]);
        }
    }

    function testFuzz_LightBelowMinimumReverts(
        address user,
        bytes32 dedication,
        uint256 value
    ) public {
        user = address(uint160(bound(uint256(uint160(user)), 0x1000, type(uint160).max)));
        value = bound(value, 0, 999 gwei);
        vm.deal(user, 1 ether);
        vm.prank(user);
        vm.expectRevert(bytes("CandleLedger: value below minimum"));
        ledger.light{value: value}(dedication);
    }

    function invariant_TotalCandlesEqualsSumOfActors() public view {
        uint256 sum = 0;
        for (uint256 i = 0; i < 3; i++) {
            sum += ledger.candlesOf(actors[i]);
        }
        assertEq(sum, ledger.totalCandles());
    }

    function invariant_TotalPaidEqualsSumOfActors() public view {
        uint256 sum = 0;
        for (uint256 i = 0; i < 3; i++) {
            sum += ledger.paidBy(actors[i]);
        }
        assertEq(sum, ledger.totalPaid());
    }

    function invariant_BalancePlusSweptEqualsTotalPaid() public view {
        assertEq(address(ledger).balance + ledger.swept(), ledger.totalPaid());
    }

    function invariant_BeneficiaryReceivedEqualsSwept() public view {
        assertEq(ledger.swept(), address(beneficiary).balance);
    }
}
