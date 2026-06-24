import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { getLoginUrl } from '@/const';
import { trpc } from '@/lib/trpc';
import { Loader2, Play, History, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const matchesQuery = trpc.match.list.useQuery(undefined, { enabled: isAuthenticated });

  if (authLoading) {
    return (
      <div className="min-h-screen cricket-field-bg flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen cricket-field-bg">
        <div className="container py-20">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4">
                AI Cricket Commentator
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Experience the thrill of cricket with AI-powered live commentary. 
                Simulate matches, enjoy realistic ball-by-ball action, and relive your favorite moments.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 my-12">
              <Card className="bg-card border border-border/50">
                <CardHeader>
                  <Zap className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Realistic Simulation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Experience authentic cricket outcomes with realistic probability distributions.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border/50">
                <CardHeader>
                  <Play className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>AI Commentary</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get unique, varied commentary for every ball powered by advanced LLMs.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-card border border-border/50">
                <CardHeader>
                  <History className="w-8 h-8 text-accent mb-2" />
                  <CardTitle>Match History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Save and replay all your matches with complete commentary logs.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8 py-6 text-lg"
            >
              <a href={getLoginUrl()}>
                Sign In to Play
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cricket-field-bg py-8">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Welcome, {user?.name || 'Cricket Fan'}!
            </h1>
            <p className="text-muted-foreground">Manage and simulate your cricket matches</p>
          </div>
          <Link href="/setup">
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
              <Play className="w-4 h-4 mr-2" />
              New Match
            </Button>
          </Link>
        </div>

        {/* Recent Matches */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Your Matches</h2>
          
          {matchesQuery.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : matchesQuery.data && matchesQuery.data.length > 0 ? (
            <div className="grid gap-4">
              {matchesQuery.data.map((match) => (
                <Link key={match.id} href={`/match/${match.id}`}>
                  <Card className="bg-card border border-border/50 hover:border-accent/50 cursor-pointer transition-colors">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className="bg-accent/20 text-accent">
                              {match.format}
                            </Badge>
                            <Badge variant="outline" className="text-muted-foreground">
                              {match.status}
                            </Badge>
                          </div>
                          <p className="text-foreground font-semibold">
                            {match.overs} Overs
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Created {formatDistanceToNow(new Date(match.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <Button variant="ghost" className="text-accent">
                          View Match →
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="bg-card border border-border/50">
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No matches yet. Create one to get started!</p>
                <Link href="/setup">
                  <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Play className="w-4 h-4 mr-2" />
                    Create Your First Match
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
