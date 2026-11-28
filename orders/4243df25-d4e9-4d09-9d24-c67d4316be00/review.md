VERDICT: PASS

# Independent review


OBSERVATION: src/ExactOutputOnly.sol:1 declares contract ExactOutputOnly is BaseHook with no storage variables and no owner field (source: src/ExactOutputOnly.sol:1).
INFERENCE: The hook has no storage and no owner as required by the brief (source: src/ExactOutputOnly.sol:1).
OBSERVATION: src/ExactOutputOnly.sol:18-24 defines getHookPermissions() public pure override returning Hooks.Permissions memory p with only p.beforeSwap = true set (source: src/ExactOutputOnly.sol:18-24).
INFERENCE: The permission word equals BEFORE_SWAP_FLAG alone, matching the brief's requirement that every other flag is false (source: src/ExactOutputOnly.sol:18-24).
OBSERVATION: src/ExactOutputOnly.sol:26-38 defines _beforeSwap internal view override returning (bytes4, BeforeSwapDelta, uint24), reverting ExactInputForbidden(params.amountSpecified) when params.amountSpecified < 0, otherwise returning (IHooks.beforeSwap.selector, BeforeSwapDeltaLibrary.ZERO_DELTA, 0) (source: src/ExactOutputOnly.sol:26-38).
INFERENCE: The beforeSwap callback enforces exact-output-only behaviour and returns the exact selector, delta and fee specified by the brief (source: src/ExactOutputOnly.sol:26-38).
OBSERVATION: src/ExactOutputOnly.sol:15-17 defines constructor(IPoolManager poolManager) BaseHook(poolManager) {} binding the hook to the PoolManager address (source: src/ExactOutputOnly.sol:15-17).
INFERENCE: PoolManager binding is present via the BaseHook constructor (source: src/ExactOutputOnly.sol:15-17).
OBSERVATION: src/ExactOutputOnly.sol contains no token transfer, fee, or owner logic (source: src/ExactOutputOnly.sol).
INFERENCE: The hook has no fee logic and no token movement as required (source: src/ExactOutputOnly.sol).
OBSERVATION: test/ExactOutputOnly.t.sol:31-40 testExactOutputSucceeds calls beforeSwap with amountSpecified: 1_000_000 (positive) and asserts selector == IHooks.beforeSwap.selector, delta == 0, fee == 0 (source: test/ExactOutputOnly.t.sol:31-40).
INFERENCE: The test demonstrates exact-output succeeds with the required return values (source: test/ExactOutputOnly.t.sol:31-40).
OBSERVATION: test/ExactOutputOnly.t.sol:42-52 testExactInputReverts calls beforeSwap with amountSpecified: -1_000_000 and expects revert ExactInputForbidden(-1_000_000) (source: test/ExactOutputOnly.t.sol:42-52).
INFERENCE: The test demonstrates any exact-input reverts with ExactInputForbidden (source: test/ExactOutputOnly.t.sol:42-52).
OBSERVATION: test/ExactOutputOnly.t.sol:54-56 testLiquidityAddIsPermitted asserts hook.getHookPermissions().beforeSwap is true (source: test/ExactOutputOnly.t.sol:54-56).
INFERENCE: The test shows liquidity-related permission (beforeSwap) is permitted, consistent with liquidity not being limited (source: test/ExactOutputOnly.t.sol:54-56).
OBSERVATION: test/ExactOutputOnly.t.sol:58-70 testPermissionWordIsBeforeSwapOnly asserts p.beforeSwap true and all other permission flags false (source: test/ExactOutputOnly.t.sol:58-70).
INFERENCE: The test verifies the permission word equals BEFORE_SWAP_FLAG alone (source: test/ExactOutputOnly.t.sol:58-70).
OBSERVATION: README.md contains two sentences stating exact-output swaps are permitted, exact-input swaps are rejected with ExactInputForbidden, and liquidity is not limited (source: README.md).
INFERENCE: The README matches the brief's two-sentence requirement (source: README.md).
OBSERVATION: forge build, forge test, and hook permissions checks from step 1 are recorded as passed (source: recorded checks).
INFERENCE: The project compiles and the recorded checks passed; no contradiction is introduced by this review (source: recorded checks).
UNKNOWN: Runtime behaviour on a live Uniswap v4 PoolManager could not be established because no deployment is sent and this review only reads delivered source (source: delivery constraint — source-only review, no deployment).

Summary: I reviewed the delivered Uniswap v4 hook ExactOutputOnly source, its Foundry tests, and README against the paid brief, confirming callback permissions, PoolManager binding, access control, and exact-output-only swap behaviour without deploying anything. This step did not perform any deployment transaction or live-chain verification.
