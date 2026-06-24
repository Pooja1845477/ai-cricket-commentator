import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { trpc } from '@/lib/trpc';
import { Calendar, Trophy, RotateCcw, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface MatchHistoryItem {
  id: number;
  team1: string;
  team2: string;
  team1Runs: number;
  team1Wickets: number;
  team2Runs: number;
  team2Wickets: number;
  format: string;
  winner: string;
  createdAt: Date;
}

export default function MatchHistory() {
  const [, navigate] = useLocation();
  const [matches, setMatches] = useState<MatchHistoryItem[]>([]);

  const historyQuery = trpc.history.list.useQuery();

  useEffect(() => {
    if (historyQuery.data) {
      const formattedMatches = historyQuery.data.map((match: any) => ({
        id: match.id,
        team1: match.team1Name,
        team2: match.team2Name,
        team1Runs: match.team1Runs || 0,
        team1Wickets: match.team1Wickets || 0,
        team2Runs: match.team2Runs || 0,
        team2Wickets: match.team2Wickets || 0,
        format: match.format,
        winner: match.winner || 'TBD',
        createdAt: new Date(match.createdAt),
      }));
      setMatches(formattedMatches);
    }
  }, [historyQuery.data]);

  const handleReplayMatch = (matchId: number) => {
    navigate(`/match/${matchId}/replay`);
  };

  return (
    <div className="min-h-screen cricket-field-bg py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Trophy className="w-8 h-8 text-accent" />
            Match History
          </h1>
          <p className="text-muted-foreground">
            Browse and replay your previous cricket matches
          </p>
        </div>

        {historyQuery.isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 bg-card/50" />
            ))}
          </div>
        ) : matches.length === 0 ? (
          <Card className="bg-card border border-border/50">
            <CardContent className="p-12 text-center">
              <Trophy className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No matches yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Create and play your first cricket match to see it here
              </p>
              <Button
                onClick={() => navigate('/setup')}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                Create New Match
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {matches.map((match) => (
              <Card
                key={match.id}
                className="bg-card border border-border/50 hover:border-accent/50 transition-colors"
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-3">
                        <Badge className="bg-accent/20 text-accent">
                          {match.format}
                        </Badge>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {formatDistanceToNow(new Date(match.createdAt), {
                            addSuffix: true,
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        {/* Team 1 */}
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {match.team1}
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            {match.team1Runs}
                            <span className="text-lg text-muted-foreground ml-1">
                              /{match.team1Wickets}
                            </span>
                          </p>
                        </div>

                        {/* VS */}
                        <div className="flex items-center justify-center">
                          <span className="text-muted-foreground font-semibold">
                            VS
                          </span>
                        </div>

                        {/* Team 2 */}
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">
                            {match.team2}
                          </p>
                          <p className="text-2xl font-bold text-foreground">
                            {match.team2Runs}
                            <span className="text-lg text-muted-foreground ml-1">
                              /{match.team2Wickets}
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 pt-3 border-t border-border/30">
                        <p className="text-sm">
                          <span className="text-muted-foreground">Winner: </span>
                          <span className="font-semibold text-accent">
                            {match.winner}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <Button
                        onClick={() => handleReplayMatch(match.id)}
                        variant="outline"
                        className="border-border/50 hover:bg-accent/10 gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Replay
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-accent hover:bg-accent/10 gap-2"
                      >
                        <ChevronRight className="w-4 h-4" />
                        Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
