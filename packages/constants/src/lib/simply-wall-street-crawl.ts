import { DateTime } from 'luxon';
import { SwsCrawlCompanyPageData } from './simply-wall-street-crawl-company-page-data-validator';

export const CRAWL_TYPES = [
  'sws_stock_list',
  'sws_screener',
  'sws_company',
] as const;

export type PuppeteerCrawlRequestPayloadType = {
  url: string;
  postData: string | undefined;
  headers: Record<string, string>;
};
export type SwsCrawlGridResultCompleteAndForFileSaving = {
  crawled: {
    requestPayload: PuppeteerCrawlRequestPayloadType;
    companies: SwsCrawlCompanyPageData['data'][];
  }[];
  totalRecordsAsPerSimplyWallStreet: number;
};

export type SwsCrawlGridDataBucket = {
  data: SwsCrawlGridDataPerScroll[];
  meta: { total_records: number };
};
export type SwsCrawlGridDataPerScroll = {
  companies: SwsCrawlCompanyPageData['data'][];
  requestPayload: PuppeteerCrawlRequestPayloadType;
};
export type SwsCrawlGridApiResponse = {
  data: SwsCrawlCompanyPageData['data'][];
  meta: { total_records: number };
};

export const SWS_STOCK_LIST_SPECIFIC_CRAWL_TYPES = [
  {
    name: 'stock_list_growth_stocks',
    dropdownName: 'Growth',
    url: 'https://simplywall.st/stocks/ph/growth',
    shouldCrawlCompanyPages: true,
    urlIncludes: '/stocks/ph/growth',
  },
  {
    name: 'stock_list_high_dividend_stocks',
    dropdownName: 'Dividend Yield',
    url: 'https://simplywall.st/stocks/ph/dividend-yield-high',
    shouldCrawlCompanyPages: true,
    urlIncludes: '/stocks/ph/dividend-yield-high',
  },
  {
    name: 'stock_list_by_market_cap',
    dropdownName: 'Market Cap High to Low',
    url: 'https://simplywall.st/stocks/ph/market-cap-large',
    shouldCrawlCompanyPages: false,
    urlIncludes: '/stocks/ph/market-cap-large',
  },
] as const;
export const SWS_SCREENER_SPECIFIC_CRAWL_TYPES = [
  {
    name: 'dividends1_+_health1_+_future1',
    dropdownName: 'Dividends - Health + Future + Dividends',
    url: 'https://simplywall.st/screener/edit/user/356746/dividends-health-future-dividends',
    shouldCrawlCompanyPages: true,
    urlIncludes: '/screener/edit/user/356746/dividends-health-future-dividends',
  },
  {
    name: 'health2_+_future2_+_past1',
    dropdownName: 'Aggressive - Health + Future',
    url: 'https://simplywall.st/screener/edit/user/356745/aggressive-health-future',
    shouldCrawlCompanyPages: true,
    urlIncludes: '/screener/edit/user/356745/aggressive-health-future',
  },
] as const;

export type SwsStockListSpecificCrawlTypesType =
  (typeof SWS_STOCK_LIST_SPECIFIC_CRAWL_TYPES)[number]['name'];
export type SwsScreenerSpecificCrawlTypesType =
  (typeof SWS_SCREENER_SPECIFIC_CRAWL_TYPES)[number]['name'];

export type SwsBaseCrawlTypesType = Record<
  'sws_stock_list',
  Array<{
    specificCrawlType: SwsStockListSpecificCrawlTypesType;
    existingDailyCrawlTypeId: number | null;
    url: string;
  }>
> &
  Record<
    'sws_screener',
    Array<{
      specificCrawlType: SwsScreenerSpecificCrawlTypesType;
      existingDailyCrawlTypeId: number | null;
      url: string;
    }>
  > &
  Record<
    'sws_company',
    Array<{
      specificCrawlType: string;
      existingDailyCrawlTypeId: number | null;
      url: string;
    }>
  >;
