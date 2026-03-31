CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`personaId` int NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`emotionalState` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `persona_files` (
	`id` int AUTO_INCREMENT NOT NULL,
	`personaId` int NOT NULL,
	`userId` int NOT NULL,
	`fileType` enum('chat_txt','chat_csv','image','video') NOT NULL,
	`originalName` varchar(255) NOT NULL,
	`fileKey` varchar(500) NOT NULL,
	`fileUrl` text NOT NULL,
	`fileSize` int NOT NULL,
	`extractedMemory` text,
	`processStatus` enum('uploaded','processing','done','failed') NOT NULL DEFAULT 'uploaded',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `persona_files_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `personas` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`name` varchar(100) NOT NULL,
	`avatarUrl` text,
	`relationshipDesc` varchar(200),
	`togetherFrom` varchar(50),
	`togetherTo` varchar(50),
	`personaData` json,
	`analysisStatus` enum('pending','analyzing','ready','error') NOT NULL DEFAULT 'pending',
	`analysisProgress` int NOT NULL DEFAULT 0,
	`analysisMessage` text,
	`emotionalState` enum('warm','playful','nostalgic','melancholy','happy','distant') NOT NULL DEFAULT 'warm',
	`chatCount` int NOT NULL DEFAULT 0,
	`lastChatAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `personas_id` PRIMARY KEY(`id`)
);
