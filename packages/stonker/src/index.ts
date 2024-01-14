export * from './crawler/index';
export * from './crawler/puppeteer/puppeteer.service';
export * from './crawler/simply-wall-street/services/simply-wall-street-crawler.service';

import { StonkerConfig } from '@myawesomeorg/config';
import {
  CrawlDataSwsCompanyCategoryRepository,
  CrawlDataSwsCompanyFreeCashFlowRepository,
  CrawlDataSwsCompanyRepository,
  CrawlDataSwsScreenerRepository,
  CrawlDataSwsScreenerResultRepository,
  CrawlDataSwsStockListRepository,
  CrawlDataSwsStockListResultRepository,
  DailyCategoryParentRepository,
  DailyCategoryRepository,
  DailyCrawlRepository,
  DailyCrawlTypeRepository,
  DayRepository,
  SwsIndustryAverageRepository,
} from '@myawesomeorg/db';
import { DailyCrawlFileSystem, FileSystem } from '@myawesomeorg/file-system';
import EventEmitter2 from 'eventemitter2';
import { StonkerCrawler } from './crawler/index';
import { PuppeteerService } from './crawler/puppeteer/puppeteer.service';
import { SimplyWallStreetCompanyPageDataService } from './crawler/simply-wall-street/services/simply-wall-street-company-page-data.service';
import { SimplyWallStreetCrawlerService } from './crawler/simply-wall-street/services/simply-wall-street-crawler.service';
import { StonkerEvents } from './events/sws-crawl-events';

const eventEmitterConfig = {
  // set this to `true` to use wildcards
  wildcard: false,

  // the delimiter used to segment namespaces
  delimiter: '.',

  // set this to `true` if you want to emit the newListener event
  newListener: false,

  // set this to `true` if you want to emit the removeListener event
  removeListener: false,

  // the maximum amount of listeners that can be assigned to an event
  maxListeners: 10,

  // show event name in memory leak message when more than maximum amount of listeners is assigned
  verboseMemoryLeak: false,

  // disable throwing uncaughtException if an error event is emitted and it has no listeners
  ignoreErrors: false,
};

const dayRepository = new DayRepository();
const dailyCrawlRepository = new DailyCrawlRepository(dayRepository);
const dailyCrawlTypeRepository = new DailyCrawlTypeRepository();
const crawlDataSwsStockListRepository = new CrawlDataSwsStockListRepository();
const crawlDataSwsStockListResultRepository =
  new CrawlDataSwsStockListResultRepository();
const crawlDataSwsScreenerRepository = new CrawlDataSwsScreenerRepository();
const crawlDataSwsScreenerResultRepository =
  new CrawlDataSwsScreenerResultRepository();
const crawlDataSwsCompanyRepository = new CrawlDataSwsCompanyRepository();
const crawlDataSwsCompanyFreeCashFlowRepository =
  new CrawlDataSwsCompanyFreeCashFlowRepository();
const dailyCategoryRepository = new DailyCategoryRepository(dayRepository);
const dailyCategoryParentRepository = new DailyCategoryParentRepository();
const crawlDataSwsCompanyCategoryRepository =
  new CrawlDataSwsCompanyCategoryRepository(
    dayRepository,
    dailyCategoryRepository,
  );
const swsIndustryAverageRepository = new SwsIndustryAverageRepository();

const swsCompanyPageDataService = new SimplyWallStreetCompanyPageDataService(
  crawlDataSwsCompanyRepository,
  swsIndustryAverageRepository,
);

const eventEmitter = new EventEmitter2(eventEmitterConfig);
const fileSystem = new FileSystem(StonkerConfig.APP_ROOT_DIR_ABSPATH);
const puppeteerService = new PuppeteerService(fileSystem);
const simplyWallStreetCrawler = new SimplyWallStreetCrawlerService(
  dailyCrawlTypeRepository,
  eventEmitter,
  puppeteerService,
);
const crawler = new StonkerCrawler(
  dayRepository,
  dailyCrawlTypeRepository,
  dailyCrawlRepository,
  simplyWallStreetCrawler,
);
new StonkerEvents(
  eventEmitter,
  dayRepository,
  dailyCrawlRepository,
  dailyCrawlTypeRepository,
  crawlDataSwsStockListRepository,
  crawlDataSwsStockListResultRepository,
  crawlDataSwsScreenerRepository,
  crawlDataSwsScreenerResultRepository,
  crawlDataSwsCompanyRepository,
  crawlDataSwsCompanyFreeCashFlowRepository,
  crawlDataSwsCompanyCategoryRepository,
  dailyCategoryParentRepository,
  crawler,
  swsCompanyPageDataService,
);

const dailyCrawlFiles = new DailyCrawlFileSystem(
  StonkerConfig.APP_ROOT_DIR_ABSPATH,
);

export {
  crawlDataSwsCompanyCategoryRepository,
  crawlDataSwsCompanyFreeCashFlowRepository,
  crawlDataSwsCompanyRepository,
  crawlDataSwsScreenerRepository,
  crawlDataSwsScreenerResultRepository,
  crawlDataSwsStockListRepository,
  crawlDataSwsStockListResultRepository,
  crawler,
  dailyCategoryRepository,
  dailyCrawlFiles,
  dailyCrawlRepository,
  dailyCrawlTypeRepository,
  dayRepository,
  puppeteerService,
  simplyWallStreetCrawler,
  swsCompanyPageDataService,
  swsIndustryAverageRepository,
};
