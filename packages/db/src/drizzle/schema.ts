// import { CRAWL_TYPES } from '@myawesomeorg/constants';
import { relations } from 'drizzle-orm';
import {
  blob,
  integer,
  real,
  sqliteTable,
  text,
  unique,
} from 'drizzle-orm/sqlite-core';
import { luxonDateTime } from './custom-types/luxon-date-time.custom-type';

export const dailyCrawl = sqliteTable('daily_crawl', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  dataAt: luxonDateTime('data_at')
    .notNull()
    .unique()
    .references(() => day.dataAt, { onDelete: 'cascade' }),
  finishedAt: luxonDateTime('finished_at'),
});

const CRAWL_TYPES = ['sws_stock_list', 'sws_screener', 'sws_company'] as const;

export const dailyCrawlType = sqliteTable(
  'daily_crawl_type',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    dailyCrawlId: integer('daily_crawl_id', {
      mode: 'number',
    }).references(() => dailyCrawl.id, { onDelete: 'cascade' }),
    crawlType: text('crawl_type', {
      enum: CRAWL_TYPES,
    }).notNull(),
    crawlTypeSpecific: text('crawl_type_specific').notNull(),
    url: text('url').notNull(),
    dataId: integer('data_id', { mode: 'number' }),
  },
  (table) => {
    return {
      unq: unique('daily_crawl_and_crawl_type').on(
        table.dailyCrawlId,
        table.crawlType,
        table.crawlTypeSpecific,
      ),
    };
  },
);

export const dailyCrawlRelations = relations(dailyCrawl, ({ many, one }) => ({
  dailyCrawlTypes: many(dailyCrawlType),
  day: one(day, {
    fields: [dailyCrawl.dataAt],
    references: [day.dataAt],
  }),
}));

export const dailyCrawlTypeRelations = relations(dailyCrawlType, ({ one }) => ({
  dailyCrawl: one(dailyCrawl, {
    fields: [dailyCrawlType.dailyCrawlId],
    references: [dailyCrawl.id],
  }),
}));

export const crawlDataSwsStockList = sqliteTable(
  'crawl_data_sws_stock_list',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    crawledAt: luxonDateTime('crawled_at')
      // .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    // finishedAt: text("finished_at"),
    crawlTypeSpecific: text('crawl_type_specific', {
      enum: [
        'stock_list_growth_stocks',
        'stock_list_high_dividend_stocks',
        'stock_list_by_market_cap_high_to_low',
      ],
    }).notNull(),
  },
  (table) => {
    return {
      unq: unique('crawl_data_sws_stock_list_data_at_and_crawl_type').on(
        table.crawledAt,
        table.crawlTypeSpecific,
      ),
    };
  },
);

export const crawlDataSwsStockListResult = sqliteTable(
  'crawl_data_sws_stock_list_result',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    crawlDataSwsStockListId: integer('crawl_data_sws_stock_list_id', {
      mode: 'number',
    })
      .notNull()
      .references(() => crawlDataSwsStockList.id, { onDelete: 'cascade' }),
    swsId: integer('sws_id').notNull(),
    swsUniqueSymbol: text('sws_unique_symbol').notNull(),
    position: integer('position').notNull(),
  },
  (table) => {
    return {
      unq: unique('stock_list_and_position').on(
        table.crawlDataSwsStockListId,
        table.position,
      ),
    };
  },
);

export const crawlDataSwsScreener = sqliteTable(
  'crawl_data_sws_screener',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    crawledAt: luxonDateTime('crawled_at')
      // .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    // finishedAt: luxonDateTime("finished_at"),
    crawlTypeSpecific: text('crawl_type_specific', {
      enum: ['dividends1_+_health1_+_future1', 'health2_+_future2_+_past1'],
    }).notNull(),
  },
  (table) => {
    return {
      unq: unique('crawl_data_sws_screener_data_at_and_crawl_type').on(
        table.crawledAt,
        table.crawlTypeSpecific,
      ),
    };
  },
);

export const crawlDataSwsScreenerResult = sqliteTable(
  'crawl_data_sws_screener_result',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    crawlDataSwsScreenerId: integer('crawl_data_sws_screener_id', {
      mode: 'number',
    }).references(() => crawlDataSwsScreener.id, { onDelete: 'cascade' }),
    swsId: integer('sws_id').notNull(),
    swsUniqueSymbol: text('sws_unique_symbol').notNull(),
    position: integer('position').notNull(),
  },
  (table) => {
    return {
      unq: unique('screener_and_position').on(
        table.crawlDataSwsScreenerId,
        table.position,
      ),
    };
  },
);

