# WateringRoster

A sign-up book for watering slots at a conservatory. No ETH and no tokens move.

## Constants

- `DAYS = 7` — number of days in the roster.
- `SLOTS = 3` — number of slots per day.

## Functions

### `book(uint8 day, uint8 slot)`
Books a watering slot for `msg.sender`. Reverts `BadDay()` if `day >= 7`, `BadSlot()` if `slot >= 3`, `Taken()` if the slot is already occupied. Emits `Booked`.

### `cancel(uint8 day, uint8 slot)`
Cancels a slot previously booked by `msg.sender`. Reverts `BadDay()` if `day >= 7`, `BadSlot()` if `slot >= 3`, `NotHolder()` if `msg.sender` did not book the slot. Emits `Cancelled`.

### `swap(uint8 dayA, uint8 slotA, uint8 dayB, uint8 slotB)`
Swaps the holders of two slots. `msg.sender` must hold slot A. Slot B must be occupied by someone else. Reverts `BadDay()`/`BadSlot()` for out-of-range indices, `NotHolder()` if the caller does not hold A, `Empty()` if B is empty, `SameHolder()` if B is already held by the caller. Emits `Swapped`.

### `holder(uint8 day, uint8 slot) view returns (address)`
Returns the holder of a slot, or `address(0)` if empty. Reverts `BadDay()`/`BadSlot()` for out-of-range indices.

### `countOf(address who) view returns (uint256)`
Returns how many slots `who` currently holds.

## Custom Errors

- `BadDay()` — day index out of range.
- `BadSlot()` — slot index out of range.
- `Taken()` — slot already booked.
- `NotHolder()` — caller is not the holder of the referenced slot.
- `Empty()` — target slot in a swap is empty.
- `SameHolder()` — target slot in a swap is already held by the caller.

## Events

- `Booked(address indexed who, uint8 day, uint8 slot)`
- `Cancelled(address indexed who, uint8 day, uint8 slot)`
- `Swapped(address indexed a, address indexed b, uint8 dayA, uint8 slotA, uint8 dayB, uint8 slotB)`

## Tests

Run with `forge test`. The test suite covers every custom error, a book-cancel-book path, a swap between two different addresses, and a fuzz invariant asserting `countOf(actor)` always equals the number of slots where `holder == actor`.
