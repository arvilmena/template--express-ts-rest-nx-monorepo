/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { myTsRestContract } from '@myawesomeorg/ts-rest';
import {
  dayUrlParamStringToLuxon,
  getCurrentManilaDate,
} from '@myawesomeorg/utils';
import {
  crawler,
  puppeteerService,
  simplyWallStreetCrawler,
  swsCompanyPageDataService,
} from '@stonker/stonker';
import { ResponseValidationError } from '@ts-rest/core';
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import { generateOpenApi } from '@ts-rest/open-api';
import * as bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import cors = require('cors');

declare global {
  interface BigInt {
    toJSON(): string;
  }
}
BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const s = initServer();

const completedRouter = s.router(myTsRestContract, {
  getPost: async ({ params: { id } }) => {
    return {
      status: 200,
      body: { id, title: '', body: '' },
    };
  },
  createPost: async ({ body }) => {
    return {
      status: 201,
      body: { ...body, id: '1' },
    };
  },
});

const openApiDocument = generateOpenApi(myTsRestContract, {
  info: { title: 'MyAwesomeOrg API', version: '0.0.1' },
});

// const apiDocs = express.Router();

// apiDocs.use(serve);
// apiDocs.get('/', setup(openapi));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

app.get('/test', (req, res) => {
  return res.json(req.query);
});

createExpressEndpoints(myTsRestContract, completedRouter, app);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ResponseValidationError) {
    console.error(err.cause);
  }

  next(err);
});

/**
 * Custom routes starts
 */
app.get('/open-browser', (_req: Request, res: Response) => {
  puppeteerService.openBrowser();
  res.json({ result: 'ok' });
});
app.get('/start-daily-crawl', async (_req: Request, res: Response) => {
  const d = await crawler.startDailyCrawl();
  res.json(d);
});

app.get('/debug', async (_req: Request, res: Response) => {
  const { browser } = await puppeteerService.openBrowser();
  const page = await browser.newPage();
  await page.goto('https://www.google.com');
  const d = await simplyWallStreetCrawler._crawlCompanyPage({
    page,
    company: {
      unique_symbol: 'PSE:FB',
      url: 'https://simplywall.st/stocks/ph/food-beverage-tobacco/pse-fb/san-miguel-food-and-beverage-shares',
      existingDailyCrawlTypeId: null,
    },
  });
  await browser.close();
  // res.json(d);
  res.send(d.html);
});
app.get(
  '/recrawl-sws-company-page-data-from-file',
  async (req: Request, res: Response) => {
    // return await swsCompanyPageDataService.recrawlCompanyPageDataFromFile();
    const { day, uniqueSymbol } = req.body;
    const dataAt = dayUrlParamStringToLuxon(day);
    const result =
      await swsCompanyPageDataService.recrawlCompanyPageDataFromFile(
        dataAt,
        uniqueSymbol,
      );
    res.json(result);
  },
);
/* Custom routes ends */

const port = process.env.PORT || 4646;
const server = app.listen(port, async () => {
  console.log(`Listening at http://localhost:${port}`);

  const startupTime = getCurrentManilaDate();
  if (parseInt(startupTime.luxon.toFormat('HH')) >= 17) {
    try {
      return await crawler.startDailyCrawl();
    } catch (error) {
      console.error(error);
    }
  }
});
server.on('error', console.error);

export default app;
