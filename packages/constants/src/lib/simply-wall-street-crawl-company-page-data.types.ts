/* eslint-disable @typescript-eslint/no-explicit-any */
export type SwsCrawlCompanyData = {
  data: SwsCrawlCompanyDataData;
};

export type SwsCrawlCompanyDataData = {
  id: number;
  company_id: string;
  company_status: number;
  trading_item_id: number;
  trading_item_status: number;
  name: string;
  slug: string;
  exchange_symbol: ExchangeSymbol;
  ticker_symbol: string;
  unique_symbol: string;
  primary_ticker: boolean;
  last_updated: number;
  canonical_url: string;
  primary_canonical_url: string;
  is_searchable: boolean;
  isin_symbol: string;
  active: boolean;
  classification_status: string;
  analysis: PurpleAnalysis;
  info: Info;
  score: Score;
};

export type PurpleAnalysis = {
  data: AnalysisData;
};

export type AnalysisData = {
  id: string;
  share_price: number;
  market_cap: number;
  intrinsic_discount: number | null;
  pe: number;
  pb: number;
  peg: number | null;
  preferred_multiple: string;
  preferred_multiple_reason: string;
  preferred_multiple_secondary: string;
  preferred_relative_multiple_average_peer_value: number;
  justified_preferred_multiple_ratio: number | null;
  roe: number;
  roa: number;
  eps: number;
  debt_equity: number;
  dividend: PurpleDividend;
  future: DataFuture;
  past: FluffyPast;
  analyst_count: number | null;
  insider_buying: number | null;
  show_new_valuation: boolean;
  show_analyst_price_target: boolean;
  show_new_apt_calc: boolean;
  extended: Extended;
};

export type PurpleDividend = {
  current: number;
  future: number | null;
  upcoming: boolean;
  ex_date: null;
};

export type Extended = {
  data: ExtendedData;
};

export type ExtendedData = {
  id: string;
  analysis: FluffyAnalysis;
  statements: any[] | StatementsClass;
  scores: Scores;
  industry_averages: IndustryAverages;
  raw_data: RawData;
};

export type FluffyAnalysis = {
  dividend: AnalysisDividend;
  future: AnalysisFuture;
  health: AnalysisHealth;
  management: AnalysisManagement;
  misc: AnalysisMisc;
  past: AnalysisPast;
  value: AnalysisValue;
};

export type AnalysisDividend = {
  dividend_yield: number;
  dividend_yield_future: number | null;
  dividend_volatility: boolean | null;
  dividend_paying_years: number;
  payout_ratio: number;
  payout_ratio_3y: number | null;
  historical_dividend_yield: { [key: string]: number };
  historical_dividend_payments: { [key: string]: number };
  merged_future_dividends_per_share: any[] | { [key: string]: number };
  merged_future_yield: any[] | { [key: string]: number };
  upcoming_dividend: any[];
  dividend_yield_growth_annual: number | null;
  first_payment: number | null;
  last_payment: number | null;
  industry_analysis: any[];
  buyback_yield: number;
  total_shareholder_yield: number;
  payout_ratio_median_3yr: number | null;
  dividend_payments_growth_annual: number | null;
  dividend_payments_single_growth_1y: number | null;
  dividend_payments_single_growth_3y: number | null;
  dividend_payments_single_growth_5y: number | null;
  dividend_payments_ltm: number | null;
  payout_ratio_history: { [key: string]: number };
  cash_payout_ratio: number;
};

export type AnalysisFuture = {
  return_on_equity_1y: number | null;
  return_on_equity_3y: number | null;
  earnings_per_share_growth_1y: number | null;
  earnings_per_share_growth_3y: number | null;
  earnings_per_share_1y: number | null;
  earnings_per_share_2y: number | null;
  earnings_per_share_3y: number | null;
  revenue_growth_1y: number | null;
  revenue_growth_2y: number | null;
  revenue_growth_3y: number | null;
  revenue_1y: number | null;
  revenue_2y: number | null;
  revenue_3y: number | null;
  cash_ops_growth_1y: number | null;
  cash_ops_growth_2y: number | null;
  cash_ops_growth_3y: null;
  cash_ops_1y: number | null;
  cash_ops_2y: number | null;
  cash_ops_3y: null;
  net_income_growth_1y: number | null;
  net_income_growth_2y: number | null;
  net_income_growth_3y: number | null;
  net_income_1y: number | null;
  net_income_2y: number | null;
  net_income_3y: number | null;
  minimum_earnings_growth: number;
  merged_future_earnings_per_share: any[] | { [key: string]: number };
  merged_future_earnings_per_share_high: any[] | { [key: string]: number };
  merged_future_earnings_per_share_low: any[] | { [key: string]: number };
  merged_future_revenue: any[] | { [key: string]: number };
  merged_future_cash_operations: any[] | { [key: string]: number };
  merged_future_net_income: any[] | { [key: string]: number };
  earnings_per_share_growth_annual: number | null;
  revenue_growth_annual: number | null;
  cash_ops_growth_annual: number | null;
  net_income_growth_annual: number | null;
  industry_analysis: any[];
  merged_future_ebitda: any[] | { [key: string]: number };
  ebitda_1y: number | null;
  ebitda_growth_1y: number | null;
  forward_pe_1y: number | null;
  forward_price_to_sales_1y: number | null;
  forward_ev_to_ebitda_1y: number | null;
  forward_ev_to_sales_1y: number | null;
  gross_profit_margin_1y: number | null;
  net_income_margin_1y: number | null;
  merged_future_revenue_high: any[] | { [key: string]: number };
  merged_future_revenue_low: any[] | { [key: string]: number };
  merged_future_net_income_high: any[] | { [key: string]: number };
  merged_future_net_income_low: any[] | { [key: string]: number };
  next_earnings_release: null;
  last_revenue_estimate_confirmed: number | null;
  last_net_income_estimate_confirmed: number | null;
};

export type AnalysisHealth = {
  net_income: number;
  net_interest_expense: number;
  cash_operating: number;
  total_assets: number;
  ppe: number;
  inventory: number | null;
  cash_st_investments: number;
  receivables: number;
  current_assets: number;
  total_equity: number;
  total_debt: number;
  long_term_debt: number | null;
  long_term_liab: number;
  accounts_payable: number;
  total_current_liab: number;
  total_liab_equity: number;
  total_debt_equity: number;
  total_inventory: number | null;
  debt_to_equity_ratio: number;
  debt_to_equity_ratio_past: number | null;
  net_debt_to_equity: number;
  assets_equity_ratio: number;
  fixed_to_total_assets: number;
  current_assets_to_total_debt: number | null;
  operating_cash_flow_to_total_debt: number | null;
  net_interest_cover: number | null;
  current_solvency_ratio: number;
  current_assets_to_long_term_liab: number;
  operating_expenses: number;
  operating_expenses_total: { [key: string]: number };
  operating_expenses_growth_annual: number | null;
  operating_expenses_stable_years: number | null;
  operating_expenses_growth_years: number | null;
  median_2yr_net_income: number;
  industry_analysis: any[] | { [key: string]: number | null };
  capex: number | null;
  capex_growth_1y: number | null;
  capex_growth_annual: number | null;
  net_debt: number;
  management_rate_return: number;
  book_value_per_share: number;
  levered_free_cash_flow: number;
  levered_free_cash_flow_1y: number;
  levered_free_cash_flow_2y: number;
  levered_free_cash_flow_history: { [key: string]: number };
  levered_free_cash_growth_annual: null;
  levered_free_cash_flow_growth_annual: number;
  levered_free_cash_flow_growth_years: number | null;
  levered_free_cash_flow_stable_years: number | null;
  cash_from_investing: number;
  net_debt_to_ebitda: number | null;
  capitalisation_percent: number;
  capitalisation_percent_1y: number;
  cash_operating_growth_1y: number;
  cash_from_investing_1y: number;
  inventory_growth_1y: number | null;
  net_operating_assets: number | null;
  net_operating_assets_1y: number | null;
  aggregate_accruals: number | null;
  accounts_receivable_growth_1y: number;
  accounts_receivable_percent: number;
  long_term_assets: number;
  last_balance_sheet_update: number;
  total_debt_history: { [key: string]: number };
  current_portion_lease_liabilities: number | null;
  long_term_portion_lease_liabilities: number | null;
  total_lease_liabilities: number;
  restricted_cash: number | null;
  restricted_cash_ratio: number | null;
  levered_free_cash_flow_break_even_years: number | null;
  net_operating_assets_ltm_history: NetOperatingAssetsLtmHistory;
  aggregate_accruals_ltm_history: AggregateAccrualsLtmHistory;
  accrual_ratio_from_cashflow_ltm_history: AccrualRatioFromCashflowLtmHistory;
  total_assets_ltm_history: LtmHistory;
  total_current_liab_ltm_history: LtmHistory;
};

