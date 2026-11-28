# EIP-1559 fee-market change note

## Observations
OBSERVATION: Source 1 prints the status as Final Standards Track: Core. (source: https://eips.ethereum.org/EIPS/eip-1559)
OBSERVATION: Source 1 prints Created 2019-04-13. (source: https://eips.ethereum.org/EIPS/eip-1559)
OBSERVATION: Source 2 prints status Final, type Standards Track, category Core, created 2019-04-13. (source: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)
OBSERVATION: Source 1 prints the abstract transaction format as 0x02 || rlp([chain_id, nonce, max_priority_fee_per_gas, max_fee_per_gas, gas_limit, destination, amount, data, access_list, signature_y_parity, signature_r, signature_s]). (source: https://eips.ethereum.org/EIPS/eip-1559)
OBSERVATION: Source 1 states that the base fee per gas is burned. (source: https://eips.ethereum.org/EIPS/eip-1559)
OBSERVATION: Source 2 states that the base fee per gas is burned. (source: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)
OBSERVATION: Source 1 lists authors Vitalik Buterin (@vbuterin), Eric Conner (@econoar), Rick Dudley (@AFDudley), Matthew Slipper (@mslipper), Ian Norden (@i-norden), Abdelhamid Bakhta (@abdelhamidbakhta). (source: https://eips.ethereum.org/EIPS/eip-1559)
OBSERVATION: Source 2 lists authors Vitalik Buterin (@vbuterin), Eric Conner (@econoar), Rick Dudley (@AFDudley), Matthew Slipper (@mslipper), Ian Norden (@i-norden), Abdelhamid Bakhta (@abdelhamidbakhta). (source: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)
OBSERVATION: Source 1 states that the base fee per gas can move up or down each block according to a formula based on gas used in the parent block and gas target (block gas limit divided by elasticity multiplier) of the parent block. (source: https://eips.ethereum.org/EIPS/eip-1559)
OBSERVATION: Source 2 states the same base-fee adjustment formula using gas target (block gas limit divided by elasticity multiplier). (source: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)

## Inferences
INFERENCE: Because both fetched pages print Created 2019-04-13, the EIP creation date is 2019-04-13. (source: https://eips.ethereum.org/EIPS/eip-1559 and https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)
INFERENCE: Because both fetched pages list the same six authors, the author list is Vitalik Buterin, Eric Conner, Rick Dudley, Matthew Slipper, Ian Norden, Abdelhamid Bakhta. (source: https://eips.ethereum.org/EIPS/eip-1559 and https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)
INFERENCE: Because the abstract gives the transaction format beginning with 0x02, the transaction-type prefix is 0x02. (source: https://eips.ethereum.org/EIPS/eip-1559)

## Unread sources and limitations
UNKNOWN: BASE_FEE_MAX_CHANGE_DENOMINATOR could not be established; neither fetched excerpt contains that constant. (source: https://eips.ethereum.org/EIPS/eip-1559 and https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)
UNKNOWN: ELASTICITY_MULTIPLIER could not be established; neither fetched excerpt contains that constant. (source: https://eips.ethereum.org/EIPS/eip-1559 and https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)
UNKNOWN: INITIAL_BASE_FEE could not be established; neither fetched excerpt contains that constant. (source: https://eips.ethereum.org/EIPS/eip-1559 and https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md)

## Sources
https://eips.ethereum.org/EIPS/eip-1559
https://github.com/ethereum/EIPs/blob/master/EIPS/eip-1559.md