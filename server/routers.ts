import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { invokeLLM } from "./_core/llm";
import { z } from "zod";
import * as db from "./db";
import * as cricket from "./cricket";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Cricket match routers
  match: router({
    // Create a new match
    create: protectedProcedure
      .input(z.object({
        team1Name: z.string(),
        team1Code: z.string(),
        team2Name: z.string(),
        team2Code: z.string(),
        format: z.enum(["T20", "ODI", "Test"]),
        overs: z.number().int().positive(),
        team1Players: z.array(z.object({
          name: z.string(),
          role: z.enum(["batsman", "bowler", "all-rounder", "wicket-keeper"]),
          jerseyNumber: z.number().int().optional(),
        })),
        team2Players: z.array(z.object({
          name: z.string(),
          role: z.enum(["batsman", "bowler", "all-rounder", "wicket-keeper"]),
          jerseyNumber: z.number().int().optional(),
        })),
      }))
      .mutation(async ({ ctx, input }) => {
        // Create teams
        const team1Result = await db.createTeam(input.team1Name, input.team1Code);
        const team2Result = await db.createTeam(input.team2Name, input.team2Code);
        
        const team1Id = (team1Result as any).insertId || 1;
        const team2Id = (team2Result as any).insertId || 2;
        
        // Create players for team 1
        for (const player of input.team1Players) {
          await db.createPlayer(team1Id, player.name, player.role, player.jerseyNumber);
        }
        
        // Create players for team 2
        for (const player of input.team2Players) {
          await db.createPlayer(team2Id, player.name, player.role, player.jerseyNumber);
        }
        
        // Create match
        const matchResult = await db.createMatch(
          ctx.user!.id,
          team1Id,
          team2Id,
          input.format,
          input.overs
        );
        
        return {
          matchId: (matchResult as any).insertId || 1,
          team1Id,
          team2Id,
        };
      }),

    // Get match details
    get: protectedProcedure
      .input(z.object({ matchId: z.number().int() }))
      .query(async ({ input }) => {
        const match = await db.getMatch(input.matchId);
        if (!match) throw new Error("Match not found");
        
        const matchInnings = await db.getMatchInnings(input.matchId);
        const team1Players = await db.getTeamPlayers(match.team1Id);
        const team2Players = await db.getTeamPlayers(match.team2Id);
        
        return {
          match,
          innings: matchInnings,
          team1Players,
          team2Players,
        };
      }),

    // List user's matches
    list: protectedProcedure.query(async ({ ctx }) => {
      return await db.getUserMatches(ctx.user!.id);
    }),

    // Start a match (create first innings)
    start: protectedProcedure
      .input(z.object({
        matchId: z.number().int(),
        tossWinnerId: z.number().int(),
        tossDecision: z.enum(["bat", "bowl"]),
      }))
      .mutation(async ({ input }) => {
        const match = await db.getMatch(input.matchId);
        if (!match) throw new Error("Match not found");
        
        // Determine batting and bowling teams
        const battingTeamId = input.tossDecision === "bat" ? input.tossWinnerId : 
          (input.tossWinnerId === match.team1Id ? match.team2Id : match.team1Id);
        const bowlingTeamId = battingTeamId === match.team1Id ? match.team2Id : match.team1Id;
        
        // Create first innings
        const inningsResult = await db.createInnings(input.matchId, 1, battingTeamId, bowlingTeamId) as any;
        
        // Update match status
        await db.updateMatchStatus(input.matchId, "in-progress");
        
        return {
          inningsId: inningsResult.insertId,
          battingTeamId,
          bowlingTeamId,
        };
      }),
  }),

  // Ball simulation and commentary
  ball: router({
    // Simulate next ball
    simulate: protectedProcedure
      .input(z.object({
        inningsId: z.number().int(),
        batsmanId: z.number().int(),
        bowlerId: z.number().int(),
      }))
      .mutation(async ({ input }) => {
        // Get innings data
        const inningsData = await db.getInningsBalls(input.inningsId);
        const ballNumber = inningsData.length + 1;
        const overNumber = Math.floor((ballNumber - 1) / 6);
        const ballInOver = (ballNumber - 1) % 6;
        
        // Simulate ball outcome
        const outcome = cricket.simulateBallOutcome();
        
        // Get player names for commentary
        const batsman = await db.getPlayer(input.batsmanId);
        const bowler = await db.getPlayer(input.bowlerId);
        const batsmanName = batsman?.name || `Batsman ${input.batsmanId}`;
        const bowlerName = bowler?.name || `Bowler ${input.bowlerId}`;
        
        // Generate AI commentary
        const commentaryPrompt = cricket.getCommentaryPrompt(
          outcome.outcome,
          batsmanName,
          bowlerName,
          outcome.runs,
          outcome.wicketType
        );
        
        let commentary = "";
        try {
          const llmResponse = await invokeLLM({
            messages: [
              {
                role: "system",
                content: "You are an expert cricket commentator. Generate natural, exciting, and varied commentary for cricket matches. Be concise and engaging."
              },
              {
                role: "user",
                content: commentaryPrompt
              }
            ]
          });
          const content = llmResponse.choices[0]?.message.content;
          commentary = typeof content === 'string' ? content : "";
        } catch (error) {
          console.error("Failed to generate commentary:", error);
          commentary = `${batsmanName} faces a ${outcome.outcome} from ${bowlerName}.`;
        }
        
        // Insert ball into database
        const ballResult = await db.insertBall(
          input.inningsId,
          ballNumber,
          overNumber,
          ballInOver,
          input.batsmanId,
          input.bowlerId,
          outcome.outcome,
          outcome.runs,
          outcome.isWicket ? 1 : 0,
          outcome.wicketType,
          commentary
        ) as any;
        
        // Update innings stats
        const allBalls = await db.getInningsBalls(input.inningsId);
        const totalRuns = allBalls.reduce((sum, b) => sum + b.runs, 0) + outcome.runs;
        const totalWickets = allBalls.reduce((sum, b) => sum + b.isWicket, 0) + (outcome.isWicket ? 1 : 0);
        const totalBalls = allBalls.length + 1;
        
        await db.updateInningsStats(input.inningsId, totalRuns, totalWickets, totalBalls);
        
        return {
          ballId: (ballResult as any).insertId || 0,
          outcome: outcome.outcome,
          runs: outcome.runs,
          isWicket: outcome.isWicket,
          commentary,
          ballNumber: ballNumber,
          overs: cricket.formatOvers(totalBalls),
          totalRuns,
          totalWickets,
        };
      }),

    // Get all balls in an innings
    getInnings: protectedProcedure
      .input(z.object({ inningsId: z.number().int() }))
      .query(async ({ input }) => {
        return await db.getInningsBalls(input.inningsId);
      }),
  }),

  // Match history and replay
  history: router({
    // Get all completed matches
    list: protectedProcedure.query(async ({ ctx }) => {
      const matches = await db.getUserMatches(ctx.user!.id);
      return matches.filter(m => m.status === "completed");
    }),

    // Get match replay with commentary
    getReplay: protectedProcedure
      .input(z.object({ matchId: z.number().int() }))
      .query(async ({ input }) => {
        const match = await db.getMatch(input.matchId);
        if (!match) throw new Error("Match not found");
        
        const matchInnings = await db.getMatchInnings(input.matchId);
        const commentaryLog = await db.getMatchCommentaryLog(input.matchId);
        
        return {
          match,
          innings: matchInnings,
          commentary: commentaryLog,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
