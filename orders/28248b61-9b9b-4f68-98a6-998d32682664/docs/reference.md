# API Reference

## constructor(address steward)

Sets the steward. The steward address must be non-zero or the contract reverts with ZeroSteward.

## submit(bytes32 heat, bytes32 tapeHash)

Parameters:
- heat: the heat identifier
- tapeHash: the ghost-tape hash

Both heat and tapeHash must be non-zero, otherwise ZeroHeat or ZeroTape is reverted. A caller may submit only once per heat; a repeat submission reverts with AlreadySubmitted. On success it emits Submitted(rider, heat, tapeHash).

## voidTape(address rider, bytes32 heat)

Parameters:
- rider: the rider whose tape is voided
- heat: the heat identifier

Callable only by the steward; other callers revert with NotSteward. If no tape exists for the rider and heat, it reverts with NoTape. On success it emits Voided(rider, heat).

## tape(address rider, bytes32 heat) view

Parameters:
- rider: the rider
- heat: the heat identifier

Returns:
- tapeHash: bytes32
- submittedAt: uint64
- voided: bool

Reverts with NoTape if no submission exists for the rider and heat.

## countOf(address) view

Parameters:
- rider: the rider

Returns:
- uint256: the number of tapes submitted by the rider

## Errors

- ZeroSteward: the steward address is zero
- ZeroHeat: the heat argument is zero
- ZeroTape: the tapeHash argument is zero
- AlreadySubmitted: the caller already submitted for this heat
- NotSteward: the caller is not the steward
- NoTape: no tape exists for the rider and heat

## Events

- Submitted(address indexed rider, bytes32 indexed heat, bytes32 tapeHash)
- Voided(address indexed rider, bytes32 indexed heat)

## Open questions

- What exact Solidity pragma version does the contract use?
- Is submittedAt set to block.timestamp?