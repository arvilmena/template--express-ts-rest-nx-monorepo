import { expect, test } from '@jest/globals';
import { MANILA_TIMEZONE } from '@myawesomeorg/constants';
import { getCurrentManilaDate } from './get-current-manila-time';

test('getCurrentManilaDate should return current Manila date and time', () => {
  const { luxon, date } = getCurrentManilaDate();

  // Check the timezone is Asia/Manila
  expect(luxon.zoneName).toBe(MANILA_TIMEZONE);

  // Check date and time are valid
  expect(date.getFullYear()).toBeGreaterThanOrEqual(2023);
  expect(date.getMonth()).toBeGreaterThanOrEqual(0);
  expect(date.getDate()).toBeGreaterThanOrEqual(1);
  expect(date.getHours()).toBeGreaterThanOrEqual(0);
  expect(date.getMinutes()).toBeGreaterThanOrEqual(0);
  expect(date.getSeconds()).toBeGreaterThanOrEqual(0);
});
