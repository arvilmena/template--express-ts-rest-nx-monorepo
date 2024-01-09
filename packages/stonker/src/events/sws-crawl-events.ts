import {
  SWS_CRAWL_COMPANY_PAGE_DATA_CRAWLED_EVENT,
  SWS_CRAWL_GRID_RESULT_EVENT,
  SWS_CRAWL_PUPPETEER_TIME_OUT,
  SwsCrawlCompanyPageDataCrawledEvent,
  SwsCrawlGridResultEvent,
  SwsCrawlPuppeteerTimedOutEvent,
  SwsScreenerSpecificCrawlTypesType,
  SwsStockListSpecificCrawlTypesType,
} from '@myawesomeorg/constants';
import {
  CrawlDataSwsCompanyCategoryRepository,
  CrawlDataSwsCompanyFreeCashFlowRepository,
  CrawlDataSwsCompanyRepository,
  CrawlDataSwsScreenerRepository,
  CrawlDataSwsScreenerResultRepository,
  CrawlDataSwsStockListRepository,
  CrawlDataSwsStockListResultRepository,
  DailyCategoryParentRepository,
  DailyCrawlRepository,
  DailyCrawlTypeDbData,
  DailyCrawlTypeRepository,
  DayRepository,
  InsertCrawlDataSwsCompanySchemaType,
  SwsStockListCrawlTypeSpecificType,
} from '@myawesomeorg/db';
import {
  getProcessDetails,
  killPidProcess,
  processArg0IsPuppeteer,
} from '@myawesomeorg/utils';
import { EventEmitter2 } from 'eventemitter2';
import { DateTime } from 'luxon';
import { dailyCrawlFiles } from '..';
import { StonkerCrawler } from '../crawler';

export class StonkerEvents {
  constructor(
    emitter: EventEmitter2,
    private readonly dayRepository: DayRepository,
    private readonly dailyCrawlRepository: DailyCrawlRepository,
    private readonly dailyCrawlTypeRepository: DailyCrawlTypeRepository,
    private readonly crawlDataSwsStockListRepository: CrawlDataSwsStockListRepository,
    private readonly crawlDataSwsStockListResultRepository: CrawlDataSwsStockListResultRepository,
    private readonly crawlDataSwsScreenerRepository: CrawlDataSwsScreenerRepository,
    private readonly crawlDataSwsScreenerResultRepository: CrawlDataSwsScreenerResultRepository,
    private readonly crawlDataSwsCompanyRepository: CrawlDataSwsCompanyRepository,
    private readonly crawlDataSwsCompanyFreeCashFlowRepository: CrawlDataSwsCompanyFreeCashFlowRepository,
    private readonly crawlDataSwsCompanyCategoryRepository: CrawlDataSwsCompanyCategoryRepository,
    private readonly dailyCategoryParentRepository: DailyCategoryParentRepository,
    private readonly crawler: StonkerCrawler,
  ) {
    emitter.on(
      SWS_CRAWL_GRID_RESULT_EVENT,
      this.onSwsCrawlGridResultEvent.bind(this),
    );
    emitter.on(
      SWS_CRAWL_COMPANY_PAGE_DATA_CRAWLED_EVENT,
      this.onSwsCompanyPageDataCrawledEvent.bind(this),
    );
    emitter.on(
      SWS_CRAWL_PUPPETEER_TIME_OUT,
      this.onSwsCrawlPuppeteerTimeOut.bind(this),
    );

    /* all events registered. */
    console.log(`all event registered`);
  }

  async onSwsCrawlPuppeteerTimeOut(event: SwsCrawlPuppeteerTimedOutEvent) {
    // kill browser pid
    console.log(
      `onSwsCrawlPuppeteerTimeOut triggered! attempting to restart the crawl...`,
    );
    const { browserProcess: originalBrowserProcess } = event;
    const { pid } = originalBrowserProcess;
    if (!pid) {
      throw new Error(`browserProcess.pid is ${pid}`);
    }
    const processDetails = await getProcessDetails(pid);
    if (processArg0IsPuppeteer(processDetails.arg0) === false) {
      throw new Error('Browser process arg0 doesnt look to be chrome');
    }
    // kill pid
    await killPidProcess(pid);
    await this.crawler.startDailyCrawl();
  }

