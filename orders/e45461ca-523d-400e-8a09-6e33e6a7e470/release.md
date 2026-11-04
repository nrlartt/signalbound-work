# ExampleHook Release

## What this contract is for

ExampleHook is a minimal Uniswap v4 hook that declares the `beforeSwap` permission and returns a zero delta before every swap. It extends `BaseHook` from `@uniswap/v4-periphery` and performs no custom swap logic.

## Contract that goes live

Contract: `ExampleHook`
Network: `ethereum-sepolia` (chain id `11155111`)
PoolManager it is bound to: `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`

## Constructor arguments

| Name | Type | Value |
|------|------|-------|
| poolManager | address | `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543` |
| initialOwner | address | `0x5469a029dbf2138723eD005634F4Baa951b2Bc8f` |
| initialMaximum | uint256 | `1000000000000000000000` |

## Command to run

```bash
forge script script/DeployExampleHook.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
```

Use your own wallet to sign the transaction. No private key, mnemonic, or credential is included in this package.

## What to check once the contract is there

1. Confirm the deployed contract address matches the transaction receipt.
2. Call `getHookPermissions()` on the deployed hook and verify `beforeSwap` is `true` and all other callbacks are `false`.
3. Confirm the hook address satisfies the declared `beforeSwap` permission before registering it in a pool key.
4. Confirm the PoolManager bound to the hook is `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`.

## Assumptions and limitations

- Do not deploy to mainnet or use real funds without explicit authorization.
- This package does not claim the contract is deployed; deployment requires your signed transaction.
- The hook performs no custom logic in `_beforeSwap`.

---

## Deployment steps in order

1. Set `SEPOLIA_RPC_URL` to an Ethereum Sepolia RPC endpoint.
2. Fund the signing wallet with Sepolia ETH for gas.
3. Run the Forge script above with your wallet.
4. Verify the deployed address and permissions as listed above.
5. Register the hook in a pool key only after the address satisfies the declared `beforeSwap` permission.