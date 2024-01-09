import { SwsCrawlCompanyPageData } from '@myawesomeorg/constants';
import {
  CrawlDataSwsCompanyRepository,
  CrawlDataSwsCompanyStatementPivotRepository,
  SwsCompanyStatementRepository,
} from '@myawesomeorg/db';
import { luxonToManilaSqlFormat, slugify } from '@myawesomeorg/utils';
import { DateTime } from 'luxon';
import { dailyCrawlFiles } from './../../../index';

export class SimplyWallStreetCompanyPageDataService {
  constructor(
    private readonly crawlDataSwsCompanyRepository: CrawlDataSwsCompanyRepository,
    private readonly swsCompanyStatementRepository: SwsCompanyStatementRepository,
    private readonly crawlDataSwsCompanyStatementPivotRepository: CrawlDataSwsCompanyStatementPivotRepository,
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

    const rawStatements =
      companyData.crawl.data.data.analysis.data.extended.data.statements;

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

    if (Array.isArray(rawStatements) && rawStatements.length > 0) {
      return `swsId: ${swsId} and swsDataLastUpdated: ${swsDataLastUpdated} > Has unhandled statements: ${JSON.stringify(
        rawStatements,
        null,
        2,
      )}`;
    }

    const statements = Object.values(rawStatements)
      .map((statement) => {
        const d = Object.values(statement);
        return d.map((dd) => {
          const {
            statement_name: key,
            description,
            type: effectType,
            data,
          } = dd as {
            statement_name: string;
            description: string;
            type: string;
            data: unknown[];
          };
          if (!key || !description || !effectType) return null;
          return { key, description, effectType, data };
        });
      })
      .flatMap((d) => d)
      .filter(Boolean);

    // save statements...
    const toSave = statements.filter(
      (n) =>
        n.description !== 'Information is not available.' &&
        n.effectType !== 'NO_DATA',
    );
    // const saved = await Promise.all(
    //   toSave.map(async (s) => {
    //     const { key, description, effectType } = s;
    //     const _statement = await this.swsCompanyStatementRepository.createOne({
    //       key,
    //       description,
    //       effectType,
    //     });

    //     if (!_statement) {
    //       throw new Error(
    //         `Failed to attach statement to company: swsId: ${swsId} and swsDataLastUpdated: ${swsDataLastUpdated} / ${
    //           (JSON.stringify({
    //             key,
    //             description,
    //             effectType,
    //           }),
    //           null,
    //           2)
    //         }`,
    //       );
    //     }

    //     // attach statement to the company...
    //     await this.crawlDataSwsCompanyStatementPivotRepository.attachStatementToCompany(
    //       {
    //         crawlDataSwsCompanyId: swsCompany.id,
    //         statementId: _statement.id,
    //       },
    //     );

    //     return _statement;
    //   }),
    // );
    // save statements ends...

    // save market data

    // save market data ends...

    return { rawStatements, statements, toSave };
  }
}
