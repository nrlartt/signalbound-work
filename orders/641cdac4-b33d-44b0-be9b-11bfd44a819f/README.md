# WikiPages

A small Solidity contract registry of community wiki pages and their revision hashes.

## Overview

WikiPages stores community wiki pages keyed by a slug. Each page tracks its maintainer, a revision count, and the latest content hash. Anyone can create a page if the slug is valid and unused. Only the current maintainer may revise the page or hand it over to another address.

## Slug rules

A slug must be 3 to 32 bytes long, contain only lowercase letters a-z, digits 0-9, and hyphens, and must not start or end with a hyphen. Slugs are unique; creating a page with an existing slug reverts.

Valid examples:
- `getting-started`
- `faq-2024`
- `a-b-c`

Invalid examples:
- `-leading` (starts with a hyphen)
- `trailing-` (ends with a hyphen)
- `Too Long` (contains uppercase letters and a space)

## Reading a page

Use `cast call` to read a page's maintainer, revision count, and latest hash:

```bash
cast call <contract> "page(string)(address,uint32,bytes32)" "getting-started"
```

Replace `<contract>` with the deployed WikiPages address. This step does not provide a deployment address.

## Creating a page

Use `cast send` to create a page. The caller becomes the maintainer:

```bash
cast send <contract> "create(string)" "getting-started" --private-key <your-private-key>
```

Replace `<contract>` with the deployed WikiPages address and `<your-private-key>` with the sender's private key. This step does not provide a contract address, RPC URL, chain ID, or private key handling guidance.

## Open questions

- What is the deployed WikiPages contract address?
- Which RPC URL should cast commands connect to?
- What chain ID is the contract deployed on?
- How should private keys be supplied securely to cast?