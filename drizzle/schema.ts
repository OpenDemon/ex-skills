import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 前任数字分身表
 */
export const personas = mysqlTable("personas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  avatarUrl: text("avatarUrl"),
  relationshipDesc: varchar("relationshipDesc", { length: 200 }),
  togetherFrom: varchar("togetherFrom", { length: 50 }),
  togetherTo: varchar("togetherTo", { length: 50 }),
  personaData: json("personaData"),
  analysisStatus: mysqlEnum("analysisStatus", [
    "pending",
    "analyzing",
    "ready",
    "error",
  ]).default("pending").notNull(),
  analysisProgress: int("analysisProgress").default(0).notNull(),
  analysisMessage: text("analysisMessage"),
  emotionalState: mysqlEnum("emotionalState", [
    "warm",
    "playful",
    "nostalgic",
    "melancholy",
    "happy",
    "distant",
  ]).default("warm").notNull(),
  chatCount: int("chatCount").default(0).notNull(),
  lastChatAt: timestamp("lastChatAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Persona = typeof personas.$inferSelect;
export type InsertPersona = typeof personas.$inferInsert;

/**
 * 上传文件记录表
 */
export const personaFiles = mysqlTable("persona_files", {
  id: int("id").autoincrement().primaryKey(),
  personaId: int("personaId").notNull(),
  userId: int("userId").notNull(),
  fileType: mysqlEnum("fileType", [
    "chat_txt",
    "chat_csv",
    "image",
    "video",
  ]).notNull(),
  originalName: varchar("originalName", { length: 255 }).notNull(),
  fileKey: varchar("fileKey", { length: 500 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileSize: int("fileSize").notNull(),
  extractedMemory: text("extractedMemory"),
  processStatus: mysqlEnum("processStatus", [
    "uploaded",
    "processing",
    "done",
    "failed",
  ]).default("uploaded").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PersonaFile = typeof personaFiles.$inferSelect;
export type InsertPersonaFile = typeof personaFiles.$inferInsert;

/**
 * 对话消息表
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  personaId: int("personaId").notNull(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  emotionalState: varchar("emotionalState", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;