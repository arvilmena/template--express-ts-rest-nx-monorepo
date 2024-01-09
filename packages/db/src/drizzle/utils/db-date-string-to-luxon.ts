import { DateTime } from "luxon";

export function dbDateStringToLuxon(dbDate: string): DateTime {
  // Parse the date string using Luxon
  const dateTime = DateTime.fromFormat(dbDate, "yyyy-MM-dd HH:mm:ss", {
    zone: "UTC",
  });

  // Check if the parsing was successful
  if (!dateTime.isValid) {
    throw new Error(`Invalid date string: ${dbDate}`);
  }

  // Ensure the parsed DateTime object is in UTC
  return dateTime;
}
