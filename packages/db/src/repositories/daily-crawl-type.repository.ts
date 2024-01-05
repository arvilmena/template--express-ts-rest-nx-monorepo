import { eq } from 'drizzle-orm';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { dailyCrawlType, db } from './../index';

export const insertDailyCrawlTypeSchema = createInsertSchema(dailyCrawlType);
export const findDailyCrawlTypeSchema = createSelectSchema(dailyCrawlType);
export type CreateDailyCrawlTypeByUnique = {
  dailyCrawlId: number;
  crawlType: z.infer<typeof insertDailyCrawlTypeSchema>['crawlType'];
  crawlTypeSpecific: string;
  url: string;
};
export class DailyCrawlTypeRepository {
  async createOne(data: z.infer<typeof insertDailyCrawlTypeSchema>) {
    const [v] = await db
      .insert(dailyCrawlType)
      .values(data)
      .onConflictDoNothing()
      .returning();
    return v;
  }

  async findAllUnfinishedSwsCompaniesByDailyCrawlId(dailyCrawlId: number) {
    return await db.query.dailyCrawlType.findMany({
      where: (dailyCrawlType, { eq, and, isNull }) =>
        and(
          eq(dailyCrawlType.dailyCrawlId, dailyCrawlId),
          eq(dailyCrawlType.crawlType, 'sws_company'),
          isNull(dailyCrawlType.dataId)
        ),
    });
  }
  async findById(
    dailyCrawlTypeId: number
  ): Promise<DailyCrawlTypeDbData | undefined> {
    return await db.query.dailyCrawlType.findFirst({
      where: eq(dailyCrawlType.id, dailyCrawlTypeId),
    });
  }
  async createOneByUnique(params: CreateDailyCrawlTypeByUnique) {
    const [v] = await db
      .insert(dailyCrawlType)
      .values(params)
      .onConflictDoNothing()
      .returning();
    return v;
  }
  async findByUnique(
    params: Omit<CreateDailyCrawlTypeByUnique, 'url'>
  ): Promise<DailyCrawlTypeDbData | undefined> {
    const { dailyCrawlId, crawlType, crawlTypeSpecific } = params;
    return await db.query.dailyCrawlType.findFirst({
      where: (dailyCrawlType, { eq, and }) =>
        and(
          eq(dailyCrawlType.dailyCrawlId, dailyCrawlId),
          eq(dailyCrawlType.crawlType, crawlType),
          eq(dailyCrawlType.crawlTypeSpecific, crawlTypeSpecific)
        ),
    });
  }

  async attachDataId({
    dataId,
    dailyCrawlTypeId,
  }: {
    dataId: number;
    dailyCrawlTypeId: number;
  }) {
    const [v] = await db
      .update(dailyCrawlType)
      .set({ dataId })
      .where(eq(dailyCrawlType.id, dailyCrawlTypeId))
      .returning();
    return v;
  }
}

export type DailyCrawlTypeDbData = Awaited<
  ReturnType<InstanceType<typeof DailyCrawlTypeRepository>['createOne']>
>;
