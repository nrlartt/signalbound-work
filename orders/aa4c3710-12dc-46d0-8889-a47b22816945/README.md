# Signalbound Monitor

Read-only Node.js worker that watches a single Ethereum Sepolia contract for unusual activity.

## Cadence
- Checks once every `intervalSeconds` (default 60 seconds).
- Alarms when a single check sees more than `maxTxPerInterval` transactions to the contract (default 20).
- Alarms when the contract ETH balance falls below `minBalanceEth`.
- After an alert, the next check runs on the normal interval; there is no separate cooldown.

## Configuration
Copy `config.example.json` to `config.json` and fill in your endpoint and contract address. The endpoint can also be supplied via `MONITOR_ENDPOINT`.

The paid endpoint belongs to the brief and must not be inlined in source. Tests use their own loopback endpoint.

## Run

```
npm start
# or
node src/monitor.mjs config.json
```

## What the monitor cannot see
- It cannot see internal transactions or contract-created transfers that do not appear as top-level `eth_getBlockByNumber` transactions.
- It cannot see token balances or ERC-20 activity.
- It cannot observe mempool activity before a block is mined.
- It never sends transactions and never holds a private key.

## Tests

```
npm test
```