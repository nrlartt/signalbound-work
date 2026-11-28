# SpecimenTag documentation

## Overview

SpecimenTag is a small Solidity contract: an append-only register of plant specimen tags kept by one registrar. The registrar is set in the constructor. Only the registrar can tag or retag accessions. Each accession is a bytes32 identifier that must be non-zero. A label is a string of 1 to 48 bytes. Tagging an accession records its label and the block timestamp at which it was tagged. Retagging an accession can happen once per accession and replaces the label while remembering the old one. The contract exposes read-only views for a single accession's info and for the total count of tagged accessions.

## cast keccak example

Use cast to derive an accession from a label string. The brief does not state which label to hash, so this example uses the literal string "Specimen-001":

```bash
cast keccak "Specimen-001"
```

The brief does not state the resulting hash, so it is not reproduced here.

## cast send example for tag

Send a tag transaction from the registrar account. Replace <accession> with a non-zero bytes32 value, <label> with a 1-48 byte string, and <rpc-url> with your RPC endpoint:

```bash
cast send <contract-address> "tag(bytes32,string)" <accession> "<label>" --private-key <private-key> --rpc-url <rpc-url>
```

The brief does not provide a contract address, private key, or RPC URL.

## cast call examples for info and count

Read an accession's info:

```bash
cast call <contract-address> "info(bytes32)" <accession> --rpc-url <rpc-url>
```

Read the total count of tagged accessions:

```bash
cast call <contract-address> "count()" --rpc-url <rpc-url>
```

The brief does not provide a contract address or RPC URL.

## Open questions

- What is the deployed contract address?
- What is the RPC URL?
- What is the registrar private key or signer?
- Which accession value should examples use?