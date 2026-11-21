# API reference

## calculateFee(gasUsed, baseFeeGwei, priorityFeeGwei)

Calculates the total gas fee for a transaction.

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `gasUsed` | `number` | Amount of gas used by the transaction |
| `baseFeeGwei` | `number` | Base fee in gwei |
| `priorityFeeGwei` | `number` | Priority fee (tip) in gwei |

### Return value

Returns `{ gwei: number, eth: string }`. The `gwei` field is the total fee in gwei. The `eth` field is the total fee in ETH as a string.

### Thrown errors

Throws `RangeError` if any input is negative or non-finite.

### Examples

```js
import { calculateFee } from 'gas-diary-calc'

calculateFee(21000, 2, 1)
// { gwei: 63000, eth: '0.000063' }
```

```js
import { calculateFee } from 'gas-diary-calc'

calculateFee(100000, 15, 2)
// { gwei: 1700000, eth: '0.0017' }
```

## formatGwei(n)

Formats a gwei amount as a human-readable string.

### Parameters

| Parameter | Type | Description |
|---|---|---|
| `n` | `number` | Amount in gwei |

### Return value

Returns a `string` representing the gwei amount.

### Thrown errors

Throws `RangeError` if `n` is negative or non-finite.

### Examples

```js
import { formatGwei } from 'gas-diary-calc'

formatGwei(63000)
// '63000 gwei'
```

```js
import { formatGwei } from 'gas-diary-calc'

formatGwei(1700000)
// '1700000 gwei'
```