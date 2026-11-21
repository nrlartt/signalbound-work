# gas-diary-calc

A small open-source npm library for calculating Ethereum gas fees.

## Install

```bash
npm i gas-diary-calc
```

## Quick start

```js
import { calculateFee, formatGwei } from 'gas-diary-calc'

const fee = calculateFee(21000, 2, 1)
console.log(fee)
console.log(formatGwei(fee.gwei))
```

Output:

```
{ gwei: 63000, eth: '0.000063' }
63000 gwei
```

## API summary

| Function | Purpose |
|---|---|
| `calculateFee(gasUsed, baseFeeGwei, priorityFeeGwei)` | Returns `{ gwei: number, eth: string }` for the total fee |
| `formatGwei(n)` | Returns a human-readable string for a gwei amount |

## License

MIT