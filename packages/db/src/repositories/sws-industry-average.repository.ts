import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { DayRepository, db, swsIndustryAverage } from '../index';

export const insertSwsIndustryAverageSchema =
  createInsertSchema(swsIndustryAverage);

export class SwsIndustryAverageRepository {
  constructor(private readonly dayRepository: DayRepository) {}

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
}

export type DailyCategoryRepositoryCreateOneType = Parameters<
  InstanceType<typeof SwsIndustryAverageRepository>['createOne']
>[0];

export type DailyCategoryRepositoryFindOneReturnType = Awaited<
  ReturnType<InstanceType<typeof SwsIndustryAverageRepository>['createOne']>
>;

export type DailyCategoryFindManyReturnType = Awaited<
  ReturnType<
    InstanceType<
      typeof SwsIndustryAverageRepository
    >['getAllMostParentByLuxonDate']
  >
>;

export type DailyCategoryFindByLuxonAndSlugReturnType = Awaited<
  ReturnType<
    InstanceType<typeof SwsIndustryAverageRepository>['findByLuxonAndSlug']
  >
>;
