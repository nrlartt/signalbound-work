# ExampleHook

A minimal Uniswap v4 hook that declares the `beforeSwap` permission and returns a zero delta before every swap.

## Architecture

- `ExampleHook` extends `BaseHook` from `@uniswap/v4-periphery`.
- `getHookPermissions()` declares only `beforeSwap = true`.
- `_beforeSwap()` returns `BaseHook.beforeSwap.selector`, `BeforeSwapDeltaLibrary.ZERO_DELTA`, and fee `0`.

## Permissions

The hook declares exactly one callback permission:

| Callback | Declared |
|----------|----------|
| beforeSwap | true |
| afterSwap | false |
| beforeInitialize | false |
| afterInitialize | false |
| beforeAddLiquidity | false |
| afterAddLiquidity | false |
| beforeRemoveLiquidity | false |
| afterRemoveLiquidity | false |
| beforeDonate | false |
| afterDonate | false |
| beforeSwapReturn | false |
| afterSwapReturn | false |

The PoolManager reads these permissions from the hook address and only invokes callbacks that are declared.

## Configuration

The constructor takes the `IPoolManager` address and forwards it to `BaseHook`.

## Testing

```bash
forge install
forge build
forge test
```

## Deployment

Deploy with the Uniswap v4 PoolManager address as the constructor argument. The hook address must satisfy the declared permissions before it is registered in a pool key.

## Assumptions and Limitations

- This hook performs no custom logic in `_beforeSwap`.
- Do not deploy to mainnet without explicit authorization.
- No private keys are included in this package.
- This is step 1 of 2; deployment scripts and onchain deployment are not included in this bundle.
