import { manilaLuxonDateToCrawlDataAtFormat } from '@myawesomeorg/utils';
import { asc, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { DateTime } from 'luxon';
import { z } from 'zod';
import { DayRepository, dailyCrawl, dailyCrawlType, db } from './../index';
import { FixAnnoyingDrizzleZodBug } from './_helper';

export const insertDailyCrawlSchema = createInsertSchema(dailyCrawl);

export class DailyCrawlRepository {
  constructor(private readonly dayRepository: DayRepository) {}

  async findByLuxonDate(luxon: DateTime) {
    const correctDateFormat = manilaLuxonDateToCrawlDataAtFormat(luxon);
    return await db.query.dailyCrawl.findFirst({
      where: eq(dailyCrawl.dataAt, correctDateFormat),
      with: {
        dailyCrawlTypes: {
          orderBy: [
            asc(dailyCrawlType.crawlType),
            asc(dailyCrawlType.crawlTypeSpecific),
            asc(dailyCrawlType.id),
          ],
        },
      },
    });
  }
  async findById(id: number) {
    return await db.query.dailyCrawl.findFirst({
      where: eq(dailyCrawl.id, id),
      with: {
        dailyCrawlTypes: {
          orderBy: [
            asc(dailyCrawlType.crawlType),
            asc(dailyCrawlType.crawlTypeSpecific),
          ],
        },
      },
    });
  }

  async getByLuxon(luxon: DateTime) {
    const correctDateFormat = manilaLuxonDateToCrawlDataAtFormat(luxon);
    const day = await this.dayRepository.getByLuxon(correctDateFormat);
    if (!day) {
      throw new Error(
        `Day entry for ${luxon.toISO()} -> ${correctDateFormat.toISO()} cant be created nor fetched`
      );
    }
    const data: FixAnnoyingDrizzleZodBug<
      z.infer<typeof insertDailyCrawlSchema>,
      'dataAt'
    > = {
      dataAt: day.dataAt,
    };
    try {
      const [v] = await db
        .insert(dailyCrawl)
        .values(data)
        .onConflictDoNothing()
        .returning();
      if (v === undefined) {
        return await this.findByLuxonDate(correctDateFormat);
      }
      return v;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async markCompletedIfAllCrawlTypesAreCompleted(
    dailyCrawlId: number,
    luxon: DateTime
  ) {
    const f = await this.findById(dailyCrawlId);
    if (!f) {
      return false;
    }
    const unfinishedCrawlTypes = f.dailyCrawlTypes.filter((n) => !n.dataId);
    if (unfinishedCrawlTypes.length !== 0) {
      return false;
    }
    const [v] = await db
      .update(dailyCrawl)
      .set({ finishedAt: luxon })
      .where(eq(dailyCrawl.id, dailyCrawlId))
      .returning();
    return v;
  }
}
export type DailyCrawlDbData = Awaited<
  ReturnType<InstanceType<typeof DailyCrawlRepository>['getByLuxon']>
>;
