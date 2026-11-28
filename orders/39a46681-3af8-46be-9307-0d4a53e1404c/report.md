# EIP-1271 and EIP-191: Contract Signature Validation and Signed Data

## Observations

OBSERVATION: EIP-1271 defines an isValidSignature function with signature `function isValidSignature ( bytes32 _hash , bytes memory _signature ) public view returns ( bytes4 magicValue );` (source: https://eips.ethereum.org/EIPS/eip-1271)

OBSERVATION: EIP-1271 states the function MUST return the bytes4 magic value `0x1626ba7e` when the function passes (source: https://eips.ethereum.org/EIPS/eip-1271)

OBSERVATION: EIP-1271 is listed as Final Standards Track: ERC (source: https://eips.ethereum.org/EIPS/eip-1271)

OBSERVATION: EIP-1271 states the function MUST NOT modify state, using STATICCALL for solc < 0.5 or the view modifier for solc > 0.5, and MUST allow external calls (source: https://eips.ethereum.org/EIPS/eip-1271)

OBSERVATION: EIP-1271 says applications wanting to support contract signatures should call this method if the signer is a contract (source: https://eips.ethereum.org/EIPS/eip-1271)

OBSERVATION: EIP-191 defines signed_data format `0x19 <1 byte version> <version specific data> <data to sign>` (source: https://eips.ethereum.org/EIPS/eip-191)

OBSERVATION: EIP-191 registry lists version byte `0x00` as EIP 191 Data with intended validator (source: https://eips.ethereum.org/EIPS/eip-191)

OBSERVATION: EIP-191 registry lists version byte `0x45` (E) as EIP 191 personal_sign messages (source: https://eips.ethereum.org/EIPS/eip-191)

OBSERVATION: EIP-191 version 0x00 format is `0x19 <0x00> <intended validator address> <data to sign>` (source: https://eips.ethereum.org/EIPS/eip-191)

OBSERVATION: EIP-191 version 0x45 format is `0x19 <0x45 (E)> <thereum Signed Message:\n" + len(message)> <data to sign>` (source: https://eips.ethereum.org/EIPS/eip-191)

OBSERVATION: EIP-191 says the initial 0x19 byte ensures signed_data is not valid RLP, so it can never be an Ethereum transaction (source: https://eips.ethereum.org/EIPS/eip-191)

OBSERVATION: EIP-191 example recovers the signer with ecrecover and checks `if (addressRecovered == owner)` before executing (source: https://eips.ethereum.org/EIPS/eip-191)

## Inferences

INFERENCE: A contract implementing EIP-1271 can accept an EIP-191 signed message by receiving the hash and signature, calling its own isValidSignature(hash, signature), and accepting only when it returns exactly 0x1626ba7e; any other return value or revert means rejection (source: https://eips.ethereum.org/EIPS/eip-1271)

INFERENCE: For EIP-191 version 0x00, the contract can use the intended validator address field to bind the signature to itself, preventing reuse by a different wallet (source: https://eips.ethereum.org/EIPS/eip-191)

INFERENCE: For EIP-191 version 0x45, the contract can treat the personal_sign prefix as version-specific data and verify the recovered signer against an authorized owner (source: https://eips.ethereum.org/EIPS/eip-191)

INFERENCE: Because EIP-1271 returns a strict bytes4 magic value instead of a boolean, verification is stricter and simpler than boolean-based checks (source: https://eips.ethereum.org/EIPS/eip-1271)

INFERENCE: EIP-1271 is backward compatible with EOA signature validation because it is specific to contract-based signatures and not EOA signatures (source: https://eips.ethereum.org/EIPS/eip-1271)

## Unread sources and limitations

UNKNOWN: No unread sources; both requested sources were successfully fetched (source: worker fetch result for source 1 and source 2)

## Sources

- https://eips.ethereum.org/EIPS/eip-1271
- https://eips.ethereum.org/EIPS/eip-191