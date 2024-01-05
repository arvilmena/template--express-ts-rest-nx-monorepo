import { SwsCrawlCompanyPageData } from '@myawesomeorg/constants';
import { and, eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import {
  crawlDataSwsCompany,
  crawlDataSwsCompanyCategory,
  db,
} from './../index';
import { FixAnnoyingDrizzleZodBug } from './_helper';

export const insertCrawlDataSwsCompanySchema =
  createInsertSchema(crawlDataSwsCompany);

export class CrawlDataSwsCompanyRepository {
  async findAllUnderCategory({ categoryId }: { categoryId: number }) {
    return await db
      .select()
      .from(crawlDataSwsCompany)
      .innerJoin(
        crawlDataSwsCompanyCategory,
        and(
          eq(
            crawlDataSwsCompany.id,
            crawlDataSwsCompanyCategory.crawlDataSwsCompanyId
          ),
          eq(crawlDataSwsCompanyCategory.dailyCategoryId, categoryId)
        )
      );
  }
  async findBySwsIdAndLastUpdated({
    swsId,
    swsDataLastUpdated,
  }: {
    swsId: SwsCrawlCompanyPageData['data']['id'];
    swsDataLastUpdated: bigint;
  }) {
    return await db.query.crawlDataSwsCompany.findFirst({
      where: (crawlDataSwsCompany, { eq, and }) =>
        and(
          eq(crawlDataSwsCompany.swsId, swsId),
          eq(crawlDataSwsCompany.swsDataLastUpdated, swsDataLastUpdated)
        ),
    });
  }
  async createOne(data: InsertCrawlDataSwsCompanySchemaType) {
    const [v] = await db
      .insert(crawlDataSwsCompany)
      .values(data)
      .onConflictDoNothing()
      .returning();

    if (v === undefined) {
      return await this.findBySwsIdAndLastUpdated({
        swsId: data.swsId,
        swsDataLastUpdated: data.swsDataLastUpdated,
      });
    }
    return v;
  }
  async findById(id: number) {
    return await db.query.crawlDataSwsCompany.findFirst({
      where: eq(crawlDataSwsCompany.id, id),
    });
  }
}

export type InsertCrawlDataSwsCompanySchemaType = FixAnnoyingDrizzleZodBug<
  z.infer<typeof insertCrawlDataSwsCompanySchema>,
  'crawledAt'
>;

export type CrawlDataSwsCompanyDbData = Awaited<
  ReturnType<InstanceType<typeof CrawlDataSwsCompanyRepository>['createOne']>
>;

export type CrawlDataSwsCompanyFindAllUnderCategoryReturnType = Awaited<
  ReturnType<
    InstanceType<typeof CrawlDataSwsCompanyRepository>['findAllUnderCategory']
  >
>;
