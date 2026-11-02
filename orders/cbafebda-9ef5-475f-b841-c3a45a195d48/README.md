# Signed Price Oracle

This Foundry project stores one signed price per asset. An EIP-712 update binds the oracle domain, claimed signer, asset, bounded price, timestamp, nonce and the signer's current authorization epoch. The owner manages authorized signers and the freshness window. Anyone may relay a valid signature, but an unauthorized signer, replayed nonce, zero or oversized value, future timestamp or update at or beyond the freshness boundary is rejected. Readers use the same strict boundary.

## Build and test

Run `forge build` and `forge test`. The tests cover valid updates, signer authorization, malformed signatures, replay protection, authorization epochs, zero and oversized values, old/future timestamps, exact-boundary stale reads, ordering and bounded fuzzed prices. The project uses the worker-vendored OpenZeppelin Contracts v5.0.2 source tree.

## Security assumptions

Consumers trust the owner to authorize honest signers and choose an appropriate freshness window. A valid signature proves which authorized key approved a value; it does not prove that the offchain price itself is economically correct. Source only: this package does not deploy a contract or contain credentials.
