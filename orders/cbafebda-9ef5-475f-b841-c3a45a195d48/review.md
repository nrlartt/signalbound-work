VERDICT: FAIL

# Independent review


FINDING [high] src/SignedPriceOracle.sol:28 — signer address is not included in the signed digest, so a signature for one authorized signer can be reused by any other authorized signer for the same asset, price, timestamp, and nonce, breaking signer binding and replay protection.
OBSERVATION: updateDigest at src/SignedPriceOracle.sol:28-29 encodes address(this), block.chainid, asset, price, timestamp, and nonce but omits msg.sender or any signer identity.
INFERENCE: because the digest does not bind the signer, any authorized key can submit a signature recovered from another authorized key's signing of identical parameters, and the usedNonce mapping is keyed by recovered signer so the same nonce can be consumed once per signer instead of once per signed intent.

FINDING [medium] src/SignedPriceOracle.sol:28 — 29 — the digest lacks EIP-712 domain separation (no contract name, version, or domain separator), making signatures portable to other contracts that sign the same asset/price/timestamp/nonce tuple.
OBSERVATION: updateDigest at src/SignedPriceOracle.sol:28-29 uses a raw keccak256(abi.encode(...)) with only address(this) and block.chainid as context.
INFERENCE: without a structured EIP-712 domain, a signature valid for this oracle could be replayed against any other contract using an identical encoding scheme.

FINDING [medium] src/SignedPriceOracle.sol:47 — no upper bound is enforced on price, so extremely large or economically meaningless price values are accepted.
OBSERVATION: submitPrice at src/SignedPriceOracle.sol:47-48 only reverts when price == 0 via the ZeroPrice error.
INFERENCE: the brief requires invalid price values to be rejected, but only zero is invalid; no maximum or sanity bound is defined.

FINDING [medium] src/SignedPriceOracle.sol:51 — a price exactly freshnessWindow seconds old is treated as fresh by both submitPrice and latestPrice because the stale check uses strict greater-than.
OBSERVATION: submitPrice at src/SignedPriceOracle.sol:51 reverts only when block.timestamp - timestamp > freshnessWindow, and latestPrice at src/SignedPriceOracle.sol:88 uses the same strict comparison.
INFERENCE: at the exact boundary the contract accepts and serves data that is as old as the policy permits, which may be earlier than consumers intend if freshnessWindow is meant to be a maximum age inclusive of the boundary.

FINDING [low] src/SignedPriceOracle.sol:62 — 63 — when a signer is deauthorized, their usedNonce entries are not cleared, so re-authorizing that signer later resurrects old nonce restrictions.
OBSERVATION: setSigner at src/SignedPriceOracle.sol:62-63 only flips authorizedSigner[signer] and emits an event; it does not touch usedNonce[signer].
INFERENCE: a signer deauthorized and later reauthorized will find previously used nonces still blocked, which is surprising access-control behavior and can break legitimate key rotation.

FINDING [low] src/SignedPriceOracle.sol:1 — the Ownable import from OpenZeppelin is not pinned to a version or documented in README as a dependency.
OBSERVATION: src/SignedPriceOracle.sol:1 imports @openzeppelin/contracts/access/Ownable.sol and foundry.toml lists libs = ["lib"] without specifying an OpenZeppelin version.
INFERENCE: reproducible builds cannot be confirmed from the delivered files because the OpenZeppelin version is not declared in foundry.toml, remappings.txt, or README.

UNKNOWN: whether the project compiles — I did not run forge build and cannot confirm OpenZeppelin contracts are installed at the expected path (source: foundry.toml and src/SignedPriceOracle.sol import).
UNKNOWN: whether all tests pass — I did not run forge test and cannot confirm the test expectations match the contract errors at runtime (source: test/SignedPriceOracle.t.sol).
UNKNOWN: the exact OpenZeppelin contract version used — no remappings.txt, lib manifest, or pinned dependency version was delivered (source: foundry.toml and project file listing).
UNKNOWN: whether ECDSA.recover handles malformed signatures safely for all 65-byte lengths — this depends on the OpenZeppelin implementation version, which was not established (source: src/SignedPriceOracle.sol:1 import and usage at line 67).
