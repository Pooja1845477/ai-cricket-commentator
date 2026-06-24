import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLocation } from "wouter";
import { Zap, TrendingUp, Users, Sparkles, ArrowRight, Play } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen cricket-field-bg overflow-hidden">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b border-border/20">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-background" />
            </div>
            <h1 className="text-2xl font-bold gradient-text">Cricket AI</h1>
          </div>
          <Button
            onClick={() => navigate("/setup")}
            className="btn-premium flex items-center gap-2"
          >
            <Play className="w-4 h-4" />
            New Match
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container py-20 sm:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight">
                Experience{" "}
                <span className="gradient-text">Cricket Like Never Before</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Simulate realistic cricket matches with AI-powered commentary, 
                ball-by-ball analysis, and stunning live scoreboard. Create, play, 
                and replay your perfect cricket moments.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button
                onClick={() => navigate("/setup")}
                className="btn-premium px-8 py-4 text-lg flex items-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Start Simulating
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => navigate("/history")}
                variant="outline"
                className="px-8 py-4 text-lg border-accent/30 hover:bg-accent/10 text-accent"
              >
                View History
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="premium-card p-4">
                <div className="text-3xl font-bold gradient-text">∞</div>
                <p className="text-sm text-muted-foreground mt-2">Matches</p>
              </div>
              <div className="premium-card p-4">
                <div className="text-3xl font-bold accent-glow">AI</div>
                <p className="text-sm text-muted-foreground mt-2">Commentary</p>
              </div>
              <div className="premium-card p-4">
                <div className="text-3xl font-bold gradient-text">100%</div>
                <p className="text-sm text-muted-foreground mt-2">Realistic</p>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className="animate-fade-in-down relative h-96 sm:h-full min-h-96">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-secondary/20 rounded-3xl blur-3xl" />
            <div className="relative premium-card h-full flex items-center justify-center p-8 animate-pulse-glow">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center animate-scale-in">
                  <Play className="w-12 h-12 text-background" />
                </div>
                <h3 className="text-2xl font-bold">Ready to Play?</h3>
                <p className="text-muted-foreground">Create your first match and experience AI commentary</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container py-20 space-y-12">
        <div className="text-center space-y-4 animate-fade-in-up">
          <h2 className="text-4xl sm:text-5xl font-bold">
            Packed with <span className="gradient-text">Amazing Features</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for the ultimate cricket simulation experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              icon: Zap,
              title: "AI Commentary",
              description: "Realistic, varied commentary for every ball powered by advanced AI",
              color: "from-accent to-green-400",
            },
            {
              icon: TrendingUp,
              title: "Live Statistics",
              description: "Real-time scoreboard with run rates, strike rates, and detailed analytics",
              color: "from-secondary to-purple-400",
            },
            {
              icon: Users,
              title: "Team Management",
              description: "Configure teams, players, and match formats (T20, ODI, Test)",
              color: "from-blue-500 to-cyan-400",
            },
            {
              icon: Play,
              title: "Flexible Controls",
              description: "Auto-play with adjustable speed or manual ball-by-ball progression",
              color: "from-orange-500 to-red-400",
            },
            {
              icon: Sparkles,
              title: "Match Replay",
              description: "Replay any match with full commentary logs and detailed scorecards",
              color: "from-pink-500 to-rose-400",
            },
            {
              icon: TrendingUp,
              title: "Match History",
              description: "Browse and analyze all your previous matches with complete statistics",
              color: "from-yellow-500 to-amber-400",
            },
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="premium-card p-8 group hover:border-accent/50 animate-fade-in-up"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Your Matches Section */}
      <section className="container py-20 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-bold">Your Matches</h2>
          <Button
            onClick={() => navigate("/history")}
            variant="ghost"
            className="text-accent hover:bg-accent/10"
          >
            View All <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        <Card className="premium-card border-0">
          <CardContent className="p-12 text-center space-y-6">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center">
              <Play className="w-10 h-10 text-accent/50" />
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-2">No matches yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first cricket match to get started
              </p>
            </div>
            <Button
              onClick={() => navigate("/setup")}
              className="btn-premium px-8 py-3 inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Create Your First Match
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/20 py-12 mt-20">
        <div className="container text-center text-muted-foreground">
          <p>
            Crafted with <span className="text-accent">♥</span> for cricket enthusiasts
          </p>
        </div>
      </footer>
    </div>
  );
}