export type AccrualRatioFromCashflowLtmHistory = {
  '0': number;
  '-1': number;
  '-2': number;
};

export type AggregateAccrualsLtmHistory = {
  '0': number;
  '-1': number;
  '-2': number;
  '-3': number | null;
};

export type NetOperatingAssetsLtmHistory = {
  '0': number;
  '-1': number;
  '-2': number;
  '-3': number;
};

export type LtmHistory = {
  '0': number;
  '-1': number;
  '-2': number;
  '-3': number | null;
  '-4': number | null;
  '-5': number | null;
};

export type AnalysisManagement = {
  management_tenure: number | null;
  board_tenure: number;
  management_age: number;
  board_age: number;
  insider_buying_ratio: number | null;
  total_shares_bought: number;
  total_shares_sold: number;
  total_employees: number | null;
  ceo_compensation: any[];
  ceo_salary_growth_1y: null;
  industry_analysis: any[];
  ceo_salary_growth_annual: null;
  ceo_compensation_total: null;
  ceo_compensation_salary: null;
  ceo_compensation_salary_usd: null;
  ceo_compensation_total_usd: null;
  ceo_compensation_salary_history: any[];
  ceo_salary_fraction: null;
  total_board_members_count: number;
  independent_board_members_count: number;
  independent_board_members_ratio: number;
};

export type AnalysisMisc = {
  min_price: number;
  max_price: number;
  min_price_52w: number;
  max_price_52w: number;
  price_spread: number;
  is_volatile: boolean;
  analyst_count: number | null;
  is_fund: boolean;
  industry_analysis: any[];
  days_since_last_trade: number;
  shares_outstanding_single_growth_1y: number | null;
  shares_outstanding_single_growth_5y: number | null;
  daily_return_standard_deviation_90d: number;
  daily_return_standard_deviation_1y: number;
};

export type AnalysisPast = {
  revenue: number;
  revenue_usd: number;
  revenue_ltm_history: ELtmHistory;
  operating_revenue: number;
  net_income: number;
  net_income_usd: number;
  net_income_ltm_history: ELtmHistory;
  earnings_per_share: number;
  earnings_per_share_ltm_history: ELtmHistory;
  earnings_per_share_1y: number;
  earnings_per_share_3y: number | null;
  earnings_per_share_5y: number | null;
  earnings_per_share_5y_avg: number;
  ebt_excluding: number;
  earnings_continued_ops: number;
  total_assets: number;
  total_equity: number;
  current_liabilities: number;
  return_on_equity: number;
  return_on_assets: number;
  return_on_capital_employed: number;
  return_on_capital_employed_past: number | null;
  return_on_capital_growth: number | null;
  earnings_per_share_growth_1y: number;
  earnings_per_share_growth_3y: number;
  earnings_per_share_growth_5y: number | null;
  net_income_1y: number;
  net_income_2y: number;
  net_income_3y: number | null;
  net_income_4y: number | null;
  net_income_5y: number | null;
  net_income_5y_avg: number;
  net_income_growth_1y: number;
  net_income_growth_3y: number;
  net_income_growth_5y: number | null;
  revenue_growth_1y: number;
  revenue_growth_3y: number;
  revenue_growth_5y: number | null;
  days_since_last_update: number;
  last_earnings_update: number;
  last_earnings_update_annual: number;
  industry_analysis: IndustryAnalysisClass;
  ebit: number;
  ebit_ltm_history: LtmHistory;
  ebit_3y_avg: number;
  ebit_5y_avg: number;
  ebit_single_growth_1y: number | null;
  ebit_single_growth_3y: number | null;
  ebit_single_growth_5y: number | null;
  ebit_margin_1y: number;
  ebit_margin: number;
  ebitda: number | null;
  ebitda_margin: number | null;
  gross_profit_margin: number;
  last_filing_date: number;
  net_income_single_growth_3y: number | null;
  net_income_single_growth_5y: number | null;
  earnings_per_share_single_growth_3y: number | null;
  earnings_per_share_single_growth_5y: number | null;
  gross_profit_margin_1y: number;
  net_income_margin: number;
  net_income_margin_1y: number;
  change_in_unearned_revenue: number | null;
  unearned_revenue_percent_of_sales: number;
  ebt_including: number;
  unusual_items: number;
  unusual_item_ratio: number;
  operating_revenue_percent: number;
  years_profitable: number;
  trading_since_years: number;
  non_operating_revenue: number | null;
  non_operating_revenue_ratio: number | null;
  non_operating_revenue_ratio_1y: number | null;
  non_operating_revenue_ratio_delta: number | null;
  income_tax_to_ebit_ratio: number;
  capital_employed_ltm_history: LtmHistory;
  return_on_capital_employed_ltm_history: LtmHistory;
  latest_fiscal_year: number;
  latest_fiscal_quarter: number;
  business_revenue_segments: { [key: string]: number };
  geographic_revenue_segments: GeographicRevenueSegments;
  selling_general_admin_expense: number;
  research_development_expense: number | null;
  sales_marketing_expense: number | null;
  stock_based_compensation: number | null;
  depreciation_amortization: number | null;
  general_admin_expense: number;
  non_operating_expense: number;
  last_processed_filing_date: number | null;
  last_company_filing_date: number | null;
  last_announced_date: number | null;
  latest_filing_processed: boolean | null;
};

export type ELtmHistory = {
  '0': number;
  '-1': number;
  '-2': number;
  '-3': number | null;
  '-4': number | null;
  '-5': number | null;
  '-6': number | null;
  '-7': number | null;
  '-8': number | null;
  '-9': number | null;
  '-10': number | null;
};

export type GeographicRevenueSegments = {
  Japan?: number;
  Europe?: number;
  America?: number;
  'Rest of Asia/Others'?: number;
  Philippines?: number;
  Foreign?: number;
  Others?: number;
  Eliminations?: number;
  'United States'?: number;
};

export type IndustryAnalysisClass = {
  d_a_expense: number | null;
  r_d_expense: number | null;
  non_op_expense: number;
  sales_marketing: number | null;
  revenue_segments: { [key: string]: number };
  stock_based_comp: number | null;
  general_administrative: number;
  selling_general_admin_expenses: number;
};

export type AnalysisValue = {
  pe: number;
  pb: number;
  peg: number | null;
  beta_5y: number | null;
  beta_5y_unlevered: number | null;
  intrinsic_discount: number | null;
  npv_per_share: number | null;
  earnings_per_share_growth_1y: null;
  merged_future_earnings_per_share: any[];
  intrinsic_value: IntrinsicValue;
  industry_analysis: any[];
  market_cap_usd: number;
  market_cap: number;
  market_cap_band: string;
  last_share_price: number;
  price_to_sales: number;
  ev_to_sales: number;
  ev_to_ebitda: number | null;
  return_1d: number;
  return_7d: number;
  return_30d: number;
  return_90d: number;
  return_ytd: number;
  return_1yr_abs: number | null;
  return_3yr_abs: number | null;
  return_5yr_abs: number | null;
  return_7d_total_return: number;
  return_30d_total_return: number;
  return_90d_total_return: number;
  return_ytd_total_return: number;
  return_1yr_total_return: number | null;
  return_3yr_total_return: number | null;
  return_5yr_total_return: number | null;
  return_since_ipo_abs: number;
  price_target: number | null;
  price_target_low: number | null;
  price_target_high: number | null;
  price_target_analyst_count: number;
  market_cap_movement_1d: number;
  market_cap_movement_usd_1d: number;
  market_cap_movement_7d: number;
  market_cap_movement_usd_7d: number;
  market_cap_movement_30d: number;
  market_cap_movement_usd_30d: number;
  market_cap_movement_90d: number;
  market_cap_movement_usd_90d: number;
  market_cap_movement_1y: number | null;
  market_cap_movement_usd_1y: number | null;
  market_cap_movement_3y: number | null;
  market_cap_movement_usd_3y: number | null;
  market_cap_movement_5y: number | null;
  market_cap_movement_usd_5y: number | null;
};

