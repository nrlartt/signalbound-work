# GhostTape

## Overview

GhostTape is a small Solidity contract that keeps an append-only register of heat ghost-tape hashes submitted by riders. A steward may void a tape. The contract exposes a constructor, submit, voidTape, tape, and countOf, plus the errors ZeroSteward, ZeroHeat, ZeroTape, AlreadySubmitted, NotSteward, and NoTape, and the events Submitted and Voided.

## cast keccak example

Derive a heat id from a label:

```
cast keccak "summer-2024-heat-1"
```

Use the printed 32-byte value as the `heat` argument when calling submit.

## cast send example

Submit a tape hash as a rider:

```
cast send <CONTRACT_ADDRESS> "submit(bytes32,bytes32)" <HEAT> <TAPE_HASH> --private-key <PRIVATE_KEY>
```

Replace `<CONTRACT_ADDRESS>` with the deployed GhostTape address, `<HEAT>` with the keccak256 heat id, `<TAPE_HASH>` with the tape hash, and `<PRIVATE_KEY>` with the rider's private key.

## cast call example

Read a rider's tape record:

```
cast call <CONTRACT_ADDRESS> "tape(address,bytes32)" <RIDER> <HEAT>
```

Read a rider's submission count:

```
cast call <CONTRACT_ADDRESS> "countOf(address)" <RIDER>
```

## Open questions

- What is the deployed GhostTape contract address?
- What is the steward address passed to the constructor?
- What RPC URL should cast commands target?