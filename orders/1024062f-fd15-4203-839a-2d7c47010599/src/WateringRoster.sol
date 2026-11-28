// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title WateringRoster
 * @dev A sign-up book for watering slots at a conservatory.
 * No ETH and no tokens move.
 */
contract WateringRoster {
    uint8 public constant DAYS = 7;
    uint8 public constant SLOTS = 3;

    // roster[day][slot] holds the address that booked it, or address(0) if empty
    mapping(uint8 => mapping(uint8 => address)) public roster;

    // Custom errors
    error BadDay();
    error BadSlot();
    error Taken();
    error NotHolder();
    error Empty();
    error SameHolder();

    // Events
    event Booked(address indexed who, uint8 day, uint8 slot);
    event Cancelled(address indexed who, uint8 day, uint8 slot);
    event Swapped(address indexed a, address indexed b, uint8 dayA, uint8 slotA, uint8 dayB, uint8 slotB);

    /**
     * @dev Book a watering slot.
     * @param day The day index (0-6).
     * @param slot The slot index (0-2).
     */
    function book(uint8 day, uint8 slot) external {
        if (day >= DAYS) revert BadDay();
        if (slot >= SLOTS) revert BadSlot();
        if (roster[day][slot] != address(0)) revert Taken();
        roster[day][slot] = msg.sender;
        emit Booked(msg.sender, day, slot);
    }

    /**
     * @dev Cancel a previously booked slot.
     * @param day The day index (0-6).
     * @param slot The slot index (0-2).
     */
    function cancel(uint8 day, uint8 slot) external {
        if (day >= DAYS) revert BadDay();
        if (slot >= SLOTS) revert BadSlot();
        if (roster[day][slot] != msg.sender) revert NotHolder();
        roster[day][slot] = address(0);
        emit Cancelled(msg.sender, day, slot);
    }

    /**
     * @dev Swap two slots. The caller must hold slot A; slot B must be held by someone else.
     * @param dayA Day index of slot A.
     * @param slotA Slot index of slot A.
     * @param dayB Day index of slot B.
     * @param slotB Slot index of slot B.
     */
    function swap(uint8 dayA, uint8 slotA, uint8 dayB, uint8 slotB) external {
        if (dayA >= DAYS) revert BadDay();
        if (slotA >= SLOTS) revert BadSlot();
        if (dayB >= DAYS) revert BadDay();
        if (slotB >= SLOTS) revert BadSlot();

        address holderA = roster[dayA][slotA];
        address holderB = roster[dayB][slotB];

        if (holderA != msg.sender) revert NotHolder();
        if (holderB == address(0)) revert Empty();
        if (holderB == msg.sender) revert SameHolder();

        roster[dayA][slotA] = holderB;
        roster[dayB][slotB] = holderA;

        emit Swapped(holderA, holderB, dayA, slotA, dayB, slotB);
    }

    /**
     * @dev Get the holder of a slot.
     * @param day The day index.
     * @param slot The slot index.
     * @return The holder address, or address(0) if empty.
     */
    function holder(uint8 day, uint8 slot) external view returns (address) {
        if (day >= DAYS) revert BadDay();
        if (slot >= SLOTS) revert BadSlot();
        return roster[day][slot];
    }

    /**
     * @dev Count how many slots an address currently holds.
     * @param who The address to count slots for.
     * @return The number of slots held by who.
     */
    function countOf(address who) external view returns (uint256) {
        uint256 count = 0;
        for (uint8 d = 0; d < DAYS; d++) {
            for (uint8 s = 0; s < SLOTS; s++) {
                if (roster[d][s] == who) count++;
            }
        }
        return count;
    }
}