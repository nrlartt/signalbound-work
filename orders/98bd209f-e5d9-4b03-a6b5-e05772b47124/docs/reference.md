# API reference

## pay(address[] recipients, uint256[] amounts) payable

Pays many recipients ETH in one transaction. The caller must send ETH with the transaction equal to the sum of all amounts.

## Errors

- `LengthMismatch()` — fires when `recipients` and `amounts` differ in length.
- `EmptyBatch()` — fires when the batch is empty.
- `TooMany()` — fires when there are more than 200 recipients.
- `ZeroAddress(uint256 index)` — fires when `recipients[index]` is the zero address.
- `WrongValue(uint256 expected, uint256 total)` — fires unless `msg.value` equals the sum of `amounts` exactly. `expected` is the sum and `total` is `msg.value`.
- `TransferFailed(uint256 index)` — fires if any send fails. Because this is all-or-nothing, nobody is paid when this reverts.

## Event

- `Paid(address indexed payer, uint256 count, uint256 total)` — emitted when every recipient is paid. `payer` is the caller, `count` is the number of recipients, and `total` is the amount paid.

## Contract properties

- No owner.
- No fee.
- No `receive()` function.
- Keeps no ETH.

## Open questions

The brief does not state the visibility of `pay`, whether it is `external` or `public`, whether it is `nonReentrant`, the exact revert condition ordering, or the SPDX license identifier and Solidity pragma.