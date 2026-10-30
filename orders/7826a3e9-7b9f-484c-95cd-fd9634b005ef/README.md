# ERC-8004 Agent Registration Indexer

## Overview
This project is a **read‑only** Node.js indexer that connects to an Ethereum JSON‑RPC endpoint, scans a configurable block range for the `AgentRegistered` event defined by the ERC‑8004 standard, and writes a JSON snapshot (`snapshot.json`) containing the observed agents and their registration timestamps.

The indexer **does not** hold any private keys, never sends transactions, and never writes to the blockchain.

## Prerequisites
- Node.js ≥ 18
- Access to an Ethereum JSON‑RPC endpoint (e.g., Infura, Alchemy, or any public node). The endpoint URL must be supplied via the `RPC_URL` environment variable.

## Setup
```bash
git clone <repo‑url>
cd <repo‑folder>
npm install
```

## Configuration
Create the following environment variables before running the indexer:

| Variable            | Description                                                                                              |
|---------------------|----------------------------------------------------------------------------------------------------------|
| `RPC_URL`           | HTTP(S) URL of the JSON‑RPC endpoint (required).                                                         |
| `CONTRACT_ADDRESS`  | Address of the ERC‑8004 contract to monitor (required).                                                  |
| `START_BLOCK`       | *(Optional)* First block to scan. If omitted, the indexer automatically determines a block roughly one week ago. |
| `END_BLOCK`         | *(Optional)* Last block to scan. Defaults to the latest block if not provided.                          |

Example (Unix shell):
```bash
export RPC_URL=https://mainnet.infura.io/v3/YOUR_PROJECT_ID
export CONTRACT_ADDRESS=0x1234567890abcdef1234567890abcdef12345678
# optional overrides
# export START_BLOCK=17000000
# export END_BLOCK=17050000
npm start
```

## Running the Indexer
```bash
npm start
```
The script will:
1. Connect to the RPC endpoint.
2. Determine (or use) the block range.
3. Fetch all `AgentRegistered` logs emitted by the specified contract.
4. Decode the logs and write `snapshot.json`.

### Sample `snapshot.json`
```json
{
  "scannedRange": { "startBlock": 17000000, "endBlock": 17050000 },
  "totalEvents": 3,
  "events": [
    {
      "blockNumber": 17001234,
      "transactionHash": "0xabc...",
      "agent": "0xdef...",
      "timestamp": "1698001234"
    }
  ]
}
```

## What the Indexer **Cannot** See
- **Block range coverage**: It only scans the range defined by `START_BLOCK`/`END_BLOCK` or the automatically‑derived one‑week window. Events outside this window are not captured.
- **Skipped logs**: If the RPC node is not an archival node, logs that were pruned or not indexed may be missing.
- **Partial data**: Rate‑limits, timeouts, or node errors can cause incomplete retrieval. A reader must not conclude that the total number of registered agents on the chain equals the `totalEvents` count; it is only the count observed within the scanned window and under the node’s availability constraints.

## Limitations & Recommendations
- Use an **archival** RPC provider for full historical coverage.
- Adjust `START_BLOCK`/`END_BLOCK` to match the exact week you wish to analyze.
- Verify the snapshot against multiple providers for higher confidence.

## License
MIT