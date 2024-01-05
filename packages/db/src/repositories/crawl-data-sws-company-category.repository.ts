import { SwsCrawlCompanyPageData } from '@myawesomeorg/constants';
import { manilaLuxonDateToCrawlDataAtFormat } from '@myawesomeorg/utils';
import { createInsertSchema } from 'drizzle-zod';
import { DateTime } from 'luxon';
import {
  CrawlDataSwsCompanyDbData,
  DayRepository,
  crawlDataSwsCompanyCategory,
  db,
} from './../index';
import {
  DailyCategoryRepository,
  DailyCategoryRepositoryCreateOneType,
} from './daily-category.repository';

export const insertCrawlDataSwsCompanyCategorySchema = createInsertSchema(
  crawlDataSwsCompanyCategory
);

export class CrawlDataSwsCompanyCategoryRepository {
  constructor(
    private readonly dayRepository: DayRepository,
    private readonly dailyCategoryRepository: DailyCategoryRepository
  ) {}
  async createAndAttachToCompanyCategoryByApiResponse(
    crawledAt: DateTime,
    swsCompanyData: CrawlDataSwsCompanyDbData,
    apiResponse: Pick<
      SwsCrawlCompanyPageData['data']['analysis']['data']['extended']['data']['raw_data']['data']['industries']['sector'],
      'sic_name' | 'sub_type_id'
    >,
    isMostParent: boolean,
    isTail: boolean
  ): Promise<CrawlDataSwsCompanyCategoryFindReturnType> {
    if (swsCompanyData === undefined) {
      throw new Error(`swsCompanyData is not valid`);
    }
    const day = await this.dayRepository.getByLuxon(
      manilaLuxonDateToCrawlDataAtFormat(crawledAt)
    );
    if (!day) {
      throw new Error(
        `Failed to create a day record for ${swsCompanyData.id}: ${swsCompanyData.crawledAt}`
      );
    }
    const data: DailyCategoryRepositoryCreateOneType = {
      dataAt: day.dataAt,
      name: `${apiResponse.sic_name}_${apiResponse.sub_type_id}`,
      source: 'sws',
      isMostParent: Boolean(true === isMostParent),
      isTail: Boolean(true === isTail),
    };
    const createdDailyCategory = await this.dailyCategoryRepository.createOne(
      data
    );
    if (!createdDailyCategory) {
      throw new Error(
        `Failed to create a daily category record for ${swsCompanyData.id}: ${data['name']}`
      );
    }
    const [v] = await db
      .insert(crawlDataSwsCompanyCategory)
      .values({
        crawlDataSwsCompanyId: swsCompanyData.id,
        dailyCategoryId: createdDailyCategory.id,
      })
      .onConflictDoNothing()
      .returning();
    if (v) return v;
    return await this.findByCompanyAndDailyCategoryId({
      dailyCategoryId: createdDailyCategory.id,
      crawlDataSwsCompanyId: swsCompanyData.id,
    });
  }

  async findByCompanyAndDailyCategoryId({
    dailyCategoryId,
    crawlDataSwsCompanyId,
  }: {
    crawlDataSwsCompanyId: number;
    dailyCategoryId: number;
  }) {
    return await db.query.crawlDataSwsCompanyCategory.findFirst({
      where: (crawlDataSwsCompanyCategory, { eq, and }) =>
        and(
          eq(
            crawlDataSwsCompanyCategory.crawlDataSwsCompanyId,
            crawlDataSwsCompanyId
          ),
          eq(crawlDataSwsCompanyCategory.dailyCategoryId, dailyCategoryId)
        ),
    });
  }
}
export type CrawlDataSwsCompanyCategoryFindReturnType = Awaited<
  ReturnType<
    InstanceType<
      typeof CrawlDataSwsCompanyCategoryRepository
    >['findByCompanyAndDailyCategoryId']
  >
>;
