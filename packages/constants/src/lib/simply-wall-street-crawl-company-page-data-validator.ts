import { SwsCrawlCompanyData } from './simply-wall-street-crawl-company-page-data.types';

// export const SwsCrawlCompanyPageDataSchemaValidator = (data: unknown) =>
//   swsCrawlCompanyDataSchema.parse(data);

// TODO: zod validation
// error TS7056: The inferred type of this node exceeds the maximum length the compiler will serialize. An explicit type annotation is needed.
// export type SwsCrawlCompanyPageData = z.infer<typeof swsCrawlCompanyDataSchema>;
export type SwsCrawlCompanyPageData = SwsCrawlCompanyData;
