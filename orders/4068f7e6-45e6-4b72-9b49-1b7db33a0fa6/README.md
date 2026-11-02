# Signalbound ERC-20 Indexer

Read-only Node.js indexer that observes ERC-20 `Transfer` events via JSON-RPC and writes a JSON snapshot.

## What this indexer cannot see

- **Block range:** It only scans blocks from its startup height forward. It does not index historical blocks before the first run.
- **Skipped blocks:** If the RPC endpoint errors, rate-limits, or returns incomplete logs for a block range, those blocks are skipped and never retried. The snapshot is therefore partial.
- **Non-Transfer events:** It only listens for `Transfer(address indexed from, address indexed to, uint256 value)`. Approvals, deposits, withdrawals, and contract-specific events are invisible.
- **No onchain conclusions:** Absence from the snapshot does not mean a token has no holders, no transfers, or no value. Presence does not mean the indexer validated the contract or the balances.

## Requirements

- Node.js >= 18
- `viem` package

## Setup

```bash
npm install
```

## Run

Set the JSON-RPC endpoint in an environment variable. Never hardcode it.

```bash
export RPC_ENDPOINT=https://your-rpc-endpoint.example.com
npm start
```

The indexer writes `snapshot.json` in the project root on every poll cycle.

## Read-only guarantee

This indexer never sends a transaction, never holds a private key, and never writes to the chain. It only reads logs via `eth_getLogs` and `eth_blockNumber`.

## Security note

The RPC endpoint is read exclusively from `process.env.RPC_ENDPOINT`. No endpoint, API key, or credential is compiled into the source. Rotate the endpoint by changing the environment variable, not the code.
