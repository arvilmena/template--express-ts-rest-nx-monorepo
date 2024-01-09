import { customType } from 'drizzle-orm/sqlite-core';

import { DateTime } from 'luxon';
import { dbDateStringToLuxon } from '../utils/db-date-string-to-luxon';
export const luxonDateTime = customType<{
  data: DateTime;
  driverData: string;
  dataType: string;
}>({
  dataType() {
    return 'text';
  },
  fromDriver(value: string): DateTime {
    return dbDateStringToLuxon(value);
  },
  toDriver(value: DateTime): string {
    const toDriver = value.toUTC().toFormat('yyyy-MM-dd HH:mm:ss');
    // console.log({ toDriver });
    return toDriver;
  },
});
