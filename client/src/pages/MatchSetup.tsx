import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Plus, Trash2, Play } from 'lucide-react';

interface Player {
  name: string;
  role: 'batsman' | 'bowler' | 'all-rounder' | 'wicket-keeper';
  jerseyNumber?: number;
}

export default function MatchSetup() {
  const [, navigate] = useLocation();
  const createMatch = trpc.match.create.useMutation();

  // Team 1 state
  const [team1Name, setTeam1Name] = useState('Team A');
  const [team1Code, setTeam1Code] = useState('TA');
  const [team1Players, setTeam1Players] = useState<Player[]>([
    { name: 'Player 1', role: 'batsman' },
    { name: 'Player 2', role: 'bowler' },
  ]);

  // Team 2 state
  const [team2Name, setTeam2Name] = useState('Team B');
  const [team2Code, setTeam2Code] = useState('TB');
  const [team2Players, setTeam2Players] = useState<Player[]>([
    { name: 'Player 3', role: 'batsman' },
    { name: 'Player 4', role: 'bowler' },
  ]);

  // Match format
  const [format, setFormat] = useState<'T20' | 'ODI' | 'Test'>('T20');
  const [overs, setOvers] = useState(20);

  const formatOversOptions = {
    T20: 20,
    ODI: 50,
    Test: 90,
  };

  const addPlayer = (team: 1 | 2) => {
    const newPlayer: Player = {
      name: `Player ${team === 1 ? team1Players.length + 1 : team2Players.length + 1}`,
      role: 'batsman',
    };
    if (team === 1) {
      setTeam1Players([...team1Players, newPlayer]);
    } else {
      setTeam2Players([...team2Players, newPlayer]);
    }
  };

  const removePlayer = (team: 1 | 2, index: number) => {
    if (team === 1) {
      setTeam1Players(team1Players.filter((_, i) => i !== index));
    } else {
      setTeam2Players(team2Players.filter((_, i) => i !== index));
    }
  };

  const updatePlayer = (team: 1 | 2, index: number, field: keyof Player, value: any) => {
    if (team === 1) {
      const updated = [...team1Players];
      updated[index] = { ...updated[index], [field]: value };
      setTeam1Players(updated);
    } else {
      const updated = [...team2Players];
      updated[index] = { ...updated[index], [field]: value };
      setTeam2Players(updated);
    }
  };

  const handleCreateMatch = async () => {
    if (team1Players.length === 0 || team2Players.length === 0) {
      toast.error('Each team must have at least one player');
      return;
    }

    try {
      const result = await createMatch.mutateAsync({
        team1Name,
        team1Code,
        team2Name,
        team2Code,
        format,
        overs,
        team1Players,
        team2Players,
      });

      toast.success('Match created successfully!');
      navigate(`/match/${result.matchId}`);
    } catch (error) {
      toast.error('Failed to create match');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen cricket-field-bg py-8">
      <div className="container">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Cricket Match Setup</h1>
          <p className="text-muted-foreground">Configure teams and match settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Match Format */}
          <Card className="lg:col-span-3 bg-card border border-border/50">
            <CardHeader>
              <CardTitle>Match Format</CardTitle>
              <CardDescription>Choose your match format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['T20', 'ODI', 'Test'] as const).map((fmt) => (
                  <Button
                    key={fmt}
                    variant={format === fmt ? 'default' : 'outline'}
                    onClick={() => {
                      setFormat(fmt);
                      setOvers(formatOversOptions[fmt]);
                    }}
                    className="h-20 text-lg font-semibold"
                  >
                    {fmt}
                    <span className="block text-sm text-muted-foreground mt-1">
                      {formatOversOptions[fmt]} overs
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team 1 Setup */}
          <Card className="bg-card border border-border/50">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-accent">{team1Name}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Team name"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  className="text-sm"
                />
                <Input
                  placeholder="Code"
                  value={team1Code}
                  onChange={(e) => setTeam1Code(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="text-sm w-20"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {team1Players.map((player, idx) => (
                  <div key={idx} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Input
                        placeholder="Player name"
                        value={player.name}
                        onChange={(e) => updatePlayer(1, idx, 'name', e.target.value)}
                        className="text-sm"
                      />
                      <Select value={player.role} onValueChange={(val) => updatePlayer(1, idx, 'role', val)}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="batsman">Batsman</SelectItem>
                          <SelectItem value="bowler">Bowler</SelectItem>
                          <SelectItem value="all-rounder">All-rounder</SelectItem>
                          <SelectItem value="wicket-keeper">Wicket-keeper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlayer(1, idx)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addPlayer(1)}
                className="w-full mt-4 text-accent border-accent hover:bg-accent/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
            </CardContent>
          </Card>

          {/* Team 2 Setup */}
          <Card className="bg-card border border-border/50">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-accent">{team2Name}</CardTitle>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Team name"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  className="text-sm"
                />
                <Input
                  placeholder="Code"
                  value={team2Code}
                  onChange={(e) => setTeam2Code(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="text-sm w-20"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {team2Players.map((player, idx) => (
                  <div key={idx} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-1">
                      <Input
                        placeholder="Player name"
                        value={player.name}
                        onChange={(e) => updatePlayer(2, idx, 'name', e.target.value)}
                        className="text-sm"
                      />
                      <Select value={player.role} onValueChange={(val) => updatePlayer(2, idx, 'role', val)}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="batsman">Batsman</SelectItem>
                          <SelectItem value="bowler">Bowler</SelectItem>
                          <SelectItem value="all-rounder">All-rounder</SelectItem>
                          <SelectItem value="wicket-keeper">Wicket-keeper</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removePlayer(2, idx)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addPlayer(2)}
                className="w-full mt-4 text-accent border-accent hover:bg-accent/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
            </CardContent>
          </Card>

          {/* Summary and Start */}
          <Card className="lg:col-span-3 bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/30">
            <CardHeader>
              <CardTitle>Match Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Format</p>
                  <p className="text-lg font-semibold text-foreground">{format}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Overs</p>
                  <p className="text-lg font-semibold text-foreground">{overs}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{team1Name}</p>
                  <p className="text-lg font-semibold text-foreground">{team1Players.length} players</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{team2Name}</p>
                  <p className="text-lg font-semibold text-foreground">{team2Players.length} players</p>
                </div>
              </div>
              <Button
                onClick={handleCreateMatch}
                disabled={createMatch.isPending}
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 text-lg"
              >
                <Play className="w-5 h-5 mr-2" />
                {createMatch.isPending ? 'Creating Match...' : 'Start Match'}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
