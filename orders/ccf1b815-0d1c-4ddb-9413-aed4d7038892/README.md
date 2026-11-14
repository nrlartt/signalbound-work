# Signalbound Health Monitor

Read-only health monitor that polls an HTTP or HTTPS endpoint and prints alerts locally. It never sends a transaction, never holds a key, and never calls an external webhook.

## Cadence

- Checks the endpoint every 60 seconds by default (configurable via `intervalMs`).
- Alarms after three consecutive failed reads by default (configurable via `consecutiveFailures`).
- Waits 5 seconds between a failed read and the next attempt by default (configurable via `backoffMs`).
- Prints a recovery notice after a failure streak ends and a successful read occurs.

## Configuration

Copy `config.example.json` to `config.json` and fill in your own endpoint. Settings can also be provided through environment variables.

| Setting | Environment variable | Example |
|---------|----------------------|---------|
| endpoint | `MONITOR_ENDPOINT` | `https://signalbound.fun/healthz` |
| intervalMs | `MONITOR_INTERVAL_MS` | `60000` |
| consecutiveFailures | `MONITOR_CONSECUTIVE_FAILURES` | `3` |
| recoveryNotice | `MONITOR_RECOVERY_NOTICE` | `true` |
| requestTimeoutMs | `MONITOR_REQUEST_TIMEOUT_MS` | `10000` |
| backoffMs | `MONITOR_BACKOFF_MS` | `5000` |

## Run

```
npm start
```

## Test

```
npm test
```

## Conditions the monitor cannot observe

- It cannot see whether the upstream service is semantically healthy beyond HTTP status and response body receipt.
- It cannot detect slow clients, partial responses, or application-layer timeouts that occur after the body completes.
- It cannot observe internal server state, database health, or blockchain state.
- It cannot detect alerts that require external messaging, because it prints locally only.

## Read-only

This monitor performs GET-style reads only. It never sends a transaction and never holds a credential.