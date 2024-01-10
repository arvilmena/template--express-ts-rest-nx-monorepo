import { SwsCrawlCompanyPageData } from '@myawesomeorg/constants';
import { CrawlDataSwsCompanyRepository } from '@myawesomeorg/db';
import { luxonToManilaSqlFormat, slugify } from '@myawesomeorg/utils';
import { DateTime } from 'luxon';
import { dailyCrawlFiles } from './../../../index';

export class SimplyWallStreetCompanyPageDataService {
  constructor(
    private readonly crawlDataSwsCompanyRepository: CrawlDataSwsCompanyRepository,
  ) {}

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
    const companyData = JSON.parse(contents) as {
      crawl: { data: SwsCrawlCompanyPageData };
    };

    // get the sws crawl company
    const swsId = companyData.crawl.data.data.id;
    const swsDataLastUpdated = BigInt(companyData.crawl.data.data.last_updated);

    const swsCompany =
      await this.crawlDataSwsCompanyRepository.findBySwsIdAndLastUpdated({
        swsId,
        swsDataLastUpdated,
      });
    if (!swsCompany) {
      return `SWS Company for swsId: ${swsId} and swsDataLastUpdated: ${swsDataLastUpdated} not found!`;
    }

    const rawIndustryAverages =
      companyData.crawl.data.data.analysis.data.extended.data.industry_averages;

    return rawIndustryAverages;
  }
}