export const crawlDataSwsCompany = sqliteTable(
  'crawl_data_sws_company',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    crawledAt: luxonDateTime('crawled_at')
      // .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    swsId: integer('sws_id').notNull(),
    swsUniqueSymbol: text('sws_unique_symbol').notNull(),
    swsDataLastUpdated: blob('sws_data_last_updated', {
      mode: 'bigint',
    }).notNull(),
    scoreValue: real('score_value'),
    scoreIncome: real('score_income'),
    scoreHealth: real('score_health'),
    scorePast: real('score_past'),
    scoreFuture: real('score_future'),
    scoreManagement: real('score_management'),
    scoreMisc: real('score_misc'),
    scoreScoreTotal: real('score_score_total'),
    scoreSentence: text('score_sentence'),
    snowflakeColor: real('snowflake_color'),
    sharePrice: real('share_price'),
    pe: real('value_pe'),
    ps: real('value_ps'),
    roe: real('roe'),
    priceTarget: real('value_price_target'),
    priceTargetAnalystCount: real('value_price_target_analyst_count'),
    priceTargetHigh: real('value_price_target_high'),
    priceTargetLow: real('value_price_target_low'),

    epsAnnualGrowthRate: real('future_earnings_per_share_growth_annual'),
    netIncomeAnnualGrowthRate: real('future_net_income_growth_annual'),
    roeFuture3y: real('future_roe_3y'),
    peForward1y: real('future_forward_pe_1y'),
    psForward1y: real('future_forward_ps_1y'),

    peerPreferredComparison: text('peer_preferred_multiple'),
    peerPreferredValue: real(
      'peer_preferred_relative_multiple_average_peer_value',
    ),

    intrinsicValue: real('intrinsic_value'),
    intrinsicValueModel: text('intrinsic_value_model'),
    intrinsicValueDiscount: real('intrinsic_value_discount'),
    dividendYield: real('dividend_yield'),
    dividendYieldFuture: real('dividend_yield_future'),
    dividendPayoutRatio: real('dividend_payout_ratio'),
    dividendPayoutRatio3Y: real('dividend_payout_ratio_3y'),
    dividendPayoutRatioMedian3Y: real('dividend_payout_ratio_median_3yr'),
    dividendPaymentsGrowthAnnual: real('dividend_payments_growth_annual'),
    dividendCashPayoutRatio: real('dividend_cash_payout_ratio'),

    leveredFreeCashFlowAnnualGrowth: real(
      'health_levered_free_cash_flow_growth_annual',
    ),
  },
  (table) => {
    return {
      unq: unique('crawled_at_and_sws_id').on(table.crawledAt, table.swsId),
      unq2: unique('sws_id_and_sws_data_last_updated').on(
        table.swsId,
        table.swsDataLastUpdated,
      ),
    };
  },
);

export const crawlDataSwsCompanyRelations = relations(
  crawlDataSwsCompany,
  ({ many }) => ({
    freeCashFlows: many(crawlDataSwsCompanyFreeCashFlow),
    categories: many(crawlDataSwsCompanyCategory),
  }),
);

export const crawlDataSwsCompanyCategory = sqliteTable(
  'crawl_data_sws_company_category',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    crawlDataSwsCompanyId: integer('crawl_data_sws_company_id', {
      mode: 'number',
    })
      .notNull()
      .references(() => crawlDataSwsCompany.id, { onDelete: 'cascade' }),
    dailyCategoryId: integer('daily_category_id', {
      mode: 'number',
    })
      .notNull()
      .references(() => dailyCategory.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      unq: unique('crawl_data_sws_company_category_company_and_category').on(
        table.crawlDataSwsCompanyId,
        table.dailyCategoryId,
      ),
    };
  },
);

export const crawlDataSwsCompanyCategoryRelations = relations(
  crawlDataSwsCompanyCategory,
  ({ one }) => ({
    company: one(crawlDataSwsCompany, {
      fields: [crawlDataSwsCompanyCategory.crawlDataSwsCompanyId],
      references: [crawlDataSwsCompany.id],
    }),
    category: one(dailyCategory, {
      fields: [crawlDataSwsCompanyCategory.dailyCategoryId],
      references: [dailyCategory.id],
    }),
  }),
);

