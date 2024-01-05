import { expect, test } from '@jest/globals';
import { DateTime } from 'luxon';
import { luxonToDbFormat } from './luxon-to-db-format';

test('luxonToUtcDbFormat should convert to UTC and format correctly', () => {
  const dateTime = DateTime.fromISO('2023-12-12T20:28:40.047Z');

  const formattedDateTime = luxonToDbFormat(dateTime);

  expect(formattedDateTime).toBe('2023-12-12 20:28:40');
});
