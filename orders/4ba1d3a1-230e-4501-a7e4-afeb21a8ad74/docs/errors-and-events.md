# Errors and event

## ZeroHash

ZeroHash is raised when add is called with a bytes32 value of zero. The brief does not state the solidity error signature or whether the error carries any data beyond its name; only that a zero hash reverts.

## Index

Index is raised when at is called with an index i that is out of range, meaning i is greater than or equal to the current row count. The brief does not state the error signature or any attached data.

## CastRecorded

CastRecorded is emitted whenever a row is successfully appended. It has three parameters: i, a uint256 indexed by the new row index; caster, an address indexed by the caller; and leadHash, a bytes32 holding the stored hash. The brief does not state whether the event is anonymous or whether any other events exist.

## Open questions

The brief does not give the Solidity error signatures for ZeroHash or Index, the event signature for CastRecorded, or the ABI encoding of any of them. It also does not say whether the contract uses custom errors or require statements under the hood. These are unspecified.