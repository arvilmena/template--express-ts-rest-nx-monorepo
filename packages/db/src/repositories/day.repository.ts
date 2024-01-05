import { manilaLuxonDateToCrawlDataAtFormat } from '@myawesomeorg/utils';
import { desc, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { DateTime } from 'luxon';
import { z } from 'zod';
import { day, db } from './../index';
import { FixAnnoyingDrizzleZodBug } from './_helper';
export const insertDaySchema = createInsertSchema(day);

export class DayRepository {
  async findByLuxonDate(luxon: DateTime) {
    const correctDateFormat = manilaLuxonDateToCrawlDataAtFormat(luxon);
    return await db.query.day.findFirst({
      where: eq(day.dataAt, correctDateFormat),
      with: {
        dailyCrawl: true,
      },
    });
  }

  async findAmount(amount: number): Promise<NonNullable<DayDbData>[]> {
    return await db.query.day.findMany({
      limit: amount,
      orderBy: [desc(day.dataAt)],
      with: {
        dailyCrawl: true,
      },
    });
  }

  /**
   * Creates a new day record in the database.
   *
   * Takes a Luxon DateTime and converts it to the correct format for the dataAt field.
   * Checks if a record already exists for that date and returns it if so.
   * Otherwise, inserts a new record and returns it.
   * Handles the case where the insert returns no data by doing a find.
   */
  async getByLuxon(luxon: DateTime) {
    const correctDateFormat = manilaLuxonDateToCrawlDataAtFormat(luxon);
    // const alreadyExisting = await this.findByLuxonDate(correctDateFormat);
    // if (alreadyExisting) return alreadyExisting;
    const data: FixAnnoyingDrizzleZodBug<
      z.infer<typeof insertDaySchema>,
      'dataAt'
    > = {
      dataAt: correctDateFormat,
    };
    let v;
    [v] = await db.insert(day).values(data).onConflictDoNothing().returning();
    if (v === undefined) {
      v = await this.findByLuxonDate(correctDateFormat);
    }
    return v;
  }
}
export type DayDbData = Awaited<
  ReturnType<InstanceType<typeof DayRepository>['getByLuxon']>
>;
export type DayRepositoryFindManyReturnType = Awaited<
  ReturnType<InstanceType<typeof DayRepository>['findAmount']>
>;
