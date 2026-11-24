ANSWER: EIP-170 introduced a maximum runtime bytecode size of 24576 bytes (0x6000), which took effect at the Spurious Dragon hard fork on block 2675000.

## Observations
OBSERVATION: EIP-170 sets MAX_CODE_SIZE to 0x6000, described as 2**14 + 2**13, and FORK_BLKNUM to 2,675,000 on CHAIN_ID 1 (Mainnet), under the Spurious Dragon hard fork (source: https://eips.ethereum.org/EIPS/eip-170).
OBSERVATION: The ethereum.org forks page lists upgrade names and dates but the fetched excerpt does not include Spurious Dragon or its activation date (source: https://ethereum.org/ethereum-forks/).
INFERENCE: 0x6000 equals 24576 bytes because 2**14 is 16384 and 2**13 is 8192, and 16384 + 8192 equals 24576 (source: arithmetic from the EIP-170 excerpt at https://eips.ethereum.org/EIPS/eip-170).
INFERENCE: EIP-170 took effect at the Spurious Dragon hard fork on mainnet at block 2675000 (source: https://eips.ethereum.org/EIPS/eip-170).
UNKNOWN: The exact calendar activation date of Spurious Dragon is not stated in the fetched ethereum.org excerpt, which covers later upgrades such as Fusaka and Pectra but not Spurious Dragon (source: https://ethereum.org/ethereum-forks/).

## Reasoning
The EIP-170 excerpt directly states the code size limit as 0x6000 (2**14 + 2**13 = 24576 bytes), the fork block as 2,675,000, and the chain as mainnet, under the Spurious Dragon hard fork. The ethereum.org excerpt was checked for an activation date but does not list Spurious Dragon, so the calendar date cannot be established from the supplied sources.

## Limitations
The activation date in calendar form could not be established because the fetched ethereum.org forks page excerpt does not include Spurious Dragon; only block number 2675000 is supported by the sources (source: https://ethereum.org/ethereum-forks/).