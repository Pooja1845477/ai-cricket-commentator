import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Plus, Trash2, Play, Users, Settings, Zap } from 'lucide-react';

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
        {/* Header */}
        <div className="mb-12 animate-fade-in-down">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <Settings className="w-6 h-6 text-background" />
            </div>
            <h1 className="text-5xl font-bold">
              Set Up Your <span className="gradient-text">Match</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">Configure teams, players, and match format</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Match Format */}
          <Card className="lg:col-span-3 premium-card border-0 animate-fade-in-up">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                <CardTitle>Match Format</CardTitle>
              </div>
              <CardDescription>Choose your match format</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(['T20', 'ODI', 'Test'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => {
                      setFormat(fmt);
                      setOvers(formatOversOptions[fmt]);
                    }}
                    className={`premium-card p-6 text-center transition-all ${
                      format === fmt
                        ? 'border-accent ring-2 ring-accent/50 bg-accent/10'
                        : ''
                    }`}
                  >
                    <div className="text-3xl font-bold mb-2">{fmt}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatOversOptions[fmt]} overs
                    </div>
                    {format === fmt && (
                      <div className="text-accent text-xs font-semibold mt-3">✓ Selected</div>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Team 1 Setup */}
          <Card className="premium-card border-0 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <CardHeader className="pb-4 border-b border-border/30">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-accent" />
                <CardTitle className="text-accent">{team1Name}</CardTitle>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Team name"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  className="bg-input border-border/50 text-sm"
                />
                <Input
                  placeholder="Code"
                  value={team1Code}
                  onChange={(e) => setTeam1Code(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="bg-input border-border/50 text-sm w-20"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {team1Players.map((player, idx) => (
                  <div key={idx} className="flex gap-2 items-end p-3 bg-background/50 rounded-lg border border-border/30 hover:border-accent/30 transition-colors">
                    <div className="flex-1 space-y-1">
                      <Input
                        placeholder="Player name"
                        value={player.name}
                        onChange={(e) => updatePlayer(1, idx, 'name', e.target.value)}
                        className="bg-input border-border/50 text-sm"
                      />
                      <Select value={player.role} onValueChange={(val) => updatePlayer(1, idx, 'role', val)}>
                        <SelectTrigger className="text-sm bg-input border-border/50">
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
                      className="text-destructive hover:bg-destructive/20"
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
                className="w-full mt-4 text-accent border-accent/50 hover:bg-accent/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
              <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/30 text-center">
                <p className="text-sm font-semibold text-accent">{team1Players.length} Players</p>
              </div>
            </CardContent>
          </Card>

          {/* Team 2 Setup */}
          <Card className="premium-card border-0 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <CardHeader className="pb-4 border-b border-border/30">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-secondary" />
                <CardTitle className="text-secondary">{team2Name}</CardTitle>
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder="Team name"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  className="bg-input border-border/50 text-sm"
                />
                <Input
                  placeholder="Code"
                  value={team2Code}
                  onChange={(e) => setTeam2Code(e.target.value.toUpperCase())}
                  maxLength={3}
                  className="bg-input border-border/50 text-sm w-20"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {team2Players.map((player, idx) => (
                  <div key={idx} className="flex gap-2 items-end p-3 bg-background/50 rounded-lg border border-border/30 hover:border-secondary/30 transition-colors">
                    <div className="flex-1 space-y-1">
                      <Input
                        placeholder="Player name"
                        value={player.name}
                        onChange={(e) => updatePlayer(2, idx, 'name', e.target.value)}
                        className="bg-input border-border/50 text-sm"
                      />
                      <Select value={player.role} onValueChange={(val) => updatePlayer(2, idx, 'role', val)}>
                        <SelectTrigger className="text-sm bg-input border-border/50">
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
                      className="text-destructive hover:bg-destructive/20"
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
                className="w-full mt-4 text-secondary border-secondary/50 hover:bg-secondary/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Player
              </Button>
              <div className="mt-4 p-3 bg-secondary/10 rounded-lg border border-secondary/30 text-center">
                <p className="text-sm font-semibold text-secondary">{team2Players.length} Players</p>
              </div>
            </CardContent>
          </Card>

          {/* Summary and Start */}
          <Card className="lg:col-span-3 premium-card border-0 animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <CardHeader className="pb-4">
              <CardTitle>Match Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-background/50 rounded-lg border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">Format</p>
                  <p className="text-2xl font-bold text-accent">{format}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">Overs</p>
                  <p className="text-2xl font-bold text-accent">{overs}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">{team1Name}</p>
                  <p className="text-2xl font-bold text-accent">{team1Players.length}</p>
                </div>
                <div className="p-4 bg-background/50 rounded-lg border border-border/30">
                  <p className="text-sm text-muted-foreground mb-1">{team2Name}</p>
                  <p className="text-2xl font-bold text-secondary">{team2Players.length}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="flex-1 border-border/50 hover:bg-background/50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateMatch}
                  disabled={createMatch.isPending}
                  className="flex-1 btn-premium flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5" />
                  {createMatch.isPending ? 'Creating...' : 'Start Match'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
