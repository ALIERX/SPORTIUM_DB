import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Video, Users, MessageCircle, Volume2, Send, ThumbsUp, Smile } from "lucide-react";
import { HeroBanner } from "./HeroBanner";
import { Input } from "./ui/input";

interface WatchParty {
  id: string;
  match: string;
  host: string;
  viewers: number;
  maxViewers: number;
  status: "live" | "upcoming";
  startsIn?: string;
  rewards: number;
}

interface ChatMessage {
  id: string;
  user: string;
  message: string;
  timestamp: string;
  reactions: number;
}

export function WatchPartyPage() {
  const [selectedParty, setSelectedParty] = useState<string | null>(null);
  const [chatMessage, setChatMessage] = useState("");

  const parties: WatchParty[] = [
    {
      id: "1",
      match: "Inter vs Milan",
      host: "GiovanniNera",
      viewers: 847,
      maxViewers: 1000,
      status: "live",
      rewards: 500
    },
    {
      id: "2",
      match: "Juventus vs Napoli",
      host: "CalcioFan",
      viewers: 623,
      maxViewers: 1000,
      status: "live",
      rewards: 500
    },
    {
      id: "3",
      match: "Roma vs Lazio",
      host: "DerbyKing",
      viewers: 0,
      maxViewers: 500,
      status: "upcoming",
      startsIn: "2 ore",
      rewards: 300
    }
  ];

  const chatMessages: ChatMessage[] = [
    {
      id: "1",
      user: "InterFan1908",
      message: "Grande azione! Lautaro è in forma oggi! 🔥",
      timestamp: "2m fa",
      reactions: 12
    },
    {
      id: "2",
      user: "MilanSupporter",
      message: "Leão è troppo veloce, impossibile fermarlo",
      timestamp: "3m fa",
      reactions: 8
    },
    {
      id: "3",
      user: "CalcioTactics",
      message: "Secondo me dovrebbero cambiare modulo, 4-3-3 non funziona",
      timestamp: "5m fa",
      reactions: 15
    },
    {
      id: "4",
      user: "You",
      message: "GOOOOOL! Incredibile! 🎉⚽",
      timestamp: "Ora",
      reactions: 23
    }
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      // Handle sending message
      setChatMessage("");
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1522778119026-d647f0596c20?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYW5zJTIwd2F0Y2hpbmclMjBtYXRjaHxlbnwxfHx8fDE3NTk4NjMzMzZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
        title="Watch Party"
        subtitle="Guarda le partite insieme ad altri tifosi e guadagna bonus FP"
        badge="LIVE ORA"
        height="small"
      />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="p-4 bg-[#111318] border-white/10 text-center">
          <div className="text-2xl text-[#A7FF1A] mb-1">
            {parties.filter(p => p.status === "live").length}
          </div>
          <p className="text-xs text-[#A9AFBC]">Party Live</p>
        </Card>
        <Card className="p-4 bg-[#111318] border-white/10 text-center">
          <div className="text-2xl text-[#00E0FF] mb-1">
            {parties.reduce((sum, p) => sum + p.viewers, 0)}
          </div>
          <p className="text-xs text-[#A9AFBC]">Spettatori</p>
        </Card>
        <Card className="p-4 bg-[#111318] border-white/10 text-center">
          <div className="text-2xl text-white mb-1">+500</div>
          <p className="text-xs text-[#A9AFBC]">FP/Partita</p>
        </Card>
      </div>

      {!selectedParty ? (
        /* Party List */
        <div className="space-y-4">
          <h3 className="text-xl text-white">Stanze Disponibili</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parties.map((party) => (
              <Card 
                key={party.id}
                className="p-6 bg-[#111318] border-white/10 hover:border-[#A7FF1A]/50 transition-all cursor-pointer"
                onClick={() => party.status === "live" && setSelectedParty(party.id)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-white mb-2">{party.match}</h4>
                      <p className="text-sm text-[#A9AFBC]">Host: {party.host}</p>
                    </div>
                    <Badge className={`${
                      party.status === "live"
                        ? "bg-red-500/20 text-red-400 border-red-500/30"
                        : "bg-[#A9AFBC]/20 text-[#A9AFBC] border-[#A9AFBC]/30"
                    } border`}>
                      {party.status === "live" ? "🔴 LIVE" : party.startsIn}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-[#A9AFBC]">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{party.viewers}/{party.maxViewers}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-4 h-4" />
                      <span>Chat Attiva</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#A7FF1A]">
                      <span>+{party.rewards} FP</span>
                    </div>
                  </div>

                  {party.status === "live" && (
                    <Button className="w-full bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]">
                      <Video className="w-4 h-4 mr-2" />
                      Entra nella Party
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {/* Create Party CTA */}
          <Card className="p-6 bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30 text-center">
            <h3 className="text-white mb-2">Crea la tua Watch Party</h3>
            <p className="text-sm text-[#A9AFBC] mb-4">
              Invita amici, guarda insieme e guadagna FP bonus come host
            </p>
            <Button className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]">
              <Video className="w-4 h-4 mr-2" />
              Crea Party
            </Button>
          </Card>
        </div>
      ) : (
        /* Watch Party Room */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Video + Chat */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player */}
            <Card className="aspect-video bg-black border-white/10 flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#A7FF1A]/10 via-transparent to-[#00E0FF]/10" />
              <div className="relative text-center space-y-4">
                <Video className="w-16 h-16 text-[#A9AFBC] mx-auto" />
                <p className="text-[#A9AFBC]">Video Stream Simulato</p>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30 border">
                  🔴 LIVE - Inter vs Milan 1-1
                </Badge>
              </div>
              
              {/* Live Reactions Overlay */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm flex items-center gap-2">
                  ⚽ +50
                </div>
                <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm flex items-center gap-2">
                  🔥 +23
                </div>
              </div>
            </Card>

            {/* Match Info */}
            <Card className="p-4 bg-[#111318] border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🔵⚫</div>
                    <div className="text-sm text-white">Inter</div>
                    <div className="text-2xl text-[#A7FF1A]">1</div>
                  </div>
                  <div className="text-[#A9AFBC]">-</div>
                  <div className="text-center">
                    <div className="text-2xl mb-1">🔴⚫</div>
                    <div className="text-sm text-white">Milan</div>
                    <div className="text-2xl text-[#A7FF1A]">1</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-[#A9AFBC] mb-1">Tempo</div>
                  <div className="text-xl text-white">67'</div>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Viewers */}
            <Card className="p-4 bg-[#111318] border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#A7FF1A]" />
                  Spettatori
                </h4>
                <Badge className="bg-[#2B2F3A] text-white border-white/10 border">
                  847
                </Badge>
              </div>
              <div className="flex -space-x-2">
                {[...Array(8)].map((_, i) => (
                  <Avatar key={i} className="border-2 border-[#0A1020]">
                    <AvatarFallback className="bg-[#A7FF1A] text-[#0A1020]">
                      {String.fromCharCode(65 + i)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <div className="w-10 h-10 rounded-full bg-[#2B2F3A] border-2 border-[#0A1020] flex items-center justify-center text-xs text-[#A9AFBC]">
                  +839
                </div>
              </div>
            </Card>

            {/* Chat */}
            <Card className="p-4 bg-[#111318] border-white/10 h-[500px] flex flex-col">
              <h4 className="text-white mb-4 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#A7FF1A]" />
                Chat Live
              </h4>

              {/* Messages */}
              <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                {chatMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`p-3 rounded-lg ${
                      msg.user === "You" 
                        ? "bg-[#A7FF1A]/10 border border-[#A7FF1A]/30" 
                        : "bg-[#2B2F3A]"
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <span className={`text-sm ${
                        msg.user === "You" ? "text-[#A7FF1A]" : "text-white"
                      }`}>
                        {msg.user}
                      </span>
                      <span className="text-xs text-[#A9AFBC]">{msg.timestamp}</span>
                    </div>
                    <p className="text-sm text-[#A9AFBC] mb-2">{msg.message}</p>
                    <div className="flex items-center gap-2">
                      <button className="flex items-center gap-1 text-xs text-[#A9AFBC] hover:text-[#A7FF1A] transition-colors">
                        <ThumbsUp className="w-3 h-3" />
                        {msg.reactions}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <Input
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Scrivi un messaggio..."
                  className="bg-[#2B2F3A] border-white/10 text-white"
                />
                <Button 
                  onClick={handleSendMessage}
                  className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>

            {/* Rewards */}
            <Card className="p-4 bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30">
              <div className="text-center space-y-2">
                <div className="text-sm text-[#A9AFBC]">Guadagnati Oggi</div>
                <div className="text-3xl text-[#A7FF1A]">+500 FP</div>
                <p className="text-xs text-[#A9AFBC]">Bonus watch party attivo!</p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {selectedParty && (
        <Button
          onClick={() => setSelectedParty(null)}
          variant="outline"
          className="border-white/10 text-white hover:bg-[#2B2F3A]"
        >
          ← Torna alle Party
        </Button>
      )}
    </div>
  );
}