export const crawlDataSwsCompanyFreeCashFlow = sqliteTable(
  'crawl_data_sws_company_free_cash_flow',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    swsId: integer('sws_id').notNull(),
    swsUniqueSymbol: text('sws_unique_symbol').notNull(),
    dataAt: luxonDateTime('data_at').notNull(),
    leveredFreeCashFlow: real('levered_free_cash_flow').notNull(),
  },
  (table) => {
    return {
      unq: unique('data_at_and_sws_id').on(table.dataAt, table.swsId),
    };
  },
);

export const crawlDataSwsCompanyFreeCashFlowRelations = relations(
  crawlDataSwsCompanyFreeCashFlow,
  ({ one }) => ({
    company: one(crawlDataSwsCompany, {
      fields: [crawlDataSwsCompanyFreeCashFlow.swsId],
      references: [crawlDataSwsCompany.id],
    }),
  }),
);

export const day = sqliteTable('day', {
  dataAt: luxonDateTime('data_at').notNull().unique().primaryKey(),
});
export const dayRelations = relations(day, ({ many, one }) => ({
  dailyCategories: many(dailyCategory),
  dailyCrawl: one(dailyCrawl, {
    fields: [day.dataAt],
    references: [dailyCrawl.dataAt],
  }),
}));

export const dailyCategory = sqliteTable(
  'daily_category',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    dataAt: luxonDateTime('data_at')
      .notNull()
      .references(() => day.dataAt, { onDelete: 'cascade' }),
    source: text('source', {
      enum: ['sws', 'pse', 'investa'],
    }).notNull(),
    swsSubTypeId: text('sws_sub_type_id'),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    isMostParent: integer('is_most_parent', { mode: 'boolean' }).notNull(),
    isTail: integer('is_tail', { mode: 'boolean' }).notNull(),
  },
  (table) => {
    return {
      unq: unique('daily_category_data_at_source_and_name').on(
        table.dataAt,
        table.source,
        table.name,
      ),
      unq2: unique('daily_category_data_at_slug').on(table.dataAt, table.slug),
    };
  },
);

export const dailyCategoryRelations = relations(
  dailyCategory,
  ({ one, many }) => ({
    day: one(day, {
      fields: [dailyCategory.dataAt],
      references: [day.dataAt],
    }),
    dailyCategoryParents: many(dailyCategoryParent, {
      relationName: 'dailyCategory',
    }),
  }),
);

export const dailyCategoryParent = sqliteTable(
  'daily_category_parent',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    dailyCategoryId: integer('daily_category_id', {
      mode: 'number',
    }).references(() => dailyCategory.id, { onDelete: 'cascade' }),
    parentId: integer('daily_category_parent_id', {
      mode: 'number',
    }).references(() => dailyCategory.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      unq: unique('daily_category_parent_category_and_parent').on(
        table.dailyCategoryId,
        table.parentId,
      ),
    };
  },
);

export const dailyCategoryParentRelations = relations(
  dailyCategoryParent,
  ({ one }) => ({
    dailyCategory: one(dailyCategory, {
      fields: [dailyCategoryParent.dailyCategoryId],
      references: [dailyCategory.id],
      relationName: 'dailyCategory',
    }),
    parentCategory: one(dailyCategory, {
      fields: [dailyCategoryParent.parentId],
      references: [dailyCategory.id],
      relationName: 'parentCategory',
    }),
  }),
);

export const swsCompanyStatement = sqliteTable(
  'sws_company_statement',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    key: text('statement_name').notNull(),
    description: text('description').notNull(),
    effectType: text('type').notNull(),
  },
  (table) => {
    return {
      unq: unique('sws_company_statement_key_description_and_type').on(
        table.key,
        table.description,
        table.effectType,
      ),
    };
  },
);

export const crawlDataSwsCompanyStatement = sqliteTable(
  'crawl_data_sws_company_statement',
  {
    id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
    statementId: integer('sws_company_statement_id', {
      mode: 'number',
    }).references(() => swsCompanyStatement.id, { onDelete: 'cascade' }),
    crawlDataSwsCompanyId: integer('crawl_data_sws_company_id', {
      mode: 'number',
    }).references(() => crawlDataSwsCompany.id, { onDelete: 'cascade' }),
  },
  (table) => {
    return {
      unq: unique('crawl_data_sws_company_statement_unique').on(
        table.statementId,
        table.crawlDataSwsCompanyId,
      ),
    };
  },
);
