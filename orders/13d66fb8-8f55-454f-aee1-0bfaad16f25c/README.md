# Signalbound Monitor

A read-only Node.js monitoring worker. It polls an endpoint, extracts a price, and raises an alarm when readings are bad or outside configured thresholds. It never sends a transaction and never holds a key.

## Configuration

Copy `config.example.json` to `config.json` and fill in your own values. Settings may also be provided through environment variables, which take precedence over the config file.

| Setting | Environment variable | Example | Description |
|---------|---------------------|---------|-------------|
| `endpoint` | `MONITOR_ENDPOINT` | `https://api.example.com/price` | The URL to poll. Must come from config or environment, never a source constant. |
| `checkIntervalMs` | `MONITOR_CHECK_INTERVAL_MS` | `30000` | How often the monitor checks the endpoint. |
| `consecutiveBadReads` | `MONITOR_CONSECUTIVE_BAD_READS` | `3` | How many consecutive bad reads trigger an alarm. |
| `alarmCooldownMs` | `MONITOR_ALARM_COOLDOWN_MS` | `300000` | How long the monitor waits before raising the same alarm again. |
| `minPrice` | `MONITOR_MIN_PRICE` | `50000` | Optional lower price bound. |
| `maxPrice` | `MONITOR_MAX_PRICE` | `100000` | Optional upper price bound. |

## Stated cadence

- **Check interval:** every `checkIntervalMs` milliseconds (default 30000 ms / 30 seconds).
- **Alarm trigger:** after `consecutiveBadReads` consecutive bad reads (default 3).
- **Alarm cooldown:** waits `alarmCooldownMs` milliseconds (default 300000 ms / 5 minutes) before raising the same alarm again.

A quiet market produces repeated `OK` log lines. A broken monitor produces repeated bad reads until the consecutive threshold is met, then an alarm, then cooldown-suppressed repeats until reads recover.

## What this monitor cannot see

- It cannot see order-book depth, trade volume, or exchange-specific liquidity.
- It cannot see off-chain or over-the-counter Bitcoin price movements.
- It cannot see prices from any endpoint other than the one configured.
- It cannot detect market manipulation, wash trading, or flash crashes that occur between polling intervals.
- It cannot confirm on-chain finality or Bitcoin blockchain state.

## Read-only guarantee

The monitor performs HTTP GET requests only. It never signs, broadcasts, or sends a transaction. It reads no private keys and holds no credentials beyond the endpoint URL you supply.

## Running

```bash
cp config.example.json config.json
# edit config.json with your endpoint, or export MONITOR_ENDPOINT
npm start
```

## File types

All shipped files are `.mjs`, `.js`, `.json`, or `.md`.
