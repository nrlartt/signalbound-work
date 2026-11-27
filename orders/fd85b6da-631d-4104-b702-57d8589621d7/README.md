# EditionLog Documentation

A small Solidity contract that maintains an append-only log of newsletter editions kept by one editor.

## Overview

The `EditionLog` contract allows a single editor to publish numbered editions with a headline and content hash. Each edition can only be corrected once. The contract enforces that only the editor may call `publish` or `correct`, validates headline length and hash non-zero, and emits events for every publication and correction.

## cast Examples

### cast call: count()

```bash
cast call \
  --rpc-url <RPC_URL> \
  <CONTRACT_ADDRESS> \
  "count()"
```

### cast send: publish(keccak hash, headline)
```bash
cast send <CONTRACT_ADDRESS> \
  "publish(bytes32,string)" \
  "$(echo -n 'Hello, world!' | cast keccak)" \
  "Welcome Edition"
```

*Both examples assume the caller is the editor address passed to the constructor. The headline length is validated to be 1–80 bytes and the hash must be non-zero.*

---

*Open question: The brief does not specify whether the editor address should be stored immutably or whether renouncing ownership is permitted after deployment.*