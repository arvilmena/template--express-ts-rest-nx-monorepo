CREATE TABLE `crawl_data_sws_company` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`crawled_at` text NOT NULL,
	`sws_id` integer NOT NULL,
	`sws_unique_symbol` text NOT NULL,
	`sws_data_last_updated` blob NOT NULL,
	`score_value` real,
	`score_income` real,
	`score_health` real,
	`score_past` real,
	`score_future` real,
	`score_management` real,
	`score_misc` real,
	`score_score_total` real,
	`score_sentence` text,
	`snowflake_color` real,
	`share_price` real,
	`value_pe` real,
	`value_ps` real,
	`roe` real,
	`value_price_target` real,
	`value_price_target_analyst_count` real,
	`value_price_target_high` real,
	`value_price_target_low` real,
	`future_earnings_per_share_growth_annual` real,
	`future_net_income_growth_annual` real,
	`future_roe_3y` real,
	`future_forward_pe_1y` real,
	`future_forward_ps_1y` real,
	`peer_preferred_multiple` text,
	`peer_preferred_relative_multiple_average_peer_value` real,
	`intrinsic_value` real,
	`intrinsic_value_model` text,
	`intrinsic_value_discount` real,
	`dividend_yield` real,
	`dividend_yield_future` real,
	`dividend_payout_ratio` real,
	`dividend_payout_ratio_3y` real,
	`dividend_payout_ratio_median_3yr` real,
	`dividend_payments_growth_annual` real,
	`dividend_cash_payout_ratio` real,
	`health_levered_free_cash_flow_growth_annual` real
);
--> statement-breakpoint
CREATE TABLE `crawl_data_sws_company_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`crawl_data_sws_company_id` integer NOT NULL,
	`daily_category_id` integer NOT NULL,
	FOREIGN KEY (`crawl_data_sws_company_id`) REFERENCES `crawl_data_sws_company`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`daily_category_id`) REFERENCES `daily_category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `crawl_data_sws_company_free_cash_flow` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sws_id` integer NOT NULL,
	`sws_unique_symbol` text NOT NULL,
	`data_at` text NOT NULL,
	`levered_free_cash_flow` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `crawl_data_sws_screener` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`crawled_at` text NOT NULL,
	`crawl_type_specific` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `crawl_data_sws_screener_result` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`crawl_data_sws_screener_id` integer,
	`sws_id` integer NOT NULL,
	`sws_unique_symbol` text NOT NULL,
	`position` integer NOT NULL,
	FOREIGN KEY (`crawl_data_sws_screener_id`) REFERENCES `crawl_data_sws_screener`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `crawl_data_sws_stock_list` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`crawled_at` text NOT NULL,
	`crawl_type_specific` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `crawl_data_sws_stock_list_result` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`crawl_data_sws_stock_list_id` integer NOT NULL,
	`sws_id` integer NOT NULL,
	`sws_unique_symbol` text NOT NULL,
	`position` integer NOT NULL,
	FOREIGN KEY (`crawl_data_sws_stock_list_id`) REFERENCES `crawl_data_sws_stock_list`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `daily_category` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`data_at` text NOT NULL,
	`source` text NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	FOREIGN KEY (`data_at`) REFERENCES `day`(`data_at`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `daily_category_parent` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`daily_category_id` integer,
	`daily_category_parent_id` integer,
	FOREIGN KEY (`daily_category_id`) REFERENCES `daily_category`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`daily_category_parent_id`) REFERENCES `daily_category`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `daily_crawl` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`data_at` text NOT NULL,
	`finished_at` text,
	FOREIGN KEY (`data_at`) REFERENCES `day`(`data_at`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `daily_crawl_type` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`daily_crawl_id` integer,
	`crawl_type` text NOT NULL,
	`crawl_type_specific` text NOT NULL,
	`url` text NOT NULL,
	`data_id` integer,
	FOREIGN KEY (`daily_crawl_id`) REFERENCES `daily_crawl`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `day` (
	`data_at` text PRIMARY KEY NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `crawled_at_and_sws_id` ON `crawl_data_sws_company` (`crawled_at`,`sws_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sws_id_and_sws_data_last_updated` ON `crawl_data_sws_company` (`sws_id`,`sws_data_last_updated`);--> statement-breakpoint
CREATE UNIQUE INDEX `crawl_data_sws_company_category_company_and_category` ON `crawl_data_sws_company_category` (`crawl_data_sws_company_id`,`daily_category_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `data_at_and_sws_id` ON `crawl_data_sws_company_free_cash_flow` (`data_at`,`sws_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `crawl_data_sws_screener_data_at_and_crawl_type` ON `crawl_data_sws_screener` (`crawled_at`,`crawl_type_specific`);--> statement-breakpoint
CREATE UNIQUE INDEX `screener_and_position` ON `crawl_data_sws_screener_result` (`crawl_data_sws_screener_id`,`position`);--> statement-breakpoint
CREATE UNIQUE INDEX `crawl_data_sws_stock_list_data_at_and_crawl_type` ON `crawl_data_sws_stock_list` (`crawled_at`,`crawl_type_specific`);--> statement-breakpoint
CREATE UNIQUE INDEX `stock_list_and_position` ON `crawl_data_sws_stock_list_result` (`crawl_data_sws_stock_list_id`,`position`);--> statement-breakpoint
CREATE UNIQUE INDEX `daily_category_data_at_source_and_name` ON `daily_category` (`data_at`,`source`,`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `daily_category_data_at_slug` ON `daily_category` (`data_at`,`slug`);--> statement-breakpoint
CREATE UNIQUE INDEX `daily_category_parent_category_and_parent` ON `daily_category_parent` (`daily_category_id`,`daily_category_parent_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `daily_crawl_data_at_unique` ON `daily_crawl` (`data_at`);--> statement-breakpoint
CREATE UNIQUE INDEX `daily_crawl_and_crawl_type` ON `daily_crawl_type` (`daily_crawl_id`,`crawl_type`,`crawl_type_specific`);--> statement-breakpoint
CREATE UNIQUE INDEX `day_data_at_unique` ON `day` (`data_at`);