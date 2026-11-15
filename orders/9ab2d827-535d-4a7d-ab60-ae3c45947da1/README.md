# TimeLockVault

Original ETH time-lock vault project for Signalbound QA task SB-QA-20261114.

## Description

Each wallet deposits its own ETH with a 1-day lock. Withdrawals are only by the depositor after its unlock time. A new deposit extends only that depositor's lock. The contract uses checks-effects-interactions and ReentrancyGuard.

## Contracts
- `src/TimeLockVault.sol` – the vault contract
- `test/TimeLockVault.t.sol` – Foundry tests

## Build & Test
```bash
forge build
forge test
```

## Deployment (Step 2)
Deploy to Sepolia and report the address and receipt.