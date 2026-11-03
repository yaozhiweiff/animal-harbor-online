CREATE TABLE `accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`name_key` text NOT NULL,
	`password_salt` text NOT NULL,
	`password_hash` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_name_key_unique` ON `accounts` (`name_key`);--> statement-breakpoint
CREATE TABLE `auth_limits` (
	`key` text PRIMARY KEY NOT NULL,
	`count` integer NOT NULL,
	`window_start` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `player_progress` (
	`account_id` text PRIMARY KEY NOT NULL,
	`save_data` text,
	`revision` integer DEFAULT 0 NOT NULL,
	`peak` real DEFAULT 0 NOT NULL,
	`aquarium_unlocked` integer DEFAULT 0 NOT NULL,
	`aquarium_json` text DEFAULT '{}' NOT NULL,
	`updated_at` integer NOT NULL,
	`last_upload_id` text,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `player_peak` ON `player_progress` (`peak`);--> statement-breakpoint
CREATE INDEX `player_aquarium` ON `player_progress` (`aquarium_unlocked`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`created_at` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sessions_expiry` ON `sessions` (`expires_at`);