export type IntrinsicValue = {
  de: number;
  iso: Country;
  npv: number;
  REIT: null;
  pvtv: number;
  model: string;
  pv_5y: number;
  tax_rate: number;
  asset_based: null;
  levered_beta: number;
  adr_per_share: number;
  npv_per_share: number;
  two_stage_fcf: TwoStageFcf;
  cost_of_equity: number;
  equity_premium: number;
  excess_returns: null;
  risk_free_rate: number;
  terminal_value: number;
  unlevered_beta: number;
  dividend_discount: DividendDiscount;
  intrinsic_discount: number | null;
  levered_beta_actual: number;
  npv_per_share_reported_currency?: number;
};

export type DividendDiscount = {
  dps: number | null;
  roe: number | null;
  payout: number | null;
  ddm_growth: number | null;
  ddm_source: null | string;
  expected_growth: number | null;
};

export enum Country {
  Ph = 'PH',
  Us = 'US',
}

export type TwoStageFcf = {
  scale: ReportingUnitText;
  fcf_ltm: number;
  fcf_data: any[] | { [key: string]: number };
  fcf_count: any[] | { [key: string]: number };
  first_stage: { [key: string]: FirstStage };
  scale_numeric: number;
  growth_cagr_5y: number;
  shares_outstanding: number;
  capital_to_revenue_ratio_3yr_avg: number;
  combined_free_cash_flow_time_series: { [key: string]: number };
  annualized_adjust_free_cash_flow_time_series: { [key: string]: number };
};

export type FirstStage = {
  data: number;
  source: string;
  discounted: number;
};

export enum ReportingUnitText {
  Absolute = 'Absolute',
  Millions = 'Millions',
}

export type IndustryAverages = {
  industryId: number;
  countryIso: string;
  name: string;
  valueScore: number;
  dividendsScore: number;
  futurePerformanceScore: number;
  healthScore: number;
  pastPerformanceScore: number;
  totalScore: number;
  sharePrice: number;
  marketCap: number;
  intrinsicDiscount: number;
  analystCount: number;
  PE: number;
  PB: number;
  PEG: number;
  futureOneYearGrowth: number;
  futureThreeYearGrowth: number;
  futureOneYearROE: null;
  futureThreeYearROE: null;
  pastOneYearGrowth: number;
  pastFiveYearGrowth: number;
  ROE: number;
  ROA: number;
  dividendYield: number;
  futureDividendYield: number;
  payoutRatio: null;
  EPS: number;
  insiderBuying: number;
  debtEquity: number;
  leveredBeta: number;
  unleveredBeta: number;
  totalBaseCount: number;
  profitableCount: number;
  analystCoverageCount: number;
  dividendCount: number;
  betaCount: number;
  earningsPerShareGrowthAnnual: number;
  netIncomeGrowthAnnual: number;
  cashOpsGrowthAnnual: number;
  revenueGrowthAnnual: number;
  leveredBetaMedian: number;
  baseSource: string;
  profitableSource: string;
  analystSource: string;
  dividendSource: string;
  betaSource: string;
  all: All;
};

export type All = {
  industryId: number;
  countryIso: Country;
  name: string;
  valueScore: number;
  dividendsScore: number;
  futurePerformanceScore: number;
  healthScore: number;
  pastPerformanceScore: number;
  totalScore: number;
  sharePrice: number;
  marketCap: number;
  intrinsicDiscount: number;
  analystCount: number;
  PE: number;
  PB: number;
  PEG: number;
  futureOneYearGrowth: number;
  futureThreeYearGrowth: number;
  futureOneYearROE: null;
  futureThreeYearROE: null;
  pastOneYearGrowth: number;
  pastFiveYearGrowth: number;
  ROE: number;
  ROA: number;
  dividendYield: number;
  futureDividendYield: number;
  payoutRatio: null;
  EPS: number;
  insiderBuying: number;
  debtEquity: number;
  leveredBeta: number;
  unleveredBeta: number;
  totalBaseCount: number;
  profitableCount: number;
  analystCoverageCount: number;
  dividendCount: number;
  betaCount: number;
  earningsPerShareGrowthAnnual: number;
  netIncomeGrowthAnnual: number;
  cashOpsGrowthAnnual: number;
  revenueGrowthAnnual: number;
  leveredBetaMedian: number;
};

export type RawData = {
  data: RawDataData;
};

export type RawDataData = {
  company_info: CompanyInfo;
  market_cap: MarketCap;
  listings: { [key: string]: Listing };
  prices: Prices;
  dividend: FluffyDividend;
  past: { [key: string]: { [key: string]: PurplePast } };
  estimates: any[] | { [key: string]: Estimate };
  members: Members;
  insider_trading: InsiderTrading;
  ownership: { [key: string]: Ownership };
  currency_info: CurrencyInfo;
  industries: Industries;
  insider_transactions: InsiderTransactions;
};

export type CompanyInfo = {
  url: string;
  city: string;
  name: string;
  type: string;
  state: null;
  address: string;
  country: string;
  is_fund: boolean;
  address2: string;
  zip_code: number | null;
  company_id: number;
  short_name: string;
  country_iso: Country;
  description: string;
  isin_symbol: string;
  status_type: string;
  year_founded: number | null;
  ticker_symbol: string;
  unique_symbol: string;
  exchange_symbol: ExchangeSymbol;
  trading_item_id: number;
  short_description: string;
  short_name_plural: string;
  exchange_symbol_filtered: ExchangeSymbol;
};

export enum ExchangeSymbol {
  Otcpk = 'OTCPK',
  Pse = 'PSE',
}

export type CurrencyInfo = {
  reporting_unit: number;
  reporting_unit_abs: number;
  reporting_unit_text: ReportingUnitText;
  reporting_currency_iso: Currency;
  reporting_unit_text_abs: ReportingUnitText;
  reporting_currency_symbol: CurrencySymbol;
  trading_item_currency_iso: Currency;
  trading_item_currency_symbol: CurrencySymbol;
  primary_trading_item_currency_iso: Currency;
  primary_trading_item_currency_symbol: CurrencySymbol;
};

export enum Currency {
  PHP = 'PHP',
  Usd = 'USD',
}

export enum CurrencySymbol {
  CurrencySymbol = '$',
  Empty = '₱',
}

export type FluffyDividend = {
  next: null;
  past: any[] | { [key: string]: PastPast };
  chain: { [key: string]: Chain };
};

export type Chain = {
  date: number;
  days: number;
  value: number | null;
  end_date: number;
  avg_yield: number;
  raw_value: number;
};

export type PastPast = {
  date: number;
  amount: number;
  pay_date: number;
  record_date: number;
  currency_iso: Currency;
  split_adjusted_amount: number;
  reporting_currency_amount: number;
};

export type Estimate = {
  ni_est?: NIEst;
  fcf_est?: FcfEst;
  nav_est?: NavEst;
  ebitda_est?: EbitdaEst;
  ni_num_est?: NINumEst;
  est_act_rev?: EstActRev;
  fcf_num_est?: FcfNumEst;
  nav_num_est?: NavNumEst;
  revenue_est?: RevenueEst;
  bv_share_est?: BvShareEst;
  eps_norm_est?: EpsNormEst;
  cash_oper_est?: CashOperEst;
  est_act_ebitda?: EstActEbitda;
  ni_reported_est?: NIReportedEst;
  revenue_low_est?: RevenueLowEst;
  revenue_num_est?: RevenueNumEst;
  bv_share_num_est?: BvShareNumEst;
  eps_norm_num_est?: EpsNormNumEst;
  eps_reported_est?: EpsReportedEst;
  gross_margin_est?: GrossMarginEst;
  revenue_high_est?: RevenueHighEst;
  cash_oper_num_est?: CashOperNumEst;
  return_equity_est?: ReturnEquityEst;
  est_act_ni_reported?: EstActNIReported;
  ni_reported_low_est?: NIReportedLowEst;
  ni_reported_num_est?: NIReportedNumEst;
  eps_reported_low_est?: EpsReportedLowEst;
  eps_reported_num_est?: EpsReportedNumEst;
  est_act_eps_reported?: EstActEpsReported;
  ni_reported_high_est?: NIReportedHighEst;
  eps_reported_high_est?: EpsReportedHighEst;
  return_equity_num_est?: ReturnEquityNumEst;
  dps_est?: DpsEst;
  dps_num_est?: DpsNumEst;
  price_target_est?: PriceTargetEst;
  price_target_low_est?: PriceTargetEst;
  price_target_num_est?: TNumEst;
  price_target_std_est?: PriceTargetEst;
  price_target_high_est?: PriceTargetEst;
  ffo_adj_reit_est?: FfoAdjReitEst;
  ffo_adj_reit_num_est?: TNumEst;
};

