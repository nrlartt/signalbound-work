# Circle USDC Batch Indexer

Read-only Node.js indexer that detects batch payouts of Circle USDC on Ethereum Sepolia.

## Contract
- Address: 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238
- Decimals: 6
- Event: Transfer(address indexed from, address indexed to, uint256 value)
- Topic: 0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef

## What this indexer cannot see
- It only scans the block range configured in config.json (fromBlock to toBlock, or the persisted cursor to the latest block).
- It skips logs that fail to decode and does not advance past them.
- It does not see internal transfers, other tokens, or events outside the configured range.
- A partial scan is not proof that no batch payouts occurred outside the scanned range.

## Requirements
- Node.js 22+
- Environment variable SEPOLIA_RPC_URL (never written into source)
- config.json with fromBlock and optional toBlock

## Usage

```bash
npm start
```

## Output
- batches.jsonl: one JSON line per detected batch
- cursor.json: last scanned block for restart
- Console prints batch count and top 3 batches by total

## Tests

```bash
npm test
```

Tests run offline against fixtures/logs.json and cover decoding, batch detection, truncation, restart, duplicates, and RPC failure.

## Not verified
- Live RPC connectivity to Ethereum Sepolia
- Mainnet or other networks
- Reorg handling on a live chain
- Concurrency or long-running persistence under load