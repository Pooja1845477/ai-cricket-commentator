import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Clock, TrendingUp } from 'lucide-react';

interface LiveScoreboardProps {
  team1Name: string;
  team1Code: string;
  team1Runs: number;
  team1Wickets: number;
  team2Name: string;
  team2Code: string;
  team2Runs?: number;
  team2Wickets?: number;
  currentOvers: string;
  totalOvers: number;
  currentRunRate: number;
  requiredRunRate?: number;
  isTeam1Batting: boolean;
  matchStatus: 'setup' | 'in-progress' | 'completed';
}

export default function LiveScoreboard({
  team1Name,
  team1Code,
  team1Runs,
  team1Wickets,
  team2Name,
  team2Code,
  team2Runs,
  team2Wickets,
  currentOvers,
  totalOvers,
  currentRunRate,
  requiredRunRate,
  isTeam1Batting,
  matchStatus,
}: LiveScoreboardProps) {
  const battingTeamName = isTeam1Batting ? team1Name : team2Name;
  const battingTeamCode = isTeam1Batting ? team1Code : team2Code;
  const battingTeamRuns = isTeam1Batting ? team1Runs : team2Runs || 0;
  const battingTeamWickets = isTeam1Batting ? team1Wickets : team2Wickets || 0;

  return (
    <div className="space-y-4">
      {/* Main Scoreboard */}
      <Card className="scoreboard overflow-hidden border border-border/50">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Team 1 Score */}
            <div className={`p-6 border-r border-border/30 ${isTeam1Batting ? 'bg-accent/5' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">{team1Code}</p>
                  <h3 className="text-2xl font-bold text-foreground">{team1Name}</h3>
                </div>
                {isTeam1Batting && (
                  <Badge className="bg-accent text-accent-foreground">Batting</Badge>
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold text-accent">{team1Runs}</span>
                <span className="text-2xl text-muted-foreground">/{team1Wickets}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Overs: <span className="text-foreground font-semibold">{currentOvers}</span></p>
              </div>
            </div>

            {/* Team 2 Score */}
            <div className={`p-6 ${!isTeam1Batting && team2Runs !== undefined ? 'bg-accent/5' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-muted-foreground uppercase tracking-wider">{team2Code}</p>
                  <h3 className="text-2xl font-bold text-foreground">{team2Name}</h3>
                </div>
                {!isTeam1Batting && team2Runs !== undefined && (
                  <Badge className="bg-accent text-accent-foreground">Batting</Badge>
                )}
              </div>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-5xl font-bold text-accent">
                  {team2Runs !== undefined ? team2Runs : '-'}
                </span>
                <span className="text-2xl text-muted-foreground">
                  {team2Wickets !== undefined ? `/${team2Wickets}` : '/-'}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Status: <span className="text-foreground font-semibold">
                  {team2Runs === undefined ? 'Yet to bat' : 'In progress'}
                </span></p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Match Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Overs */}
        <Card className="bg-card border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground uppercase">Overs</p>
                <p className="text-xl font-bold text-foreground">
                  {currentOvers} / {totalOvers}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Run Rate */}
        <Card className="bg-card border border-border/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-accent" />
              <div>
                <p className="text-xs text-muted-foreground uppercase">CRR</p>
                <p className="text-xl font-bold text-foreground">
                  {currentRunRate.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Required Run Rate */}
        {requiredRunRate !== undefined && team2Runs !== undefined && (
          <Card className="bg-card border border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase">RRR</p>
                  <p className="text-xl font-bold text-foreground">
                    {requiredRunRate.toFixed(2)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Runs to Win */}
        {team2Runs !== undefined && (
          <Card className="bg-card border border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-accent" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase">Need</p>
                  <p className="text-xl font-bold text-foreground">
                    {Math.max(0, team1Runs - team2Runs + 1)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Match Status */}
      {matchStatus === 'completed' && (
        <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30">
          <CardContent className="p-4">
            <p className="text-center font-semibold text-foreground">
              Match Completed
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
