import { expect, test } from '@jest/globals';
import { DateTime } from 'luxon';
import { luxonToManilaSqlFormat } from './luxon-to-manila-sql-format';

test('luxonToManilaSqlFormat should convert to Manila and format correctly', () => {
  // Create a Luxon DateTime object with a specific date and time
  const dateTime = DateTime.utc(2023, 12, 11, 16, 0, 0);
  // Convert to Manila and format
  const formattedDate = luxonToManilaSqlFormat(dateTime);
  // Check if the timezone is Manila and the format is correct
  expect(formattedDate).toBe('2023-12-12');
});
