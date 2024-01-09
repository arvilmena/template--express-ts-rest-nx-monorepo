import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { FixAnnoyingDrizzleZodBug } from '../drizzle/utils/_helper';
import { crawlDataSwsCompanyFreeCashFlow, db } from './../index';

export const insertCrawlDataSwsCompanyFreeCashFlowSchema = createInsertSchema(
  crawlDataSwsCompanyFreeCashFlow,
);

export class CrawlDataSwsCompanyFreeCashFlowRepository {
  async createOne(
    data: FixAnnoyingDrizzleZodBug<
      z.infer<typeof insertCrawlDataSwsCompanyFreeCashFlowSchema>,
      'dataAt'
    >,
  ) {
    const [v] = await db
      .insert(crawlDataSwsCompanyFreeCashFlow)
      .values(data)
      .onConflictDoNothing()
      .returning();
    return v;
  }
}
