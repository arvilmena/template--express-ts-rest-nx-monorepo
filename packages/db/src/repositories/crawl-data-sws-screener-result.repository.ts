import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { crawlDataSwsScreenerResult, db } from './../index';

export const insertCrawlDataSwsScreenerResultSchema = createInsertSchema(
  crawlDataSwsScreenerResult
);

export class CrawlDataSwsScreenerResultRepository {
  async createOne(
    data: z.infer<typeof insertCrawlDataSwsScreenerResultSchema>
  ) {
    const [v] = await db
      .insert(crawlDataSwsScreenerResult)
      .values(data)
      .onConflictDoNothing()
      .returning();
    return v;
  }
}
