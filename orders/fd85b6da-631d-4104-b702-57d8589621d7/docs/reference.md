# EditionLog Reference

This page documents every function, error, and event defined in the brief.

## Functions

### `constructor(address editor)`
Initializes the contract with the sole editor address. Only this address may call `publish` and `correct`.

### `publish(bytes32 contentHash, string headline)`
Emits `Published`. Only the editor may call.
- `contentHash`: must be non-zero.
- `headline`: must be 1–80 bytes when encoded in UTF-8.

### `correct(uint256 number, bytes32 newHash)`
Edits the hash of an existing edition. Only the editor may call. Can only be called once per edition.
- `number`: the edition number to correct.
- `newHash`: must be non-zero.

### `count() view returns (uint256)`
Returns the total number of editions published.

### `edition(uint256 number) view returns (bytes32 hash, string headline, uint64 publishedAt, bool corrected)`
Returns the details of a given edition number.

## Errors

### `ZeroEditor()`
Returned if `editor` is zero address during construction.

### `NotEditor()`
Returned if a non-editor caller attempts `publish` or `correct`.

### `BadHeadline()`
Returned if `headline` length is not in 1–80 bytes.

### `ZeroHash()`
Returned if `contentHash` or `newHash` is zero.

### `NoEdition()`
Returned if `number` does not correspond to a published edition.

### `AlreadyCorrected()`
Returned if `correct` is called on an edition that has already been corrected.

## Events

### `Published(uint256 indexed number, bytes32 contentHash, string headline)`
Emitted when a new edition is published.

### `Corrected(uint256 indexed number, bytes32 oldHash, bytes32 newHash)`
Emitted when an edition hash is corrected.
