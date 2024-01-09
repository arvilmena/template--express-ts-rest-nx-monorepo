import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { db, swsCompanyStatement } from '../index';

export const insertSwsCompanyStatementSchema =
  createInsertSchema(swsCompanyStatement);

export class SwsCompanyStatementRepository {
  async createOne(data: z.infer<typeof insertSwsCompanyStatementSchema>) {
    const [v] = await db
      .insert(swsCompanyStatement)
      .values(data)
      .onConflictDoNothing()
      .returning();
    if (v) return v;

    const { key, effectType, description } = data;

    return await this.findByStatementAndSwsId({ key, effectType, description });
  }

  async findByStatementAndSwsId({
    key,
    effectType,
    description,
  }: Pick<
    z.infer<typeof insertSwsCompanyStatementSchema>,
    'key' | 'effectType' | 'description'
  >) {
    return await db.query.swsCompanyStatement.findFirst({
      where: (swsCompanyStatement, { eq, and }) =>
        and(
          eq(swsCompanyStatement.key, key),
          eq(swsCompanyStatement.effectType, effectType),
          eq(swsCompanyStatement.description, description),
        ),
    });
  }
}

// export type DailyCategoryRepositoryCreateOneType = Parameters<
//   InstanceType<typeof SwsCompanyStatementRepository>['createOne']
// >[0];

// export type DailyCategoryRepositoryFindOneReturnType = Awaited<
//   ReturnType<InstanceType<typeof SwsCompanyStatementRepository>['createOne']>
// >;

// export type DailyCategoryFindManyReturnType = Awaited<
//   ReturnType<
//     InstanceType<
//       typeof SwsCompanyStatementRepository
//     >['getAllMostParentByLuxonDate']
//   >
// >;

// export type DailyCategoryFindByLuxonAndSlugReturnType = Awaited<
//   ReturnType<
//     InstanceType<typeof SwsCompanyStatementRepository>['findByLuxonAndSlug']
//   >
// >;
