# ShardLog

ShardLog is a small Solidity contract that keeps an append-only diary of glaze-test shard hashes, written by the potters themselves. Each row records the address that submitted it, the time it was recorded, and the glaze-test shard hash itself.

## What this document set covers

This bundle contains the documentation for ShardLog only. It describes the public API, the errors the contract can revert with, and the event it emits. A short examples page shows how the API may be used from JavaScript with ethers v6.

## What the brief does not say

The brief does not state a Solidity compiler version, a software licence, a deployed contract address, or any network details. These are left unspecified rather than invented.

## Files

- README.md — this overview
- docs/api.md — public API: record, count, entry
- docs/errors-and-event.md — revert errors and the Recorded event
- docs/examples.md — short usage examples with ethers v6

## How to read this

Read docs/api.md for the function signatures and behaviour, docs/errors-and-event.md for the conditions under which the contract reverts and what the Recorded event contains, and docs/examples.md for a worked call pattern. Nothing here describes functions, fees, roles, or pause switches that the brief does not define.

## Open questions

- The Solidity compiler version is unspecified.
- The licence is unspecified.
- The deployed contract address is unspecified.
- Example return values are not derivable from the brief and are marked as open questions where shown.