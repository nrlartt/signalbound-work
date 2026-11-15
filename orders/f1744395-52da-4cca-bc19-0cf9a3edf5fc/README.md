# Signalbound Health Monitor

Read-only health monitor for Signalbound endpoints. It polls an HTTP/HTTPS health endpoint, prints alerts locally, and never sends transactions or holds keys.

## Cadence

- Checks every 60 seconds by default (configurable via `MONITOR_INTERVAL_MS` or `config.intervalMs`).
- Alarms after three consecutive failed reads (configurable via `MONITOR_FAILURE_THRESHOLD` or `config.failureThreshold`).
- Waits for the next successful read before raising a recovery notice.
- Each check waits up to 10 seconds for a response (configurable via `MONITOR_TIMEOUT_MS` or `config.timeoutMs`).

## Configuration

Copy `config.example.json` to `config.json` and adjust values, or set environment variables:

| Setting | Environment variable | Default |
|---------|---------------------|---------|
| Endpoint URL | `MONITOR_ENDPOINT` | (required)
| Check interval (ms) | `MONITOR_INTERVAL_MS` | `60000` |
| Failure threshold | `MONITOR_FAILURE_THRESHOLD` | `3` |
| Request timeout (ms) | `MONITOR_TIMEOUT_MS` | `10000` |
| Recovery notice | `MONITOR_RECOVERY_NOTICE` | `true` |
| Log level | `MONITOR_LOG_LEVEL` | `info` |

## Run

```
npm start
```

## Test

```
npm test
```

Tests run offline against local loopback fixtures using Node builtins only.

## What this monitor cannot see

- It cannot observe blockchain state, token balances, or Sepolia transactions.
- It cannot detect issues that do not affect the configured health endpoint.
- It cannot see failures outside the request timeout window.
- It cannot send alerts to external webhooks or messaging services; alerts are printed locally only.

## Security

This monitor is read-only. It never sends a transaction and never holds a credential. Do not put private keys or webhook URLs in the config.

## Hosting

Continuous hosting is not claimed or provided by this bundle.