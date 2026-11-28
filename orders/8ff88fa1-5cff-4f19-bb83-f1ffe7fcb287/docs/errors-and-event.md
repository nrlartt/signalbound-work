# Errors and event

This page documents the revert conditions and the single event that ShardLog emits, as defined by the brief.

## ZeroHash

record reverts with ZeroHash when the supplied glazeHash is zero. The brief does not state whether ZeroHash is a custom error, a require message, or a revert string.

## Index

entry reverts with Index when the requested index i is out of range. The brief does not state whether Index is a custom error, a require message, or a revert string.

## Recorded

ShardLog emits Recorded whenever a row is appended. The event has three fields:

- i — uint256, indexed, the index of the newly appended row
- potter — address, indexed, the address that called record
- glazeHash — bytes32, the hash that was stored

The brief does not state the order in which the event is emitted relative to the state change, nor whether any other events exist.

## Open questions

- The Solidity error type for ZeroHash and Index is unspecified.
- The emitted index value for the first row is not explicitly stated, though it follows from the row being appended.
- Any behaviour beyond the API, errors, and event listed here is outside the brief.