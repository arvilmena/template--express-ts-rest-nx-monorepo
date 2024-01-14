import { SwsCrawlCompanyPageData } from '@myawesomeorg/constants';
import { and, eq, lte, sql } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { DateTime } from 'luxon';
import { z } from 'zod';
import { FixAnnoyingDrizzleZodBug } from '../drizzle/utils/_helper';
import {
  crawlDataSwsCompany,
  crawlDataSwsCompanyCategory,
  db,
} from './../index';

export const insertCrawlDataSwsCompanySchema =
  createInsertSchema(crawlDataSwsCompany);

export class CrawlDataSwsCompanyRepository {
  async getForDayByLuxon(dayLuxon: DateTime) {
    // const sq = db.$with('sq').as(
    //   db
    //     .select({
    //       maxSwsDataLastUpdated:
    //         sql`max(${crawlDataSwsCompany.swsDataLastUpdated})`.as('sq'),
    //       // sq: sql`${crawlDataSwsCompany.id}`.as('sq'),
    //     })
    //     .from(crawlDataSwsCompany)
    //     .where(eq(crawlDataSwsCompany.id))
    //     .groupBy(crawlDataSwsCompany.swsId),
    // );
    // return await db
    //   .select({
    //     id: crawlDataSwsCompany.id,
    //     name: crawlDataSwsCompany.swsUniqueSymbol,
    //     swsDataLastUpdated: crawlDataSwsCompany.swsDataLastUpdated,
    //   })
    //   .from(crawlDataSwsCompany)
    //   .where((a) => eq(a.swsDataLastUpdated))
    //   .orderBy(desc(crawlDataSwsCompany.swsDataLastUpdated));
    // `
    //   SELECT a.id, a.name, a.last_updated
    //   FROM A AS a
    //   WHERE a.last_updated = (
    //       SELECT MAX(last_updated)
    //       FROM A
    //       WHERE name = a.name
    //       AND last_updated <= 250
    //   )
    //   AND a.last_updated <= 250;
    // `;

    // add 8hrs, as it looks like SWS refresh data every GMT+0
    // which is 8am in our time already
    const dayLuxonToBigint = BigInt(dayLuxon.plus({ hour: 8 }).toMillis());
    // return await sql`
    // SELECT a.id, a.swsDataLastUpdated from ${crawlDataSwsCompany} AS a
    // WHERE swsDataLastUpdated = (
    //   SELECT max(swsDataLastUpdated) FROM ${crawlDataSwsCompany}
    //   WHERE id = a.id
    //   AND swsDataLastUpdated <= ${dayLuxonToBigint}
    // )
    // AND a.swsDataLastUpdated <= ${dayLuxonToBigint}`;

    // const companies = await db
    //   .select({
    //     swsId: crawlDataSwsCompany.swsId,
    //     swsDataLastUpdated: crawlDataSwsCompany.swsDataLastUpdated,
    //   })
    //   .from(crawlDataSwsCompany)
    //   .where(lte(crawlDataSwsCompany.swsDataLastUpdated, dayLuxonToBigint))
    //   .groupBy(crawlDataSwsCompany.swsId)
    //   .orderBy(desc(crawlDataSwsCompany.swsDataLastUpdated));

    // const result = await Promise.all(
    //   companies.map(async (company) => {
    //     const [v] = await db
    //       .select()
    //       .from(crawlDataSwsCompany)
    //       .where(
    //         and(
    //           eq(crawlDataSwsCompany.swsId, company.swsId),
    //           lte(crawlDataSwsCompany.swsDataLastUpdated, dayLuxonToBigint),
    //         ),
    //       )
    //       .orderBy(desc(crawlDataSwsCompany.swsDataLastUpdated))
    //       .limit(1)
    //       .innerJoin(
    //         crawlDataSwsCompanyCategory,
    //         and(
    //           eq(
    //             crawlDataSwsCompany.id,
    //             crawlDataSwsCompanyCategory.crawlDataSwsCompanyId,
    //           ),
    //         ),
    //       );
    //     return v;
    //   }),
    // );
    // return result.filter(Boolean);
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

    return await db
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
  }
  async findAllUnderCategory({ categoryId }: { categoryId: number }) {
    return await db
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
