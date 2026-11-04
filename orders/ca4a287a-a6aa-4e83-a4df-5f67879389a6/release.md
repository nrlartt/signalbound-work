# GuardedSwapHook release

## Deployment

Deploy the compiled `GuardedSwapHook` on Ethereum Sepolia (chain 11155111) through the permission-address CREATE2 deployer. Pass the PoolManager, payer-owned administrator and maximum swap amount in the exact order recorded in `deploy.json`.

## Verification

After the receipt is mined, compare its creation inputs with `deploy.json`, verify that the deployed address carries only the `beforeSwap` permission bit, and confirm that runtime bytecode exists. The earlier unit suite uses a local manager harness; run a real pool initialization and swap integration test before treating the hook as production-ready.
