import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import BattingScorecard, { BattingStats } from '@/components/BattingScorecard';
import BowlingScorecard, { BowlingStats } from '@/components/BowlingScorecard';
import CommentaryFeed, { CommentaryEntry } from '@/components/CommentaryFeed';
import { Trophy, MessageSquare } from 'lucide-react';

interface MatchDetailsData {
  id: number;
  team1: string;
  team2: string;
  format: string;
  winner: string;
  team1BattingStats: BattingStats[];
  team2BattingStats: BattingStats[];
  team1BowlingStats: BowlingStats[];
  team2BowlingStats: BowlingStats[];
  commentary: CommentaryEntry[];
  team1Runs: number;
  team1Wickets: number;
  team2Runs: number;
  team2Wickets: number;
  totalOvers: string;
}

export default function MatchDetails() {
  const [match, params] = useRoute<{ matchId: string }>('/match/:matchId/details');
  const [matchData, setMatchData] = useState<MatchDetailsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (match && params?.matchId) {
      // TODO: Fetch match details from API
      // For now, show loading state
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [match]);

  if (!match) return null;

  if (loading) {
    return (
      <div className="min-h-screen cricket-field-bg py-8">
        <div className="container space-y-6">
          <Skeleton className="h-32 bg-card/50" />
          <Skeleton className="h-96 bg-card/50" />
        </div>
      </div>
    );
  }

  if (!matchData) {
    return (
      <div className="min-h-screen cricket-field-bg py-8">
        <div className="container">
          <Card className="bg-card border border-border/50">
            <CardContent className="p-12 text-center">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                Match not found
              </h3>
              <p className="text-muted-foreground">
                The match you are looking for does not exist.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cricket-field-bg py-8">
      <div className="container">
        {/* Match Header */}
        <Card className="bg-card border border-border/50 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  {matchData.team1} vs {matchData.team2}
                </h1>
                <div className="flex gap-2">
                  <Badge className="bg-accent/20 text-accent">
                    {matchData.format}
                  </Badge>
                  <Badge className="bg-green-500/20 text-green-400">
                    Winner: {matchData.winner}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {matchData.team1}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {matchData.team1Runs}
                  <span className="text-lg text-muted-foreground ml-2">
                    /{matchData.team1Wickets}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  {matchData.team2}
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {matchData.team2Runs}
                  <span className="text-lg text-muted-foreground ml-2">
                    /{matchData.team2Wickets}
                  </span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="batting" className="space-y-6">
          <TabsList className="bg-card border border-border/50 p-1">
            <TabsTrigger value="batting">Batting</TabsTrigger>
            <TabsTrigger value="bowling">Bowling</TabsTrigger>
            <TabsTrigger value="commentary" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Commentary
            </TabsTrigger>
          </TabsList>

          {/* Batting Tab */}
          <TabsContent value="batting" className="space-y-6">
            <BattingScorecard
              players={matchData.team1BattingStats}
              teamName={matchData.team1}
              totalRuns={matchData.team1Runs}
              totalWickets={matchData.team1Wickets}
              totalOvers={matchData.totalOvers}
            />
            <BattingScorecard
              players={matchData.team2BattingStats}
              teamName={matchData.team2}
              totalRuns={matchData.team2Runs}
              totalWickets={matchData.team2Wickets}
              totalOvers={matchData.totalOvers}
            />
          </TabsContent>

          {/* Bowling Tab */}
          <TabsContent value="bowling" className="space-y-6">
            <BowlingScorecard
              players={matchData.team1BowlingStats}
              teamName={matchData.team1}
            />
            <BowlingScorecard
              players={matchData.team2BowlingStats}
              teamName={matchData.team2}
            />
          </TabsContent>

          {/* Commentary Tab */}
          <TabsContent value="commentary">
            <Card className="bg-card border border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-accent" />
                  Match Commentary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CommentaryFeed entries={matchData.commentary} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
