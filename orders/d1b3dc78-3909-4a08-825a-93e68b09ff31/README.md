# Chainlink ETH/USD Price Monitor

Read-only Node.js monitor for the Chainlink ETH/USD price feed on Ethereum Sepolia.

## Feed
- Address: 0x694AA1769357215DE4FAC081bf1f309aDC325306
- Decimals: 8
- Method: latestRoundData() via eth_call (read-only)

## Configuration
Set SEPOLIA_RPC_URL to an Ethereum Sepolia JSON-RPC endpoint. Optional overrides:
- MONITOR_INTERVAL_MS: check interval in milliseconds (default 60000)
- STALE_AFTER_SECONDS: staleness threshold in seconds (default 3900)
- JUMP_PERCENT: price jump threshold in percent (default 2)
- ERROR_THRESHOLD: consecutive failed calls before ERROR status (default 3)

Copy config.example.json to config.json and fill in your RPC URL, or export SEPOLIA_RPC_URL directly.

## Cadence
The monitor checks every 60 seconds by default. It alarms on STALE when now minus updatedAt is greater than 3900 seconds. It alarms on JUMP when the answer moves more than 2% since the previous check. It reports ERROR after 3 failed calls in a row and recovers to OK on the next successful call.

## Output
One JSON line per check:
{ "time", "status", "price", "updatedAt", "ageSeconds" }

Statuses:
- OK: feed is fresh and within jump threshold
- STALE: now - updatedAt > 3900 seconds
- JUMP: answer moved more than 2% since previous check
- ERROR: 3 failed calls in a row; monitor keeps running

## Run
npm start

## Read-only
This monitor never sends a transaction and never holds a key. It only calls eth_call.

## Conditions it cannot see
- It cannot detect on-chain events that do not update updatedAt.
- It cannot observe price moves older than the previous check interval.
- It cannot detect feed upgrades or address changes.
- It cannot see off-chain price sources outside the RPC endpoint.
