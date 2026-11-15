# DynamicFeeHook

A minimal Uniswap v4 beforeSwap dynamic-fee hook.

## What this step did

- Created a Foundry project (`foundry.toml`) with Solidity 0.8.24 and the optimizer enabled.
- Implemented `src/DynamicFeeHook.sol`, a hook extending `BaseHook` from `@uniswap/v4-periphery`.
- The hook imports the real v4 interfaces: `IPoolManager`, `IHooks`, `Hooks`, `PoolKey`, `BeforeSwapDelta`, `BeforeSwapDeltaLibrary`.
- Declares only the `beforeSwap` permission in `getHookPermissions()` so the PoolManager invokes `_beforeSwap` per swap.
- `_beforeSwap` enforces a fixed bounded fee override clamped between `minFeeBps` and `maxFeeBps`, returning `BeforeSwapDeltaLibrary.ZERO_DELTA` and the bounded fee in basis points.
- Added `test/DynamicFeeHookTest.t.sol` with compileable Foundry tests covering permissions, constructor bounds, revert cases, and fee clamping.
- Added `README.md` with build and test instructions.

## What this step did not do

- Did not compile the project (no `forge build` was run).
- Did not run the tests (no `forge test` was run).
- Did not deploy any contract.
- Did not send any transaction.
- Did not verify anything against Sepolia or any live network.

## Build and test

```bash
forge build
forge test
```

## Security notes

- No private keys, mnemonics, or API keys are present.
- No deployment is included; source only.
- The hook restricts the callback logically to the PoolManager via the constructor-stored address; the PoolManager enforces hook permissions at the protocol level.

## Files

- `foundry.toml` — Foundry configuration.
- `src/DynamicFeeHook.sol` — The v4 beforeSwap dynamic-fee hook.
- `test/DynamicFeeHookTest.t.sol` — Foundry tests.
- `README.md` — This file.