export type BvShareEst = {
  id: BvShareEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum BvShareEstID {
  BvShareEst = 'BV_SHARE_EST',
}

export type BvShareNumEst = {
  id: BvShareNumEstID;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum BvShareNumEstID {
  BvShareNumEst = 'BV_SHARE_NUM_EST',
}

export type CashOperEst = {
  id: CashOperEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum CashOperEstID {
  CashOperEst = 'CASH_OPER_EST',
}

export type CashOperNumEst = {
  id: CashOperNumEstID;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum CashOperNumEstID {
  CashOperNumEst = 'CASH_OPER_NUM_EST',
}

export type DpsEst = {
  id: DpsEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum DpsEstID {
  DpsEst = 'DPS_EST',
}

export type DpsNumEst = {
  id: DpsNumEstID;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum DpsNumEstID {
  DpsNumEst = 'DPS_NUM_EST',
}

export type EbitdaEst = {
  id: EbitdaEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum EbitdaEstID {
  EbitdaEst = 'EBITDA_EST',
}

export type EpsNormEst = {
  id: EpsNormEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum EpsNormEstID {
  EpsNormEst = 'EPS_NORM_EST',
}

export type EpsNormNumEst = {
  id: EpsNormNumEstID;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum EpsNormNumEstID {
  EpsNormNumEst = 'EPS_NORM_NUM_EST',
}

export type EpsReportedEst = {
  id: EpsReportedEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum EpsReportedEstID {
  EpsReportedEst = 'EPS_REPORTED_EST',
}

export type EpsReportedHighEst = {
  id: EpsReportedHighEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum EpsReportedHighEstID {
  EpsReportedHighEst = 'EPS_REPORTED_HIGH_EST',
}

export type EpsReportedLowEst = {
  id: EpsReportedLowEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum EpsReportedLowEstID {
  EpsReportedLowEst = 'EPS_REPORTED_LOW_EST',
}

export type EpsReportedNumEst = {
  id: EpsReportedNumEstID;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum EpsReportedNumEstID {
  EpsReportedNumEst = 'EPS_REPORTED_NUM_EST',
}

export type EstActEbitda = {
  id: EstActEbitdaID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum EstActEbitdaID {
  EstActEbitda = 'EST_ACT_EBITDA',
}

export type EstActEpsReported = {
  id: EstActEpsReportedID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum EstActEpsReportedID {
  EstActEpsReported = 'EST_ACT_EPS_REPORTED',
}

export type EstActNIReported = {
  id: EstActNIReportedID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum EstActNIReportedID {
  EstActNIReported = 'EST_ACT_NI_REPORTED',
}

export type EstActRev = {
  id: EstActRevID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum EstActRevID {
  EstActRev = 'EST_ACT_REV',
}

export type FcfEst = {
  id: FcfEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum FcfEstID {
  FcfEst = 'FCF_EST',
}

export type FcfNumEst = {
  id: FcfNumEstID;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum FcfNumEstID {
  FcfNumEst = 'FCF_NUM_EST',
}

export type FfoAdjReitEst = {
  id: string;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export type TNumEst = {
  id: string;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export type GrossMarginEst = {
  id: GrossMarginEstID;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum GrossMarginEstID {
  GrossMarginEst = 'GROSS_MARGIN_EST',
}

export type NavEst = {
  id: NavEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum NavEstID {
  NavEst = 'NAV_EST',
}

export type NavNumEst = {
  id: NavNumEstID;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum NavNumEstID {
  NavNumEst = 'NAV_NUM_EST',
}

export type NIEst = {
  id: NIEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum NIEstID {
  NIEst = 'NI_EST',
}

export type NINumEst = {
  id: NINumEstID;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum NINumEstID {
  NINumEst = 'NI_NUM_EST',
}

export type NIReportedEst = {
  id: NIReportedEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum NIReportedEstID {
  NIReportedEst = 'NI_REPORTED_EST',
}

export type NIReportedHighEst = {
  id: NIReportedHighEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum NIReportedHighEstID {
  NIReportedHighEst = 'NI_REPORTED_HIGH_EST',
}

export type NIReportedLowEst = {
  id: NIReportedLowEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum NIReportedLowEstID {
  NIReportedLowEst = 'NI_REPORTED_LOW_EST',
}

export type NIReportedNumEst = {
  id: NIReportedNumEstID;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum NIReportedNumEstID {
  NIReportedNumEst = 'NI_REPORTED_NUM_EST',
}

export type PriceTargetEst = {
  id: string;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export type ReturnEquityEst = {
  id: ReturnEquityEstID;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum ReturnEquityEstID {
  ReturnEquityEst = 'RETURN_EQUITY_EST',
}

export type ReturnEquityNumEst = {
  id: ReturnEquityNumEstID;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum ReturnEquityNumEstID {
  ReturnEquityNumEst = 'RETURN_EQUITY_NUM_EST',
}

export type RevenueEst = {
  id: RevenueEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum RevenueEstID {
  RevenueEst = 'REVENUE_EST',
}

export type RevenueHighEst = {
  id: RevenueHighEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum RevenueHighEstID {
  RevenueHighEst = 'REVENUE_HIGH_EST',
}

export type RevenueLowEst = {
  id: RevenueLowEstID;
  unit: ReportingUnitText;
  value: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum RevenueLowEstID {
  RevenueLowEst = 'REVENUE_LOW_EST',
}

export type RevenueNumEst = {
  id: RevenueNumEstID;
  unit: ReportingUnitText;
  value: number;
  currency: null;
  end_date: number;
  unit_numeric: number;
  effective_date: number;
};

export enum RevenueNumEstID {
  RevenueNumEst = 'REVENUE_NUM_EST',
}

export type Industries = {
  sector: Primary;
  primary: Primary;
  tertiary: Tertiary;
  secondary: Primary;
};

export type Primary = {
  sic: null;
  name: string;
  level: number;
  sic_name: string;
  sub_type_id: number;
};

export type Tertiary = {
  sic: number | null;
  name: string;
  level: number;
  sic_name: string;
  sub_type_id: number;
};

export type InsiderTrading = {
  '1': The1;
  '2': The1;
  '3': The3;
  '4': The4;
  total_buy: number;
  total_sell: number;
  total_volume: number;
};

export type The1 = {
  buy: The1_Buy;
  sell: Sell;
};

export type The1_Buy = {
  avg_price: number;
  month_diff: number;
  trade_type: TraType;
  security_id: number;
  total_shares: number;
  total_trades: number;
  company_names: any[];
  unique_owners: number;
  individual_ids: number[];
  individual_names: string[];
  total_trans_value: number;
  total_company_shares: number;
  total_individual_shares: number;
};

export enum TraType {
  Buy = 'Buy',
  Sell = 'Sell',
}

export type Sell = {
  avg_price: number;
  month_diff: number;
  trade_type: TraType;
  security_id: number;
  total_shares: number;
  total_trades: number;
  company_names: any[];
  unique_owners: number;
  individual_ids: any[];
  individual_names: any[];
  total_trans_value: number;
  total_company_shares: number;
  total_individual_shares: number;
};

export type The3 = {
  buy: The3_Buy;
  sell: The3_Buy;
};

export type The3_Buy = {
  avg_price: number;
  month_diff: number;
  trade_type: TraType;
  security_id: number;
  total_shares: number;
  total_trades: number;
  company_names: string[];
  unique_owners: number;
  individual_ids: number[];
  individual_names: string[];
  total_trans_value: number;
  total_company_shares: number;
  total_individual_shares: number;
};

export type The4 = {
  buy: The1_Buy;
  sell: The1_Buy;
};

export type InsiderTransactions = {
  data: Datum[];
};

export type Datum = {
  transaction_id: number;
  transaction_type: TraType;
  transaction_type_id: number;
  transaction_type_description: TransactionTypeDescription;
  owner_object_id: number;
  owner_name: string;
  owner_type: OwnerType;
  management_insider: boolean;
  trade_date_min: number;
  trade_date_max: number;
  shares: number;
  price_min: number;
  price_max: number;
  transaction_value: number;
  percentage_shares_traded: number;
  percentage_change_trans_shares: number | null;
  filing_end_shares: number;
  filing_date: number;
  month_diff: number;
};

export enum OwnerType {
  Company = 'Company',
  Individual = 'Individual',
}

export enum TransactionTypeDescription {
  OpenMarketAcquisition = 'Open Market Acquisition',
  OpenMarketDisposition = 'Open Market Disposition',
}

export type Listing = {
  start_date: number;
  security_id: number;
  currency_iso: Currency;
  canonical_url: string;
  exchange_name: ExchangeName;
  security_name: string;
  ticker_symbol: string;
  major_currency: boolean;
  currency_symbol: CurrencySymbol;
  exchange_symbol: ExchangeSymbol;
  trading_item_id: number;
  primary_security: boolean;
  security_type_id: number;
  exchange_country_iso: Country;
  primary_trading_item: boolean;
  exchange_currency_iso: Currency;
  exchange_country_iso_3: ExchangeCountryISO3;
  exchange_currency_symbol: CurrencySymbol;
  exchange_importance_level: number;
};

export enum ExchangeCountryISO3 {
  Phl = 'PHL',
  Usa = 'USA',
}

export enum ExchangeName {
  PhilippinesStockExchange = 'Philippines Stock Exchange',
  PinkSheetsLLC = 'Pink Sheets LLC',
}

export type MarketCap = {
  usd: number;
  listing: number;
  primary: number;
  reported: number;
  market_cap_band: string;
  shares_outstanding: number;
  original_market_cap: null;
  trading_item_to_primary_ratio: number;
  total_enterprise_value_reported: number;
  shares_outstanding_common_equity: number;
  relative_listing_shares_outstanding: number;
};

export type Members = {
  board: { [key: string]: Board };
  leader: Leader;
  management: { [key: string]: ManagementValue };
};

export type Board = {
  id: number;
  age: number;
  rank: number;
  title: string;
  prefix: Prefix;
  pro_id: number;
  suffix: null | string;
  tenure: number | null;
  key_exec: boolean;
  only_one: boolean;
  pro_rank: number | null;
  biography: string;
  last_name: string;
  pro_title: ProTitle;
  specialty: null;
  year_born: number;
  board_flag: boolean;
  board_rank: number;
  first_name: string;
  pro_member: boolean;
  salutation: string;
  start_date: number | null;
  middle_name: null | string;
  shares_held: number | null;
  short_title: string;
  board_member: boolean;
  compensation: number | null;
  holding_date: number | null;
  options_held: number | null;
  top_key_exec: boolean;
  shares_changed: number | null;
  rank_shares_held: number | null;
  rank_shares_sold: null;
  rank_shares_bought: number | null;
  percent_shares_changed: number | null;
  compensation_currency_iso?: Currency;
  percent_of_shares_outstanding: number | null;
  currency_id?: null;
};

export enum Prefix {
  Attorney = 'Attorney',
  DR = 'Dr.',
  Engineer = 'Engineer',
  Justice = 'Justice',
  MS = 'Ms.',
  Mr = 'Mr.',
  Prof = 'Prof.',
}

export enum ProTitle {
  ChairmanEmeritus = 'Chairman Emeritus',
  ChairmanOfTheBoard = 'Chairman of the Board',
  LeadDirector = 'Lead Director',
  MemberOfAdvisoryBoard = 'Member of Advisory Board',
  MemberOfTheBoardOfDirectors = 'Member of the Board of Directors',
  ViceChairman = 'Vice Chairman',
}

export type Leader = {
  id: number;
  age: number;
  rank: number;
  title: string;
  prefix: Prefix;
  pro_id: number;
  suffix: null;
  tenure: number | null;
  key_exec: boolean;
  only_one: boolean;
  pro_rank: number;
  biography: string;
  last_name: string;
  pro_title: string;
  specialty: null;
  year_born: number;
  board_flag: boolean;
  board_rank: number;
  first_name: string;
  pro_member: boolean;
  salutation: string;
  start_date: number | null;
  currency_id: null;
  middle_name: string;
  shares_held: number;
  short_title: string;
  board_member: boolean;
  compensation: null;
  holding_date: number;
  options_held: number;
  top_key_exec: boolean;
  compensations: any[];
  shares_changed: number;
  rank_shares_held: number | null;
  rank_shares_sold: null;
  rank_shares_bought: null;
  percent_shares_changed: number;
  percent_of_shares_outstanding: number;
};

export type ManagementValue = {
  id: number;
  age: number | null;
  rank: number;
  title: string;
  prefix: Prefix | null;
  pro_id: number;
  suffix: null | string;
  tenure: number | null;
  key_exec: boolean;
  only_one: boolean;
  pro_rank: number;
  biography: string;
  last_name: string;
  pro_title: string;
  specialty: null;
  year_born: number | null;
  board_flag: boolean;
  board_rank: number | null;
  first_name: string;
  pro_member: boolean;
  salutation: string;
  start_date: number | null;
  currency_id: null;
  middle_name: null | string;
  shares_held: number | null;
  short_title: string;
  board_member: boolean;
  compensation: null;
  holding_date: number | null;
  options_held: number | null;
  top_key_exec: boolean;
  shares_changed: number | null;
  rank_shares_held: number | null;
  rank_shares_sold: number | null;
  rank_shares_bought: number | null;
  percent_shares_changed: number | null;
  percent_of_shares_outstanding: number | null;
};

export type Ownership = {
  shares_held: number;
  owner_type_id: number;
  owner_type_name: string;
  owned_company_id: number;
};

export type PurplePast = {
  id: PastID;
  unit: ReportingUnitText;
  year: number;
  value: number;
  latest: boolean;
  quarter: number;
  type_id: number;
  currency: Currency;
  end_date: number;
  unit_numeric: number;
};

export enum PastID {
  AccountsReceivable = 'ACCOUNTS_RECEIVABLE',
  AccruedExpenses = 'ACCRUED_EXPENSES',
  Ap = 'AP',
  AssetWritedownCF = 'ASSET_WRITEDOWN_CF',
  BasicEps = 'BASIC_EPS',
  BasicWeight = 'BASIC_WEIGHT',
  Beta5Yr = 'BETA_5YR',
  BvShare = 'BV_SHARE',
  Capex = 'CAPEX',
  CapitalLeases = 'CAPITAL_LEASES',
  CashAquireCF = 'CASH_AQUIRE_CF',
  CashConversion = 'CASH_CONVERSION',
  CashEquiv = 'CASH_EQUIV',
  CashFFinancing = 'CASH_F_FINANCING',
  CashFInvesting = 'CASH_F_INVESTING',
  CashOper = 'CASH_OPER',
  CashPurchaseIntangibleAssets = 'CASH_PURCHASE_INTANGIBLE_ASSETS',
  CashStInvest = 'CASH_ST_INVEST',
  ChangeAp = 'CHANGE_AP',
  ChangeAr = 'CHANGE_AR',
  ChangeInUnearnedRevenue = 'CHANGE_IN_UNEARNED_REVENUE',
  ChangeInventory = 'CHANGE_INVENTORY',
  ChangeNetWorkingCapital = 'CHANGE_NET_WORKING_CAPITAL',
  Cogs = 'COGS',
  CommonIssued = 'COMMON_ISSUED',
  CommonRep = 'COMMON_REP',
  CommonStock = 'COMMON_STOCK',
  CurrentPortCapitalLeases = 'CURRENT_PORT_CAPITAL_LEASES',
  CurrentPortLtDebt = 'CURRENT_PORT_LT_DEBT',
  DACF = 'D_A_CF',
  DAExpense = 'D_A_EXPENSE',
  DefTaxLiab = 'DEF_TAX_LIAB',
  DivShare = 'DIV_SHARE',
  DivestCF = 'DIVEST_CF',
  EarningCo = 'EARNING_CO',
  EarningDo = 'EARNING_DO',
  Ebit = 'EBIT',
  Ebitda = 'EBITDA',
  Ebt = 'EBT',
  EbtIncl = 'EBT_INCL',
  FfoCalculated = 'FFO_CALCULATED',
  FfoGrossProfit = 'FFO_GROSS_PROFIT',
  FfoInt = 'FFO_INT',
  FfoTotalDebt = 'FFO_TOTAL_DEBT',
  GAExpense = 'G_A_EXPENSE',
  GainAssetsCF = 'GAIN_ASSETS_CF',
  GeneralAdministrative = 'GENERAL_ADMINISTRATIVE',
  Goodwill = 'GOODWILL',
  GrossProfit = 'GROSS_PROFIT',
  IncomeTax = 'INCOME_TAX',
  InterestExp = 'INTEREST_EXP',
  Inventory = 'INVENTORY',
  InvestSecurityCF = 'INVEST_SECURITY_CF',
  Isaac = 'ISAAC',
  LeveredFcf = 'LEVERED_FCF',
  LtDebt = 'LT_DEBT',
  LtInvest = 'LT_INVEST',
  MgmtRateReturn = 'MGMT_RATE_RETURN',
  NI = 'NI',
  NIAvailExcl = 'NI_AVAIL_EXCL',
  NavShareRe = 'NAV_SHARE_RE',
  NetBuybacks = 'NET_BUYBACKS',
  NetChange = 'NET_CHANGE',
  NetDebt = 'NET_DEBT',
  NetInterestExp = 'NET_INTEREST_EXP',
  NonOperatingRevenue = 'NON_OPERATING_REVENUE',
  NormEps = 'NORM_EPS',
  Nppe = 'NPPE',
  OperInc = 'OPER_INC',
  OperatingRevenue = 'OPERATING_REVENUE',
  OtherReceivable = 'OTHER_RECEIVABLE',
  PayoutRatio = 'PAYOUT_RATIO',
  Pension = 'PENSION',
  PrepaidExp = 'PREPAID_EXP',
  RDExpense = 'R_D_EXPENSE',
  RestrictedCash = 'RESTRICTED_CASH',
  RetainedEarnings = 'RETAINED_EARNINGS',
  ReturnAssets = 'RETURN_ASSETS',
  ReturnEquity = 'RETURN_EQUITY',
  SalesMarketing = 'SALES_MARKETING',
  SharesPerDR = 'SHARES_PER_DR',
  StDebt = 'ST_DEBT',
  StInvest = 'ST_INVEST',
  StockBasedCF = 'STOCK_BASED_CF',
  StockBasedComp = 'STOCK_BASED_COMP',
  TotalAssets = 'TOTAL_ASSETS',
  TotalCA = 'TOTAL_CA',
  TotalCl = 'TOTAL_CL',
  TotalCommonEquity = 'TOTAL_COMMON_EQUITY',
  TotalDebt = 'TOTAL_DEBT',
  TotalDebtEquity = 'TOTAL_DEBT_EQUITY',
  TotalDebtIssued = 'TOTAL_DEBT_ISSUED',
  TotalDebtRepaid = 'TOTAL_DEBT_REPAID',
  TotalDivPaidCF = 'TOTAL_DIV_PAID_CF',
  TotalEmployees = 'TOTAL_EMPLOYEES',
  TotalEquity = 'TOTAL_EQUITY',
  TotalIntangible = 'TOTAL_INTANGIBLE',
  TotalLiabBnk = 'TOTAL_LIAB_BNK',
  TotalLiabEquity = 'TOTAL_LIAB_EQUITY',
  TotalLiabilities = 'TOTAL_LIABILITIES',
  TotalReceiv = 'TOTAL_RECEIV',
  TotalRev = 'TOTAL_REV',
  TotalRevEmployee = 'TOTAL_REV_EMPLOYEE',
  TotalRevShare = 'TOTAL_REV_SHARE',
  TotalSharesOutstanding = 'TOTAL_SHARES_OUTSTANDING',
  TreasuryStock = 'TREASURY_STOCK',
}

export type Prices = {
  history: { [key: string]: History };
  listing: number;
  primary: number;
  return_metadata: ReturnMetadata;
  listing_currrency_primary: number;
  primary_currrency_listing: number;
  listing_currrency_reported: number;
  primary_currrency_reported: number;
};

export type History = {
  ask: number;
  bid: number;
  low: number | null;
  mid: number;
  date: number;
  open: number | null;
  close: number;
  volume: number | null;
  currency: Currency;
  adjustment_factor: number;
};

export type ReturnMetadata = {
  return_90d: Return90D;
};

export type Return90D = {
  ask: number;
  bid: number;
  low: number;
  mid: number;
  date: number;
  open: number;
  close: number;
  volume: number;
  currency: Currency;
  adjustment_factor: number;
};

export type Scores = {
  value: number;
  income: number;
  health: number;
  past: number;
  future: number;
  management: number;
  misc: number;
  total: number;
  sentence: string;
};

export type StatementsClass = {
  dividend: StatementsDividend;
  future: StatementsFuture;
  health: StatementsHealth;
  management: StatementsManagement;
  misc: StatementsMisc;
  past: StatementsPast;
  value: StatementsValue;
};

export type StatementsDividend = {
  GrowthStatement: GrowthStatement;
  PayoutStatement: PayoutStatement;
  PayoutStatement3y: PayoutStatement3Y;
  VolatilityStatement: VolatilityStatement;
  YieldLowRiskStatement: YieldLowRiskStatement;
  YieldMarketTopStatement: YieldMarketTopStatement;
};

export type GrowthStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: GrowthStatementData;
  type: string;
  latex_formula: null;
};

export type GrowthStatementData = {
  market: string;
  last_payment: number;
  first_payment: number;
  min_threshold: number;
  dividend_yield: number;
  dividend_paying_years: number;
};

export type PayoutStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: PayoutStatementData;
  type: string;
  latex_formula: null;
};

export type PayoutStatementData = {
  market: string;
  threshold: number;
  payout_ratio: number;
  min_threshold: number;
  dividend_yield: number;
  payout_ratio_inverse: number | null;
};

export type PayoutStatement3Y = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: PayoutStatement3YData;
  type: string;
  latex_formula: null;
};

export type PayoutStatement3YData = {
  market: string;
  threshold: number;
  min_threshold: number;
  payout_ratio_3y: number | null;
  dividend_yield_future: number;
  payout_ratio_3y_inverse: number | null;
};

export type VolatilityStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: VolatilityStatementData;
  type: string;
  latex_formula: null;
};

export type VolatilityStatementData = {
  market: string;
  min_threshold: number;
  dividend_yield: number;
  dividend_volatility: boolean;
  dividend_paying_years: number;
};

export type YieldLowRiskStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: YieldLowRiskStatementData;
  type: string;
  latex_formula: null;
};

export type YieldLowRiskStatementData = {
  market: string;
  low_risk_rate: number;
  dividend_yield: number;
};

export type YieldMarketTopStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: YieldMarketTopStatementData;
  type: string;
  latex_formula: null;
};

export type YieldMarketTopStatementData = {
  market: string;
  dividend_yield: number;
  top_top_top_of_the_best: number;
};

export type StatementsFuture = {
  Cash2yStatement: Cash2YStatement;
  EarningsHighGrowth: Earnings;
  EarningsVsMarketAverage: EarningsVsMarketAverage;
  EarningsVsRiskFreeRate: Earnings;
  FundamentalGrowthMethodStatement: FundamentalGrowthMethodStatement;
  Growth1yStatement: Growth1YStatement;
  Growth3yStatement: Growth3YStatement;
  MeaninglessFutureStatement: MeaninglessFutureStatement;
  NetIncome2yStatement: NetIncome2YStatement;
  ProjectedROEBenchStatement: ProjectedROEBenchStatement;
  ProjectedROEIndustryStatement: ProjectedROEIndustryStatement;
  ProjectedROEStatement: ProjectedROEStatement;
  Revenue2yStatement: Revenue2YStatement;
  RevenueHighGrowth: RevenueHighGrowth;
  RevenueVsMarketAverage: RevenueVsMarketAverage;
};

export type Cash2YStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: Cash2YStatementData;
  type: string;
  latex_formula: null;
};

export type Cash2YStatementData = {
  cash_ops_2y: number | null;
  cash_ops_now: number;
  cash_ops_growth_2y: number | null;
};

export type Earnings = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: EarningsHighGrowthData;
  type: string;
  latex_formula: null;
};

export type EarningsHighGrowthData = {
  net_income_now: number;
  minimum_threshold: number;
  maximum_net_income: number;
  net_income_growth_annual: number;
};

export type EarningsVsMarketAverage = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: EarningsVsMarketAverageData;
  type: string;
  latex_formula: null;
};

export type EarningsVsMarketAverageData = {
  country: string;
  market_average: number;
  maximum_net_income: number;
  net_income_growth_annual: number;
  net_income_growth_market: number;
};

export type FundamentalGrowthMethodStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: null;
  data: FundamentalGrowthMethodStatementData;
  type: string;
  latex_formula: null;
};

export type FundamentalGrowthMethodStatementData = {
  growth_result: boolean;
  fundamental_growth_inputs: boolean;
};

export type Growth1YStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: Growth1YStatementData;
  type: string;
  latex_formula: null;
};

export type Growth1YStatementData = {
  minimum_threshold: number;
  earnings_per_share_1y: number;
  earnings_per_share_now: number;
  earnings_per_share_growth_1y: number | null;
};

export type Growth3YStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: Growth3YStatementData;
  type: string;
  latex_formula: null;
};

export type Growth3YStatementData = {
  minimum_threshold: number;
  earnings_per_share_3y: number | null;
  earnings_per_share_now: number;
  earnings_per_share_growth_3y: number | null;
};

export type MeaninglessFutureStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: { [key: string]: number | null };
  type: string;
  latex_formula: null;
};

export type NetIncome2YStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: NetIncome2YStatementData;
  type: string;
  latex_formula: null;
};

export type NetIncome2YStatementData = {
  net_income_2y: number;
  net_income_now: number;
  net_income_growth_2y: number | null;
};

export type ProjectedROEBenchStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: ProjectedROEBenchStatementData;
  type: string;
  latex_formula: null;
};

export type ProjectedROEBenchStatementData = {
  return_on_equity_3y: number;
};

export type ProjectedROEIndustryStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: ProjectedROEIndustryStatementData;
  type: string;
  latex_formula: null;
};

export type ProjectedROEIndustryStatementData = {
  industry_name: string;
  return_on_equity_3y: number;
  return_on_equity_industry: number;
};

export type ProjectedROEStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: ProjectedROEStatementData;
  type: string;
  latex_formula: null;
};

export type ProjectedROEStatementData = {
  return_on_equity: number;
  return_on_equity_3y: number;
};

export type Revenue2YStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: Revenue2YStatementData;
  type: string;
  latex_formula: null;
};

export type Revenue2YStatementData = {
  revenue_2y: number;
  renenue_now: number;
  revenue_growth_2y: number;
};

export type RevenueHighGrowth = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: RevenueHighGrowthData;
  type: string;
  latex_formula: null;
};

export type RevenueHighGrowthData = {
  minimum_threshold: number;
  maximum_net_income: number;
  revenue_growth_annual: number;
};

export type RevenueVsMarketAverage = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: RevenueVsMarketAverageData;
  type: string;
  latex_formula: null;
};

export type RevenueVsMarketAverageData = {
  country: string;
  maximum_revenue: number;
  revenue_growth_annual: number;
  revenue_growth_market: number;
};

export type StatementsHealth = {
  AssetsToLiabsStatement: AssetsToLiabsStatement;
  CashBurnGrowthStatement: CashBurnGrowthStatement;
  CashBurnStableStatement: CashBurnStableStatement;
  CashDebtStatement: CashDebtStatement;
  CurrentAssetsToDebtStatement: CurrentAssetsToDebtStatement;
  CurrentAssetsToLTLiabsStatement: CurrentAssetsToLTLiabsStatement;
  DebtGrowthStatement: DebtGrowthStatement;
  DebtInterestStatement: DebtInterestStatement;
  DebtStatement: DebtStatement;
  InventoryStatement: InventoryStatement;
  MeaninglessHealthStatement: MeaninglessHealthStatement;
};

export type AssetsToLiabsStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: AssetsToLiabsStatementData;
  type: string;
  latex_formula: null;
};

export type AssetsToLiabsStatementData = {
  current_solvency_ratio: number;
};

export type CashBurnGrowthStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: CashBurnGrowthStatementData;
  type: string;
  latex_formula: null;
};

export type CashBurnGrowthStatementData = {
  net_income: number;
  net_income_5y_avg: number;
  levered_free_cash_flow: number;
  levered_free_cash_flow_growth_years: null;
  levered_free_cash_flow_growth_annual: number;
};

export type CashBurnStableStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: CashBurnStableStatementData;
  type: string;
  latex_formula: null;
};

export type CashBurnStableStatementData = {
  net_income: number;
  net_income_5y_avg: number;
  levered_free_cash_flow: number;
  levered_free_cash_flow_stable_years: null;
};

export type CashDebtStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: CashDebtStatementData;
  type: string;
  latex_formula: null;
};

export type CashDebtStatementData = {
  net_income: number;
  total_debt: number;
  net_income_5y_avg: number;
  levered_free_cash_flow: number;
  operating_cash_flow_to_total_debt: number;
};

export type CurrentAssetsToDebtStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: CurrentAssetsToDebtStatementData;
  type: string;
  latex_formula: null;
};

export type CurrentAssetsToDebtStatementData = {
  total_debt: number;
  total_equity: number;
  current_assets_to_total_debt: number;
};

export type CurrentAssetsToLTLiabsStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: CurrentAssetsToLTLiabsStatementData;
  type: string;
  latex_formula: null;
};

export type CurrentAssetsToLTLiabsStatementData = {
  long_term_liab: number;
  current_assets_to_long_term_liab: number;
};

export type DebtGrowthStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: DebtGrowthStatementData;
  type: string;
  latex_formula: null;
};

export type DebtGrowthStatementData = {
  total_debt: number;
  total_equity: number;
  total_debt_max: number;
  debt_to_equity_ratio: number;
  debt_to_equity_ratio_past: number;
};

export type DebtInterestStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: DebtInterestStatementData;
  type: string;
  latex_formula: null;
};

export type DebtInterestStatementData = {
  net_income: number;
  total_debt: number;
  net_income_5y_avg: number;
  earnings_per_share: number;
  net_interest_cover: number | null;
  levered_free_cash_flow: number;
};

export type DebtStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: DebtStatementData;
  type: string;
  latex_formula: null;
};

export type DebtStatementData = {
  total_debt: number;
  total_equity: number;
  debt_to_equity_ratio: number;
};

export type InventoryStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: InventoryStatementData;
  type: string;
  latex_formula: null;
};

export type InventoryStatementData = {
  fixed_to_total_assets: number;
};

export type MeaninglessHealthStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: MeaninglessHealthStatementData;
  type: string;
  latex_formula: null;
};

export type MeaninglessHealthStatementData = {
  total_assets: number;
  total_equity: number;
  current_assets: number;
  cast_st_investments: number;
  debt_to_equity_ratio: number;
  debt_to_equity_ratio_past: number;
};

export type StatementsManagement = {
  BoardTenureStatement: BoardTenureStatement;
  CEOOverCompensationStatement: CEOOverCompensationStatement;
  CEOSalaryGrowthStatement: CEOSalaryGrowthStatement;
  InsiderTradeStatement: InsiderTradeStatement;
  ProTenureStatement: ProTenureStatement;
};

export type BoardTenureStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: BoardTenureStatementData;
  type: string;
  latex_formula: null;
};

export type BoardTenureStatementData = {
  lower_limit: number;
  upper_limit: number;
  board_tenure: number;
};

export type CEOOverCompensationStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: CEOOverCompensationStatementData;
  type: string;
  latex_formula: null;
};

export type CEOOverCompensationStatementData = {
  market: null;
  ceo_name: string;
  median_compensation_usd: null;
  ceo_compensation_total_usd: null;
};

export type CEOSalaryGrowthStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: CEOSalaryGrowthStatementData;
  type: string;
  latex_formula: null;
};

export type CEOSalaryGrowthStatementData = {
  ceo_name: string;
  earnings_per_share: number;
  ceo_salary_growth_1y: null;
  earnings_per_share_1y: number;
  earnings_per_share_growth_1y: number;
};

export type InsiderTradeStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: InsiderTradeStatementData;
  type: string;
  latex_formula: null;
};

export type InsiderTradeStatementData = {
  buying_3_month: number;
  total_ex_3_month: number;
  buying_3_month_value: number;
  insider_buying_ratio: number | null;
  selling_3_month_value: number;
  minimum_value_threshold: number;
};

export type ProTenureStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: ProTenureStatementData;
  type: string;
  latex_formula: null;
};

