# Uniswap v4 Hook

This project implements a minimal Uniswap v4 hook that declares `beforeSwap` and `afterSwap` permissions and overrides the internal `_beforeSwap` and `_afterSwap` callbacks. It is built against the official `@uniswap/v4-core` and `@uniswap/v4-periphery` interfaces.

## Architecture

- `src/SimpleHook.sol` — the hook contract. It extends `BaseHook`, takes the `PoolManager` address in its constructor, and declares exactly the permissions it implements (`beforeSwap` and `afterSwap`) via `getHookPermissions()`.
- `test/SimpleHookTest.t.sol` — Foundry tests verifying declared permissions and callback behavior.

## Permissions

The hook declares:
- `beforeSwap = true`
- `afterSwap = true`

All other permission flags are left at their default (`false`). The PoolManager reads these permissions from the hook's address and invokes only the declared callbacks.

## Setup

1. Install dependencies:
   ```bash
   forge install Uniswap/v4-core
   forge install Uniswap/v4-periphery
   forge install foundry-rs/forge-std
   ```
2. Build:
   ```bash
   forge build
   ```
3. Test:
   ```bash
   forge test
   ```

## Deployment

Deploy `SimpleHook` with the `PoolManager` address as the constructor argument. The deployed address carries exactly the permissions declared in `getHookPermissions()`, and the PoolManager invokes callbacks only for those flags.

## Assumptions and Limitations

- This step builds and tests the hook locally; it does not deploy to any network.
- No private keys, mnemonics, or API keys are included.
- Do not deploy to mainnet or use real funds without explicit authorization.
