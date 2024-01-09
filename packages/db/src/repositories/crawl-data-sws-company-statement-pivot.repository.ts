import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { crawlDataSwsCompanyStatement, db } from '../index';

export const insertCrawlDataSwsCompanyStatementSchema = createInsertSchema(
  crawlDataSwsCompanyStatement,
);

export class CrawlDataSwsCompanyStatementPivotRepository {
  async attachStatementToCompany(
    data: Pick<
      z.infer<typeof insertCrawlDataSwsCompanyStatementSchema>,
      'statementId' | 'crawlDataSwsCompanyId'
    >,
  ) {
    await db
      .insert(crawlDataSwsCompanyStatement)
      .values(data)
      .onConflictDoNothing()
      .returning();
  }
}
