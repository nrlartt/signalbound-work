# ShardLog API

This page documents the public API of the ShardLog contract exactly as the brief defines it. No other functions exist.

## record(bytes32 glazeHash)

Any address may call record to append one row to the diary. The row holds the caller's address as msg.sender, block.timestamp as the time, and the supplied glazeHash. If glazeHash is zero, the call reverts with the ZeroHash error. The brief does not state a return value for record.

## count()

count returns the number of rows currently stored in the diary. The brief does not state the return type beyond describing it as a number.

## entry(uint256 i)

entry returns the row at index i as a triple: the potter's address, the timestamp, and the glazeHash. If i is out of range, the call reverts with the Index error.

## What the brief does not specify

- There is no constructor and no constructor arguments.
- There are no payable functions.
- There is no owner.
- The visibility and mutability modifiers (for example view or pure) are not stated in the brief.
- The return type of count is not stated beyond being a number.
- The return value of record is not stated.

## Open questions

- The exact Solidity signatures, including visibility and mutability, are unspecified.
- The return type of count is unspecified.
- Whether record returns anything is unspecified.