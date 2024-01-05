import { GetCurrentManilaDateReturnType } from '@myawesomeorg/constants';
import { DateTime } from 'luxon';

export function getCurrentManilaDate(): GetCurrentManilaDateReturnType {
  // Set the timezone to Asia/Manila
  const manilaZone = DateTime.local().setZone('Asia/Manila');

  // Return both the Luxon DateTime object and the native Date object
  return {
    luxon: manilaZone,
    date: manilaZone.toJSDate(),
  };
}
