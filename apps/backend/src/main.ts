/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { myTsRestContract } from '@myawesomeorg/ts-rest';
import { ResponseValidationError } from '@ts-rest/core';
import { createExpressEndpoints, initServer } from '@ts-rest/express';
import { generateOpenApi } from '@ts-rest/open-api';
import * as bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';
import * as path from 'path';
import * as swaggerUi from 'swagger-ui-express';
import { puppeteerService } from './stonker';
import cors = require('cors');

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
app.get('/open-browser', async () => {
  return await puppeteerService.openBrowser();
});
/* Custom routes ends */

const port = process.env.port || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
server.on('error', console.error);

export default app;
