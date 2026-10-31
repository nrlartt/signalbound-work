# Vault Monitor

Read-only Node.js monitoring worker for vault deposit and balance accounting.

## Cadence

- Checks the configured endpoint every 10 seconds (configurable via `checkIntervalMs` or `MONITOR_INTERVAL_MS`).
- Alarms after 3 consecutive bad reads (configurable via `badReadsToAlarm` or `MONITOR_BAD_READS_TO_ALARM`).
- Waits 5 minutes before raising the same alarm again (configurable via `alarmCooldownMs` or `MONITOR_ALARM_COOLDOWN_MS`).

## Configuration

Copy `config.example.json` to `config.json` and fill in your own endpoint. The endpoint may also be supplied through the `MONITOR_ENDPOINT` environment variable. No credential or webhook is inlined in source code.

## Run

```
npm install
npm start
```

## What this monitor cannot see

This worker only observes readings exposed by its configured endpoint. It cannot see:
- Off-chain deposits that have not been reported to the endpoint.
- User balances that are not included in the endpoint's `sumUserBalances` field.
- Private key usage, transaction signing, or on-chain state changes (it never sends transactions and never holds a key).
- Events occurring between checks.

## Read-only guarantee

The monitor performs HTTP GET reads only. It never sends a transaction and never holds a signing key.