export type ProTenureStatementData = {
  lower_limit: number;
  upper_limit: number;
  management_tenure: number;
};

export type StatementsMisc = {
  AnalystCoverageStatement: AnalystCoverageStatement;
  ExchangeTradedFundStatement: ExchangeTradedFundStatement;
  MarketCapStatement: MarketCapStatement;
  OutDatedDataStatement: OutDatedDataStatement;
  PriceVolatilityStatement: PriceVolatilityStatement;
  TradingHaltStatement: TradingHaltStatement;
};

export type AnalystCoverageStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: null | string;
  data: AnalystCoverageStatementData;
  type: string;
  latex_formula: null;
};

export type AnalystCoverageStatementData = {
  limit: number;
  analystCount: number;
};

export type ExchangeTradedFundStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: null;
  data: ExchangeTradedFundStatementData;
  type: string;
  latex_formula: null;
};

export type ExchangeTradedFundStatementData = {
  is_fund: boolean;
};

export type MarketCapStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: null;
  data: MarketCapStatementData;
  type: string;
  latex_formula: null;
};

export type MarketCapStatementData = {
  threshold: number;
  marketCapUSD: number;
};

export type OutDatedDataStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: null | string;
  data: OutDatedDataStatementData;
  type: string;
  latex_formula: null;
};

