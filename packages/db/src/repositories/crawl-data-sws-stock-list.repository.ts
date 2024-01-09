import { createInsertSchema } from 'drizzle-zod';
import { DateTime } from 'luxon';
import { z } from 'zod';
import { FixAnnoyingDrizzleZodBug } from '../drizzle/utils/_helper';
import { crawlDataSwsStockList, db } from './../index';

export const insertCrawlDataSwsStockListSchema = createInsertSchema(
  crawlDataSwsStockList,
);

export type SwsStockListCrawlTypeSpecificType = z.infer<
  typeof insertCrawlDataSwsStockListSchema
>['crawlTypeSpecific'];

export class CrawlDataSwsStockListRepository {
  async createOne({
    luxon,
    crawlTypeSpecific,
  }: {
    luxon: DateTime;
    crawlTypeSpecific: SwsStockListCrawlTypeSpecificType;
  }) {
    const data: FixAnnoyingDrizzleZodBug<
      z.infer<typeof insertCrawlDataSwsStockListSchema>,
      'crawledAt'
    > = {
      crawledAt: luxon,
      crawlTypeSpecific,
    };
    const [v] = await db
      .insert(crawlDataSwsStockList)
      .values(data)
      .onConflictDoNothing()
      .returning();
    return v;
  }
}
