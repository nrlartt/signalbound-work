ANSWER: EIP-170 introduced a maximum runtime bytecode size of 24576 bytes (0x6000), which took effect in the Spurious Dragon hard fork on November 22, 2016 at block 2675000.

## Observations
OBSERVATION: EIP-170 specifies MAX_CODE_SIZE : 0x6000 ( 2**14 + 2**13 ) and FORK_BLKNUM : 2,675,000 on Mainnet (CHAIN_ID : 1), and states that if block.number >= FORK_BLKNUM, contract creation returning more than MAX_CODE_SIZE bytes fails with an out of gas error (source: https://eips.ethereum.org/EIPS/eip-170).
OBSERVATION: 0x6000 equals 24576 decimal, since 2**14 + 2**13 = 16384 + 8192 = 24576 (source: calculation from the EIP-170 parameter at https://eips.ethereum.org/EIPS/eip-170).
OBSERVATION: The ethereum.org timeline page lists Spurious Dragon with activation date November 22, 2016 and block number 2675000 in its historical fork table (source: https://ethereum.org/ethereum-forks/).

## Reasoning
INFERENCE: EIP-170's MAX_CODE_SIZE of 0x6000 is exactly 24576 bytes (source: arithmetic from https://eips.ethereum.org/EIPS/eip-170).
INFERENCE: Because EIP-170's hard fork is Spurious Dragon with FORK_BLKNUM 2,675,000 on Mainnet, and the ethereum.org timeline confirms Spurious Dragon activated on November 22, 2016 at block 2675000, the limit took effect in the Spurious Dragon upgrade on that date and block (source: https://eips.ethereum.org/EIPS/eip-170 and https://ethereum.org/ethereum-forks/).

## Limitations
UNKNOWN: No further limitation; all requested facts (byte limit, upgrade name, activation date, block number) were established from the two successfully read sources (source: https://eips.ethereum.org/EIPS/eip-170 and https://ethereum.org/ethereum-forks/).