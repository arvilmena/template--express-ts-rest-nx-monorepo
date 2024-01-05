import { expect, test } from '@jest/globals';
import { MANILA_TIMEZONE } from '@myawesomeorg/constants';
import { DateTime } from 'luxon';
import { manilaLuxonDateToCrawlDataAtFormat } from './manila-luxon-date-to-crawl-data-at-format';

const expectedResult = '2023-12-10 16:00:00' as const;
test('manilaLuxonDateToCrawlDataAtFormat should work properly', () => {
  const luxon = DateTime.fromISO('2023-12-10T16:50:53.112Z').setZone(
    MANILA_TIMEZONE
  );

  // Check the timezone is Asia/Manila
  expect(luxon.zoneName).toBe(MANILA_TIMEZONE);
  expect(
    manilaLuxonDateToCrawlDataAtFormat(luxon).toFormat('yyyy-MM-dd HH:mm:ss')
  ).toBe('2023-12-10 16:00:00');
});
test('manilaLuxonDateToCrawlDataAtFormat expectedResult should be on UTC and when converted to Manila time should be 00:00:00', () => {
  const luxon = DateTime.fromFormat(expectedResult, 'yyyy-MM-dd HH:mm:ss', {
    zone: 'utc',
  }).setZone(MANILA_TIMEZONE);

  expect(luxon.zoneName).toBe(MANILA_TIMEZONE);
  expect(luxon.toFormat('yyyy-MM-dd HH:mm:ss')).toBe('2023-12-11 00:00:00');
});