  async onSwsCompanyPageDataCrawledEvent(
    event: SwsCrawlCompanyPageDataCrawledEvent,
  ) {
    // validate API response schema
    const companyApiResponse = event.crawl.data;
    // TODO: run a validator
    // try {
    //   SwsCrawlCompanyPageDataSchemaValidator.validateAndCleanCopy(
    //     companyApiResponse
    //   );
    // } catch (error) {
    //   console.error(
    //     `failed parsing companyApiResponse ${event.companyPage.company.unique_symbol}`
    //   );
    //   return;
    // }

    const companyData = companyApiResponse.data;
    // save to file
    if (event?.dailyCrawl) {
      const dailyCrawlSwsDataFileSystem =
        dailyCrawlFiles.createDailyCrawlSwsDataFileSystem(
          event.crawledAtManilaTime.luxon,
        );
      dailyCrawlSwsDataFileSystem.saveSwsCrawlData({
        crawlType: 'sws_company',
        crawlTypeSpecific: companyData.unique_symbol,
        data: event,
        luxonDataAt:
          event?.dailyCrawl?.dataAt ?? event.crawledAtManilaTime.luxon,
      });
    }

    // save the data to db
    const { iso } =
      companyData.analysis.data.extended.data.analysis.value.intrinsic_value;
    if (iso !== 'PH' && iso !== null) {
      throw new Error(
        `${
          companyData.unique_symbol
        } - intrinsic_value.iso ${iso} is not PH nor null - from ${JSON.stringify(
          companyData.analysis.data.extended.data.analysis.value
            .intrinsic_value,
        )}`,
      );
    }

    const data: InsertCrawlDataSwsCompanySchemaType = {
      swsId: companyData.id,
      swsUniqueSymbol: companyData.unique_symbol,
      crawledAt: event.crawledAtManilaTime.luxon,
      swsDataLastUpdated: BigInt(companyData.last_updated),
      scoreValue: companyData.score.data.value,
      scoreIncome: companyData.score.data.income,
      scoreHealth: companyData.score.data.health,
      scorePast: companyData.score.data.past,
      scoreFuture: companyData.score.data.future,
      scoreManagement: companyData.score.data.management,
      scoreMisc: companyData.score.data.misc,
      scoreScoreTotal: companyData.score.data.total,
      scoreSentence: companyData.score.data.sentence,
      snowflakeColor: companyData?.score?.data?.snowflake?.data?.color ?? null,
      sharePrice: companyData.analysis.data.share_price,
      pe: companyData.analysis.data.pe,
      ps: companyData.analysis.data.extended.data.analysis.value.price_to_sales,
      priceTarget:
        companyData.analysis.data.extended.data.analysis.value.price_target,
      priceTargetAnalystCount:
        companyData.analysis.data.extended.data.analysis.value
          .price_target_analyst_count,
      priceTargetHigh:
        companyData.analysis.data.extended.data.analysis.value
          .price_target_high,
      priceTargetLow:
        companyData.analysis.data.extended.data.analysis.value.price_target_low,
      epsAnnualGrowthRate:
        companyData.analysis.data.extended.data.analysis.future
          .earnings_per_share_growth_annual,
      netIncomeAnnualGrowthRate:
        companyData.analysis.data.extended.data.analysis.future
          .net_income_growth_annual,
      roeFuture3y: companyData.analysis.data.future.roe_3y,
      roe: companyData.analysis.data.roe,
      peForward1y:
        companyData.analysis.data.extended.data.analysis.future.forward_pe_1y,
      psForward1y:
        companyData.analysis.data.extended.data.analysis.future
          .forward_price_to_sales_1y,
      peerPreferredComparison: companyData.analysis.data.preferred_multiple,
      peerPreferredValue:
        companyData.analysis.data
          .preferred_relative_multiple_average_peer_value,
      intrinsicValue:
        companyData.analysis.data.extended.data.analysis.value.intrinsic_value
          .npv_per_share,
      intrinsicValueModel:
        companyData.analysis.data.extended.data.analysis.value.intrinsic_value
          .model,
      intrinsicValueDiscount:
        companyData.analysis.data.extended.data.analysis.value.intrinsic_value
          .intrinsic_discount,
      dividendYield:
        companyData.analysis.data.extended.data.analysis.dividend
          .dividend_yield,
      dividendYieldFuture:
        companyData.analysis.data.extended.data.analysis.dividend
          .dividend_yield_future,
      dividendPayoutRatio:
        companyData.analysis.data.extended.data.analysis.dividend.payout_ratio,
      dividendPayoutRatio3Y:
        companyData.analysis.data.extended.data.analysis.dividend
          .payout_ratio_3y,
      dividendPayoutRatioMedian3Y:
        companyData.analysis.data.extended.data.analysis.dividend
          .payout_ratio_median_3yr,
      dividendPaymentsGrowthAnnual:
        companyData.analysis.data.extended.data.analysis.dividend
          .dividend_payments_growth_annual,
      dividendCashPayoutRatio:
        companyData.analysis.data.extended.data.analysis.dividend
          .cash_payout_ratio,
      leveredFreeCashFlowAnnualGrowth:
        companyData.analysis.data.extended.data.analysis.health
          .levered_free_cash_flow_growth_annual,
    };
    const swsCompanyData =
      await this.crawlDataSwsCompanyRepository.createOne(data);

    if (swsCompanyData === undefined) {
      throw new Error(
        `Failed to create new swsCompanyData: ${data.swsUniqueSymbol}`,
      );
    }

    // save the free cash flow to db
    const _fcfHistoryValues =
      Object.values(
        companyData.analysis.data.extended.data.analysis.health
          .levered_free_cash_flow_history,
      ) ?? [];
    if (_fcfHistoryValues.length > 0) {
      const fcfHistory =
        companyData.analysis.data.extended.data.analysis.health
          .levered_free_cash_flow_history;
      for (const timestamp in fcfHistory) {
        const dataAt = DateTime.fromMillis(Number(timestamp)).toUTC();
        const swsId = companyData.id;
        const swsUniqueSymbol = companyData.unique_symbol;
        // TODO: find first, before insert.
        await this.crawlDataSwsCompanyFreeCashFlowRepository.createOne({
          swsId,
          swsUniqueSymbol,
          dataAt,
          leveredFreeCashFlow: fcfHistory[timestamp as keyof typeof fcfHistory],
        });
      }
    }

    // save categories
    const industries =
      companyData.analysis.data.extended.data.raw_data.data.industries;
    const { sector, primary, secondary, tertiary } = industries;
    await this.dayRepository.getByLuxon(event.crawledAtManilaTime.luxon);
    const dailyCategoryParents: {
      sectorId: null | number;
      primary: null | number;
      secondary: null | number;
      tertiary: null | number;
    } = {
      sectorId: null,
      primary: null,
      secondary: null,
      tertiary: null,
    };
    for (const _s of [sector, primary, secondary, tertiary]) {
      if (!_s.sic_name.length) continue;
      const _d =
        await this.crawlDataSwsCompanyCategoryRepository.createAndAttachToCompanyCategoryByApiResponse(
          event.crawledAtManilaTime.luxon,
          swsCompanyData,
          _s,
          Boolean(_s.level === 1),
          Boolean(_s.level === 4),
        );
      const _dailyCategoryId = _d ? _d.dailyCategoryId : null;
      if (_dailyCategoryId && _s.level === 1) {
        dailyCategoryParents.sectorId = _dailyCategoryId;
      } else if (_dailyCategoryId && _s.level === 2) {
        dailyCategoryParents.primary = _dailyCategoryId;
      } else if (_dailyCategoryId && _s.level === 3) {
        dailyCategoryParents.secondary = _dailyCategoryId;
      } else if (_dailyCategoryId && _s.level === 4) {
        dailyCategoryParents.tertiary = _dailyCategoryId;
      }
    }

    // loop through DailyCategoryParents key value
    const PARENT_CATEGORY_MAPPING = {
      sectorId: null,
      primary: 'sectorId',
      secondary: 'primary',
      tertiary: 'secondary',
    };
    for (const key in dailyCategoryParents) {
      const _dailyCategoryId =
        dailyCategoryParents[key as keyof typeof dailyCategoryParents];
      const _parentCategoryIdKey =
        PARENT_CATEGORY_MAPPING[key as keyof typeof PARENT_CATEGORY_MAPPING] ??
        null;
      if (!_parentCategoryIdKey) continue;
      const _parentCategoryId =
        dailyCategoryParents[
          _parentCategoryIdKey as keyof typeof dailyCategoryParents
        ];
      if (!_parentCategoryId) continue;

      if (_dailyCategoryId) {
        await this.dailyCategoryParentRepository.setCategoryParentId({
          dailyCategoryId: _dailyCategoryId,
          parentDailyCategoryId: _parentCategoryId,
        });
      }
    }

    // attach dataId to dailyCrawlType if defined
    if (event?.dailyCrawl?.id && swsCompanyData) {
      const _dailyCrawlType = await this.dailyCrawlTypeRepository.findByUnique({
        crawlType: 'sws_company',
        crawlTypeSpecific: data.swsUniqueSymbol,
        dailyCrawlId: event.dailyCrawl.id,
      });
      if (_dailyCrawlType)
        await this.dailyCrawlTypeRepository.attachDataId({
          dataId: swsCompanyData.id,
          dailyCrawlTypeId: _dailyCrawlType.id,
        });
    }

    // check if all the dailyCrawlType has dataId
    // then mark the dailyCrawl as finished
    if (event?.dailyCrawl?.id) {
      await this.dailyCrawlRepository.markCompletedIfAllCrawlTypesAreCompleted(
        event.dailyCrawl.id,
        event.crawledAtManilaTime.luxon,
      );
    }
  }

