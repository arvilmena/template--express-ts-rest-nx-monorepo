import {
  SWS_CRAWL_COMPANY_PAGE_DATA_CRAWLED_EVENT,
  SWS_CRAWL_GRID_RESULT_EVENT,
  SWS_CRAWL_PUPPETEER_TIME_OUT,
  SWS_SCREENER_SPECIFIC_CRAWL_TYPES,
  SWS_STOCK_LIST_SPECIFIC_CRAWL_TYPES,
  SwsCrawlCompanyPageData,
  SwsCrawlCompanyPageDataCrawledEvent,
  SwsCrawlCompanyPagesListToCrawlLater,
  SwsCrawlGridApiResponse,
  SwsCrawlGridDataPerScroll,
  SwsCrawlGridResultCompleteAndForFileSaving,
  SwsCrawlGridResultEvent,
  SwsCrawlPuppeteerError,
  SwsCrawlPuppeteerTimedOutEvent,
  SwsCrawlWhatToCrawlParamsType,
} from '@myawesomeorg/constants';
import { DailyCrawlTypeRepository } from '@myawesomeorg/db';
import { getCurrentManilaDate } from '@myawesomeorg/utils';
import EventEmitter2 from 'eventemitter2';
import { DateTime } from 'luxon';
import { ElementHandle, HTTPResponse, Page } from 'puppeteer';
import { PuppeteerService } from '../../puppeteer/puppeteer.service';
export class SimplyWallStreetCrawlerService {
  constructor(
    // private readonly ROOT_FOLDER: string,
    private readonly dailyCrawlTypeRepository: DailyCrawlTypeRepository,
    private readonly emitter: EventEmitter2,
    private readonly puppeteerService: PuppeteerService
  ) {}

  // getCookieFilePath(): string {
  //   return path.join(
  //     this.ROOT_FOLDER,
  //     "data",
  //     "puppeteer",
  //     "cookies",
  //     "cookies.json"
  //   );
  // }

  // async getCookie(): Promise<Protocol.Network.CookieParam[]> {
  //   return this.fileSystem.puppeteerCookie.getCookie();
  // }

  // async saveCurrentCookies(cdt: CDPSession) {
  //   // console.log(`> saving cookies...`);
  //   return this.fileSystem.puppeteerCookie.replaceCookie(
  //     (await cdt.send("Network.getAllCookies")).cookies
  //   );
  // }

  async _scrapeInfiniteScrollGrid(
    page: Page,
    crawled: SwsCrawlGridDataPerScroll[],
    itemCount: number,
    crawlType: string,
    specificCrawlType: string,
    errorToThrow: SwsCrawlPuppeteerTimedOutEvent,
    scrollDelay = 1000
  ): Promise<SwsCrawlGridDataPerScroll[]> {
    // console.log(`> crawling Infinite Scroll...`);
    let items: SwsCrawlGridDataPerScroll[] = crawled;
    let currentHeight = 0;
    try {
      while (items.length < itemCount) {
        await page.waitForTimeout(scrollDelay);
        currentHeight = parseFloat(
          (await page.evaluate('document.body.scrollHeight')) as string
        );
        // console.log(`>> currentHeight: ${currentHeight}`);
        await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
        // const newHeight = parseFloat(
        //   (await page.evaluate("document.body.scrollHeight")) as string
        // );
        // console.log(`>> newHeight: ${newHeight}`);

        let response: HTTPResponse | null = null;
        // try {
        //   const _r = await Promise.all([
        //     page.waitForResponse(async (response) => {
        //       const shouldWait =
        //         response.url().includes("/api/grid/filter") &&
        //         response.request().postData()?.includes('"ph');
        //       return Boolean(shouldWait);
        //     }),
        //   ]);
        //   response = _r[0];
        // } catch (error) {
        //   this.emitter.emit(
        //     SWS_CRAWL_PUPPETEER_TIME_OUT,
        //     errorToThrow satisfies SwsCrawlPuppeteerTimedOutEvent
        //   );
        //   throw new SwsCrawlPuppeteerError(JSON.stringify(errorToThrow));
        // }
        const _r = await Promise.all([
          page.waitForResponse(async (response) => {
            const shouldWait =
              response.url().includes('/api/grid/filter') &&
              response.request().postData()?.includes('"ph');
            return Boolean(shouldWait);
          }),
        ]);
        response = _r[0];
        const _result: SwsCrawlGridApiResponse = await response.json();
        // items = items.concat(_result.data);

        if (_result.data.length > 0) {
          const companiesOnly = items
            .map((c) => c.companies)
            .flat()
            .flat();

          const _companiesToPush: SwsCrawlGridApiResponse['data'] = [];
          let companiesCrawled = items
            .map((c) => c.companies)
            .flat()
            .map((c) => c.unique_symbol);
          if (
            _result.data.some((c) => companiesCrawled.includes(c.unique_symbol))
          ) {
            continue;
          }
          for (const d of _result.data) {
            const existingItem = companiesOnly.find(
              (i) => i.unique_symbol === d.unique_symbol
            );
            if (!existingItem) {
              _companiesToPush.push(d);
            }
          }
          const _request = response.request();
          const requestPayload = {
            url: _request.url(),
            postData: _request.postData(),
            headers: _request.headers(),
          };

          items = items.concat([
            {
              companies: _companiesToPush,
              requestPayload,
            },
          ]);

          companiesCrawled = items
            .map((c) => c.companies)
            .flat()
            .map((c) => c.unique_symbol);
          console.log(
            `>>> companies: ${companiesCrawled.length}/${itemCount}...`
          );
        }

        await page.waitForFunction(
          `document.body.scrollHeight > ${currentHeight}`
        );
        await page.waitForTimeout(scrollDelay);
      }
    } catch (error) {
      console.log(
        `> timeout trying to get more data... usually SWS doesn't complete the company list in the grid`
      );
    }
    return items;
  }