export type OutDatedDataStatementData = {
  days_since_last_update: number;
};

export type PriceVolatilityStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: null | string;
  data: PriceVolatilityStatementData;
  type: string;
  latex_formula: null;
};

export type PriceVolatilityStatementData = {
  threshold: number;
  volatility: boolean;
};

export type TradingHaltStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: null;
  data: TradingHaltStatementData;
  type: string;
  latex_formula: null;
};

export type TradingHaltStatementData = {
  unique_symbol: string;
  days_since_last_trade: number;
};

export type StatementsPast = {
  Growth1y5yStatement: Growth1Y5YStatement;
  Growth5yStatement: Growth5YStatement;
  MeaninglessPastStatement: MeaninglessPastStatement;
  ROAStatement: ROAStatement;
  ROCEStatement: ROCEStatement;
  ROEStatement: ROEStatement;
  VsMarketGrowthStatement: VsMarketGrowthStatement;
};

export type Growth1Y5YStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: Growth1Y5YStatementData;
  type: string;
  latex_formula: null;
};

export type Growth1Y5YStatementData = {
  earnings: number;
  earnings_1y: number;
  earnings_growth_1y: number;
  earnings_growth_5y: number;
  trading_since_years: number;
};

export type Growth5YStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: Growth5YStatementData;
  type: string;
  latex_formula: null;
};

