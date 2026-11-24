# block-age

A small open-source JavaScript library for computing blockchain block ages. Published on npm as an ESM package with no dependencies.

## Install

npm install block-age

## Quick start

```js
import { blockAge, formatAge, isStale } from 'block-age';

const age = blockAge(1700000000);
console.log(formatAge(age));
console.log(isStale(1700000000, 3600));
```

## Documentation

- [API reference](docs/api.md)
- [Examples](docs/examples.md)

## Open questions

- The brief does not state the ESM import syntax beyond the package name; confirm whether a named import, default import, or subpath export is supported.
- The brief does not provide a repository URL; the documentation link target above is relative and may need to be replaced with the published package URL.