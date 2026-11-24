ANSWER: EIP-170 introduced a maximum runtime bytecode size of 24576 bytes (0x6000 = 2**14 + 2**13), which took effect at the Spurious Dragon hard fork on block 2,675,000.

## Observations
OBSERVATION: EIP-170 specifies MAX_CODE_SIZE : 0x6000 ( 2**14 + 2**13 ) and FORK_BLKNUM : 2,675,000 for Mainnet (CHAIN_ID : 1), under the Spurious Dragon hard fork. (source: https://eips.ethereum.org/EIPS/eip-170)
OBSERVATION: EIP-170 states that if block.number >= FORK_BLKNUM, contract creation initialization returning data longer than MAX_CODE_SIZE bytes fails with an out of gas error. (source: https://eips.ethereum.org/EIPS/eip-170)
OBSERVATION: ethereum.org's fork timeline lists Spurious Dragon with block number 2,675,000. (source: https://ethereum.org/ethereum-forks/)
OBSERVATION: 0x6000 equals 24576 in decimal, computed as 2**14 + 2**13 = 16384 + 8192. (source: arithmetic from the EIP-170 excerpt at https://eips.ethereum.org/EIPS/eip-170)

## Reasoning
INFERENCE: EIP-170's exact maximum runtime bytecode size is 24576 bytes because MAX_CODE_SIZE is defined as 0x6000, which equals 2**14 + 2**13 = 24576. (source: https://eips.ethereum.org/EIPS/eip-170)
INFERENCE: The limit took effect on Ethereum mainnet at the Spurious Dragon hard fork, activation block 2,675,000, because EIP-170 lists Spurious Dragon as its hard fork with FORK_BLKNUM 2,675,000 on CHAIN_ID 1, and ethereum.org's timeline confirms Spurious Dragon at block 2,675,000. (source: https://eips.ethereum.org/EIPS/eip-170; https://ethereum.org/ethereum-forks/)
UNKNOWN: The exact calendar activation date of Spurious Dragon could not be established from the supplied excerpts because neither source states a date for that fork. (source: https://eips.ethereum.org/EIPS/eip-170; https://ethereum.org/ethereum-forks/)

## Limitations
LIMITATION: No activation date for Spurious Dragon appears in the fetched excerpts, so the requested activation date cannot be cited from the supplied sources. (source: https://eips.ethereum.org/EIPS/eip-170; https://ethereum.org/ethereum-forks/)
LIMITATION: This step only produced one panel member's answer; it did not produce the panel's combined answer or the signed record of how many members agreed. (source: task brief)