export type Growth5YStatementData = {
  earnings: number;
  earnings_5y_avg: number;
  earnings_growth_5y: number;
  trading_since_years: number;
};

export type MeaninglessPastStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: MeaninglessPastStatementData;
  type: string;
  latex_formula: null;
};

export type MeaninglessPastStatementData = {
  revenue: number;
  net_income: number;
  return_on_assets: number;
  return_on_equity: number;
  return_on_capital_employed: number;
  return_on_capital_employed_past: number;
};

export type ROAStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: ROAStatementData;
  type: string;
  latex_formula: null;
};

export type ROAStatementData = {
  industry_name: string;
  return_on_assets: number;
  return_on_assets_industry: number;
};

export type ROCEStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: ROCEStatementData;
  type: string;
  latex_formula: null;
};

export type ROCEStatementData = {
  net_income: number;
  total_assets: number;
  current_liabilities: number;
  return_on_capital_growth: number;
  return_on_capital_employed: number;
  return_on_capital_employed_past: number;
};

export type ROEStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: ROEStatementData;
  type: string;
  latex_formula: null;
};

export type ROEStatementData = {
  total_equity: number;
  return_on_equity: number;
  total_debt_equity: number;
  earnings_continued_ops: number;
};

export type VsMarketGrowthStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: VsMarketGrowthStatementData;
  type: string;
  latex_formula: null;
};

