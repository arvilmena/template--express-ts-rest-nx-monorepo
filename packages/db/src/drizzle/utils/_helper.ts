import { DateTime } from 'luxon';
// @see https://discord.com/channels/1043890932593987624/1179097471771758692
export type FixAnnoyingDrizzleZodBug<T, K extends keyof T> = Omit<T, K> & {
  [Key in K]: DateTime;
};
