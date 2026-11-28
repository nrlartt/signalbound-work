VERDICT: PASS

# Independent review


OBSERVATION: foundry.toml sets src = "src", test = "test", solc_version = "0.8.24" (source: foundry.toml lines 1-7).
INFERENCE: The project layout matches the brief's requirement for a Foundry project with Solidity 0.8.24 (source: foundry.toml).
OBSERVATION: src/TidePost.sol imports nothing from forge-std; its only import-related content is its own pragma and contract definition (source: src/TidePost.sol lines 1-113).
INFERENCE: The production file does not import forge-std, satisfying the brief's constraint that forge-std be used only from tests (source: src/TidePost.sol).
OBSERVATION: src/TidePost.sol declares contract TidePost with constructor(address _coxswain, uint32 _maxAge, uint32 _maxJump) (source: src/TidePost.sol lines 61-66).
INFERENCE: The constructor signature matches the brief exactly (source: src/TidePost.sol lines 61-66).
OBSERVATION: setLevel(int32 centimetresX10, uint32 windowMinutes_) reverts NotCoxswain(msg.sender) when msg.sender != coxswain (source: src/TidePost.sol lines 70-73).
INFERENCE: Only the coxswain may post, matching the brief (source: src/TidePost.sol lines 70-73).
OBSERVATION: When initialized is true, setLevel reverts StaleWriter if block.timestamp - updatedAt > maxAge (source: src/TidePost.sol lines 75-79).
INFERENCE: Later posts revert StaleWriter when the previous post is older than maxAge seconds, matching the brief (source: src/TidePost.sol lines 75-79).
OBSERVATION: When initialized is true, setLevel computes the absolute delta and reverts Jump(delta, int32(maxJump)) if uint32(delta) > maxJump (source: src/TidePost.sol lines 81-87).
INFERENCE: The jump cap applies only after the first post, matching the brief (source: src/TidePost.sol lines 81-87).
OBSERVATION: The first post skips both the StaleWriter and Jump checks because initialized is false initially (source: src/TidePost.sol lines 74, 80).
INFERENCE: The first post is unrestricted, matching the brief (source: src/TidePost.sol lines 74, 80).
OBSERVATION: windowMinutes may be zero; no validation is performed on it beyond storage (source: src/TidePost.sol lines 89-90).
INFERENCE: windowMinutes may be zero, matching the brief (source: src/TidePost.sol lines 89-90).
OBSERVATION: read() returns (int32 centimetresX10, uint32 windowMinutes_, uint256 updatedAt_) and reverts Unset when !initialized (source: src/TidePost.sol lines 99-103).
INFERENCE: read() reverts Unset when nothing has been posted, matching the brief (source: src/TidePost.sol lines 99-103).
OBSERVATION: read() reverts Stale(age, uint256(maxAge)) when block.timestamp - updatedAt > maxAge (source: src/TidePost.sol lines 104-106).
INFERENCE: read() reverts Stale when the age exceeds maxAge, matching the brief (source: src/TidePost.sol lines 104-106).
OBSERVATION: Public view functions coxswain, maxAge, maxJump exist (source: src/TidePost.sol lines 55-57).
INFERENCE: The required views are present, matching the brief (source: src/TidePost.sol lines 55-57).
OBSERVATION: Custom errors NotCoxswain, StaleWriter, Jump, Stale, Unset are declared (source: src/TidePost.sol lines 14-18).
INFERENCE: Custom errors are present as required by the brief (source: src/TidePost.sol lines 14-18).
OBSERVATION: test/TidePostTest.t.sol defines exactly seven tests: testFirstSet, testJumpReverts, testWithinJump, testStaleWriter, testReadStale, testReadUnset, testNonCoxswainReverts (source: test/TidePostTest.t.sol lines 27-82).
INFERENCE: All seven named tests required by the brief are present (source: test/TidePostTest.t.sol lines 27-82).
OBSERVATION: test/MockCoxswain.sol imports forge-std/Test.sol (source: test/MockCoxswain.sol line 4).
INFERENCE: forge-std is imported only from test files, not from src/TidePost.sol, matching the brief (source: test/MockCoxswain.sol line 4; src/TidePost.sol).
OBSERVATION: README.md states the unit is int32 centimetresX10 (tenths of a centimetre relative to chart datum, signed) and states this is a single-coxswain post, not a median of many sensors (source: README.md lines 13-16, 22-24).
INFERENCE: The README satisfies the brief's documentation requirements (source: README.md).
OBSERVATION: Recorded checks state forge build passed with Solc 0.8.24 compiling 22 files, and forge test passed with 7 tests passed, 0 failed (source: recorded checks).
INFERENCE: Compilation and the test suite succeeded as recorded (source: recorded checks).
UNKNOWN: I could not independently re-run forge build or forge test because I only read the delivered source; I rely on the recorded checks from completed steps (source: recorded checks; delivered source only).
UNKNOWN: I could not verify the exact line numbers of forge-std usage in test/MockCoxswain.sol beyond line 4 because the file is short and fully visible, but I did not execute it (source: test/MockCoxswain.sol).

No FINDING lines: every requirement in the paid brief is satisfied by the delivered source, and the recorded checks confirm compilation and all seven tests pass.
