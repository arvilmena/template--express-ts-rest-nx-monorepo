import { DateTime } from 'luxon';
import { MANILA_TIMEZONE } from '@myawesomeorg/constants';
import { dayUrlParamStringToLuxon } from './day-url-param-string-to-luxon';
import { luxonToDbFormat } from './luxon-to-db-format';

test('should parse a valid date string', () => {
  const urlParamString = '2023-12-25';
  const expectedDateTime = DateTime.fromISO('2023-12-25', {
    zone: MANILA_TIMEZONE,
  });

  const parsedDateTime = dayUrlParamStringToLuxon(urlParamString);

  expect(parsedDateTime).toEqual(expectedDateTime);
});

test('should throw an error for an invalid date string', () => {
  const invalidUrlParamString = 'not-a-date';

  expect(() => dayUrlParamStringToLuxon(invalidUrlParamString)).toThrow(
    'Invalid date string: not-a-date'
  );
});

test('should set the correct timezone and returns correct db format if converted', () => {
  const urlParamString = '2023-12-27';
  const parsedDateTime = dayUrlParamStringToLuxon(urlParamString);

  expect(parsedDateTime.zoneName).toBe(MANILA_TIMEZONE);
  expect(luxonToDbFormat(parsedDateTime)).toBe('2023-12-26 16:00:00');
});
