import { DateTime } from "luxon";

// Function to convert Luxon DateTime to UTC and format it
export function luxonToDbFormat(dateTime: DateTime): string {
  // Set the timezone to UTC
  const utcDateTime = dateTime.setZone("UTC");

  // Format the date and time
  const formattedDateTime = utcDateTime.toFormat("yyyy-MM-dd HH:mm:ss");

  return formattedDateTime;
}
