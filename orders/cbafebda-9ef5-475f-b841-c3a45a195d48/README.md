# Signed Price Oracle

This Foundry project stores one signed price per asset. A signed update binds the oracle address, chain ID, asset, price, timestamp and nonce. The owner manages authorized signers and the freshness window. Anyone may relay a valid signature, but an unauthorized signer, replayed nonce, zero value, future timestamp or stale update is rejected. Readers also reject unset and expired prices.

## Build and test

Run `forge build` and `forge test`. The tests cover valid updates, signer authorization, malformed signatures, replay protection, zero values, old/future timestamps, stale reads, ordering and fuzzed non-zero prices.

## Security assumptions

Consumers trust the owner to authorize honest signers and choose an appropriate freshness window. A valid signature proves which authorized key approved a value; it does not prove that the offchain price itself is economically correct. Source only: this package does not deploy a contract or contain credentials.
