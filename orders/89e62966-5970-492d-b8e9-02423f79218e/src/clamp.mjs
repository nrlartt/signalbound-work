export function clamp(x, min, max) {
  if (min > max) {
    throw new RangeError("Invalid bounds: min must not be greater than max");
  }
  return Math.max(min, Math.min(max, x));
}