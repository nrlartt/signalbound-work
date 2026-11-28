# StartBlockGate

A Uniswap v4 hook that keeps a pool silent until a chosen start block.

## Permission

The hook declares only `beforeSwap`. Every other callback flag is false, so the PoolManager never calls `afterSwap`, donate, or liquidity callbacks on this hook.

## Revert

`beforeSwap` reverts with `TooEarly(uint256 startBlock, uint256 nowBlock)` when `block.number` is still below the configured `startBlock`. A `startBlock` of zero means the pool may be swapped in from the very first block.

## Tests

- startBlock 100: a swap at block 99 reverts; a swap after `vm.roll(100)` succeeds.
- startBlock 0: swappable immediately without any roll.
- Declared permissions match `beforeSwap` only.
