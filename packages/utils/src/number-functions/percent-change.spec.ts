import { percentChange } from './percent-change'; // Replace with the correct path

describe('percentChange function', () => {
  it('calculates positive percentage change', () => {
    const referenceValue = 100;
    const finalValue = 120;
    expect(percentChange(referenceValue, finalValue)).toBe(20);
  });

  it('calculates negative percentage change', () => {
    const referenceValue = 100;
    const finalValue = 80;
    expect(percentChange(referenceValue, finalValue)).toBe(-20);
  });

  test('should calculate percent change', () => {
    expect(percentChange(100, 50)).toBe(-50);
    expect(percentChange(50, 100)).toBe(100);
    expect(percentChange(1.0157, 0.6917)?.toFixed(2)).toBe('-31.90');
  });

  test('should handle null values', () => {
    expect(percentChange(null, 100)).toBe(null);
    expect(percentChange(100, null)).toBe(null);
  });

  test('should handle division by zero', () => {
    expect(percentChange(0, 0)).toBe(null);
  });

  test('custom rule, if the reference value is 0, percent difference is final value times 100', () => {
    expect(percentChange(0, 100)).toBe(10_000);
    expect(percentChange(0, 1)).toBe(100);
    expect(percentChange(0.0462, 0)).toBe(0.0462 * -100);
  });
});
