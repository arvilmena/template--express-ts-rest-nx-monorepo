import {
  CRAWL_TYPES,
  SWS_BASE_CRAWL_TYPES,
  SWS_SCREENER_SPECIFIC_CRAWL_TYPES,
  SWS_STOCK_LIST_SPECIFIC_CRAWL_TYPES,
  SwsCrawlPuppeteerError,
  SwsCrawlWhatToCrawlParamsType,
  SwsScreenerSpecificCrawlTypesType,
  SwsStockListSpecificCrawlTypesType,
} from '@myawesomeorg/constants';
import {
  DailyCrawlRepository,
  DailyCrawlTypeRepository,
  DayRepository,
} from '@myawesomeorg/db';
import {
  getCurrentManilaDate,
  manilaLuxonDateToCrawlDataAtFormat,
} from '@myawesomeorg/utils';
import { SimplyWallStreetCrawlerService } from './simply-wall-street/services/simply-wall-street-crawler.service';

//export default SimplyWallStreetCrawler;

// @Service()
export class StonkerCrawler {
  constructor(
    private readonly dayRepository: DayRepository,
    private readonly dailyCrawlTypeRepository: DailyCrawlTypeRepository,
    private readonly dailyCrawlRepository: DailyCrawlRepository,
    private readonly simplyWallStreetCrawlerService: SimplyWallStreetCrawlerService,
  ) {}

  async startDailyCrawl() {
    // get current Philippine Date
    const now = getCurrentManilaDate();
    const dayLuxon = manilaLuxonDateToCrawlDataAtFormat(now.luxon);

    const yesterday = dayLuxon.minus({ days: 1 });
    const yesterdayCrawl =
      await this.dailyCrawlRepository.findByLuxonDate(yesterday);

    let todayCrawl = await this.dailyCrawlRepository.findByLuxonDate(dayLuxon);

    if (!todayCrawl) {
      const _newDailyCrawl =
        await this.dailyCrawlRepository.getByLuxon(dayLuxon);

      const todayCrawlId = _newDailyCrawl?.id ?? null;
      if (todayCrawlId)
        todayCrawl = await this.dailyCrawlRepository.findById(todayCrawlId);
    }

    if (!todayCrawl) {
      throw new Error('todayCrawl is still not populated');
    }

    // check if all crawlTypes are populated
    const existingCrawlTypes = todayCrawl.dailyCrawlTypes.map(
      (n) => n.crawlType,
    );
    const toBeCreatedCrawlTypes = CRAWL_TYPES.filter(
      (n) => !existingCrawlTypes.includes(n),
    );

    for (const crawlType of toBeCreatedCrawlTypes) {
      if (!['sws_stock_list', 'sws_screener'].includes(crawlType)) continue;
      const TO_BE_CREATED_TYPES = {
        sws_stock_list: [
          ...SWS_STOCK_LIST_SPECIFIC_CRAWL_TYPES.map((n) => n.name).toSorted(),
        ],
        sws_screener: [
          ...SWS_SCREENER_SPECIFIC_CRAWL_TYPES.map((n) => n.name).toSorted(),
        ],
      };
      for (const crawlTypeSpecific of TO_BE_CREATED_TYPES[
        crawlType as keyof typeof TO_BE_CREATED_TYPES
      ]) {
        await this.dailyCrawlTypeRepository.createOne({
          dailyCrawlId: todayCrawl.id,
          crawlType,
          crawlTypeSpecific,
          url:
            SWS_BASE_CRAWL_TYPES[
              crawlType as keyof typeof SWS_BASE_CRAWL_TYPES
            ].find((n) => n.specificCrawlType === crawlTypeSpecific)?.url ??
            '_tmp',
        });
      }
    }
    todayCrawl = await this.dailyCrawlRepository.findById(todayCrawl.id);
    if (!todayCrawl) {
      throw new Error('todayCrawl is not found after refetch');
    }

    // unfinishedCrawlTypes
    const unfinishedCrawlTypes = todayCrawl.dailyCrawlTypes.filter(
      (n) => !n.dataId,
    );

    if (unfinishedCrawlTypes.length === 0) {
      return `All crawls for today ${now.luxon.toFormat(
        'yyyy-MM-dd',
      )} has been completed`;
    }

    if (
      unfinishedCrawlTypes
        .map((n) => n.crawlType)
        .some((n) => n.startsWith('sws_'))
    ) {
      const whatToCrawl: SwsCrawlWhatToCrawlParamsType = {
        whatToCrawl: {
          sws_stock_list: unfinishedCrawlTypes
            .filter((n) => n.crawlType === 'sws_stock_list')
            .map((n) => ({
              specificCrawlType:
                n.crawlTypeSpecific as SwsStockListSpecificCrawlTypesType,
              existingDailyCrawlTypeId: n.id,
              url: n.url,
            })),
          sws_screener: unfinishedCrawlTypes
            .filter((n) => n.crawlType === 'sws_screener')
            .map((n) => ({
              specificCrawlType:
                n.crawlTypeSpecific as SwsScreenerSpecificCrawlTypesType,
              existingDailyCrawlTypeId: n.id,
              url: n.url,
            })),
          sws_company: unfinishedCrawlTypes
            .filter((n) => n.crawlType === 'sws_company')
            .map((n) => ({
              specificCrawlType:
                n.crawlTypeSpecific as SwsScreenerSpecificCrawlTypesType,
              existingDailyCrawlTypeId: n.id,
              url: n.url,
            })),
        },
        dailyCrawl: {
          id: todayCrawl.id,
          dataAt: todayCrawl.dataAt,
        },
      };
      try {
        await this.simplyWallStreetCrawlerService.crawl(whatToCrawl);
      } catch (error) {
        console.error({ error });
        if (error instanceof SwsCrawlPuppeteerError) {
          console.log({ error });
          console.log('SwsCrawlPuppeteerError error! will attempt to recrawl');

          return { yesterdayCrawl: yesterdayCrawl ?? null, todayCrawl };
        }
        throw new Error('Error crawling');
      }
    }

    return { yesterdayCrawl: yesterdayCrawl ?? null, todayCrawl };
  }
}
