import { MANILA_TIMEZONE } from '@myawesomeorg/constants';
import { DateTime } from 'luxon';

export function manilaLuxonDateToCrawlDataAtFormat(luxon: DateTime): DateTime {
  return luxon
    .setZone(MANILA_TIMEZONE)
    .set({ hour: 0 })
    .set({ minute: 0 })
    .set({ second: 0 })
    .set({ millisecond: 0 })
    .toUTC();
}
