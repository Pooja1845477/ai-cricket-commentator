import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, teams, players, matches, innings, balls, playerMatchStats, commentaryLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Cricket-specific database helpers

export async function createTeam(name: string, shortCode: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(teams).values({ name, shortCode });
  return result;
}

export async function createPlayer(teamId: number, name: string, role: string, jerseyNumber?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(players).values({
    teamId,
    name,
    role: role as any,
    jerseyNumber,
  });
  return result;
}

export async function getTeamPlayers(teamId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(players).where(eq(players.teamId, teamId));
}

export async function createMatch(userId: number, team1Id: number, team2Id: number, format: string, overs: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(matches).values({
    userId,
    team1Id,
    team2Id,
    format: format as any,
    overs,
    status: "setup",
  });
  return result;
}

export async function getMatch(matchId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(matches).where(eq(matches.id, matchId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getUserMatches(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(matches).where(eq(matches.userId, userId));
}

export async function updateMatchStatus(matchId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(matches).set({ status: status as any }).where(eq(matches.id, matchId));
}

export async function createInnings(matchId: number, inningsNumber: number, battingTeamId: number, bowlingTeamId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(innings).values({
    matchId,
    inningsNumber,
    battingTeamId,
    bowlingTeamId,
    status: "in-progress",
  });
  return result;
}

export async function getMatchInnings(matchId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(innings).where(eq(innings.matchId, matchId));
}

export async function getCurrentInnings(matchId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(innings)
    .where(and(eq(innings.matchId, matchId), eq(innings.status, "in-progress")))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function insertBall(inningsId: number, ballNumber: number, overNumber: number, ballInOver: number, 
  batsmanId: number, bowlerId: number, outcome: string, runs: number, isWicket: number, wicketType?: string, commentary?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.insert(balls).values({
    inningsId,
    ballNumber,
    overNumber,
    ballInOver,
    batsmanId,
    bowlerId,
    outcome: outcome as any,
    runs,
    isWicket,
    wicketType,
    commentary,
  });
  return result;
}

export async function getInningsBalls(inningsId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(balls).where(eq(balls.inningsId, inningsId));
}

export async function updateInningsStats(inningsId: number, totalRuns: number, totalWickets: number, totalBalls: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.update(innings).set({
    totalRuns,
    totalWickets,
    totalBalls,
  }).where(eq(innings.id, inningsId));
}

export async function upsertPlayerMatchStats(matchId: number, playerId: number, inningsId: number | null, 
  runs: number, ballsFaced: number, strikeRate: number, wicketsTaken: number, ballsBowled: number, 
  runsConceded: number, economyRate: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await db.select().from(playerMatchStats)
    .where(and(eq(playerMatchStats.matchId, matchId), eq(playerMatchStats.playerId, playerId)))
    .limit(1);
  
  if (existing.length > 0) {
    return await db.update(playerMatchStats).set({
      runs,
      ballsFaced,
      strikeRate: strikeRate.toString(),
      wicketsTaken,
      ballsBowled,
      runsConceded,
      economyRate: economyRate.toString(),
    }).where(and(eq(playerMatchStats.matchId, matchId), eq(playerMatchStats.playerId, playerId)));
  } else {
    return await db.insert(playerMatchStats).values({
      matchId,
      playerId,
      inningsId,
      runs,
      ballsFaced,
      strikeRate: strikeRate.toString(),
      wicketsTaken,
      ballsBowled,
      runsConceded,
      economyRate: economyRate.toString(),
    });
  }
}

export async function getPlayerMatchStats(matchId: number, playerId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const result = await db.select().from(playerMatchStats)
    .where(and(eq(playerMatchStats.matchId, matchId), eq(playerMatchStats.playerId, playerId)))
    .limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function insertCommentaryLog(matchId: number, ballId: number, commentary: string, eventType: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.insert(commentaryLog).values({
    matchId,
    ballId,
    commentary,
    eventType: eventType as any,
  });
}

export async function getMatchCommentaryLog(matchId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return await db.select().from(commentaryLog).where(eq(commentaryLog.matchId, matchId));
}
