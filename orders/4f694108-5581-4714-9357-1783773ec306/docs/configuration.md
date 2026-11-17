# Configuration

sepolia-drip reads configuration from a YAML file.

## config.yaml

The configuration file describes how the CLI requests testnet ETH.

### faucets list

Open question: what is the key name for the faucets list, what entries does each faucet require, and where does the list of faucets come from?

### wallet address

Open question: what is the key name for the wallet address, what format is expected, and is the address validated?

### schedule cron

Open question: what is the key name for the schedule, what cron syntax is supported, and what is the default schedule?

### rate limits

Open question: what is the key name for rate limits, what units are used, and what happens when a rate limit is exceeded?