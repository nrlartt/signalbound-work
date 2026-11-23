# Sepolia RPC Monitor

Read-only Node.js monitor that checks the health of an Ethereum Sepolia RPC endpoint.

## Cadence

- Checks the RPC endpoint every 30 seconds by default (configurable via `intervalSeconds` or `MONITOR_INTERVAL_SECONDS`).
- Calls `eth_getBlockByNumber("latest", false)` each interval.
- Alarms after 3 consecutive failed reads by default (configurable via `alertAfterFailures` or `MONITOR_ALERT_AFTER_FAILURES`).
- After an alarm, it waits for the next successful read before resetting the failure counter; it does not re-alert on every failed interval while already down.

## Configuration

Copy `config.example.json` to `config.json` and fill in your endpoint. The endpoint can also be supplied via the `MONITOR_ENDPOINT` environment variable. If neither is set, the monitor exits with a configuration error.

Settings:
- `rpcUrl` / `MONITOR_ENDPOINT`: Sepolia RPC endpoint (http or https). No default; must be configured.
- `intervalSeconds` / `MONITOR_INTERVAL_SECONDS`: seconds between checks (default 30).
- `maxBlockAgeSeconds` / `MONITOR_MAX_BLOCK_AGE_SECONDS`: maximum acceptable block age in seconds (default 60).
- `maxBaseFeeGwei` / `MONITOR_MAX_BASE_FEE_GWEI`: maximum acceptable base fee in gwei (default 50).
- `alertAfterFailures` / `MONITOR_ALERT_AFTER_FAILURES`: consecutive RPC errors before an `rpc-down` alert (default 3).
- `requestTimeoutMs` / `MONITOR_REQUEST_TIMEOUT_MS`: per-request timeout in milliseconds (default 10000).

## Output

One JSON line per check:

```json
{"level":"info","time":"...","blockNumber":12345,"blockAge":12.3,"baseFeeGwei":0.123}
```

Alert JSON lines:
- `{"level":"alert","reason":"stale-head"}` when block age exceeds the threshold.
- `{"level":"alert","reason":"high-base-fee"}` when base fee exceeds the threshold.
- `{"level":"alert","reason":"rpc-down"}` after the configured number of consecutive RPC errors.

## What this monitor cannot see

- It cannot see transactions, mempool contents, or pending state; it only reads the latest block header.
- It cannot detect consensus issues, fork choice problems, or validator penalties.
- It cannot observe whether the RPC node is synced to the head beyond the block timestamp age.
- It cannot verify signatures, state roots, or receipts.

## Run

```sh
npm start
# or
node src/monitor.mjs
```

## Tests

```sh
npm test
```

## Safety

This monitor is read-only. It never sends a transaction and never holds a key.
