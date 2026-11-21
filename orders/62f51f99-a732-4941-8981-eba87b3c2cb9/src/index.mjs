export function calculateFee(gasUsed, baseFeeGwei, priorityFeeGwei) {
  for (const value of [gasUsed, baseFeeGwei, priorityFeeGwei]) {
    if (!Number.isFinite(value) || value < 0) {
      throw new RangeError('Input must be a finite non-negative number');
    }
  }

  const gwei = gasUsed * (baseFeeGwei + priorityFeeGwei);
  const eth = (gwei / 1e9).toString();

  return { gwei, eth };
}

export function formatGwei(value) {
  if (!Number.isFinite(value) || value < 0) {
    throw new RangeError('Input must be a finite non-negative number');
  }

  return String(value);
}