# Release — SeasonPass

## Contract purpose
SeasonPass sells a 7-day pass for a fixed price on Ethereum Sepolia. The price is set once in the constructor and cannot change afterward. Buyers pay the exact price to purchase or extend a pass, and the owner can withdraw the full contract balance.

## Deployment order

1. Contract that goes live: `SeasonPass` (compiled artifact `src/SeasonPass.sol`).
2. Network: Ethereum Sepolia (chain ID 11155111).
3. Constructor arguments:
   - `price` (uint256): `100000000000000` wei (0.0001 ether)
4. Initial owner: `0x9628BF1D2995D2BEffC856412d671042Ea48704e` (the payer wallet that signs the deployment).
5. Deployment command:

```bash
forge create src/SeasonPass.sol:SeasonPass \
  --rpc-url $SEPOLIA_RPC_URL \
  --constructor-args 100000000000000 \
  --from 0x9628BF1D2995D2BEffC856412d671042Ea48704e
```

6. What to check once the contract is deployed:
   - The transaction is confirmed on Ethereum Sepolia.
   - `price()` returns `100000000000000`.
   - `owner()` returns `0x9628BF1D2995D2BEffC856412d671042Ea48704e`.
   - `isActive(<buyer address>)` returns `false` before any purchase.
   - Calling `buy()` with `--value 0.0001ether` emits `PassBought` and sets `expiresAt[buyer]` to approximately `block.timestamp + 7 days`.
   - Calling `buy()` with any other value reverts with `WrongPrice`.
   - Only the owner can call `withdraw`; other callers revert with `NotOwner`.

## Example `cast send` command for buy()

```bash
cast send <DEPLOYED_ADDRESS> "buy()" --value 0.0001ether --rpc-url $SEPOLIA_RPC_URL --private-key $PRIVATE_KEY
```

Replace `<DEPLOYED_ADDRESS>` with the address returned by the deployment transaction. `$PRIVATE_KEY` must correspond to the wallet sending the purchase; no private key or credential is stored in this file.