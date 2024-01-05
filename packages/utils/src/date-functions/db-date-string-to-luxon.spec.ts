import { expect, test } from '@jest/globals';
import { dbDateStringToLuxon } from './db-date-string-to-luxon';

test('dbDateStringToLuxon should parse and set UTC timezone correctly', () => {
  // Test valid date string
  const validDateStr = '2023-12-13 10:30:15';
  const parsedDateTime = dbDateStringToLuxon(validDateStr);

  // Check if parsing is valid and timezone is UTC
  expect(parsedDateTime.isValid).toBe(true);
  expect(parsedDateTime.zoneName).toBe('UTC');
  expect(parsedDateTime.toISO()).toBe('2023-12-13T10:30:15.000Z');

  // Test invalid date string
  const invalidDateStr = 'invalid-date-string';
  expect(() => dbDateStringToLuxon(invalidDateStr)).toThrow(
    `Invalid date string: ${invalidDateStr}`
  );
});
