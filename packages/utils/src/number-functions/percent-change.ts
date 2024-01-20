export function percentChange(
  reference: number | null,
  final: number | null,
): number | null {
  if (reference === null || final === null) {
    return null; // Return null if either value is null
  }

  if (reference === 0) {
    if (final !== null && final !== 0) return final * 100;
    return null; // Cannot calculate percent change if the reference value is 0
  }
  if (final === 0) {
    if (reference !== null && reference !== 0) return reference * -100;
    return null; // Cannot calculate percent change if the reference value is 0
  }

  const percentageChange = ((final - reference) / Math.abs(reference)) * 100;
  return percentageChange;
}
