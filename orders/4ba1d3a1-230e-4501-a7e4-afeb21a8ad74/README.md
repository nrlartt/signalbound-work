# CastLog documentation

This documentation set describes CastLog, a small append-only Solidity contract in which surveyors store hashes of their lead-line casts. The contract exposes a minimal interface: surveyors can append a cast hash, anyone can read the total number of rows, and any row can be inspected by index. There is no owner, no constructor arguments, no payable functions, and no pause switch.

## Pages

- docs/interface.md — the public interface: add, length and at.
- docs/errors-and-events.md — the ZeroHash and Index errors and the CastRecorded event.
- docs/examples.md — short usage snippets written in ethers v6 syntax.

## Open questions

The brief does not specify a software licence for the contract source. It does not state a Solidity compiler version. It does not give a deployed contract address or network. It does not say whether tests exist or how to run them. These items are left as open questions rather than invented values.