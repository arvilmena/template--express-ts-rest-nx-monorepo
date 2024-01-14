import { SwsCrawlCompanyPageData } from '@myawesomeorg/constants';
import {
  CrawlDataSwsCompanyRepository,
  SwsIndustryAverageRepository,
  SwsIndustryAverageRepositoryCreateOneType,
} from '@myawesomeorg/db';
import { luxonToManilaSqlFormat, slugify } from '@myawesomeorg/utils';
import { DateTime } from 'luxon';
import { dailyCrawlFiles } from './../../../index';

export class SimplyWallStreetCompanyPageDataService {
  constructor(
    private readonly crawlDataSwsCompanyRepository: CrawlDataSwsCompanyRepository,
    private readonly swsIndustryAverageRepository: SwsIndustryAverageRepository,
  ) {}

  async saveCompanyData(companyData: SwsCrawlCompanyPageData['data']) {
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
      crawl: { data: SwsCrawlCompanyPageData };
    };

    const companyData = companyDataRaw.crawl.data.data;

    return await this.saveCompanyData(companyData);
  }
}
