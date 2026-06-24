/**
 * Cricket simulation engine
 * Handles ball outcomes, score tracking, and match logic
 */

export type BallOutcome = 'dot' | 'single' | 'two' | 'three' | 'four' | 'five' | 'six' | 'wicket' | 'wide' | 'no-ball' | 'bye' | 'leg-bye';
export type WicketType = 'bowled' | 'lbw' | 'caught' | 'stumped' | 'run-out' | 'hit-wicket' | 'handled-ball' | 'obstructing-field';

export interface BallSimulationResult {
  outcome: BallOutcome;
  runs: number;
  isWicket: boolean;
  wicketType?: WicketType;
  batsmanOut?: boolean;
  extraRuns?: number; // For wides, no-balls
}

export interface InningsState {
  totalRuns: number;
  totalWickets: number;
  totalBalls: number;
  currentOver: number;
  currentBallInOver: number;
}

/**
 * Generate a realistic ball outcome based on cricket probabilities
 * Weighted probabilities to simulate realistic cricket scenarios
 */
export function simulateBallOutcome(): BallSimulationResult {
  const rand = Math.random();
  
  // Probability distribution (realistic cricket)
  // Dot ball: 35%
  // Singles: 25%
  // Boundaries (4s): 15%
  // Twos: 10%
  // Wickets: 8%
  // Sixes: 4%
  // Wides/No-balls: 3%
  
  if (rand < 0.35) {
    return { outcome: 'dot', runs: 0, isWicket: false };
  } else if (rand < 0.60) {
    return { outcome: 'single', runs: 1, isWicket: false };
  } else if (rand < 0.75) {
    return { outcome: 'four', runs: 4, isWicket: false };
  } else if (rand < 0.85) {
    return { outcome: 'two', runs: 2, isWicket: false };
  } else if (rand < 0.93) {
    const wicketType = getRandomWicketType();
    return { 
      outcome: 'wicket', 
      runs: 0, 
      isWicket: true, 
      wicketType,
      batsmanOut: true 
    };
  } else if (rand < 0.97) {
    return { outcome: 'six', runs: 6, isWicket: false };
  } else {
    // Wides or no-balls (50/50)
    const isWide = Math.random() < 0.5;
    return {
      outcome: isWide ? 'wide' : 'no-ball',
      runs: 1,
      isWicket: false,
      extraRuns: 1
    };
  }
}

/**
 * Get a random wicket type
 */
function getRandomWicketType(): WicketType {
  const types: WicketType[] = ['bowled', 'lbw', 'caught', 'stumped', 'run-out'];
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * Calculate strike rate for a batsman
 */
export function calculateStrikeRate(runs: number, ballsFaced: number): number {
  if (ballsFaced === 0) return 0;
  return parseFloat(((runs / ballsFaced) * 100).toFixed(2));
}

/**
 * Calculate economy rate for a bowler
 */
export function calculateEconomyRate(runsConceded: number, ballsBowled: number): number {
  if (ballsBowled === 0) return 0;
  const overs = Math.floor(ballsBowled / 6) + (ballsBowled % 6) / 10;
  return parseFloat((runsConceded / overs).toFixed(2));
}

/**
 * Format overs display (e.g., "3.4" means 3 overs and 4 balls)
 */
export function formatOvers(totalBalls: number): string {
  const overs = Math.floor(totalBalls / 6);
  const balls = totalBalls % 6;
  return `${overs}.${balls}`;
}

/**
 * Calculate required run rate
 */
export function calculateRequiredRunRate(runsNeeded: number, ballsRemaining: number): number {
  if (ballsRemaining === 0) return 0;
  const oversRemaining = ballsRemaining / 6;
  return parseFloat((runsNeeded / oversRemaining).toFixed(2));
}

/**
 * Calculate current run rate
 */
export function calculateCurrentRunRate(totalRuns: number, totalBalls: number): number {
  if (totalBalls === 0) return 0;
  const oversCompleted = totalBalls / 6;
  return parseFloat((totalRuns / oversCompleted).toFixed(2));
}

/**
 * Get commentary prompt for LLM based on ball outcome
 */
export function getCommentaryPrompt(outcome: BallOutcome, batsmanName: string, bowlerName: string, runs: number, wicketType?: string): string {
  const prompts: Record<BallOutcome, string> = {
    dot: `Generate exciting cricket commentary for a dot ball bowled by ${bowlerName} to ${batsmanName}. Keep it under 15 words.`,
    single: `Generate exciting cricket commentary for a single run scored by ${batsmanName} off ${bowlerName}'s bowling. Keep it under 15 words.`,
    two: `Generate exciting cricket commentary for two runs scored by ${batsmanName} off ${bowlerName}'s bowling. Keep it under 15 words.`,
    three: `Generate exciting cricket commentary for three runs scored by ${batsmanName} off ${bowlerName}'s bowling. Keep it under 15 words.`,
    four: `Generate exciting cricket commentary for a boundary (4 runs) hit by ${batsmanName} off ${bowlerName}'s bowling. Emphasize the shot quality. Keep it under 20 words.`,
    five: `Generate exciting cricket commentary for five runs scored by ${batsmanName} off ${bowlerName}'s bowling. Keep it under 15 words.`,
    six: `Generate exciting cricket commentary for a six (maximum) hit by ${batsmanName} off ${bowlerName}'s bowling. Make it dramatic! Keep it under 20 words.`,
    wicket: `Generate dramatic cricket commentary for a wicket! ${batsmanName} is out ${wicketType || 'bowled'} by ${bowlerName}. Keep it under 20 words.`,
    wide: `Generate cricket commentary for a wide ball bowled by ${bowlerName}. Keep it under 15 words.`,
    'no-ball': `Generate cricket commentary for a no-ball bowled by ${bowlerName}. Keep it under 15 words.`,
    bye: `Generate cricket commentary for a bye off ${bowlerName}'s bowling. Keep it under 15 words.`,
    'leg-bye': `Generate cricket commentary for a leg bye off ${bowlerName}'s bowling. Keep it under 15 words.`,
  };
  
  return prompts[outcome] || 'Generate cricket commentary for this ball.';
}
