import { SwsCrawlCompanyPageData } from '@myawesomeorg/constants';
import {
  CrawlDataSwsCompanyDbData,
  CrawlDataSwsCompanyRepository,
  SwsCompanyStatementRepository,
  SwsIndustryAverageRepository,
  SwsIndustryAverageRepositoryCreateOneType,
} from '@myawesomeorg/db';
import { luxonToManilaSqlFormat, slugify } from '@myawesomeorg/utils';
import * as cheerio from 'cheerio';
import { DateTime } from 'luxon';
import { dailyCrawlFiles } from './../../../index';
import { getJsObjectFromString } from './../../../utils/get-js-object-from-string';

export class SimplyWallStreetCompanyPageDataService {
  constructor(
    private readonly crawlDataSwsCompanyRepository: CrawlDataSwsCompanyRepository,
    private readonly swsIndustryAverageRepository: SwsIndustryAverageRepository,
    private readonly swsCompanyStatementRepository: SwsCompanyStatementRepository,
  ) {}

  async saveCompanyData({
    companyData,
    html,
  }: {
    companyData: SwsCrawlCompanyPageData['data'];
    html: string | null;
  }) {
    // get the sws crawl company
    const swsId = companyData.id;
    const swsDataLastUpdated = BigInt(companyData.last_updated);

    const swsCompany =
      await this.crawlDataSwsCompanyRepository.findBySwsIdAndLastUpdated({
        swsId,
        swsDataLastUpdated,
      });
    if (!swsCompany) {
      return `SWS Company for swsId: ${swsId} and swsDataLastUpdated: ${swsDataLastUpdated} not found!`;
    }

    /** start working on the html */
    const htmlData = await this._parseDataFromHtml({
      html: html ?? '',
      swsCompany,
    });
    const { statements } = htmlData;
    const savedStatements = await Promise.all(
      statements
        .filter((n) =>
          [
            'Has Been Growing Profit Or Revenue',
            'Is Good Relative Value',
            'Are Revenue And Earnings Expected To Grow',
            'Is In Good Financial Position',
            'Is Dividend Sustainable',
            'Has High Quality Earnings',
            'Has Meaningful Market Cap',
            'Has Net Profit Margin Improved Over Past Year',
            'Has No Concerning Recent Events',
            'Negative Shareholders Equity',
            'Has Not Diluted Over Past Year',
            'Has Sufficient Financial Data',
            'Is Able To Achieve Profitability',
            'Has Meaningful Revenue',
            'Has Stable Share Price Over Past Months',
            'Price-To-Earnings vs Peers',
            'PE vs Industry',
            'Price-To-Earnings vs Fair Ratio',
            'Analyst Forecast',
            'Is Good Health Intro',
            'Earnings vs Savings Rate',
            'Earnings vs Market',
            'High Growth Earnings',
            'Revenue vs Market',
            'High Growth Revenue',
            'Future ROE',
            'Is Fruitful Past Intro',
            'Quality Earnings',
            'Growing Profit Margin',
            'Earnings Trend',
            'Accelerating Growth',
            'Earnings vs Industry',
            'High ROE',
            'Is Good Health Intro',
            'Short Term Liabilities',
            'Long Term Liabilities',
            'Debt Level',
            'Reducing Debt',
            'Debt Coverage',
            'Interest Coverage',
            'Dividend Intro',
            'Reliable Dividend',
            'Growing Dividend',
            'Notable Dividend',
            'High Dividend',
            'Earnings Coverage',
            'Cash Flow Coverage',
            'Has Management Information Intro',
            'Experienced Management',
            'Experienced Board',
            'Dilution of Shares',
          ].includes(n.title),
        )
        .map(async (n) => {
          return await this.swsCompanyStatementRepository.createOneAndAttachToSwsCompany(
            {
              swsId: swsCompany.id,
              ...n,
            },
            swsCompany.id,
          );
        }),
    );
    if (1 === parseInt('1')) return savedStatements;
    /** start working on the html ends */

    const rawIndustryAverages =
      companyData.analysis.data.extended.data.industry_averages;
    if (!rawIndustryAverages) return null;

    const { all: market, ...sector } = rawIndustryAverages;

    const savedIndustryAverages = async (
      d:
        | (typeof rawIndustryAverages)['all']
        | Omit<typeof rawIndustryAverages, 'all'>,
    ) => {
      const _marketValues = {
        ...(d as Omit<
          SwsIndustryAverageRepositoryCreateOneType,
          'swsDataLastUpdated'
        >),
        swsDataLastUpdated: BigInt(companyData.last_updated),
      } satisfies SwsIndustryAverageRepositoryCreateOneType;

      return await this.swsIndustryAverageRepository.createOneAndAttachToSwsCompany(
        _marketValues,
        swsCompany.id,
      );
    };

    let savedMarket: Awaited<ReturnType<typeof savedIndustryAverages>> | null =
      null;
    if (market) {
      savedMarket = await savedIndustryAverages(market);
    }
    const savedSector = await savedIndustryAverages(sector);

    return { rawIndustryAverages, savedMarket, savedSector };
  }

