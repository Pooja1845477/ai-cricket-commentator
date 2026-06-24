CREATE TABLE `balls` (
	`id` int AUTO_INCREMENT NOT NULL,
	`inningsId` int NOT NULL,
	`ballNumber` int NOT NULL,
	`overNumber` int NOT NULL,
	`ballInOver` int NOT NULL,
	`batsmanId` int NOT NULL,
	`bowlerId` int NOT NULL,
	`outcome` enum('dot','single','two','three','four','five','six','wicket','wide','no-ball','bye','leg-bye') NOT NULL,
	`runs` int NOT NULL DEFAULT 0,
	`isWicket` int NOT NULL DEFAULT 0,
	`wicketType` varchar(50),
	`commentary` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `balls_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `commentaryLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`matchId` int NOT NULL,
	`ballId` int NOT NULL,
	`commentary` text NOT NULL,
	`eventType` enum('dot','single','two','three','four','five','six','wicket','wide','no-ball','bye','leg-bye') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `commentaryLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `innings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`matchId` int NOT NULL,
	`inningsNumber` int NOT NULL,
	`battingTeamId` int NOT NULL,
	`bowlingTeamId` int NOT NULL,
	`totalRuns` int NOT NULL DEFAULT 0,
	`totalWickets` int NOT NULL DEFAULT 0,
	`totalBalls` int NOT NULL DEFAULT 0,
	`status` enum('in-progress','completed') NOT NULL DEFAULT 'in-progress',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `innings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `matches` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`team1Id` int NOT NULL,
	`team2Id` int NOT NULL,
	`format` enum('T20','ODI','Test') NOT NULL,
	`overs` int NOT NULL,
	`status` enum('setup','in-progress','completed') NOT NULL DEFAULT 'setup',
	`tossWinner` int,
	`tossDecision` enum('bat','bowl'),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`completedAt` timestamp,
	CONSTRAINT `matches_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `playerMatchStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`matchId` int NOT NULL,
	`playerId` int NOT NULL,
	`inningsId` int,
	`runs` int NOT NULL DEFAULT 0,
	`ballsFaced` int NOT NULL DEFAULT 0,
	`strikeRate` decimal(5,2) DEFAULT '0',
	`wicketsTaken` int NOT NULL DEFAULT 0,
	`ballsBowled` int NOT NULL DEFAULT 0,
	`runsConceded` int NOT NULL DEFAULT 0,
	`economyRate` decimal(5,2) DEFAULT '0',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `playerMatchStats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` int AUTO_INCREMENT NOT NULL,
	`teamId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`role` enum('batsman','bowler','all-rounder','wicket-keeper') NOT NULL,
	`jerseyNumber` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `players_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `teams` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`shortCode` varchar(10) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `teams_id` PRIMARY KEY(`id`)
);
