# ERC-20 Transfer Indexer

A read-only Node.js indexer that observes ERC-20 `Transfer` events through a JSON-RPC endpoint and writes a JSON snapshot of what it saw.

## Requirements

- Node.js 18 or newer
- A JSON-RPC endpoint for an Ethereum-compatible network

## Setup

```bash
npm install
```

## Run

```bash
RPC_URL=https://your-rpc-endpoint.example.com node src/indexer.mjs
```

## Environment variables

| Variable | Default | Meaning |
|----------|---------|---------|
| `RPC_URL` | (required) | JSON-RPC endpoint. Never compiled into source; must be provided at runtime. |
| `FROM_BLOCK` | `0x0` | First block to scan, inclusive. Numeric or `latest`. |
| `TO_BLOCK` | `latest` | Last block to scan, inclusive. Numeric or `latest`. |
| `TOKEN_ADDRESS` | (all tokens) | Optional ERC-20 contract address to filter. |
| `SNAPSHOT_PATH` | `./snapshot.json` | Output JSON snapshot path. |

## What the indexer cannot see

- It only covers the block range from `FROM_BLOCK` to `TO_BLOCK`. Events outside that range are not observed.
- It only observes ERC-20 `Transfer` events matching the `Transfer(address,address,uint256)` topic. It skips all other event types and all internal token movements that do not emit `Transfer`.
- A partial scan is not a complete balance history. A reader must not conclude that an address holds zero tokens just because no transfer appears for it in the snapshot.
- It does not follow contract creation, approvals, metadata changes, or off-chain transfers.

## Read-only guarantee

The indexer only calls read-only JSON-RPC methods. It never sends a transaction, never signs anything, never holds a private key, and never writes to the chain.

## Output

The snapshot is written to `SNAPSHOT_PATH` and contains the scanned block range, the RPC endpoint used, the event count, and an array of parsed `Transfer` events with block number, transaction hash, log index, token address, sender, recipient, and value as a decimal string.