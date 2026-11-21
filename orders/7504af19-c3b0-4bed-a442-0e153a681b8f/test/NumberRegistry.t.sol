// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import "forge-std/Test.sol";
import "forge-std/console.sol";
import "../src/NumberRegistry.sol";

contract NumberRegistryTest is Test {
    NumberRegistry public registry;
    address public user1 = address(0x123);
    address public user2 = address(0x456);

    function setUp() public {
        registry = new NumberRegistry();
    }

    function testFirstSetStoresNumberAndIncrementsCount() public {
        vm.prank(user1);
        registry.set(42);

        (bool exists, uint256 n) = registry.get(user1);
        assertTrue(exists, "user1 should exist");
        assertEq(n, 42, "number should be 42");
        assertEq(registry.count(), 1, "count should be 1");
    }

    function testOverwriteKeepsCountUnchanged() public {
        vm.prank(user1);
        registry.set(10);
        assertEq(registry.count(), 1, "count should be 1 after first set");

        vm.prank(user1);
        registry.set(99);

        (bool exists, uint256 n) = registry.get(user1);
        assertTrue(exists, "user1 should still exist");
        assertEq(n, 99, "number should be overwritten to 99");
        assertEq(registry.count(), 1, "count should remain 1 after overwrite");
    }

    function testOverwriteDoesNotDecrementCount() public {
        vm.prank(user1);
        registry.set(10);
        assertEq(registry.count(), 1, "count should be 1 after first set");

        vm.prank(user1);
        registry.set(20);
        assertEq(registry.count(), 1, "count must not be decremented on overwrite");

        vm.prank(user1);
        registry.clear();
        assertEq(registry.count(), 0, "count should be 0 after clear");
    }

    function testClearDeletesEntryAndDecrementsCount() public {
        vm.prank(user1);
        registry.set(7);
        assertEq(registry.count(), 1, "count should be 1 before clear");

        vm.prank(user1);
        registry.clear();

        (bool exists, uint256 n) = registry.get(user1);
        assertFalse(exists, "user1 should not exist after clear");
        assertEq(n, 0, "number should be 0 after clear");
        assertEq(registry.count(), 0, "count should be 0 after clear");
    }

    function testClearWithoutEntryReverts() public {
        vm.prank(user1);
        vm.expectRevert(NumberRegistry.NoEntry.selector);
        registry.clear();
    }

    function testGetForUnknownAddressReturnsFalseAndZero() public {
        (bool exists, uint256 n) = registry.get(address(0x999));
        assertFalse(exists, "unknown address should not exist");
        assertEq(n, 0, "unknown address number should be 0");
    }

    function testEventsEmittedOnSetAndClear() public {
        vm.prank(user1);
        registry.set(42);

        vm.prank(user1);
        registry.clear();

        assertEq(registry.count(), 0, "count should be 0 after set and clear");
    }

    function testMultipleUsersCountIndependently() public {
        vm.prank(user1);
        registry.set(1);
        vm.prank(user2);
        registry.set(2);

        assertEq(registry.count(), 2, "count should be 2 for two users");

        vm.prank(user1);
        registry.clear();
        assertEq(registry.count(), 1, "count should be 1 after user1 clears");

        (bool exists2, uint256 n2) = registry.get(user2);
        assertTrue(exists2, "user2 should still exist");
        assertEq(n2, 2, "user2 number should remain 2");
    }
}
