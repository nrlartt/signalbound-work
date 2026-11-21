# NumberRegistry Deployment

## Contract
NumberRegistry

## Network
Ethereum Sepolia (chain ID 11155111)

## Constructor arguments
None. The contract has no constructor arguments and no owner.

## Deployment order
1. Deploy the compiled NumberRegistry artifact to Ethereum Sepolia.
2. Record the verified deployment address and transaction hash.

## Post-deployment checks
- Confirm the contract is deployed at the recorded address on Ethereum Sepolia.
- Call `get(address who)` for an address that has never set a number; it must return `exists = false` and `n = 0`.
- Call `set(uint256 n)` from an address and confirm `NumberSet(address indexed who, uint256 n)` is emitted.
- Call `get` for that same address; it must return `exists = true` and the stored number.
- Call `set` again from the same address with a different number; `count()` must remain unchanged.
- Call `clear()` from that address and confirm `NumberCleared(address indexed who)` is emitted.
- Call `get` for that address after clearing; it must return `exists = false` and `n = 0`.
- Call `clear()` again from that address; it must revert with `NoEntry()`.
- Call `count()` and confirm it equals the number of addresses with an active entry.

## What the contract is for
NumberRegistry lets each address store one uint256 favourite number. Any address can call `set` to store its number, `get` to read any address's entry, `clear` to remove its own entry, and `count` to read the total number of addresses with an active entry. Setting again overwrites the number without changing the count. Clearing without an entry reverts `NoEntry()`. There is no owner and no constructor.