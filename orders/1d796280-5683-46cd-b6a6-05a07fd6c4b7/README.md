# TickMovementFeeHook

This Foundry package implements a Uniswap v4 dynamic-fee hook against the official, version-pinned v4 interfaces. The first swap uses the normal fee. Every successful swap records its absolute tick movement in afterSwap; the next swap uses the elevated fee only when that movement exceeds the owner-configured threshold. Both swap directions and amount signs share the same policy. The hook returns zero token deltas and never takes custody.

Run forge build and forge test. The suite covers permission flags, first-swap behaviour, positive and negative movement, the exact threshold boundary, both swap directions and amount signs, owner authorization, invalid fee policy, dynamic-pool enforcement and the PoolManager caller boundary.

This package is source and tests only. Production requires a permission-bit-matched CREATE2 address, the intended PoolManager, a dynamic-fee pool and real PoolManager integration tests. No deployment is claimed.