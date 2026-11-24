// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/TicketBox.sol";

contract Handler {
    TicketBox public box;
    address[] public actors;
    uint256 public actorCount;

    constructor(TicketBox _box, address[] memory _actors) {
        box = _box;
        actors = _actors;
        actorCount = _actors.length;
    }

    function doBuy(uint256 actorIndex, uint256 n) public payable {
        address actor = actors[actorIndex % actorCount];
        (bool ok, ) = payable(actor).call{value: msg.value}(abi.encodeWithSelector(box.buy.selector, n));
        if (!ok) revert("buy call failed");
    }

    function doRefund(uint256 actorIndex, uint256 n) public {
        address actor = actors[actorIndex % actorCount];
        (bool ok, ) = payable(actor).call{value: 0}(abi.encodeWithSelector(box.refund.selector, n));
        if (!ok) revert("refund call failed");
    }
}

contract TicketBoxFuzz is Test {
    TicketBox public box;
    Handler public handler;
    address[] public actors;

    function setUp() public {
        box = new TicketBox(1 ether, 100);
        actors = new address[](3);
        actors[0] = makeAddr("actor1");
        actors[1] = makeAddr("actor2");
        actors[2] = makeAddr("actor3");
        handler = new Handler(box, actors);
    }

    function invariant_SoldNeverExceedsMax() public {
        uint256 max = bound(uint256(100), 1, 1000);
        TicketBox b = new TicketBox(1 ether, max);
        address[] memory a = new address[](3);
        a[0] = makeAddr("a0");
        a[1] = makeAddr("a1");
        a[2] = makeAddr("a2");
        Handler h = new Handler(b, a);
        uint256 rounds = bound(uint256(1), 1, 32);
        for (uint256 i = 0; i < rounds; i++) {
            uint256 idx = bound(uint256(0), 0, 2);
            uint256 n = bound(uint256(1), 1, 10);
            uint256 price = b.price();
            address actor = a[idx];
            vm.deal(actor, n * price);
            vm.prank(actor);
            b.buy{value: n * price}(n);
        }
        assertTrue(b.sold() <= max, "sold exceeds max");
    }

    function invariant_BalanceEqualsSoldTimesPrice() public {
        uint256 max = bound(uint256(100), 1, 1000);
        TicketBox b = new TicketBox(1 ether, max);
        address[] memory a = new address[](3);
        a[0] = makeAddr("a0");
        a[1] = makeAddr("a1");
        a[2] = makeAddr("a2");
        Handler h = new Handler(b, a);
        uint256 rounds = bound(uint256(1), 1, 32);
        for (uint256 i = 0; i < rounds; i++) {
            uint256 idx = bound(uint256(0), 0, 2);
            uint256 n = bound(uint256(1), 1, 10);
            uint256 price = b.price();
            address actor = a[idx];
            vm.deal(actor, n * price);
            vm.prank(actor);
            b.buy{value: n * price}(n);
        }
        assertEq(address(b).balance, b.sold() * b.price(), "balance mismatch");
    }

    function invariant_SoldEqualsSumOfTickets() public {
        uint256 max = bound(uint256(100), 1, 1000);
        TicketBox b = new TicketBox(1 ether, max);
        address[] memory a = new address[](3);
        a[0] = makeAddr("a0");
        a[1] = makeAddr("a1");
        a[2] = makeAddr("a2");
        Handler h = new Handler(b, a);
        uint256 rounds = bound(uint256(1), 1, 32);
        for (uint256 i = 0; i < rounds; i++) {
            uint256 idx = bound(uint256(0), 0, 2);
            uint256 n = bound(uint256(1), 1, 10);
            uint256 price = b.price();
            address actor = a[idx];
            vm.deal(actor, n * price);
            vm.prank(actor);
            b.buy{value: n * price}(n);
        }
        uint256 sum = b.ticketsOf(a[0]) + b.ticketsOf(a[1]) + b.ticketsOf(a[2]);
        assertEq(b.sold(), sum, "sold does not equal sum");
    }

    function testFuzz_BuyThenRefundRestoresBalance(uint256 actorIdx, uint256 n) public {
        actorIdx = bound(actorIdx, 0, 2);
        n = bound(n, 1, 10);
        address actor = actors[actorIdx];
        uint256 price = box.price();
        uint256 cost = n * price;
        vm.deal(actor, cost);
        vm.prank(actor);
        box.buy{value: cost}(n);
        uint256 before = address(this).balance;
        vm.prank(actor);
        box.refund(n);
        assertEq(address(this).balance, before, "balance not restored");
        assertEq(box.ticketsOf(actor), 0, "tickets not cleared");
    }
}
