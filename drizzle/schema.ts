import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, json } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
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
 * Teams table - stores cricket teams
 */
export const teams = mysqlTable("teams", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  shortCode: varchar("shortCode", { length: 10 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Team = typeof teams.$inferSelect;
export type InsertTeam = typeof teams.$inferInsert;

/**
 * Players table - stores cricket players
 */
export const players = mysqlTable("players", {
  id: int("id").autoincrement().primaryKey(),
  teamId: int("teamId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["batsman", "bowler", "all-rounder", "wicket-keeper"]).notNull(),
  jerseyNumber: int("jerseyNumber"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Player = typeof players.$inferSelect;
export type InsertPlayer = typeof players.$inferInsert;

/**
 * Matches table - stores cricket matches
 */
export const matches = mysqlTable("matches", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(), // User who created the match
  team1Id: int("team1Id").notNull(),
  team2Id: int("team2Id").notNull(),
  format: mysqlEnum("format", ["T20", "ODI", "Test"]).notNull(),
  overs: int("overs").notNull(), // Total overs per innings
  status: mysqlEnum("status", ["setup", "in-progress", "completed"]).default("setup").notNull(),
  tossWinner: int("tossWinner"), // Team ID of toss winner
  tossDecision: mysqlEnum("tossDecision", ["bat", "bowl"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type Match = typeof matches.$inferSelect;
export type InsertMatch = typeof matches.$inferInsert;

/**
 * Innings table - stores innings data for each match
 */
export const innings = mysqlTable("innings", {
  id: int("id").autoincrement().primaryKey(),
  matchId: int("matchId").notNull(),
  inningsNumber: int("inningsNumber").notNull(), // 1 or 2
  battingTeamId: int("battingTeamId").notNull(),
  bowlingTeamId: int("bowlingTeamId").notNull(),
  totalRuns: int("totalRuns").default(0).notNull(),
  totalWickets: int("totalWickets").default(0).notNull(),
  totalBalls: int("totalBalls").default(0).notNull(),
  status: mysqlEnum("status", ["in-progress", "completed"]).default("in-progress").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Innings = typeof innings.$inferSelect;
export type InsertInnings = typeof innings.$inferInsert;

/**
 * Balls table - stores ball-by-ball data
 */
export const balls = mysqlTable("balls", {
  id: int("id").autoincrement().primaryKey(),
  inningsId: int("inningsId").notNull(),
  ballNumber: int("ballNumber").notNull(), // Sequential ball number in the innings
  overNumber: int("overNumber").notNull(), // 0-indexed over
  ballInOver: int("ballInOver").notNull(), // 0-5 (position within the over)
  batsmanId: int("batsmanId").notNull(),
  bowlerId: int("bowlerId").notNull(),
  outcome: mysqlEnum("outcome", [
    "dot",
    "single",
    "two",
    "three",
    "four",
    "five",
    "six",
    "wicket",
    "wide",
    "no-ball",
    "bye",
    "leg-bye"
  ]).notNull(),
  runs: int("runs").default(0).notNull(),
  isWicket: int("isWicket").default(0).notNull(), // 0 or 1 (boolean)
  wicketType: varchar("wicketType", { length: 50 }), // bowled, lbw, caught, etc.
  commentary: text("commentary"), // AI-generated commentary
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Ball = typeof balls.$inferSelect;
export type InsertBall = typeof balls.$inferInsert;

/**
 * Player Match Stats table - stores per-player statistics for each match
 */
export const playerMatchStats = mysqlTable("playerMatchStats", {
  id: int("id").autoincrement().primaryKey(),
  matchId: int("matchId").notNull(),
  playerId: int("playerId").notNull(),
  inningsId: int("inningsId"),
  runs: int("runs").default(0).notNull(),
  ballsFaced: int("ballsFaced").default(0).notNull(),
  strikeRate: decimal("strikeRate", { precision: 5, scale: 2 }).default("0"),
  wicketsTaken: int("wicketsTaken").default(0).notNull(),
  ballsBowled: int("ballsBowled").default(0).notNull(),
  runsConceded: int("runsConceded").default(0).notNull(),
  economyRate: decimal("economyRate", { precision: 5, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlayerMatchStats = typeof playerMatchStats.$inferSelect;
export type InsertPlayerMatchStats = typeof playerMatchStats.$inferInsert;

/**
 * Commentary Log table - stores full commentary history for replay
 */
export const commentaryLog = mysqlTable("commentaryLog", {
  id: int("id").autoincrement().primaryKey(),
  matchId: int("matchId").notNull(),
  ballId: int("ballId").notNull(),
  commentary: text("commentary").notNull(),
  eventType: mysqlEnum("eventType", [
    "dot",
    "single",
    "two",
    "three",
    "four",
    "five",
    "six",
    "wicket",
    "wide",
    "no-ball",
    "bye",
    "leg-bye"
  ]).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CommentaryLog = typeof commentaryLog.$inferSelect;
export type InsertCommentaryLog = typeof commentaryLog.$inferInsert;
