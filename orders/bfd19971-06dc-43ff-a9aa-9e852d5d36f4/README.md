# eth-wallet-monitor

A read-only Node.js monitoring worker for Ethereum Sepolia wallet balances and RPC liveness.

## Cadence
- Checks configured wallets every **300 seconds** (5 minutes) by default, configurable via `MONITOR_INTERVAL_SECONDS` or `intervalSeconds` in config.
- Alarms after **3 consecutive** failed RPC reads.
- Waits the full configured interval before re-checking; the deadline stays active until the response body completes and is never cleared immediately after starting a request.

## Alert conditions (observable)
- **balance_low**: any watched address has a balance below its configured threshold in ETH.
- **block_stale**: the node's latest block timestamp is older than **120 seconds** (RPC stall).

## Configuration (not observed)
- The monitor cannot see pending pool mempool state, gas price trends, or private keys.
- It does not send transactions or hold keys.
- It reads its endpoint and thresholds from configuration and environment variables only:
  - `MONITOR_RPC_URL` — Ethereum RPC endpoint (required unless `rpcUrl` is in the config file)
  - `MONITOR_CONFIG_PATH` — path to a JSON config file (default `/tmp/eth-monitor-config.json`)
  - `MONITOR_INTERVAL_SECONDS` — check interval in seconds
  - `MONITOR_BLOCK_STALE_SECONDS` — staleness threshold in seconds
  - config file entries: `rpcUrl`, `intervalSeconds`, `blockStaleSeconds`, `wallets[].address`, `wallets[].thresholdEth`

## Graceful shutdown
- SIGINT/SIGTERM sets a shutdown flag; the loop exits after the current interval completes.
- No inlined credentials or webhooks.

## Running
```bash
npm install
npm start
```

## Endpoint
The paid endpoint is configured through `MONITOR_RPC_URL` or `config.rpcUrl`; it is not hardcoded in source.
