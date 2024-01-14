import {
  toHumanReadable,
  trimDecimalTrailingZeros,
} from './clean-floating-number'; // Replace 'your-file' with the actual file path

describe('toHumanReadable', () => {
  it('should format number with commas and specified digits', () => {
    expect(toHumanReadable(1000, 2)).toEqual('1,000.00');
    expect(toHumanReadable(123456789, 3)).toEqual('123,456,789.000');
  });

  it('should default to 2 digits if not specified', () => {
    expect(toHumanReadable(1234)).toEqual('1,234.00');
  });

  it('should handle negative numbers', () => {
    expect(toHumanReadable(-9876.54321, 4)).toEqual('-9,876.5432');
  });

  it('should not exceed the maximum digits of the inputted number', () => {
    expect(toHumanReadable(1000.25, 4)).toEqual('1,000.25');
    expect(toHumanReadable(123.456, 2)).toEqual('123.46');
  });
});

describe('trimTrailingZeros', () => {
  it('should trim trailing zeros and decimal point', () => {
    expect(trimDecimalTrailingZeros('100.00')).toEqual('100');
    expect(trimDecimalTrailingZeros('100')).toEqual('100');
    expect(trimDecimalTrailingZeros('100.3300')).toEqual('100.33');
    expect(trimDecimalTrailingZeros('123.450000')).toEqual('123.45');
  });

  it('should handle strings without trailing zeros', () => {
    expect(trimDecimalTrailingZeros('123')).toEqual('123');
    expect(trimDecimalTrailingZeros('123.45')).toEqual('123.45');
  });

  it('should handle strings without decimal points', () => {
    expect(trimDecimalTrailingZeros('500')).toEqual('500');
  });

  it('should handle strings ending with a decimal point', () => {
    expect(trimDecimalTrailingZeros('500.')).toEqual('500');
  });

  it('should handle zero', () => {
    expect(trimDecimalTrailingZeros('0.')).toEqual('0');
    expect(trimDecimalTrailingZeros('0.0')).toEqual('0');
    expect(trimDecimalTrailingZeros('0.00')).toEqual('0');
  });

  // Add more test cases as needed
});
