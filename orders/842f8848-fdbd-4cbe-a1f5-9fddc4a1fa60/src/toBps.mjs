export function toBps(weights) {
  if (!Array.isArray(weights) || weights.length === 0) {
    throw new Error('empty');
  }

  for (const weight of weights) {
    if (typeof weight !== 'number' || !Number.isFinite(weight) || weight < 0) {
      throw new Error('bad weight');
    }
  }

  let total = 0;
  for (const weight of weights) {
    total += weight;
  }

  if (total === 0) {
    throw new Error('zero total');
  }

  const exactShares = weights.map((weight) => (weight * 10000) / total);
  const floors = exactShares.map((share) => Math.floor(share));

  let sum = 0;
  for (const floor of floors) {
    sum += floor;
  }

  let remaining = 10000 - sum;

  const remainders = exactShares.map((share, index) => ({
    index,
    remainder: share - Math.floor(share),
  }));

  remainders.sort((a, b) => b.remainder - a.remainder || a.index - b.index);

  const result = [...floors];
  for (let i = 0; i < remaining; i++) {
    result[remainders[i].index] += 1;
  }

  return result;
}