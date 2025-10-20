import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Trophy, ChevronRight } from "lucide-react";
import { HeroBanner } from "./HeroBanner";

interface Match {
  id: string;
  team1: string;
  team2: string;
  score1?: number;
  score2?: number;
  winner?: string;
  prediction?: string;
}

export function BracketPage() {
  const [selectedTournament, setSelectedTournament] = useState("champions");

  const tournaments = [
    { id: "champions", name: "Champions League", prize: 10000, participants: 847 },
    { id: "worldcup", name: "Coppa del Mondo", prize: 50000, participants: 2341 },
    { id: "euro", name: "Europei", prize: 25000, participants: 1523 }
  ];

  // Simplified bracket structure
  const rounds = [
    {
      name: "Ottavi",
      matches: [
        { id: "r1m1", team1: "Inter", team2: "Man City", prediction: "Inter" },
        { id: "r1m2", team1: "Bayern", team2: "PSG", prediction: null },
        { id: "r1m3", team1: "Real Madrid", team2: "Liverpool", prediction: "Real Madrid" },
        { id: "r1m4", team1: "Barcelona", team2: "Chelsea", prediction: null }
      ]
    },
    {
      name: "Quarti",
      matches: [
        { id: "r2m1", team1: "?", team2: "?", prediction: null },
        { id: "r2m2", team1: "?", team2: "?", prediction: null }
      ]
    },
    {
      name: "Semifinali",
      matches: [
        { id: "r3m1", team1: "?", team2: "?", prediction: null }
      ]
    },
    {
      name: "Finale",
      matches: [
        { id: "r4m1", team1: "?", team2: "?", prediction: null }
      ]
    }
  ];

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGFtcGlvbnMlMjBsZWFndWUlMjB0cm9waHl8ZW58MXx8fHwxNzU5ODYzMzM3fDA&ixlib=rb-4.1.0&q=80&w=1080"
        title="Bracket Predictions"
        subtitle="Pronostica l'intero torneo e vinci premi enormi!"
        badge="TORNEI"
        height="small"
      />

      {/* Tournament Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tournaments.map((tournament) => (
          <Card
            key={tournament.id}
            onClick={() => setSelectedTournament(tournament.id)}
            className={`p-6 cursor-pointer transition-all ${
              selectedTournament === tournament.id
                ? "bg-gradient-to-br from-[#A7FF1A]/20 to-transparent border-[#A7FF1A]/50"
                : "bg-[#111318] border-white/10 hover:border-[#A7FF1A]/30"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-white">{tournament.name}</h3>
                <Trophy className={`w-5 h-5 ${
                  selectedTournament === tournament.id ? "text-[#A7FF1A]" : "text-[#A9AFBC]"
                }`} />
              </div>
              <div className="text-sm text-[#A9AFBC]">
                {tournament.participants.toLocaleString()} partecipanti
              </div>
              <Badge className="bg-[#A7FF1A]/10 text-[#A7FF1A] border-[#A7FF1A]/30 border">
                Premio: {tournament.prize.toLocaleString()} FP
              </Badge>
            </div>
          </Card>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-[#111318] border-white/10 text-center">
          <div className="text-2xl text-[#A7FF1A] mb-1">8/16</div>
          <p className="text-xs text-[#A9AFBC]">Pronostici Fatti</p>
        </Card>
        <Card className="p-4 bg-[#111318] border-white/10 text-center">
          <div className="text-2xl text-[#00E0FF] mb-1">3/3</div>
          <p className="text-xs text-[#A9AFBC]">Corretti</p>
        </Card>
        <Card className="p-4 bg-[#111318] border-white/10 text-center">
          <div className="text-2xl text-white mb-1">#127</div>
          <p className="text-xs text-[#A9AFBC]">Rank</p>
        </Card>
        <Card className="p-4 bg-[#111318] border-white/10 text-center">
          <div className="text-2xl text-purple-400 mb-1">1200</div>
          <p className="text-xs text-[#A9AFBC]">Punti</p>
        </Card>
      </div>

      {/* Bracket Visualization */}
      <Card className="p-6 bg-[#111318] border-white/10 overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex gap-8">
            {rounds.map((round, roundIndex) => (
              <div key={roundIndex} className="flex-1 space-y-4">
                <h4 className="text-white text-center mb-6">{round.name}</h4>
                <div className="space-y-8">
                  {round.matches.map((match) => (
                    <div key={match.id} className="relative">
                      <Card className={`p-4 space-y-2 ${
                        match.prediction 
                          ? "bg-[#A7FF1A]/10 border-[#A7FF1A]/30"
                          : "bg-[#2B2F3A] border-white/10"
                      }`}>
                        <div className={`flex items-center justify-between p-2 rounded ${
                          match.prediction === match.team1 ? "bg-[#A7FF1A]/20" : ""
                        }`}>
                          <span className="text-white text-sm">{match.team1}</span>
                          {match.score1 !== undefined && (
                            <span className="text-white">{match.score1}</span>
                          )}
                        </div>
                        <div className="h-px bg-white/10" />
                        <div className={`flex items-center justify-between p-2 rounded ${
                          match.prediction === match.team2 ? "bg-[#A7FF1A]/20" : ""
                        }`}>
                          <span className="text-white text-sm">{match.team2}</span>
                          {match.score2 !== undefined && (
                            <span className="text-white">{match.score2}</span>
                          )}
                        </div>
                        {!match.prediction && match.team1 !== "?" && (
                          <Button 
                            size="sm"
                            className="w-full bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
                          >
                            Pronostica
                          </Button>
                        )}
                      </Card>
                      {roundIndex < rounds.length - 1 && (
                        <div className="absolute top-1/2 -right-4 -translate-y-1/2">
                          <ChevronRight className="w-4 h-4 text-[#A9AFBC]" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Leaderboard */}
      <Card className="p-6 bg-[#111318] border-white/10">
        <h3 className="text-white mb-4">Classifica Bracket</h3>
        <div className="space-y-3">
          {[
            { rank: 1, name: "PredictionKing", correct: 16, points: 5000, badge: "🥇" },
            { rank: 2, name: "CalcioOracle", correct: 15, points: 4800, badge: "🥈" },
            { rank: 3, name: "TacticsGuru", correct: 14, points: 4500, badge: "🥉" },
            { rank: 127, name: "You", correct: 3, points: 1200, badge: "" },
          ].map((user) => (
            <div 
              key={user.rank}
              className={`flex items-center justify-between p-3 rounded-lg ${
                user.name === "You" 
                  ? "bg-[#A7FF1A]/10 border border-[#A7FF1A]/30" 
                  : "bg-[#2B2F3A]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl w-8 text-center">{user.badge || `#${user.rank}`}</span>
                <span className={user.name === "You" ? "text-[#A7FF1A]" : "text-white"}>
                  {user.name}
                </span>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="text-[#A9AFBC]">{user.correct}/16 corretti</div>
                <div className="text-[#A7FF1A]">{user.points} pts</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
