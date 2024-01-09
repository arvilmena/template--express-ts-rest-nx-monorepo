import { createInsertSchema } from 'drizzle-zod';
import { DateTime } from 'luxon';
import { z } from 'zod';
import { FixAnnoyingDrizzleZodBug } from '../drizzle/utils/_helper';
import { crawlDataSwsScreener, db } from './../index';

export const insertCrawlDataSwsScreenerSchema =
  createInsertSchema(crawlDataSwsScreener);

export type SwsScreenerCrawlTypeSpecificType = z.infer<
  typeof insertCrawlDataSwsScreenerSchema
>['crawlTypeSpecific'];

export class CrawlDataSwsScreenerRepository {
  async createOne({
    luxon,
    crawlTypeSpecific,
  }: {
    luxon: DateTime;
    crawlTypeSpecific: SwsScreenerCrawlTypeSpecificType;
  }) {
    const data: FixAnnoyingDrizzleZodBug<
      z.infer<typeof insertCrawlDataSwsScreenerSchema>,
      'crawledAt'
    > = {
      crawledAt: luxon,
      crawlTypeSpecific,
    };
    const [v] = await db
      .insert(crawlDataSwsScreener)
      .values(data)
      .onConflictDoNothing()
      .returning();
    return v;
  }
}
