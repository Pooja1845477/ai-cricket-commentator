import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Zap, AlertCircle, Target } from 'lucide-react';

export type CommentaryEventType = 
  | 'dot' | 'single' | 'two' | 'three' | 'four' | 'five' | 'six' 
  | 'wicket' | 'wide' | 'no-ball' | 'bye' | 'leg-bye';

export interface CommentaryEntry {
  id: number;
  ballNumber: number;
  over: string;
  eventType: CommentaryEventType;
  commentary: string;
  timestamp: number;
}

interface CommentaryFeedProps {
  entries: CommentaryEntry[];
  isLive?: boolean;
}

const eventConfig: Record<CommentaryEventType, { color: string; icon: React.ReactNode; label: string }> = {
  dot: { color: 'bg-muted/30 text-muted-foreground', icon: <MessageCircle className="w-4 h-4" />, label: 'Dot' },
  single: { color: 'bg-accent/20 text-accent', icon: <Target className="w-4 h-4" />, label: '1 Run' },
  two: { color: 'bg-accent/20 text-accent', icon: <Target className="w-4 h-4" />, label: '2 Runs' },
  three: { color: 'bg-accent/20 text-accent', icon: <Target className="w-4 h-4" />, label: '3 Runs' },
  four: { color: 'bg-accent/30 text-accent', icon: <Zap className="w-4 h-4" />, label: 'Boundary' },
  five: { color: 'bg-accent/30 text-accent', icon: <Zap className="w-4 h-4" />, label: '5 Runs' },
  six: { color: 'bg-accent/40 text-accent', icon: <Zap className="w-4 h-4" />, label: 'Six' },
  wicket: { color: 'bg-destructive/20 text-destructive', icon: <AlertCircle className="w-4 h-4" />, label: 'Wicket' },
  wide: { color: 'bg-destructive/15 text-destructive', icon: <AlertCircle className="w-4 h-4" />, label: 'Wide' },
  'no-ball': { color: 'bg-destructive/15 text-destructive', icon: <AlertCircle className="w-4 h-4" />, label: 'No Ball' },
  bye: { color: 'bg-accent/15 text-accent', icon: <Target className="w-4 h-4" />, label: 'Bye' },
  'leg-bye': { color: 'bg-accent/15 text-accent', icon: <Target className="w-4 h-4" />, label: 'Leg Bye' },
};

export default function CommentaryFeed({ entries, isLive = false }: CommentaryFeedProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest entry
  useEffect(() => {
    if (scrollRef.current && isLive) {
      scrollRef.current.scrollTop = 0;
    }
  }, [entries, isLive]);

  const sortedEntries = [...entries].sort((a, b) => b.timestamp - a.timestamp);

  return (
    <Card className="commentary-feed h-full border border-border/50">
          <CardHeader className="border-b border-border/50 pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-accent" />
            Commentary Feed
          </CardTitle>
          {isLive && (
            <Badge className="bg-red-600 text-white animate-pulse">
              LIVE
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-96">
          <div ref={scrollRef} className="space-y-3 p-4">
            {sortedEntries.length === 0 ? (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <p>No commentary yet. Start the match to begin!</p>
              </div>
            ) : (
              sortedEntries.map((entry) => {
                const config = eventConfig[entry.eventType];
                return (
                  <div
                    key={entry.id}
                    className={`p-3 rounded-lg border border-border/30 transition-all duration-300 hover:border-accent/50 ${config.color}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{config.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold uppercase tracking-wider">
                            {entry.over}.{entry.ballNumber}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {config.label}
                          </Badge>
                        </div>
                        <p className="text-sm leading-relaxed text-foreground">
                          {entry.commentary}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
