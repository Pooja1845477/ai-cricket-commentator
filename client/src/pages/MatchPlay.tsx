import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Loader2, Play, Pause, SkipForward, Home as HomeIcon } from 'lucide-react';
import LiveScoreboard from '@/components/LiveScoreboard';
import CommentaryFeed, { CommentaryEntry, CommentaryEventType } from '@/components/CommentaryFeed';

export default function MatchPlay({ params }: any) {
  const [, navigate] = useLocation();
  const id = parseInt(params.matchId);

  // Queries
  const matchQuery = trpc.match.get.useQuery({ matchId: id });
  const ballsQuery = trpc.ball.getInnings.useQuery({ inningsId: 0 }, { enabled: false });

  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [inningsId, setInningsId] = useState<number | null>(null);
  const [commentaryEntries, setCommentaryEntries] = useState<CommentaryEntry[]>([]);
  const [totalRuns, setTotalRuns] = useState(0);
  const [totalWickets, setTotalWickets] = useState(0);
  const [totalBalls, setTotalBalls] = useState(0);
  const [currentOvers, setCurrentOvers] = useState('0.0');

  const simulateBall = trpc.ball.simulate.useMutation();

  // Initialize match
  useEffect(() => {
    if (matchQuery.data?.match && !inningsId) {
      // For now, create a simple innings setup
      // In real scenario, would call match.start mutation
      setInningsId(1);
    }
  }, [matchQuery.data, inningsId]);

  // Auto-play logic
  useEffect(() => {
    if (!isPlaying || !inningsId) return;

    const interval = setInterval(() => {
      handleSimulateBall();
    }, 3000 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, inningsId]);

  const handleSimulateBall = async () => {
    if (!inningsId || !matchQuery.data?.team1Players || !matchQuery.data?.team2Players) return;

    try {
      // Get random batsman and bowler
      const batsmanId = matchQuery.data.team1Players[0]?.id || 1;
      const bowlerId = matchQuery.data.team2Players[0]?.id || 2;

      const result = await simulateBall.mutateAsync({
        inningsId,
        batsmanId,
        bowlerId,
      });

      // Add to commentary
      const ballNum = totalBalls + 1;
      const newEntry: CommentaryEntry = {
        id: Date.now(),
        ballNumber: ballNum,
        over: result.overs || currentOvers,
        eventType: result.outcome as CommentaryEventType,
        commentary: result.commentary,
        timestamp: Date.now(),
      };

      setCommentaryEntries((prev) => [newEntry, ...prev]);
      setTotalRuns(result.totalRuns);
      setTotalWickets(result.totalWickets);
      setTotalBalls(ballNum);
      setCurrentOvers(result.overs || currentOvers);

      // Stop if 10 wickets
      if (result.totalWickets >= 10) {
        setIsPlaying(false);
        toast.success('Innings completed!');
      }
    } catch (error) {
      console.error('Failed to simulate ball:', error);
      toast.error('Failed to simulate ball');
      setIsPlaying(false);
    }
  };

  if (matchQuery.isLoading) {
    return (
      <div className="min-h-screen cricket-field-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!matchQuery.data) {
    return (
      <div className="min-h-screen cricket-field-bg flex items-center justify-center">
            <Card className="bg-card border border-border/50">
              <CardContent className="p-8 text-center">
                <p className="text-foreground mb-4">Match not found</p>
            <Button onClick={() => navigate('/')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
              <HomeIcon className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const match = matchQuery.data.match;

  return (
    <div className="min-h-screen cricket-field-bg py-8">
      <div className="container">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              {match.format} Match - {match.overs} Overs
            </h1>
            <p className="text-muted-foreground">Ball-by-ball simulation with AI commentary</p>
          </div>
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border border-border/50 hover:bg-card"
            >
            <HomeIcon className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scoreboard */}
            <LiveScoreboard
              team1Name={match.team1Id.toString()}
              team1Code="T1"
              team1Runs={totalRuns}
              team1Wickets={totalWickets}
              team2Name={match.team2Id.toString()}
              team2Code="T2"
              currentOvers={currentOvers}
              totalOvers={match.overs}
              currentRunRate={totalBalls > 0 ? (totalRuns / (totalBalls / 6)) : 0}
              isTeam1Batting={true}
              matchStatus={match.status as any}
            />

            {/* Controls */}
            <Card className="bg-card border border-border/50">
              <CardHeader>
                <CardTitle>Match Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Auto Play
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleSimulateBall}
                    disabled={simulateBall.isPending}
                    variant="outline"
                    className="flex-1 border border-border/50 hover:bg-card"
                  >
                    <SkipForward className="w-4 h-4 mr-2" />
                    Next Ball
                  </Button>
                </div>

                {/* Speed Control */}
                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">
                    Speed: {speed}x
                  </label>
                  <Slider
                    value={[speed]}
                    onValueChange={(val) => setSpeed(val[0])}
                    min={0.5}
                    max={3}
                    step={0.5}
                    className="w-full"
                  />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border/50">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground uppercase">Runs</p>
                    <p className="text-2xl font-bold text-accent">{totalRuns}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground uppercase">Wickets</p>
                    <p className="text-2xl font-bold text-accent">{totalWickets}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground uppercase">Overs</p>
                    <p className="text-2xl font-bold text-accent">{currentOvers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Commentary Feed */}
          <div>
            <CommentaryFeed entries={commentaryEntries} isLive={isPlaying} />
          </div>
        </div>
      </div>
    </div>
  );
}