export type VsMarketGrowthStatementData = {
  earnings: number;
  earnings_1y: number;
  industry_name: string;
  earnings_growth_1y: number;
  eps_growth_industry: number;
};

export type StatementsValue = {
  IntrinsicStatement: IntrinsicStatement;
  IntrinsicUberStatement: IntrinsicStatement;
  MeaninglessDCFStatement: MeaninglessDCFStatement;
  PBVsIndustryStatement: PBVsIndustryStatement;
  PEGStatement: PEGStatement;
  PEVsIndustryStatement: PEVsIndustryStatement;
  PEVsMarketStatement: PEVsMarketStatement;
  Return1yearVsIndustryStatement: Return1YearVsIndustryStatement;
  Return1yearVsMarketStatement: Return1YearVsMarketStatement;
  Return30dayVsIndustryStatement: Return30DayVsIndustryStatement;
  Return30dayVsMarketStatement: Return30DayVsMarketStatement;
};

export type IntrinsicStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: IntrinsicStatementData;
  type: string;
  latex_formula: null;
};

export type IntrinsicStatementData = {
  intrinsic_discount: number;
};

export type MeaninglessDCFStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: MeaninglessDCFStatementData;
  type: string;
  latex_formula: null;
};

export type MeaninglessDCFStatementData = {
  pb: number;
  pe: number;
  peg: number | null;
  type: string;
  ticker: string;
  industry: string;
  tertiary_id: number;
  intrinsic_discount: number;
};

export type PBVsIndustryStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: PBVsIndustryStatementData;
  type: string;
  latex_formula: null;
};

export type PBVsIndustryStatementData = {
  pb: number;
  source: string;
  pb_industry: number;
  industry_name: string;
};

export type PEGStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: PEGStatementData;
  type: string;
  latex_formula: null;
};

export type PEGStatementData = {
  pe: number;
  peg: number | null;
};

export type PEVsIndustryStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: PEVsIndustryStatementData;
  type: string;
  latex_formula: null;
};

export type PEVsIndustryStatementData = {
  pe: number;
  pe_industry: number;
  industry_name: string;
};

export type PEVsMarketStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: PEVsMarketStatementData;
  type: string;
  latex_formula: null;
};

export type PEVsMarketStatementData = {
  pe: number;
  market: string;
  pe_market: number;
};

export type Return1YearVsIndustryStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: Return1YearVsIndustryStatementData;
  type: string;
  latex_formula: null;
};

export type Return1YearVsIndustryStatementData = {
  industry: string;
  ticker_symbol: string;
  return_1yr_abs: number;
  flat_return_threshold: number;
  return_1yr_abs_industry: number;
};

export type Return1YearVsMarketStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: Return1YearVsMarketStatementData;
  type: string;
  latex_formula: null;
};

export type Return1YearVsMarketStatementData = {
  market: string;
  ticker_symbol: string;
  return_1yr_abs: number;
  flat_return_threshold: number;
  return_1yr_abs_market: number;
};

export type Return30DayVsIndustryStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: Return30DayVsIndustryStatementData;
  type: string;
  latex_formula: null;
};

export type Return30DayVsIndustryStatementData = {
  industry: string;
  return_30d: number;
  unique_symbol: string;
  return_30d_industry: number;
  flat_return_threshold: number;
};

export type Return30DayVsMarketStatement = {
  statement_name: string;
  area: string;
  date_generated: number;
  is_score: boolean;
  description: string;
  data: Return30DayVsMarketStatementData;
  type: string;
  latex_formula: null;
};

export type Return30DayVsMarketStatementData = {
  market: string;
  return_30d: number;
  unique_symbol: string;
  return_30d_market: number;
  flat_return_threshold: number;
};

export type DataFuture = {
  growth_1y: number | null;
  growth_3y: number | null;
  roe_1y: number | null;
  roe_3y: number;
};

export type FluffyPast = {
  growth_1y: number;
  growth_5y: number | null;
};

export type Info = {
  data: InfoData;
};

export type InfoData = {
  id: string;
  description: string;
  warning_type: number;
  industry: Industry;
  fund: boolean;
  status: string;
  currency: Currency;
  country: Country;
  employees: number;
  address: string;
  year_founded: number | null;
  url: string;
  logo_url: string;
  cover_url: string;
  cover_small_url: string;
  ceo: Ceo;
  legal_name: string;
  main_thumb: null | string;
  main_header: null | string;
};

export type Ceo = {
  name: string;
  age: number;
  url: string;
};

export type Industry = {
  name: string;
  primary_id: number;
  secondary_id: number;
  tertiary_id: number;
};

export type Score = {
  data: ScoreData;
};

export type ScoreData = {
  value: number;
  income: number;
  health: number;
  past: number;
  future: number;
  management: number;
  misc: number;
  total: number;
  sentence: string;
  snowflake: Snowflake;
};

export type Snowflake = {
  data: SnowflakeData;
};

export type SnowflakeData = {
  axes: number[];
  color: number;
};
