CREATE TABLE `crawl_data_sws_company_statement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sws_company_statement_id` integer,
	`crawl_data_sws_company_id` integer,
	FOREIGN KEY (`sws_company_statement_id`) REFERENCES `sws_company_statement`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`crawl_data_sws_company_id`) REFERENCES `crawl_data_sws_company`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `sws_company_statement` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`statement_name` text NOT NULL,
	`description` text NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `crawl_data_sws_company_statement_unique` ON `crawl_data_sws_company_statement` (`sws_company_statement_id`,`crawl_data_sws_company_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `sws_company_statement_key_description_and_type` ON `sws_company_statement` (`statement_name`,`description`,`type`);