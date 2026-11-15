# Sepolia JobEscrow Deposited Event Indexer

## What this indexer does

- Reads the Sepolia RPC endpoint from the `SEPOLIA_RPC_URL` environment variable
- Scans `Deposited` events from the JobEscrow contract `0x6307d05E1B72F08f4e20973D1766B3503e5F8DeA`
- Starting block: 12129518
- Persists a cursor atomically to track progress
- Deduplicates events across restarts
- Handles reorgs by re-scanning from the saved cursor if needed
- Writes a JSON snapshot of observed events to `snapshot.json`

## What this indexer cannot see

- **Block range covered**: The indexer starts at block 12129518 and will process all logs from that block forward up to the current latest block at the time of the run. If the cursor is already at block N, it will process blocks N+1 and above. The exact number of events observed depends on chain activity and RPC response.
- **Skipped blocks**: The indexer scans in bounded batches (5000 blocks per RPC call). If an RPC call fails, the cursor is not advanced past the failed batch, and the next run will resume from the last successfully saved cursor. Very large gaps may require multiple runs.
- **Reorgs**: If a block containing processed logs is reorganised, the cursor may point to a block that no longer exists on the canonical chain. The indexer does not automatically roll back; the reader must not conclude that events are final until the chain re-org resolves or the indexer is re-run after re-org confirmation.
- **Future blocks**: The indexer only scans up to the latest known block. Events in blocks not yet mined are not included.

## Reader cautions

- A partial scan does not imply the absence of events; only the events seen by the RPC endpoint within the scanned range are reported.
- The indexer is read-only: it never sends transactions, never holds private keys, and never writes to the chain.
- The `snapshot.json` file reflects the state at the end of the most recent run only.
- Do not use this indexer's output as the sole source of truth for on-chain balances or states without confirming finality.

## Setup

1. Install dependencies: `npm install`
2. Set the RPC endpoint: `export SEPOLIA_RPC_URL="https://your-sepolia-rpc-url"`
3. Run the indexer: `npm start`
4. Output: `snapshot.json` contains the observed Deposited events.

## Configuration

- `SEPOLIA_RPC_URL`: Required. Must be a public Ethereum JSON-RPC endpoint for Sepolia.
- `START_BLOCK`: Hardcoded to 12129518 (can be overridden by modifying the source).
- `JOB_ESCROW`: Hardcoded to the contract address above (can be overridden by modifying the source).

## Verification

- To verify the indexer against a known Sepolia receipt, run the indexer and compare `snapshot.json` with the expected events. The indexer must not produce false positives; every reported event must decode correctly from a valid log.
- Tests should import actual production functions and exercise decoding, empty ranges, restart, duplicate logs, and RPC failure with local fixtures.