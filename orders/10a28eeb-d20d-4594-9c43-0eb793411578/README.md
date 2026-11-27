# MinRangeWidth

MinRangeWidth is a minimal Uniswap v4 hook that refuses narrow liquidity positions. It declares only the `beforeAddLiquidity` permission and reverts with `NarrowRange(width)` whenever `tickUpper - tickLower < 600`; otherwise it returns the `beforeAddLiquidity` selector so the PoolManager proceeds with the position.