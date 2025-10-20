import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Trophy, TrendingUp, Award } from "lucide-react";
import { HeroBanner } from "./HeroBanner";
import { HeroBanner } from "./HeroBanner";

interface LeaderboardEntry {
  rank: number;
  username: string;
  points: number;
  level: number;
  winRate: number;
  country: string;
}

export function LeaderboardPage() {
  const leaderboard: LeaderboardEntry[] = [
    { rank: 1, username: "CalcioMaster", points: 45890, level: 42, winRate: 89, country: "IT" },
    { rank: 2, username: "TifosoPro", points: 43210, level: 40, winRate: 87, country: "IT" },
    { rank: 3, username: "FootballKing", points: 41560, level: 39, winRate: 85, country: "ES" },
    { rank: 4, username: "SerieAFan", points: 38920, level: 38, winRate: 84, country: "IT" },
    { rank: 5, username: "GoalGetter", points: 36450, level: 37, winRate: 82, country: "FR" },
    { rank: 6, username: "MilanLegend", points: 34780, level: 36, winRate: 81, country: "IT" },
    { rank: 7, username: "InterForever", points: 32190, level: 35, winRate: 79, country: "IT" },
  ];
  
  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-[#FFD700]";
    if (rank === 2) return "text-[#C0C0C0]";
    if (rank === 3) return "text-[#CD7F32]";
    return "text-[#A9AFBC]";
  };
  
  const getRankIcon = (rank: number) => {
    if (rank <= 3) return <Trophy className={`w-5 h-5 ${getRankColor(rank)}`} />;
    return <span className="text-[#A9AFBC]">#{rank}</span>;
  };
  
  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1559930198-26e8d7f0a4f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjcm93ZCUyMGNoZWVyaW5nfGVufDF8fHx8MTc1OTg2MzMzNHww&ixlib=rb-4.1.0&q=80&w=1080"
        title="Classifica Globale"
        subtitle="Compete con i migliori giocatori della community SPORTIUM"
        badge="TOP FANS"
        height="small"
      />
      
      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[1, 0, 2].map((idx) => {
          const player = leaderboard[idx];
          const isFirst = player.rank === 1;
          
          return (
            <Card 
              key={player.rank}
              className={`${
                isFirst 
                  ? "bg-gradient-to-br from-[#FFD700]/20 to-transparent border-[#FFD700]/30 order-2" 
                  : "bg-[#111318] border-white/10"
              } ${player.rank === 2 ? "order-1" : player.rank === 3 ? "order-3" : ""}`}
            >
              <div className="p-4 text-center space-y-3">
                <div className="relative inline-block">
                  <Avatar className={`w-16 h-16 border-2 ${
                    isFirst ? "border-[#FFD700]" : player.rank === 2 ? "border-[#C0C0C0]" : "border-[#CD7F32]"
                  }`}>
                    <AvatarFallback className="bg-[#2B2F3A] text-white">
                      {player.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -top-2 -right-2 w-8 h-8 rounded-full ${
                    isFirst ? "bg-[#FFD700]" : player.rank === 2 ? "bg-[#C0C0C0]" : "bg-[#CD7F32]"
                  } flex items-center justify-center text-[#0A1020]`}>
                    {player.rank}
                  </div>
                </div>
                <div>
                  <div className="text-white mb-1">{player.username}</div>
                  <div className="text-sm text-[#A9AFBC]">Livello {player.level}</div>
                </div>
                <div className="text-lg text-[#A7FF1A]">
                  {player.points.toLocaleString()} FP
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      
      {/* Filters */}
      <Tabs defaultValue="global" className="space-y-6">
        <TabsList className="bg-[#2B2F3A] border-white/10">
          <TabsTrigger value="global" className="data-[state=active]:bg-[#A7FF1A] data-[state=active]:text-[#0A1020]">
            Globale
          </TabsTrigger>
          <TabsTrigger value="friends" className="data-[state=active]:bg-[#A7FF1A] data-[state=active]:text-[#0A1020]">
            Amici
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-[#A7FF1A] data-[state=active]:text-[#0A1020]">
            Team
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="global" className="space-y-3">
          {leaderboard.map((player) => (
            <Card 
              key={player.rank}
              className="bg-[#111318] border-white/10 hover:border-[#A7FF1A]/30 transition-all"
            >
              <div className="p-4 flex items-center gap-4">
                <div className="w-12 text-center">
                  {getRankIcon(player.rank)}
                </div>
                
                <Avatar className="w-12 h-12 border-2 border-white/10">
                  <AvatarFallback className="bg-[#2B2F3A] text-white">
                    {player.username.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-white">{player.username}</span>
                    <Badge variant="outline" className="text-xs border-white/10">
                      {player.country}
                    </Badge>
                    {player.level >= 40 && (
                      <Award className="w-4 h-4 text-[#A7FF1A]" />
                    )}
                  </div>
                  <div className="text-sm text-[#A9AFBC] mt-1">
                    Livello {player.level} • Win Rate {player.winRate}%
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-lg text-[#A7FF1A]">{player.points.toLocaleString()}</div>
                  <div className="text-xs text-[#A9AFBC]">punti</div>
                </div>
              </div>
            </Card>
          ))}
        </TabsContent>
        
        <TabsContent value="friends" className="text-center py-12 text-[#A9AFBC]">
          Aggiungi amici per vedere la loro classifica
        </TabsContent>
        
        <TabsContent value="team" className="text-center py-12 text-[#A9AFBC]">
          Unisciti a un team per competere insieme
        </TabsContent>
      </Tabs>
      
      {/* Your Position */}
      <Card className="bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30">
        <div className="p-4 flex items-center gap-4">
          <div className="w-12 text-center">
            <div className="flex items-center gap-1 text-[#A7FF1A]">
              <TrendingUp className="w-4 h-4" />
              <span>#124</span>
            </div>
          </div>
          
          <Avatar className="w-12 h-12 border-2 border-[#A7FF1A]">
            <AvatarFallback className="bg-[#A7FF1A] text-[#0A1020]">
              TU
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <div className="text-white">La tua posizione</div>
            <div className="text-sm text-[#A9AFBC]">Livello 28 • Win Rate 76%</div>
          </div>
          
          <div className="text-right">
            <div className="text-lg text-[#A7FF1A]">18,450</div>
            <div className="text-xs text-[#A9AFBC]">punti</div>
          </div>
        </div>
      </Card>
    </div>
  );
}