import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { crawlDataSwsStockListResult, db } from './../index';

export const insertCrawlDataSwsStockListResultSchema = createInsertSchema(
  crawlDataSwsStockListResult
);

export class CrawlDataSwsStockListResultRepository {
  async createOne(
    data: z.infer<typeof insertCrawlDataSwsStockListResultSchema>
  ) {
    const [v] = await db
      .insert(crawlDataSwsStockListResult)
      .values(data)
      .onConflictDoNothing()
      .returning();
    return v;
  }
}
