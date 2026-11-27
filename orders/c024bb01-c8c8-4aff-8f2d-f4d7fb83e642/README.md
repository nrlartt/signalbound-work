# Aave v3 Sepolia Indexer

Read-only Node.js indexer that scans Supply and Withdraw events on Aave v3 Pool (0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951) over a block range given by `--from` and `--to` (chunks of at most 1000 blocks, retry up to 3 times with backoff). RPC endpoint from `SEPOLIA_RPC_URL` environment variable.

## What the indexer does
- Reads `SEPOLIA_RPC_URL` from the environment (never hardcoded).
- Fetches logs via `eth_getLogs` in 1000-block chunks with up to 3 retries and exponential backoff.
- Decodes `Supply` and `Withdraw` events using viem's `parseEventLogs`.
- Persists a cursor (`nextBlock`) in `out/summary.json` so subsequent runs resume where they left off.
- Outputs `out/summary.json` with counts, per-reserve totals (supplied, withdrawn, net, uniqueUsers), sorted by supply count descending then reserve ascending.
- BigInt for all amounts; no token decimal assumptions.

## What the indexer cannot see / limitations
- The block range it covers is exactly the `--from`/`--to` range passed on the command line (or the cursor range on resume).
- It skips blocks outside the specified range; it does not scan the full chain.
- It does not track token balances, APY, or user health — only raw event amounts.
- It does not handle partial state failures beyond retrying the eth_getLogs chunk; if a chunk fails after 3 attempts the run aborts.
- Reserve addresses are taken from event topics/data as-is; no resolution to token symbols.

## Running
```bash
# Install
npm install

# Run a scan from block 1 to 5000 (produces out/summary.json)
node src/indexer.mjs --from 1 --to 5000

# Resume from the saved cursor
node src/indexer.mjs
```

## Tests
```bash
npm test
```

The test suite (`test/indexer-test.mjs`) uses recorded fixture logs and covers:
- Chunk boundaries (1000-block limit).
- Retried failing chunk (backoff).
- Decoding the non-indexed `user` from `Supply` data.
- Negative net (withdraws exceeding supplies in a range).
- Sort order (supply count desc, reserve asc).
```
