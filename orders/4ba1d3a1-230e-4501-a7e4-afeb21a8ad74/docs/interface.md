# CastLog interface

CastLog is an append-only diary. Each row records the address that submitted the cast, the time the row was added, and the hash of the lead-line cast itself. Rows can only be added; nothing in the described interface removes or edits a row.

## add(bytes32 leadHash)

Any address may call add to append one row. The row stores msg.sender as the caster, block.timestamp as the time, and the supplied leadHash. A zero hash is not accepted: the call reverts with the ZeroHash error. On success the contract emits a CastRecorded event carrying the new row index, the caster address and the lead hash.

## length()

length returns the number of rows currently stored in the diary. It takes no arguments and returns a uint256.

## at(uint256 i)

at returns the contents of row i as a triple: the caster address, the timestamp, and the lead hash. If i is equal to or greater than the number of rows, the call reverts with the Index error.

## Limitations

The brief describes no constructor arguments, no payable functions, no owner and no pause switch. It does not specify a view or pure modifier for length or at, nor does it state whether the contract is deployed on any particular network. Those details are unspecified.