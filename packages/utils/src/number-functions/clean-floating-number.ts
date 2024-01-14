export function cleanFloatingNumber(number: number): string {
  return trimDecimalTrailingZeros(toHumanReadable(number, 4));
}

export function trimDecimalTrailingZeros(input: string): string {
  const decimalIndex = input.indexOf('.');

  if (decimalIndex !== -1) {
    // If the string contains a decimal point
    let trimmed = input.replace(/0+$/, ''); // Remove trailing zeros
    trimmed = trimmed.replace(/\.$/, ''); // Remove trailing decimal point
    return trimmed;
  }

  // If the string does not contain a decimal point
  return input;
}

export function toHumanReadable(number: number, digits = 2): string {
  // cast number to string
  const stringValue = number.toString();
  // check if theres a decimal point

  if (!stringValue.includes('.')) {
    return number.toLocaleString('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
  }

  // split the string into integer and decimal parts
  const [, decimalPart] = stringValue?.split('.') ?? ['', ''];
  // return the length of the decimal part, which is the number of decimal places
  const inputDecimalDigits = decimalPart.length;

  const digit = inputDecimalDigits <= digits ? inputDecimalDigits : digits;
  const formattedNumber = number.toLocaleString('en-US', {
    minimumFractionDigits: digit,
    maximumFractionDigits: digit,
  });

  return formattedNumber;
}
