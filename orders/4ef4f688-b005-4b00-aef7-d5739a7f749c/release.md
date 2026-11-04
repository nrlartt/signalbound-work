# Release: SimpleHook Uniswap v4 Hook

## What this release is for

This release deploys `SimpleHook`, a Uniswap v4 hook that declares `beforeSwap` and `afterSwap` permissions and overrides the corresponding internal callbacks. The PoolManager reads these permissions from the hook's address and invokes only the declared callbacks. The hook is bound to the PoolManager at `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543` on Ethereum Sepolia.

## Deployment order

1. **Contract:** `SimpleHook`
2. **Network:** `ethereum-sepolia` (chain ID `11155111`)
3. **PoolManager:** `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`
4. **Constructor arguments:**
   - `initialOwner` (address): `0x5469a029dbf2138723eD005634F4Baa951b2Bc8f`
   - `initialMaximum` (uint256): `1000000000000000000000`
5. **Command:**
   ```bash
   forge script script/DeploySimpleHook.s.sol --rpc-url $SEPOLIA_RPC_URL --broadcast --verify
   ```
   Sign the transaction with your own wallet. No private key, mnemonic, or credential is included in this package.
6. **What to check once the contract is live:**
   - The deployed address matches the permission bits declared in `getHookPermissions()` (`beforeSwap = true`, `afterSwap = true`).
   - `getHookPermissions()` returns exactly those two flags set to `true` and all others `false`.
   - The PoolManager address stored in the hook equals `0xE03A1074c86CFeDd5C142C4F04F1a1536e203543`.
   - The initial owner is `0x5469a029dbf2138723eD005634F4Baa951b2Bc8f`.
   - The initial maximum is `1000000000000000000000`.

## Assumptions and limitations

- This package does not deploy the contract. You must run the deployment command with your own wallet.
- Do not deploy to mainnet or use real funds without explicit authorization.
- A hook cannot be deployed to an arbitrary address because its permission bits live in its address; verify the deployed address satisfies the declared permissions.

---

## deploy.json

See `deploy.json` for the machine-readable deployment specification.