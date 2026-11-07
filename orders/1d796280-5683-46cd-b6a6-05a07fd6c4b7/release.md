# TickMovementFeeHook Release

## What this package deploys

Contract: `TickMovementFeeHook`
Network: Ethereum Sepolia (chain id 11155111)
PoolManager: `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`

This Uniswap v4 hook applies a dynamic LP fee based on absolute tick movement since the previous completed swap. During normal conditions it charges 5 basis points. When the absolute tick movement since the previous swap exceeds the owner-configured threshold, the next swap is charged 30 basis points. The hook supports both swap directions and exact-input/exact-output flows, returns zero token deltas, takes no custody, charges no protocol fee, and makes no unrestricted external calls.

## Deployment order

1. Confirm the deploying wallet is the intended initial owner: `0x5469a029dbf2138723eD005634F4Baa951b2Bc8f`.
2. Confirm the target network is Ethereum Sepolia, chain id 11155111.
3. Confirm the PoolManager address is `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`.
4. Deploy `TickMovementFeeHook` with the constructor arguments below.
5. Because Uniswap v4 hook permissions live in the contract address, mine or derive a CREATE2 address whose permission bits match the declared callbacks (`beforeSwap = true`, `afterSwap = true`) before funding or binding the hook to a pool.
6. Bind the hook to a dynamic-fee pool through the PoolManager.

## Constructor arguments

| # | Name | Type | Value |
|---|------|------|-------|
| 1 | manager | `address` (IPoolManager) | `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543` |
| 2 | initialOwner | `address` | `0x5469a029dbf2138723eD005634F4Baa951b2Bc8f` |
| 3 | initialThreshold | `uint24` | `100` |
| 4 | initialNormalFee | `uint24` | `500` (5 bps) |
| 5 | initialElevatedFee | `uint24` | `3000` (30 bps) |

## Command to run

Use your own wallet to sign and send the deployment transaction. No private key, mnemonic or credential is included in this package.

Example (Foundry):

```bash
forge script script/DeployTickMovementFeeHook.s.sol \
  --rpc-url $SEPOLIA_RPC_URL \
  --account $DEPLOY_ACCOUNT \
  --broadcast
```

Replace `$SEPOLIA_RPC_URL` and `$DEPLOY_ACCOUNT` with your own values.

## What to check once the contract is live

- The contract is deployed on Ethereum Sepolia.
- `getHookPermissions()` returns `beforeSwap = true` and `afterSwap = true`.
- The deployed address permission bits match those declared flags.
- `movementThreshold()` returns `100`.
- `normalFee()` returns `500`.
- `elevatedFee()` returns `3000`.
- `owner()` returns `0x5469a029dbf2138723eD005634F4Baa951b2Bc8f`.
- The hook is bound to the PoolManager at `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`.

## What this contract is for

A Uniswap v4 dynamic-fee hook that raises the LP fee from 5 bps to 30 bps after a swap whose absolute tick movement exceeds a configurable threshold, then resets to the normal fee after the next swap records a new movement. It is intended for a dynamic-fee ETH/KITE pool on Ethereum Sepolia. The KITE token launch and pool initialization are separate customer-wallet-signed actions and are not part of this release.