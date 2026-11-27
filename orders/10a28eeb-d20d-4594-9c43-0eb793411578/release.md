# MinRangeWidth Release

## What this contract is

MinRangeWidth is a minimal Uniswap v4 hook that refuses narrow liquidity positions. It declares only the `beforeAddLiquidity` permission. When `beforeAddLiquidity` is called, it reverts with `NarrowRange(width)` if `tickUpper - tickLower < 600`; otherwise it returns the `beforeAddLiquidity` selector so the PoolManager proceeds with the position. It has no storage, no owner, no fees, and no token transfers.

## Deployment order

1. Contract: `MinRangeWidth`
2. Network: Ethereum Sepolia (chain ID 11155111)
3. PoolManager bound to the hook: `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`
4. Constructor arguments:
   - `poolManager` (address): `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`
5. Command to run:
   `forge create src/MinRangeWidth.sol:MinRangeWidth --rpc-url <SEPOLIA_RPC_URL> --constructor-args 0xE03A1074c86CFeDd5C142C4F04F1a1536e203543 --account <YOUR_ACCOUNT>`
   Sign the transaction with your own wallet. No private key, mnemonic, or credential is included here.
6. What to check once the contract is deployed:
   - Read `getHookPermissions()` and confirm only `beforeAddLiquidity` is true; every other flag is false.
   - Confirm the hook address encodes the permission bit (Uniswap v4 hooks cannot be deployed to an arbitrary address because their permission bits live in the address).
   - Confirm adding liquidity over `[-240, 240]` (width 480) reverts with `NarrowRange(480)`.
   - Confirm adding liquidity over `[-300, 300]` (width 600) succeeds.
   - Confirm adding liquidity over `[-600, 600]` (width 1200) succeeds.