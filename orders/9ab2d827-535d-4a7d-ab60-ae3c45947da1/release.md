# TimeLockVault Release

## Contract
- Contract name: `TimeLockVault`
- Source: `src/TimeLockVault.sol`
- Compiler: Solidity 0.8.24
- Network: Ethereum Sepolia (chain ID 11155111)

## Deployment order
1. Contract to deploy: `TimeLockVault`
2. Network: Ethereum Sepolia
3. Constructor arguments: none (the constructor takes no arguments)
4. Initial owner: the deployment wallet (`msg.sender`) is set as owner via `Ownable(msg.sender)`
5. Command: `forge create src/TimeLockVault.sol:TimeLockVault --rpc-url <SEPOLIA_RPC_URL> --account <ACCOUNT_NAME> --constructor-args`
   - Replace `<SEPOLIA_RPC_URL>` with your Sepolia RPC endpoint.
   - Replace `<ACCOUNT_NAME>` with your configured Foundry account.
   - No constructor arguments are required.

## Post-deployment checks
- Verify the contract address matches the transaction receipt on Sepolia.
- Confirm `owner()` returns the deployment wallet address.
- Confirm `ONE_DAY()` returns `86400`.
- Confirm `getDeposit(<depositor>)` returns `(0, 0)` for an address with no deposit.
- Confirm the contract bytecode is present at the deployed address.

## What the contract is for
TimeLockVault is an ETH time-lock vault. Each wallet deposits its own ETH with a 1-day lock. Withdrawals are only by the depositor after its unlock time. A new deposit extends only that depositor's lock. The contract uses checks-effects-interactions and ReentrancyGuard. There is no admin withdrawal function.