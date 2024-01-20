import { SwsCrawlCompanyPageData } from '@myawesomeorg/constants';
import { and, eq, lte, sql } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { DateTime } from 'luxon';
import { z } from 'zod';
import { FixAnnoyingDrizzleZodBug } from '../drizzle/utils/_helper';
import {
  SwsCompanyStatementRepository,
  crawlDataSwsCompany,
  crawlDataSwsCompanyCategory,
  db,
} from './../index';

export const insertCrawlDataSwsCompanySchema =
  createInsertSchema(crawlDataSwsCompany);

export class CrawlDataSwsCompanyRepository {
  constructor(
    private readonly swsCompanyStatementRepository: SwsCompanyStatementRepository,
  ) {}
  async getForDayByLuxon(dayLuxon: DateTime) {
    const dayLuxonToBigint = BigInt(dayLuxon.plus({ hour: 8 }).toMillis());

    const sq = db
      .select({
        swsId: crawlDataSwsCompany.swsId,
        max_last_updated:
          sql<number>`cast(max(${crawlDataSwsCompany.swsDataLastUpdated}) as int)`.as(
            'max_last_updated',
          ),
      })
      .from(crawlDataSwsCompany)
      .where(lte(crawlDataSwsCompany.swsDataLastUpdated, dayLuxonToBigint))
      .groupBy(crawlDataSwsCompany.swsId)
      .as('sq');

    const swsCompanies = await db
      .select()
      .from(crawlDataSwsCompany)
      .innerJoin(
        sq,
        and(
          eq(crawlDataSwsCompany.swsId, sq.swsId),
          eq(
            sql<number>`cast(${crawlDataSwsCompany.swsDataLastUpdated} as int)`,
            sq.max_last_updated,
          ),
        ),
      );
    return await Promise.all(
      swsCompanies.map(async (c) => {
        const statements =
          await this.swsCompanyStatementRepository.findCompanyStatements({
            crawlDataSwsCompanyId: c.crawl_data_sws_company.id,
          });
        return { ...c, statements };
      }),
    );
  }
  async findAllUnderCategory({ categoryId }: { categoryId: number }) {
    const swsCompanies = await db
      .select()
      .from(crawlDataSwsCompany)
      .innerJoin(
        crawlDataSwsCompanyCategory,
        and(
          eq(
            crawlDataSwsCompany.id,
            crawlDataSwsCompanyCategory.crawlDataSwsCompanyId,
          ),
          eq(crawlDataSwsCompanyCategory.dailyCategoryId, categoryId),
        ),
      );
    return await Promise.all(
      swsCompanies.map(async (c) => {
        const statements =
          await this.swsCompanyStatementRepository.findCompanyStatements({
            crawlDataSwsCompanyId: c.crawl_data_sws_company.id,
          });
        return { ...c, statements };
      }),
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
          eq(crawlDataSwsCompany.swsDataLastUpdated, swsDataLastUpdated),
        ),
    });
  }

  async findBySwsIdAndLastUpdatedExtended({
    swsId,
    swsDataLastUpdated,
  }: {
    swsId: SwsCrawlCompanyPageData['data']['id'];
    swsDataLastUpdated: bigint;
  }) {
    const swsCompanies = await db
      .select()
      .from(crawlDataSwsCompany)
      .innerJoin(
        crawlDataSwsCompanyCategory,
        eq(
          crawlDataSwsCompany.id,
          crawlDataSwsCompanyCategory.crawlDataSwsCompanyId,
        ),
      )
      .where(
        and(
          eq(crawlDataSwsCompany.swsId, swsId),
          eq(crawlDataSwsCompany.swsDataLastUpdated, swsDataLastUpdated),
        ),
      )
      .limit(1);
    if (!swsCompanies) return swsCompanies;

    return await Promise.all(
      swsCompanies.map(async (c) => {
        const statements =
          await this.swsCompanyStatementRepository.findCompanyStatements({
            crawlDataSwsCompanyId: c.crawl_data_sws_company.id,
          });
        return { ...c, statements };
      }),
    );
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
