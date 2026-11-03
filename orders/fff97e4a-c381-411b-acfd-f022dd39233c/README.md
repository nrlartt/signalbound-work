# GuardedSwapHook

GuardedSwapHook is a Uniswap v4 `beforeSwap` hook built against the official v4-core and v4-periphery interfaces. It rejects swaps while paused and rejects an absolute `amountSpecified` above the owner-managed maximum. It does not alter token deltas or override the pool fee.

## Verification

Run `forge build` and `forge test`. The test suite covers the declared permission, the PoolManager caller boundary, exact-input and exact-output amount handling, the maximum boundary, pausing, owner authorization and the zero-maximum refusal.

## Deployment

The constructor takes `IPoolManager manager`, `address initialOwner` and `uint256 initialMaximum`. A v4 hook must be deployed to an address whose low permission bits match `beforeSwap=true`; use a CREATE2 permission-address miner and verify `getHookPermissions()` before using the address in a pool key. No key, RPC endpoint, transaction hash or deployment claim is included in this source bundle.
