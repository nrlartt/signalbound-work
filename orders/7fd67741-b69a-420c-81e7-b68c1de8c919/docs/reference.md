# API reference

## constructor(address registrar)

Sets the registrar address. The brief does not state what happens if registrar is the zero address.

## tag(bytes32 accession, string label)

Registrar only. Requires accession to be non-zero. Requires label to be 1 to 48 bytes. Requires the accession to be unused. Records the label and the current block timestamp as taggedAt. Emits Tagged with the accession, label, and index.

## retag(bytes32 accession, string label)

Registrar only. Requires the accession to have been tagged already. Requires the accession not to have been retagged already. Replaces the label with the new label, remembers the old label, and marks the accession as retagged. Emits Retagged with the accession, old label, and new label.

## info(bytes32 accession) view

Returns (string label, uint64 taggedAt, bool retagged). The brief does not state what is returned for an unknown accession.

## count() view

Returns uint256, the number of tagged accessions.

## Errors

- ZeroRegistrar()
- NotRegistrar()
- ZeroAccession()
- BadLabel()
- AlreadyTagged()
- Unknown()
- AlreadyRetagged()

The brief does not state which function reverts with which error.

## Events

- Tagged(bytes32 indexed accession, string label, uint32 index)
- Retagged(bytes32 indexed accession, string oldLabel, string newLabel)

The brief does not state what index means or how it is assigned.

## Open questions

- What is the exact Solidity source for these functions?
- Which error does each function revert with, and under what conditions?
- What does info return for an accession that was never tagged?
- How is the Tagged index assigned?