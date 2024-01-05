import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { crawlDataSwsCompanyFreeCashFlow, db } from './../index';
import { FixAnnoyingDrizzleZodBug } from './_helper';

export const insertCrawlDataSwsCompanyFreeCashFlowSchema = createInsertSchema(
  crawlDataSwsCompanyFreeCashFlow
);

export class CrawlDataSwsCompanyFreeCashFlowRepository {
  async createOne(
    data: FixAnnoyingDrizzleZodBug<
      z.infer<typeof insertCrawlDataSwsCompanyFreeCashFlowSchema>,
      'dataAt'
    >
  ) {
    const [v] = await db
      .insert(crawlDataSwsCompanyFreeCashFlow)
      .values(data)
      .onConflictDoNothing()
      .returning();
    return v;
  }
}
