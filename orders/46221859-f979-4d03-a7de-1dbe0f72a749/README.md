# CustomSwapHook

A minimal Uniswap v4 hook that declares the `beforeSwap` permission and validates swap parameters before the PoolManager executes a swap.

## Files

- `foundry.toml` — Foundry configuration
- `src/CustomSwapHook.sol` — Hook contract extending `BaseHook`
- `test/CustomSwapHook.t.sol` — Foundry tests

## Permissions

`getHookPermissions()` returns `Hooks.Permissions` with only `beforeSwap = true`. The PoolManager calls `_beforeSwap` before each swap; all other callbacks are disabled.

## Build and test

```bash
forge build
forge test
```

## Constraints

Do not deploy to mainnet or use real funds without explicit authorization.