  async _parseDataFromHtml({
    html,
    swsCompany,
  }: {
    html: string;
    swsCompany: NonNullable<CrawlDataSwsCompanyDbData>;
  }) {
    const $ = cheerio.load(html);
    const el = [...$('script')].find((e) => {
      const _e = $(e).text();
      return (
        _e.includes('window.__REACT_QUERY_STATE__') &&
        (_e.includes('"mutations":') || _e.includes('mutations:'))
      );
    });
    const scriptTag = $(el)?.text() ?? '';
    const jsonObj = getJsObjectFromString(scriptTag);
    if (jsonObj === undefined) {
      throw new Error(
        `Cannot get REACT_QUERY_STATE from company page ${swsCompany.swsUniqueSymbol}`,
      );
    }
    let swsReactQueryState: { queries: unknown } | undefined = eval(
      '(' + jsonObj + ')',
    );
    const queries = swsReactQueryState?.queries ?? null;

    const data =
      (
        queries as {
          queryKey: string[];
          state: {
            data: {
              symbol: string;
              statements: {
                data: {
                  outcome_name: string;
                  severity: string;
                  state: string;
                  title: string;
                  description: string;
                  area: string;
                  context: Record<string, string>;
                  _tooltip_: Record<string, string>;
                }[];
              };
            };
          };
        }[]
      ).find((n) => n.queryKey[0] === 'COMPANY_STATEMENTS_API')?.state?.data ??
      null;
    if (data?.symbol !== swsCompany.swsUniqueSymbol) {
      throw new Error('Invalid data');
    }
    swsReactQueryState = undefined;
    const rawStatements = (data?.statements?.data ?? []).filter(
      (n) => n?.outcome_name !== 'OUTCOME_NULL',
    );

    // const majorRisks = rawStatements.filter((n) => n.state === 'fail');
    const statements = rawStatements.map((n) => ({
      title: n.title,
      state: n.state,
      severity: n.severity,
      description: n.description,
      area: n.area,
      context: n.context,
      outcome_name: n.outcome_name,
      // tooltip: n._tooltip_,
    }));

    return {
      count: rawStatements.length,
      statements,
      // rawStatements,
      // risks: statements.filter((n) => ['major'].includes(n.severity)),
    };
  }

  async recrawlCompanyPageDataFromFile(dataAt: DateTime, uniqueSymbol: string) {
    let contents: string | null = null;
    try {
      contents = await dailyCrawlFiles.dailyCrawlFileStorage.readToString(
        `${luxonToManilaSqlFormat(
          dataAt,
        )}/simply-wall-street/sws_company/${slugify(
          uniqueSymbol,
        ).toUpperCase()}.json`,
      );
    } catch (error) {
      console.error(error);
    }
    if (null === contents) {
      return {};
    }
    const companyDataRaw = JSON.parse(contents) as {
      crawl: { data: SwsCrawlCompanyPageData; html: string };
    };

    const companyData = companyDataRaw.crawl.data.data;
    const html = companyDataRaw.crawl.html;

    return await this.saveCompanyData({ companyData, html });
  }
}
