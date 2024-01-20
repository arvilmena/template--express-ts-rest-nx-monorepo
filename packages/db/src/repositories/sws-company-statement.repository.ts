import { eq } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import {
  crawlDataSwsCompanyStatement,
  db,
  swsCompanyStatement,
} from '../index';

export const insertSwsCompanyStatementSchema =
  createInsertSchema(swsCompanyStatement);

export class SwsCompanyStatementRepository {
  async findCompanyStatements({
    crawlDataSwsCompanyId,
  }: {
    crawlDataSwsCompanyId: number;
  }) {
    return await db
      .select({
        swsCompanyStatement,
      })
      .from(crawlDataSwsCompanyStatement)
      .where(
        eq(
          crawlDataSwsCompanyStatement.crawlDataSwsCompanyId,
          crawlDataSwsCompanyId,
        ),
      )
      .leftJoin(
        swsCompanyStatement,
        eq(
          crawlDataSwsCompanyStatement.swsCompanyStatementId,
          swsCompanyStatement.id,
        ),
      );
  }

  async findByUnique(
    data: Pick<
      z.infer<typeof insertSwsCompanyStatementSchema>,
      'swsId' | 'title' | 'description' | 'area'
    >,
  ) {
    return await db.query.swsCompanyStatement.findFirst({
      where: (swsCompanyStatement, { eq, and }) =>
        and(
          eq(swsCompanyStatement.swsId, data.swsId),
          eq(swsCompanyStatement.title, data.title),
          eq(swsCompanyStatement.description, data.description),
          eq(swsCompanyStatement.area, data.area),
        ),
    });
  }

  async createOne(data: z.infer<typeof insertSwsCompanyStatementSchema>) {
    const [v] = await db
      .insert(swsCompanyStatement)
      .values(data)
      .onConflictDoNothing()
      .returning();
    if (v) return v;
    return await this.findByUnique({
      swsId: data.swsId,
      title: data.title,
      description: data.description,
      area: data.area,
    });
  }

  async createOneAndAttachToSwsCompany(
    data: SwsCompanyStatementRepositoryCreateOneType,
    crawlDataSwsCompanyId: number,
  ) {
    const companyStatement = await this.createOne(data);
    if (!companyStatement) {
      throw new Error(
        `Failed to create industry average swsId: ${data.swsId} - title: ${data.title}`,
      );
    }
    await db
      .insert(crawlDataSwsCompanyStatement)
      .values({
        crawlDataSwsCompanyId: crawlDataSwsCompanyId,
        swsCompanyStatementId: companyStatement.id,
      })
      .onConflictDoNothing()
      .returning();
    return companyStatement;
  }
}

export type SwsCompanyStatementRepositoryCreateOneType = Parameters<
  InstanceType<typeof SwsCompanyStatementRepository>['createOne']
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
