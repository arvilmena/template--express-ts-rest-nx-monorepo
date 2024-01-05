import { MANILA_TIMEZONE } from '@myawesomeorg/constants';
import { DateTime } from 'luxon';

export function dayUrlParamStringToLuxon(urlParamString: string): DateTime {
  const dateTime = DateTime.fromFormat(urlParamString, 'yyyy-MM-dd', {
    zone: MANILA_TIMEZONE,
  });

  if (!dateTime.isValid) {
    throw new Error(`Invalid date string: ${urlParamString}`);
  }

  return dateTime;
}
