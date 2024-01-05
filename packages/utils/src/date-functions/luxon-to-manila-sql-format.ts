import { MANILA_TIMEZONE } from '@myawesomeorg/constants';
import { DateTime } from 'luxon';

// Function to convert Luxon DateTime to Manila local date and format it
export function luxonToManilaSqlFormat(dateTime: DateTime): string {
  // Set the timezone to Asia/Manila
  const manilaDateTime = dateTime.setZone(MANILA_TIMEZONE);

  // Format the date to SQL format
  const formattedDate = manilaDateTime.toFormat('yyyy-MM-dd');

  return formattedDate;
}
