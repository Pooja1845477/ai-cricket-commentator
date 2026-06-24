import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { BarChart3 } from 'lucide-react';

export interface BattingStats {
  playerId: number;
  playerName: string;
  runs: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  isOut: boolean;
  dismissalType?: string;
}

interface BattingScorecardProps {
  players: BattingStats[];
  teamName: string;
  totalRuns: number;
  totalWickets: number;
  totalOvers: string;
}

export default function BattingScorecard({
  players,
  teamName,
  totalRuns,
  totalWickets,
  totalOvers,
}: BattingScorecardProps) {
  const calculateStrikeRate = (runs: number, balls: number) => {
    return balls > 0 ? ((runs / balls) * 100).toFixed(2) : '0.00';
  };

  return (
    <Card className="bg-card border border-border/50">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              {teamName} - Batting Scorecard
            </CardTitle>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-accent">{totalRuns}</p>
            <p className="text-xs text-muted-foreground">
              {totalWickets} wickets • {totalOvers} overs
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/30">
              <TableHead className="text-left px-4 py-3">Player</TableHead>
              <TableHead className="text-center px-4 py-3">Runs</TableHead>
              <TableHead className="text-center px-4 py-3">Balls</TableHead>
              <TableHead className="text-center px-4 py-3">4s</TableHead>
              <TableHead className="text-center px-4 py-3">6s</TableHead>
              <TableHead className="text-center px-4 py-3">SR</TableHead>
              <TableHead className="text-center px-4 py-3">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow
                key={player.playerId}
                className="border-b border-border/20 hover:bg-accent/5 transition-colors"
              >
                <TableCell className="px-4 py-3 font-medium text-foreground">
                  {player.playerName}
                </TableCell>
                <TableCell className="text-center px-4 py-3 font-semibold text-accent">
                  {player.runs}
                </TableCell>
                <TableCell className="text-center px-4 py-3">
                  {player.ballsFaced}
                </TableCell>
                <TableCell className="text-center px-4 py-3">
                  {player.fours}
                </TableCell>
                <TableCell className="text-center px-4 py-3">
                  {player.sixes}
                </TableCell>
                <TableCell className="text-center px-4 py-3">
                  {calculateStrikeRate(player.runs, player.ballsFaced)}
                </TableCell>
                <TableCell className="text-center px-4 py-3">
                  {player.isOut ? (
                    <Badge className="bg-destructive/20 text-destructive">
                      {player.dismissalType || 'Out'}
                    </Badge>
                  ) : (
                    <Badge className="bg-accent/20 text-accent">Not Out</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
