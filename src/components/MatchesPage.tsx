import { useState } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Clock, TrendingUp } from "lucide-react";
import { HeroBanner } from "./HeroBanner";
import { HeroBanner } from "./HeroBanner";

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league: string;
  time: string;
  status: "upcoming" | "live" | "finished";
  homeScore?: number;
  awayScore?: number;
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
}

export function MatchesPage() {
  const [selectedTab, setSelectedTab] = useState("live");
  
  const matches: Match[] = [
    {
      id: 1,
      homeTeam: "Inter",
      awayTeam: "Milan",
      league: "Serie A",
      time: "20:45",
      status: "upcoming",
      odds: { home: 2.10, draw: 3.40, away: 3.20 }
    },
    {
      id: 2,
      homeTeam: "Juventus",
      awayTeam: "Napoli",
      league: "Serie A",
      time: "LIVE 67'",
      status: "live",
      homeScore: 1,
      awayScore: 1,
      odds: { home: 1.85, draw: 3.60, away: 4.20 }
    },
    {
      id: 3,
      homeTeam: "Roma",
      awayTeam: "Lazio",
      league: "Serie A",
      time: "18:00",
      status: "upcoming",
      odds: { home: 2.30, draw: 3.20, away: 3.10 }
    },
  ];
  
  const liveMatches = matches.filter(m => m.status === "live");
  const upcomingMatches = matches.filter(m => m.status === "upcoming");
  
  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1746333253387-5aac26260c96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1hdGNoJTIwYWN0aW9ufGVufDF8fHx8MTc1OTgyOTY3Mnww&ixlib=rb-4.1.0&q=80&w=1080"
        title="Partite & Pronostici"
        subtitle="Fai i tuoi pronostici sulle partite live e guadagna Fans Points"
        badge="LIVE"
        height="small"
      />
      
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="bg-[#2B2F3A] border-white/10">
          <TabsTrigger value="live" className="data-[state=active]:bg-[#A7FF1A] data-[state=active]:text-[#0A1020]">
            Live ({liveMatches.length})
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="data-[state=active]:bg-[#A7FF1A] data-[state=active]:text-[#0A1020]">
            Prossime ({upcomingMatches.length})
          </TabsTrigger>
          <TabsTrigger value="finished" className="data-[state=active]:bg-[#A7FF1A] data-[state=active]:text-[#0A1020]">
            Concluse
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="live" className="space-y-4">
          {liveMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </TabsContent>
        
        <TabsContent value="upcoming" className="space-y-4">
          {upcomingMatches.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </TabsContent>
        
        <TabsContent value="finished" className="space-y-4">
          <div className="text-center py-12 text-[#A9AFBC]">
            Nessuna partita conclusa oggi
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MatchCard({ match }: { match: Match }) {
  return (
    <Card className="bg-[#111318] border-white/10 overflow-hidden">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="border-[#00E0FF]/30 text-[#00E0FF]">
              {match.league}
            </Badge>
            {match.status === "live" && (
              <Badge className="bg-destructive/20 text-destructive border-0 animate-pulse">
                LIVE
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-[#A9AFBC] text-sm">
            <Clock className="w-4 h-4" />
            {match.time}
          </div>
        </div>
        
        {/* Teams */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-white">{match.homeTeam}</span>
            {match.homeScore !== undefined && (
              <span className="text-2xl text-[#A7FF1A]">{match.homeScore}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-white">{match.awayTeam}</span>
            {match.awayScore !== undefined && (
              <span className="text-2xl text-[#A7FF1A]">{match.awayScore}</span>
            )}
          </div>
        </div>
        
        {/* Odds */}
        {match.odds && (
          <div className="pt-3 border-t border-white/10">
            <div className="flex items-center gap-2 mb-3 text-sm text-[#A9AFBC]">
              <TrendingUp className="w-4 h-4" />
              Quote
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                className="flex-col h-auto py-3 border-white/10 hover:border-[#A7FF1A]/50 hover:bg-[#A7FF1A]/10"
              >
                <span className="text-xs text-[#A9AFBC] mb-1">1</span>
                <span className="text-white">{match.odds.home}</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-3 border-white/10 hover:border-[#A7FF1A]/50 hover:bg-[#A7FF1A]/10"
              >
                <span className="text-xs text-[#A9AFBC] mb-1">X</span>
                <span className="text-white">{match.odds.draw}</span>
              </Button>
              <Button
                variant="outline"
                className="flex-col h-auto py-3 border-white/10 hover:border-[#A7FF1A]/50 hover:bg-[#A7FF1A]/10"
              >
                <span className="text-xs text-[#A9AFBC] mb-1">2</span>
                <span className="text-white">{match.odds.away}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}