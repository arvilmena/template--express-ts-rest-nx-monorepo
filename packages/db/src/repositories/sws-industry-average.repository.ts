import { desc, lte } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { DateTime } from 'luxon';
import { z } from 'zod';
import {
  crawlDataSwsCompanyIndustryAverage,
  db,
  swsIndustryAverage,
} from '../index';

export const insertSwsIndustryAverageSchema =
  createInsertSchema(swsIndustryAverage);

export class SwsIndustryAverageRepository {
  async getIndustryAveragesForDayByLuxon(dayLuxon: DateTime) {
    return await db
      .select()
      .from(swsIndustryAverage)
      .groupBy(swsIndustryAverage.industryId)
      .where(
        lte(swsIndustryAverage.swsDataLastUpdated, BigInt(dayLuxon.toMillis())),
      )
      .orderBy(desc(swsIndustryAverage.swsDataLastUpdated));
  }

  async findByUnique(
    data: Pick<
      z.infer<typeof insertSwsIndustryAverageSchema>,
      'swsDataLastUpdated' | 'industryId'
    >,
  ) {
    return await db.query.swsIndustryAverage.findFirst({
      where: (swsIndustryAverage, { eq, and }) =>
        and(
          eq(swsIndustryAverage.swsDataLastUpdated, data.swsDataLastUpdated),
          eq(swsIndustryAverage.industryId, data.industryId),
        ),
    });
  }

  async createOne(data: z.infer<typeof insertSwsIndustryAverageSchema>) {
    const [v] = await db
      .insert(swsIndustryAverage)
      .values(data)
      .onConflictDoNothing()
      .returning();
    if (v) return v;
    return await this.findByUnique({
      swsDataLastUpdated: data.swsDataLastUpdated,
      industryId: data.industryId,
    });
  }

  async createOneAndAttachToSwsCompany(
    data: SwsIndustryAverageRepositoryCreateOneType,
    crawlDataSwsCompanyId: number,
  ) {
    const industryAverage = await this.createOne(data);
    if (!industryAverage) {
      throw new Error(
        `Failed to create industry average industryId: ${data.industryId} - swsDataLastUpdated: ${data.swsDataLastUpdated}`,
      );
    }
    await db
      .insert(crawlDataSwsCompanyIndustryAverage)
      .values({
        crawlDataSwsCompanyId: crawlDataSwsCompanyId,
        swsIndustryAverageId: industryAverage.id,
      })
      .onConflictDoNothing()
      .returning();
    return industryAverage;
  }
}

export type SwsIndustryAverageRepositoryCreateOneType = Parameters<
  InstanceType<typeof SwsIndustryAverageRepository>['createOne']
>[0];

// export type DailyCategoryRepositoryFindOneReturnType = Awaited<
//   ReturnType<InstanceType<typeof SwsIndustryAverageRepository>['createOne']>
// >;

// export type DailyCategoryFindManyReturnType = Awaited<
//   ReturnType<
//     InstanceType<
//       typeof SwsIndustryAverageRepository
//     >['getAllMostParentByLuxonDate']
//   >
// >;

// export type DailyCategoryFindByLuxonAndSlugReturnType = Awaited<
//   ReturnType<
//     InstanceType<typeof SwsIndustryAverageRepository>['findByLuxonAndSlug']
//   >
// >;
