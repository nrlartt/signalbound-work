# API reference

## Functions

### create(string slug)

Creates a new wiki page. The slug must be 3 to 32 bytes, match `^[a-z0-9-]+$`, not start or end with `-`, and must not already exist. The caller becomes the page maintainer. Emits `Created`.

- `slug`: the page slug.

### revise(string slug, bytes32 contentHash)

Revises an existing page. Only the maintainer may call this. The content hash must be non-zero. The page must already exist. Emits `Revised`.

- `slug`: the page slug.
- `contentHash`: the new content hash.

### handOver(string slug, address next)

Transfers maintainership of a page. Only the current maintainer may call this. The next address must not be the zero address. The page must already exist. Emits `HandedOver`.

- `slug`: the page slug.
- `next`: the new maintainer address.

### page(string slug) view

Returns page metadata.

- `slug`: the page slug.
- Returns `maintainer`: the current maintainer address.
- Returns `revisions`: the number of revisions as `uint32`.
- Returns `latestHash`: the latest content hash as `bytes32`.

## Errors

- `BadSlug()`: the slug failed validation.
- `SlugTaken()`: the slug already exists.
- `NoPage()`: the slug does not exist.
- `NotMaintainer()`: the caller is not the maintainer.
- `ZeroHash()`: a zero bytes32 hash was supplied.
- `ZeroAddress()`: a zero address was supplied.

## Events

- `Created(bytes32 indexed slugHash, string slug, address maintainer)`: emitted when a page is created.
- `Revised(bytes32 indexed slugHash, uint32 revision, bytes32 contentHash)`: emitted when a page is revised.
- `HandedOver(bytes32 indexed slugHash, address from, address to)`: emitted when maintainership changes.

## Slug hash computation

The indexed topic `slugHash` is computed as `keccak256(bytes(slug))`, where `bytes(slug)` is the UTF-8 byte encoding of the slug string.

## Open questions

- What Solidity compiler version should be used?
- Is there an upper bound on the number of pages a single maintainer may own?