export type SwsCrawlWhatToCrawlParamsType =
  | ({ dailyCrawl: DailyCrawlUniqueIdentifierType | null } & {
      whatToCrawl: Partial<SwsBaseCrawlTypesType>;
    })
  | 'all';

export const SWS_BASE_CRAWL_TYPES: SwsBaseCrawlTypesType = {
  sws_stock_list: [],
  sws_screener: [],
  sws_company: [],
};
for (const crawlType of CRAWL_TYPES) {
  if ('sws_stock_list' !== crawlType && 'sws_screener' !== crawlType) continue;
  if (crawlType === 'sws_stock_list') {
    SWS_BASE_CRAWL_TYPES[crawlType] = SWS_STOCK_LIST_SPECIFIC_CRAWL_TYPES.map(
      (n) => ({
        specificCrawlType: n.name,
        existingDailyCrawlTypeId: null,
        url: n.url,
      })
    );
  }
  if (crawlType === 'sws_screener') {
    SWS_BASE_CRAWL_TYPES[crawlType] = SWS_SCREENER_SPECIFIC_CRAWL_TYPES.map(
      (n) => ({
        specificCrawlType: n.name,
        existingDailyCrawlTypeId: null,
        url: n.url,
      })
    );
  }
}

export const SWS_CRAWL_GRID_RESULT_EVENT = 'sws.crawl.grid.result';
export const SWS_CRAWL_SCREENER_RESULT_EVENT = 'sws.crawl.screener.result';

export type DailyCrawlUniqueIdentifierType = {
  id: number;
  dataAt: DateTime;
};
export type GetCurrentManilaDateReturnType = {
  luxon: DateTime;
  date: Date;
};
type SwsCrawlEventResultEvent = {
  crawlType: (typeof CRAWL_TYPES)[number];
  crawlTypeSpecific: string;
  crawledAtManilaTime: GetCurrentManilaDateReturnType;
  url: string;
  // crawlLaterCompanyPages: SwsCrawlCompanyPagesListToCrawlLater;
} & { dailyCrawl: DailyCrawlUniqueIdentifierType | null } & (
    | { existingDailyCrawlTypeId: null }
    | {
        existingDailyCrawlTypeId: number;
      }
  );
export type SwsCrawlGridResultEvent = SwsCrawlEventResultEvent & {
  data: SwsCrawlGridResultCompleteAndForFileSaving;
};

export const SWS_CRAWL_COMPANY_PAGE_DATA_CRAWLED_EVENT =
  'sws-company-pages-data-crawled-event';
export type SwsCrawlCompanyPageToCrawlLater = {
  // company_id: number;
  // primary_canonical_url: string;
  unique_symbol: string;
  url: string;
  existingDailyCrawlTypeId: number | null;
};
export type SwsCrawlCompanyPagesListToCrawlLater =
  SwsCrawlCompanyPageToCrawlLater[];

export type SwsCrawlCompanyPageDataCrawledEvent = {
  crawl: {
    requestPayload: PuppeteerCrawlRequestPayloadType;
    data: SwsCrawlCompanyPageData;
  };
  companyPage: {
    company: SwsCrawlCompanyPageToCrawlLater;
    existingDailyCrawlTypeId: number | null;
  };
  crawledAtManilaTime: GetCurrentManilaDateReturnType;
  dailyCrawl: DailyCrawlUniqueIdentifierType | null;
};
export const SWS_CRAWL_PUPPETEER_TIME_OUT = 'SWS_CRAWL_PUPPETEER_TIME_OUT';
export type PuppeteerBrowserProcess = {
  pid: number | null;
  browserCommand: null | string;
  arg0: string | null;
};
export type SwsCrawlPuppeteerTimedOutEvent = {
  browserProcess: PuppeteerBrowserProcess;
  dailyCrawl: DailyCrawlUniqueIdentifierType | null;
};

export class SwsCrawlPuppeteerError extends Error {
  constructor(m: string) {
    super(m);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, SwsCrawlPuppeteerError.prototype);
  }
}