  async _crawlGrid(
    page: Page,
    crawlType: string,
    specificCrawlType: string,
    errorToThrow: SwsCrawlPuppeteerTimedOutEvent
  ): Promise<SwsCrawlGridResultCompleteAndForFileSaving> {
    // await page.goto(url);
    let crawled: SwsCrawlGridDataPerScroll[] = [];

    let response: HTTPResponse | null = null;
    try {
      const _r = await Promise.all([
        page.waitForResponse((response) => {
          const shouldWait =
            response.url().includes('/api/grid/filter') &&
            response.request().postData()?.includes('"ph');
          if (!shouldWait) return false;
          return true;
        }),
      ]);
      response = _r[0];
    } catch (error) {
      this.emitter.emit(
        SWS_CRAWL_PUPPETEER_TIME_OUT,
        errorToThrow satisfies SwsCrawlPuppeteerTimedOutEvent
      );
      throw new SwsCrawlPuppeteerError(JSON.stringify(errorToThrow));
    }
    if (null === response) {
      throw new Error('Response is null');
    }
    const _result: SwsCrawlGridApiResponse = await (
      response as HTTPResponse
    ).json();
    const _request = (response as HTTPResponse).request();
    const requestPayload = {
      url: _request.url(),
      postData: _request.postData(),
      headers: _request.headers(),
    };

    await page.waitForSelector('#root h1');
    await page.waitForTimeout(150);

    console.log(`>> Crawling ${_result.meta.total_records} companies...`);

    if (_result.data.length > 0) {
      const companiesCrawled = crawled
        .map((c) => c.companies)
        .flat()
        .map((c) => c.unique_symbol);
      if (
        _result.data.some((c) => companiesCrawled.includes(c.unique_symbol)) ===
        false
      ) {
        crawled = crawled.concat([
          {
            companies: _result.data,
            requestPayload,
          },
        ]);
      }
    }
    // console.log(`>>> companies: ${companies.length}...`);

    crawled = await this._scrapeInfiniteScrollGrid(
      page,
      crawled,
      _result.meta.total_records,
      crawlType,
      specificCrawlType,
      errorToThrow
    );

    return {
      crawled,
      totalRecordsAsPerSimplyWallStreet: _result.meta.total_records,
    } satisfies SwsCrawlGridResultCompleteAndForFileSaving;
  }

  // async _writeToFile(contents: any, dest: string) {
  //   const _contents =
  //     typeof contents === "string"
  //       ? contents
  //       : JSON.stringify(contents, null, 2);

  //   // create path recursively
  //   await fs.promises.mkdir(path.parse(dest).dir, { recursive: true });
  //   return await Bun.write(dest, _contents);
  // }

