# SeasonPass

A Foundry project that sells a 7-day pass for a fixed price on Ethereum Sepolia.

## Contracts

- `src/SeasonPass.sol` — SeasonPass: fixed-price 7-day pass with extension, expiry check, and owner withdrawal.

## Tests

- `test/SeasonPass.t.sol` — Seven named tests covering purchase, extension, expiry boundary, wrong price, ownership, and constructor validation.

## Build and test

```bash
forge build
forge test
```

## Deployment

Deploy with a price of 0.0001 ether. See `release.md` for the deployment address, transaction hash, and example `cast send` command.
