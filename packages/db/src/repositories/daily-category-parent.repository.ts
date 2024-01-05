import { createInsertSchema } from 'drizzle-zod';
import { dailyCategoryParent, db } from './../index';

export const insertDailyCategoryParentSchema =
  createInsertSchema(dailyCategoryParent);

export class DailyCategoryParentRepository {
  async setCategoryParentId({
    dailyCategoryId,
    parentDailyCategoryId,
  }: {
    dailyCategoryId: number;
    parentDailyCategoryId: number;
  }) {
    await db
      .insert(dailyCategoryParent)
      .values({
        dailyCategoryId,
        parentId: parentDailyCategoryId,
      })
      .onConflictDoNothing();
  }
}
