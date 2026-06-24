import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp } from 'lucide-react';

export interface BowlingStats {
  playerId: number;
  playerName: string;
  overs: string;
  runs: number;
  wickets: number;
  maidens: number;
  wides: number;
  noBalls: number;
}

interface BowlingScorecardProps {
  players: BowlingStats[];
  teamName: string;
}

export default function BowlingScorecard({
  players,
  teamName,
}: BowlingScorecardProps) {
  const calculateEconomyRate = (runs: number, overs: string) => {
    const [fullOvers, balls] = overs.split('.').map(Number);
    const totalBalls = (fullOvers || 0) * 6 + (balls || 0);
    return totalBalls > 0 ? ((runs / totalBalls) * 6).toFixed(2) : '0.00';
  };

  return (
    <Card className="bg-card border border-border/50">
      <CardHeader className="border-b border-border/50">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-accent" />
          <CardTitle>{teamName} - Bowling Scorecard</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-border/30">
              <TableHead className="text-left px-4 py-3">Bowler</TableHead>
              <TableHead className="text-center px-4 py-3">Overs</TableHead>
              <TableHead className="text-center px-4 py-3">Runs</TableHead>
              <TableHead className="text-center px-4 py-3">Wickets</TableHead>
              <TableHead className="text-center px-4 py-3">Maidens</TableHead>
              <TableHead className="text-center px-4 py-3">Economy</TableHead>
              <TableHead className="text-center px-4 py-3">Extras</TableHead>
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
                <TableCell className="text-center px-4 py-3">
                  {player.overs}
                </TableCell>
                <TableCell className="text-center px-4 py-3">
                  {player.runs}
                </TableCell>
                <TableCell className="text-center px-4 py-3">
                  <Badge className="bg-accent/20 text-accent">
                    {player.wickets}
                  </Badge>
                </TableCell>
                <TableCell className="text-center px-4 py-3">
                  {player.maidens}
                </TableCell>
                <TableCell className="text-center px-4 py-3 font-semibold">
                  {calculateEconomyRate(player.runs, player.overs)}
                </TableCell>
                <TableCell className="text-center px-4 py-3 text-sm">
                  {player.wides > 0 && (
                    <span className="text-destructive">{player.wides}w</span>
                  )}
                  {player.noBalls > 0 && (
                    <span className="text-destructive ml-1">{player.noBalls}nb</span>
                  )}
                  {player.wides === 0 && player.noBalls === 0 && '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