  async onSwsCrawlGridResultEvent(event: SwsCrawlGridResultEvent) {
    console.log(`${SWS_CRAWL_GRID_RESULT_EVENT} event triggered!`);
    const {
      crawlType,
      crawlTypeSpecific,
      data,
      dailyCrawl,
      existingDailyCrawlTypeId,
      crawledAtManilaTime,
    } = event;

    // save to file
    const dailyCrawlSwsDataFileSystem =
      dailyCrawlFiles.createDailyCrawlSwsDataFileSystem(
        crawledAtManilaTime.luxon,
      );
    if (crawlType === 'sws_stock_list') {
      // save to file
      dailyCrawlSwsDataFileSystem.saveSwsCrawlData({
        crawlType: 'sws_stock_list',
        crawlTypeSpecific:
          crawlTypeSpecific as SwsStockListSpecificCrawlTypesType,
        data: event,
        luxonDataAt: dailyCrawl?.dataAt ?? crawledAtManilaTime.luxon,
      });
    } else if (crawlType === 'sws_screener') {
      // save to file
      dailyCrawlSwsDataFileSystem.saveSwsCrawlData({
        crawlType: 'sws_screener',
        crawlTypeSpecific:
          crawlTypeSpecific as SwsScreenerSpecificCrawlTypesType,
        data: event,
        luxonDataAt: dailyCrawl?.dataAt ?? crawledAtManilaTime.luxon,
      });
    }

    let dailyCrawlType: DailyCrawlTypeDbData | undefined;
    if (existingDailyCrawlTypeId) {
      dailyCrawlType = await this.dailyCrawlTypeRepository.findById(
        existingDailyCrawlTypeId,
      );
      if (!dailyCrawlType) {
        throw new Error(
          `dailyCrawlType with id ${existingDailyCrawlTypeId} not found`,
        );
      }
      if (
        dailyCrawlType.crawlType !== crawlType ||
        dailyCrawlType.crawlTypeSpecific !== crawlTypeSpecific
      ) {
        throw new Error(
          `dailyCrawlType with id ${existingDailyCrawlTypeId} has different crawlType or crawlTypeSpecific ${JSON.stringify(
            {
              expected: { crawlType, crawlTypeSpecific },
              actual: {
                crawlType: dailyCrawlType.crawlType,
                crawlTypeSpecific: dailyCrawlType.crawlTypeSpecific,
              },
            },
          )}`,
        );
      }
    } else {
      dailyCrawlType = await this.dailyCrawlTypeRepository.createOne({
        crawlType,
        crawlTypeSpecific,
        dailyCrawlId: dailyCrawl?.id ?? null,
        url: event.url,
      });
    }

    if (crawlType === 'sws_stock_list') {
      // save swsStockList
      const crawlDataSwsStockList =
        await this.crawlDataSwsStockListRepository.createOne({
          crawlTypeSpecific:
            crawlTypeSpecific as SwsStockListCrawlTypeSpecificType,
          luxon: crawledAtManilaTime.luxon,
        });

      // save swsStockListResults
      const companies = data.crawled.map((n) => n.companies).flat();
      for (let position = 1; position <= companies.length; position++) {
        const c = companies[position - 1];
        await this.crawlDataSwsStockListResultRepository.createOne({
          crawlDataSwsStockListId: crawlDataSwsStockList.id,
          swsId: c.id,
          swsUniqueSymbol: c.unique_symbol,
          position,
        });
      }

      // if dailyCrawlId is supplied, attach crawlDataSwsStockList to dailyCrawl
      if (dailyCrawl?.id) {
        await this.dailyCrawlTypeRepository.attachDataId({
          dataId: crawlDataSwsStockList.id,
          dailyCrawlTypeId: dailyCrawlType.id,
        });
      }
    } else if (crawlType === 'sws_screener') {
      // save Screener
      const crawlDataSwsScreener =
        await this.crawlDataSwsScreenerRepository.createOne({
          crawlTypeSpecific:
            crawlTypeSpecific as SwsScreenerSpecificCrawlTypesType,
          luxon: crawledAtManilaTime.luxon,
        });

      // save Screener results
      const companies = data.crawled.map((n) => n.companies).flat();
      for (let position = 1; position <= companies.length; position++) {
        const c = companies[position - 1];
        await this.crawlDataSwsScreenerResultRepository.createOne({
          crawlDataSwsScreenerId: crawlDataSwsScreener.id,
          swsId: c.id,
          swsUniqueSymbol: c.unique_symbol,
          position,
        });
      }

      // if dailyCrawlId is supplied, attach crawlDataSwsStockList to dailyCrawl
      if (dailyCrawl?.id) {
        await this.dailyCrawlTypeRepository.attachDataId({
          dataId: crawlDataSwsScreener.id,
          dailyCrawlTypeId: dailyCrawlType.id,
        });
      }
    }

    // get companies picked up in the grid
    if (dailyCrawl?.id) {
      const companiesCrawled = data.crawled.map((c) => c.companies).flat();
      for (const c of companiesCrawled) {
        await this.dailyCrawlTypeRepository.createOneByUnique({
          crawlType: 'sws_company',
          crawlTypeSpecific: c.unique_symbol,
          dailyCrawlId: dailyCrawl.id,
          url: `https://simplywall.st${c.primary_canonical_url}`,
        });
      }
    }
    // check if all the dailyCrawlType has dataId
    // then mark the dailyCrawl as finished
    if (event?.dailyCrawl?.id) {
      await this.dailyCrawlRepository.markCompletedIfAllCrawlTypesAreCompleted(
        event.dailyCrawl.id,
        event.crawledAtManilaTime.luxon,
      );
    }
  }
}
