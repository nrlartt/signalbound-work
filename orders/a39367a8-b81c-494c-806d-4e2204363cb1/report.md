# EIP-1167 Minimal Proxy and EIP-2470 Singleton Factory

## Observations

OBSERVATION: EIP-1167 is titled "ERC-1167: Minimal Proxy Contract" and its status line reads "Final Standards Track: ERC". (source: https://eips.ethereum.org/EIPS/eip-1167)

OBSERVATION: EIP-1167 states that the exact bytecode of the standard clone contract is "363d3d373d3d3d363d73bebebebebebebebebebebebebebebebebebebebe5af43d82803e903d91602b57fd5bf3". (source: https://eips.ethereum.org/EIPS/eip-1167)

OBSERVATION: EIP-1167 states that the bytes at indices 10 - 29 (inclusive) are replaced with the 20 byte address of the master functionality contract. (source: https://eips.ethereum.org/EIPS/eip-1167)

OBSERVATION: EIP-1167 states that the standard proxy forwards all calls and 100% of the gas to the implementation contract and relays the return value back to the caller, passing back reverts with payload data. (source: https://eips.ethereum.org/EIPS/eip-1167)

OBSERVATION: EIP-1167's rationale lists inexpensive deployment (low gas to deploy clones) as a goal. (source: https://eips.ethereum.org/EIPS/eip-1167)

OBSERVATION: EIP-2470 is titled "ERC-2470: Singleton Factory" and its status line reads "Stagnant Standards Track: ERC". (source: https://eips.ethereum.org/EIPS/eip-2470)

OBSERVATION: EIP-2470 states that its factory exposes CREATE2 (EIP-1014) to deploy bytecode on deterministic addresses based on initialization code and salt. (source: https://eips.ethereum.org/EIPS/eip-2470)

OBSERVATION: EIP-2470's SingletonFactory.deploy function takes _initCode and _salt and uses assembly create2(0, add(_initCode, 0x20), mload(_initCode), _salt) to return createdContract. (source: https://eips.ethereum.org/EIPS/eip-2470)

OBSERVATION: EIP-2470 gives a raw deployment transaction beginning "0xf9016c8085174876e8008303c4d88080b901546080604052..." and states that from this deterministic pattern anyone can deduce that no one knows the private key for the deployment account. (source: https://eips.ethereum.org/EIPS/eip-2470)

OBSERVATION: EIP-2470 does not state a numeric well-known deployment address for the factory contract in the excerpt. (source: https://eips.ethereum.org/EIPS/eip-2470)

OBSERVATION: EIP-1167's disassembly shows PUSH20 0xbebebebebebebebebebebebebebebebebebebebe at offset 0x00000009, followed by GAS at 0x0000001e and DELEGATECALL at 0x0000001f. (source: https://eips.ethereum.org/EIPS/eip-1167)

## Inferences

INFERENCE: The 45-byte EIP-1167 runtime bytecode skeleton embeds the 20-byte implementation address at byte indices 10-29, replacing the placeholder "be" bytes in the PUSH20 instruction. (source: https://eips.ethereum.org/EIPS/eip-1167)

INFERENCE: A minimal proxy is cheaper than deploying a full copy of the implementation because only the small proxy bytecode is deployed per clone while all logic lives at the fixed implementation address, matching EIP-1167's goal of inexpensive deployment. (source: https://eips.ethereum.org/EIPS/eip-1167)

INFERENCE: EIP-2470's CREATE2 factory lets an EIP-1167 proxy be deployed at a deterministic address derived from the proxy init code and a chosen salt, giving the implementation a stable proxy address across chains. (source: https://eips.ethereum.org/EIPS/eip-2470, https://eips.ethereum.org/EIPS/eip-1167)

INFERENCE: Because EIP-2470's deployment account is keyless by construction, no party can alter or seize the factory, supporting trust-minimized deterministic proxy deployment. (source: https://eips.ethereum.org/EIPS/eip-2470)

## Unread sources and limitations

UNKNOWN: None; both requested sources were read successfully. (source: worker fetch result for sources 1 and 2)

## Sources

https://eips.ethereum.org/EIPS/eip-1167
https://eips.ethereum.org/EIPS/eip-2470