  async crawl(whatToCrawl: SwsCrawlWhatToCrawlParamsType = 'all') {
    console.log(`> Crawling Simply Wall Street...`);
    // console.log(
    //   `>> whatToCrawl: ${
    //     whatToCrawl !== "all" ? JSON.stringify(whatToCrawl, null, 2) : "all"
    //   }`
    // );
    // let browser;
    // puppeteer.use(StealthPlugin());

    // // Add Adblocker plugin to block all ads and trackers (saves bandwidth)
    // puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

    // try {
    //   browser = await puppeteer.launch({
    //     headless: false,
    //     // defaultViewport: { width: 1920, height: 1080 },
    //     defaultViewport: null,
    //     userDataDir: this.fileSystem.puppeteerUserDataDir,
    //     ignoreDefaultArgs: ["--enable-automation"],
    //     args: [
    //       "--user-agent=Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    //       "--disable-infobars",
    //       "--start-maximized",
    //       "--single-process",
    //       "--no-zygote",
    //       "--no-sandbox",
    //     ],
    //   });
    // } catch (error) {
    //   console.log(error);
    // }

    // if (!browser) {
    //   throw Error("Cannot open browser");
    // }

    // const browserPid = browser.process()?.pid ?? null;
    // if (!browserPid) {
    //   throw Error("Cannot get browser pid");
    // }
    // console.log(`current browser pid: ${browserPid}...`);
    // const processDetails = await getProcessDetails(browserPid);
    // const browserProcess: PuppeteerBrowserProcess = {
    //   pid: processDetails.pid,
    //   browserCommand: processDetails.command,
    //   arg0: processDetails.arg0,
    // };
    // if (processArg0IsPuppeteer(browserProcess.arg0) === false) {
    //   throw new Error(
    //     `Browser process ${browserProcess.arg0} doesnt look to be chrome`
    //   );
    // }

    const { browser, browserProcess, cdt } =
      await this.puppeteerService.openBrowser();

    const errorData = {
      browserProcess,
      dailyCrawl: whatToCrawl !== 'all' ? whatToCrawl.dailyCrawl : null,
    };

    const page = await browser.newPage();
    // await page.setCookie(...(await this.getCookie()));
    // const cdt = await page.target().createCDPSession();
    // // minimize window
    // const { windowId } = await cdt.send("Browser.getWindowForTarget");
    // await cdt.send("Browser.setWindowBounds", {
    //   windowId,
    //   bounds: { windowState: "minimized" },
    // });

    await page.goto('https://simplywall.st/stocks/ph/top-gainers');

    // browser.on("targetchanged", async () => await this.saveCurrentCookies(cdt));
    // browser.on("disconnected", async () => await this.saveCurrentCookies(cdt));
    // page.on("close", async () => await this.saveCurrentCookies(cdt));

    // if (1 === parseInt("1")) {
    //   return;
    // }
    // await page.waitForNavigation();
    await page.waitForSelector('#root h1');
    await page.waitForFunction(
      `document.querySelectorAll('div[data-cy-id="scroll-pane"] table tbody tr[data-cy-id="stocks-table-row"]').length > 0`
    );
    const dropdown = await page.waitForSelector(
      'button[data-cy-id="stock-sorting"]'
    );
    if (!dropdown) {
      throw Error('Cannot find dropdown');
    }
    await page.waitForTimeout(1000);

    const crawlLaterCompanyPages: SwsCrawlCompanyPagesListToCrawlLater = [];

    if (
      whatToCrawl !== 'all' &&
      (whatToCrawl?.whatToCrawl?.sws_company?.length ?? 0) > 0 &&
      whatToCrawl.whatToCrawl.sws_company
    ) {
      for (const company of whatToCrawl.whatToCrawl.sws_company) {
        crawlLaterCompanyPages.push({
          unique_symbol: company.specificCrawlType,
          url: company.url,
          existingDailyCrawlTypeId:
            whatToCrawl?.whatToCrawl?.sws_company?.find(
              (n) => n.specificCrawlType === company.specificCrawlType
            )?.existingDailyCrawlTypeId ?? null,
        });
      }
    }

    for (const g of SWS_STOCK_LIST_SPECIFIC_CRAWL_TYPES) {
      if (
        'all' !== whatToCrawl &&
        !whatToCrawl.whatToCrawl.sws_stock_list?.find(
          (n) => n.specificCrawlType === g.name
        )
      ) {
        console.log(`> skipping ${g.name}...`);
        continue;
      }
      console.log(`> Crawling for ${g.name}...`);

      try {
        const dropdown2 = await page.waitForSelector(
          'button[data-cy-id="stock-sorting"]'
        );
        await page.waitForTimeout(1000);
        await dropdown2?.click();

        // if ("1" === String(1)) {
        //   return;
        // }

        // await page.waitForSelector(
        //   'span[style="display: block;"] ul[data-cy-id="dropdown-list"] li'
        // );
        const menuItem = await page.$x(
          `//ul[@data-cy-id="dropdown-list"]//li//a[contains(text(), "${g.dropdownName}")]`
        );
        // console.log({ menuItem });
        (menuItem[0] as ElementHandle<Element>).click();
        await page.waitForFunction(
          `window.location.pathname.includes("${g.urlIncludes}")`
        );
      } catch (error) {
        this.emitter.emit(
          SWS_CRAWL_PUPPETEER_TIME_OUT,
          errorData satisfies SwsCrawlPuppeteerTimedOutEvent
        );
        throw new SwsCrawlPuppeteerError(JSON.stringify(errorData));
      }
      const data = await this._crawlGrid(
        page,
        'sws_stock_list',
        g.name,
        errorData
      );

      const existingDailyCrawlTypeId =
        whatToCrawl === 'all'
          ? null
          : whatToCrawl.whatToCrawl.sws_stock_list?.find(
              (n) => n.specificCrawlType === g.name
            )?.existingDailyCrawlTypeId ?? null;

      this.emitter.emit(SWS_CRAWL_GRID_RESULT_EVENT, {
        data: data satisfies SwsCrawlGridResultCompleteAndForFileSaving,
        crawlType: 'sws_stock_list',
        crawlTypeSpecific: g.name,
        existingDailyCrawlTypeId:
          whatToCrawl === 'all' ? null : (existingDailyCrawlTypeId as number),
        dailyCrawl:
          whatToCrawl === 'all'
            ? null
            : {
                id: whatToCrawl?.dailyCrawl?.id as number,
                dataAt: whatToCrawl?.dailyCrawl?.dataAt as DateTime,
              },
        crawledAtManilaTime: getCurrentManilaDate(),
        url: g.url,
        // crawlLaterCompanyPages,
      } satisfies SwsCrawlGridResultEvent);

      const companiesCrawled = data.crawled.map((c) => c.companies).flat();
      console.log(
        `> Crawled ${companiesCrawled.length}/${data.totalRecordsAsPerSimplyWallStreet} companies from ${g.name}.`
      );

      if (g.shouldCrawlCompanyPages) {
        for (const company of companiesCrawled) {
          // check if this ticker symbol doesnt exist yet
          const companyPage = crawlLaterCompanyPages.find(
            (c) => c.unique_symbol === company.unique_symbol
          );
          if (!companyPage) {
            crawlLaterCompanyPages.push({
              // company_id: company.id,
              unique_symbol: company.unique_symbol,
              url: `https://simplywall.st${company.primary_canonical_url}`,
              existingDailyCrawlTypeId:
                whatToCrawl === 'all'
                  ? null
                  : whatToCrawl?.whatToCrawl?.sws_company?.find(
                      (n) => n.specificCrawlType === company.unique_symbol
                    )?.existingDailyCrawlTypeId ?? null,
            });
          }
        }
      }
    }

    for (const screener of SWS_SCREENER_SPECIFIC_CRAWL_TYPES) {
      if (
        'all' !== whatToCrawl &&
        !whatToCrawl.whatToCrawl.sws_screener?.find(
          (n) => n.specificCrawlType === screener.name
        )
      ) {
        console.log(`> skipping ${screener.name}...`);
        continue;
      }
      // go to screeners page
      // const screenerMenu = await page.waitForSelector(
      //   `div[data-cy-id="main-navigation"] a[href="/screener/create"]`
      // );
      // await screenerMenu?.click();
      // await page.waitForFunction(
      //   `window.location.pathname.includes("/screener/create")`
      // );
      // const spanShouldBeShown = await page.waitForSelector(
      //   `[data-cy-id="dropdown-saved-screeners"] span[style="display: none;"]`
      // );
      // if (!spanShouldBeShown) {
      //   throw Error("Cannot find the span to enable dropdown");
      // }
      // await spanShouldBeShown?.evaluate((el) => (el.style.display = "block"));

      // await page.waitForFunction(
      //   `document.querySelectorAll('[data-cy-id="dropdown-saved-screeners"] ul[data-cy-id="dropdown-list"] li a[data-cy-id="dropdown-list-item"]').length > 0`
      // );

      // const savedScreener = await page.$x(
      //   `.//*[@data-cy-id="dropdown-saved-screeners"]//ul[@data-cy-id="dropdown-list"]//li//a[@data-cy-id="dropdown-list-item"][contains(text(), "${screener.dropdownName}")]`
      // );

      // if (!savedScreener[0]) {
      //   throw Error(`Cannot find the saved screener: "${screener.name}"`);
      // }

      // savedScreener[0].click();
      // await page.waitForFunction(
      //   `window.location.pathname.includes("${screener.urlIncludes}")`
      // );
      console.log(`Crawling ${screener.name}...`);
      await page.goto(screener.url);
      const data = await this._crawlGrid(
        page,
        'sws_screener',
        screener.name,
        errorData
      );

      const existingDailyCrawlTypeId =
        whatToCrawl === 'all'
          ? null
          : whatToCrawl.whatToCrawl.sws_screener?.find(
              (n) => n.specificCrawlType === screener.name
            )?.existingDailyCrawlTypeId ?? null;

      this.emitter.emit(SWS_CRAWL_GRID_RESULT_EVENT, {
        data: data satisfies SwsCrawlGridResultCompleteAndForFileSaving,
        crawlType: 'sws_screener',
        crawlTypeSpecific: screener.name,
        existingDailyCrawlTypeId:
          whatToCrawl === 'all' ? null : (existingDailyCrawlTypeId as number),
        dailyCrawl:
          whatToCrawl === 'all'
            ? null
            : {
                id: whatToCrawl?.dailyCrawl?.id as number,
                dataAt: whatToCrawl?.dailyCrawl?.dataAt as DateTime,
              },
        crawledAtManilaTime: getCurrentManilaDate(),
        url: screener.url,
        // crawlLaterCompanyPages,
      } satisfies SwsCrawlGridResultEvent);

      const companiesCrawled = data.crawled.map((c) => c.companies).flat();
      console.log(
        `> Crawled ${companiesCrawled.length}/${data.totalRecordsAsPerSimplyWallStreet} companies from ${screener.name}.`
      );

      if (screener.shouldCrawlCompanyPages) {
        for (const company of companiesCrawled) {
          // check if this ticker symbol doesnt exist yet
          const companyPage = crawlLaterCompanyPages.find(
            (c) => c.unique_symbol === company.unique_symbol
          );
          if (!companyPage) {
            crawlLaterCompanyPages.push({
              // company_id: company.id,
              unique_symbol: company.unique_symbol,
              url: `https://simplywall.st${company.primary_canonical_url}`,
              existingDailyCrawlTypeId:
                whatToCrawl === 'all'
                  ? null
                  : whatToCrawl?.whatToCrawl?.sws_company?.find(
                      (n) => n.specificCrawlType === company.unique_symbol
                    )?.existingDailyCrawlTypeId ?? null,
            });
          }
        }
      }
    }

    const crawlLaterCompanyPagesWithDailyCrawlTypeId =
      crawlLaterCompanyPages.map((c) => {
        const _id =
          whatToCrawl === 'all'
            ? null
            : whatToCrawl.whatToCrawl.sws_company?.find(
                (n) => n.specificCrawlType === c.unique_symbol
              )?.existingDailyCrawlTypeId ?? null;
        return {
          company: c,
          existingDailyCrawlTypeId: _id,
        };
      });
    const newCrawlLaterCompanyPages =
      crawlLaterCompanyPagesWithDailyCrawlTypeId.filter(
        (n) => n.existingDailyCrawlTypeId === null
      );

    for (const c of newCrawlLaterCompanyPages) {
      const _dailyCrawlType = await this.dailyCrawlTypeRepository.createOne({
        dailyCrawlId:
          whatToCrawl === 'all' ? null : whatToCrawl.dailyCrawl?.id ?? null,
        crawlType: 'sws_company',
        crawlTypeSpecific: c.company.unique_symbol,
        url: `${c.company.url}`,
      });
      if (_dailyCrawlType) {
        const _i = crawlLaterCompanyPagesWithDailyCrawlTypeId.findIndex(
          (n) => n.company.unique_symbol === c.company.unique_symbol
        );
        crawlLaterCompanyPagesWithDailyCrawlTypeId[
          _i
        ].existingDailyCrawlTypeId = _dailyCrawlType.id;
      }
    }

    // this.emitter.emit(
    //   SWS_CRAWL_COMPANY_PAGES_LIST_TO_CRAWL_LATER_COMPILED_EVENT,
    //   {
    //     crawlLaterCompanyPages: crawlLaterCompanyPages.map((c) => {
    //       const existingDailyCrawlTypeId =
    //         whatToCrawl === "all"
    //           ? null
    //           : whatToCrawl.whatToCrawl.sws_company?.find(
    //               (n) => n.specificCrawlType === c.unique_symbol
    //             )?.existingDailyCrawlTypeId ?? null;
    //       return {
    //         company: c,
    //         existingDailyCrawlTypeId,
    //       };
    //     }),
    //     dailyCrawl: whatToCrawl === "all" ? null : whatToCrawl.dailyCrawl,
    //   } satisfies SwsCrawlCompanyPagesListToCrawlLaterCompiledEvent
    // );

    // get all the sws_companies under this dailyCrawlId
    // update the dailyCrawlTypeId
    if (whatToCrawl !== 'all' && whatToCrawl.dailyCrawl?.id) {
      const swsCompaniesInDb =
        await this.dailyCrawlTypeRepository.findAllUnfinishedSwsCompaniesByDailyCrawlId(
          whatToCrawl.dailyCrawl.id
        );

      const haveNoDbEntry = crawlLaterCompanyPages.filter(
        (n) => n.existingDailyCrawlTypeId === null
      );

      for (const c of haveNoDbEntry) {
        const _alrInDb = swsCompaniesInDb.find(
          (n) => n.crawlTypeSpecific === c.unique_symbol
        );
        if (_alrInDb && _alrInDb.id) {
          c.existingDailyCrawlTypeId = _alrInDb.id;
        }
      }
    }

    for (const c of crawlLaterCompanyPages) {
      console.log(`crawling company: ${c.unique_symbol}...`);
      let response: HTTPResponse | null = null;
      try {
        await page.goto(c.url);
        // await page.waitForNavigation();
        // await Promise.all([
        //   await page.waitForSelector("#root h1"),
        //   await page.waitForTimeout(150),
        // ]);
        const _r = await Promise.all([
          page.waitForResponse(async (response) => {
            const shouldWait = response
              .url()
              .includes('/api/company/stocks/ph/');
            return shouldWait;
          }),
        ]);
        response = _r[0];
      } catch (error) {
        const errorData = {
          browserProcess,
          dailyCrawl: whatToCrawl !== 'all' ? whatToCrawl.dailyCrawl : null,
        };
        this.emitter.emit(
          SWS_CRAWL_PUPPETEER_TIME_OUT,
          errorData satisfies SwsCrawlPuppeteerTimedOutEvent
        );
        throw new SwsCrawlPuppeteerError(JSON.stringify(errorData));
      }

      const _request = response.request();
      const requestPayload = {
        url: _request.url(),
        postData: _request.postData(),
        headers: _request.headers(),
      };
      const data: SwsCrawlCompanyPageData = await response.json();
      this.emitter.emit(SWS_CRAWL_COMPANY_PAGE_DATA_CRAWLED_EVENT, {
        crawl: {
          data,
          requestPayload,
        },
        companyPage: crawlLaterCompanyPagesWithDailyCrawlTypeId.find(
          (n) => n.company.unique_symbol === c.unique_symbol
        ) as (typeof crawlLaterCompanyPagesWithDailyCrawlTypeId)[number],
        crawledAtManilaTime: getCurrentManilaDate(),
        dailyCrawl:
          whatToCrawl === 'all'
            ? null
            : {
                id: whatToCrawl?.dailyCrawl?.id as number,
                dataAt: whatToCrawl?.dailyCrawl?.dataAt as DateTime,
              },
      } satisfies SwsCrawlCompanyPageDataCrawledEvent);

      //   await this._writeToFile(
      //     dataObj,
      //     path.join(
      //       this.ROOT_FOLDER,
      //       "data",
      //       "simply-wall-street",
      //       now ?? "",
      //       "companies",
      //       `${c.ticker_symbol}.json`
      //     )
      //   );
    }

    await this.puppeteerService.saveCurrentCookies(cdt);

    await browser.close();

    return "okay it's working";
  }
}
