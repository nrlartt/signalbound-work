# CustomSwapHook Release

## What this contract is for

CustomSwapHook is a Uniswap v4 hook that declares the `beforeSwap` permission and validates swap parameters before the PoolManager executes a swap. It rejects zero amount specifications and returns the `beforeSwap` selector with zero deltas and zero additional fee, allowing only swaps with valid non-zero amounts to proceed.

## Deployment order

1. Contract: `CustomSwapHook`
2. Network: `ethereum-sepolia` (chain id `11155111`)
3. PoolManager: `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`
4. Constructor argument: `poolManager` of type `address`, value `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`
5. Command to run: `forge script script/Deploy.s.sol --rpc-url <ethereum-sepolia-rpc-url> --broadcast --verify` (replace `<ethereum-sepolia-rpc-url>` with your own Sepolia RPC endpoint; the script must be supplied by you and must not contain a private key)
6. What to check once the contract is there: call `getHookPermissions()` and confirm `beforeSwap` is `true` and all other permissions are `false`; confirm the contract's `poolManager` storage equals `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`; confirm the hook address matches the permission-derived address expected by Uniswap v4.

## Important notes

- Sign the deployment with your own wallet. This package contains no private key, mnemonic, or credential.
- Nothing in this package claims the contract is deployed. You must run the deployment yourself.
- Do not deploy to mainnet or use real funds without explicit authorization.