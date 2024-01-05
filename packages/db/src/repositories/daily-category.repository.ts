import {
  manilaLuxonDateToCrawlDataAtFormat,
  slugify,
} from '@myawesomeorg/utils';
import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { DateTime } from 'luxon';
import { z } from 'zod';
import { DayRepository, dailyCategory, db } from './../index';

export const insertDailyCategorySchema = createInsertSchema(dailyCategory);

const dailyCategorySelectWith = {
  dailyCategoryParents: {
    with: {
      parentCategory: {
        with: {
          dailyCategoryParents: true,
        },
      },
    },
  },
} as const;

export class DailyCategoryRepository {
  constructor(private readonly dayRepository: DayRepository) {}

  async getAllMostParentByLuxonDate(luxon: DateTime) {
    const correctDateFormat = manilaLuxonDateToCrawlDataAtFormat(luxon);
    return await db.query.dailyCategory.findMany({
      where: (dailyCategory, { eq, and }) =>
        and(
          eq(dailyCategory.dataAt, correctDateFormat),
          eq(dailyCategory.isMostParent, true)
        ),
      with: dailyCategorySelectWith,
    });
  }
  async findByLuxonAndSlug({
    dataAt,
    slug,
  }: {
    dataAt: DateTime;
    slug: string;
  }): Promise<DailyCategoryRepositoryFindOneReturnType | undefined> {
    return await db.query.dailyCategory.findFirst({
      where: (dailyCategory, { eq, and }) =>
        and(eq(dailyCategory.dataAt, dataAt), eq(dailyCategory.slug, slug)),
      with: dailyCategorySelectWith,
    });
  }

  async findById(id: number) {
    return await db.query.dailyCategory.findFirst({
      where: eq(dailyCategory.id, id),
      with: dailyCategorySelectWith,
    });
  }

  async createOne(
    data: Omit<z.infer<typeof insertDailyCategorySchema>, 'slug'>
  ) {
    const { dataAt, name, source } = data;
    const correctDateFormat = manilaLuxonDateToCrawlDataAtFormat(dataAt);
    const slug = slugify(`${source}-${name}`);
    const values = { ...data, slug };
    const day = await this.dayRepository.getByLuxon(correctDateFormat);
    if (!day) {
      throw new Error('Day not found');
    }
    await db
      .insert(dailyCategory)
      .values({ ...values, dataAt: day.dataAt })
      .onConflictDoNothing();
    return await db.query.dailyCategory.findFirst({
      where: (dailyCategory, { eq, and }) =>
        and(
          eq(dailyCategory.dataAt, correctDateFormat),
          eq(dailyCategory.slug, slug)
        ),
      with: dailyCategorySelectWith,
    });
  }
}

export type DailyCategoryRepositoryCreateOneType = Parameters<
  InstanceType<typeof DailyCategoryRepository>['createOne']
>[0];

export type DailyCategoryRepositoryFindOneReturnType = Awaited<
  ReturnType<InstanceType<typeof DailyCategoryRepository>['createOne']>
>;

export type DailyCategoryFindManyReturnType = Awaited<
  ReturnType<
    InstanceType<typeof DailyCategoryRepository>['getAllMostParentByLuxonDate']
  >
>;

export type DailyCategoryFindByLuxonAndSlugReturnType = Awaited<
  ReturnType<InstanceType<typeof DailyCategoryRepository>['findByLuxonAndSlug']>
>;
