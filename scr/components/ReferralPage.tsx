import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Users, Copy, Share2, Gift, TrendingUp, CheckCircle } from "lucide-react";
import { HeroBanner } from "./HeroBanner";

export function ReferralPage() {
  const referralCode = "SPORTIUM-GN1908";
  const referralLink = `https://sportium.app/join/${referralCode}`;

  const stats = {
    totalReferrals: 12,
    activeReferrals: 8,
    totalEarned: 15000,
    pendingRewards: 2000
  };

  const referredFriends = [
    { name: "Marco R.", status: "active", earned: 2500, joinedDate: "2 giorni fa" },
    { name: "Luca M.", status: "active", earned: 1800, joinedDate: "5 giorni fa" },
    { name: "Andrea P.", status: "pending", earned: 0, joinedDate: "1 giorno fa" },
    { name: "Giuseppe B.", status: "active", earned: 3200, joinedDate: "1 settimana fa" },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRzJTIwY2VsZWJyYXRpbmd8ZW58MXx8fHwxNzU5ODYzMzM2fDA&ixlib=rb-4.1.0&q=80&w=1080"
        title="Invita Amici"
        subtitle="Guadagna 1000 FP per ogni amico che si registra e bonus continui sulle loro attività"
        badge="REFERRAL PROGRAM"
        height="small"
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A9AFBC]">Amici Totali</span>
              <Users className="w-4 h-4 text-[#A7FF1A]" />
            </div>
            <div className="text-2xl text-white">{stats.totalReferrals}</div>
            <p className="text-xs text-[#A9AFBC]">Invitati</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#00E0FF]/10 to-transparent border-[#00E0FF]/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A9AFBC]">Attivi</span>
              <CheckCircle className="w-4 h-4 text-[#00E0FF]" />
            </div>
            <div className="text-2xl text-white">{stats.activeReferrals}</div>
            <p className="text-xs text-[#A9AFBC]">Giocano regolarmente</p>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A9AFBC]">Guadagnati</span>
              <Gift className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl text-white">{stats.totalEarned.toLocaleString()}</div>
            <p className="text-xs text-[#A9AFBC]">FP totali</p>
          </div>
        </Card>

        <Card className="p-4 bg-[#111318] border-white/10">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A9AFBC]">In Arrivo</span>
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div className="text-2xl text-white">{stats.pendingRewards.toLocaleString()}</div>
            <p className="text-xs text-[#A9AFBC]">FP da sbloccare</p>
          </div>
        </Card>
      </div>

      {/* Share Section */}
      <Card className="p-6 bg-gradient-to-br from-[#A7FF1A]/10 to-[#00E0FF]/5 border-[#A7FF1A]/30">
        <h3 className="text-white mb-4">Il Tuo Link di Invito</h3>
        
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={referralLink}
              readOnly
              className="bg-[#2B2F3A] border-white/10 text-white"
            />
            <Button 
              onClick={() => copyToClipboard(referralLink)}
              className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Input
              value={referralCode}
              readOnly
              className="bg-[#2B2F3A] border-white/10 text-white"
            />
            <Button 
              onClick={() => copyToClipboard(referralCode)}
              className="bg-[#00E0FF] hover:bg-[#00C5E0] text-[#0A1020]"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Button variant="outline" className="border-white/10 text-white hover:bg-[#2B2F3A]">
              <Share2 className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            <Button variant="outline" className="border-white/10 text-white hover:bg-[#2B2F3A]">
              <Share2 className="w-4 h-4 mr-2" />
              Telegram
            </Button>
            <Button variant="outline" className="border-white/10 text-white hover:bg-[#2B2F3A]">
              <Share2 className="w-4 h-4 mr-2" />
              Email
            </Button>
          </div>
        </div>
      </Card>

      {/* How It Works */}
      <Card className="p-6 bg-[#111318] border-white/10">
        <h3 className="text-white mb-4">Come Funziona</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#A7FF1A]/10 flex items-center justify-center mx-auto">
              <Share2 className="w-8 h-8 text-[#A7FF1A]" />
            </div>
            <h4 className="text-white">1. Condividi</h4>
            <p className="text-sm text-[#A9AFBC]">
              Invia il tuo link di invito agli amici appassionati di calcio
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#00E0FF]/10 flex items-center justify-center mx-auto">
              <Users className="w-8 h-8 text-[#00E0FF]" />
            </div>
            <h4 className="text-white">2. Registrazione</h4>
            <p className="text-sm text-[#A9AFBC]">
              Quando si registrano, tu ricevi 1000 FP e loro 500 FP bonus
            </p>
          </div>

          <div className="text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto">
              <Gift className="w-8 h-8 text-purple-400" />
            </div>
            <h4 className="text-white">3. Guadagna</h4>
            <p className="text-sm text-[#A9AFBC]">
              Ottieni il 10% dei FP che guadagnano per sempre!
            </p>
          </div>
        </div>
      </Card>

      {/* Referred Friends List */}
      <div className="space-y-4">
        <h3 className="text-xl text-white">I Tuoi Inviti</h3>
        <Card className="p-6 bg-[#111318] border-white/10">
          <div className="space-y-3">
            {referredFriends.map((friend, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 bg-[#2B2F3A] rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#A7FF1A]/20 flex items-center justify-center">
                    <span className="text-[#A7FF1A]">{friend.name[0]}</span>
                  </div>
                  <div>
                    <div className="text-white">{friend.name}</div>
                    <div className="text-xs text-[#A9AFBC]">{friend.joinedDate}</div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={`${
                    friend.status === "active"
                      ? "bg-[#A7FF1A]/10 text-[#A7FF1A] border-[#A7FF1A]/30"
                      : "bg-[#A9AFBC]/10 text-[#A9AFBC] border-[#A9AFBC]/30"
                  } border mb-2`}>
                    {friend.status === "active" ? "Attivo" : "In Attesa"}
                  </Badge>
                  <div className="text-sm text-[#A9AFBC]">
                    {friend.earned > 0 ? `+${friend.earned} FP` : "In attesa"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Rewards Tiers */}
      <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30">
        <h3 className="text-white mb-4">Livelli Referral</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-[#2B2F3A] rounded-lg">
            <div>
              <div className="text-white mb-1">Bronze (0-5 amici)</div>
              <div className="text-sm text-[#A9AFBC]">1000 FP per invito + 10% sui guadagni</div>
            </div>
            <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30 border">
              Attuale
            </Badge>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#2B2F3A]/50 rounded-lg opacity-60">
            <div>
              <div className="text-white mb-1">Silver (6-15 amici)</div>
              <div className="text-sm text-[#A9AFBC]">1500 FP per invito + 15% sui guadagni</div>
            </div>
            <div className="text-[#A9AFBC]">🔒 Locked</div>
          </div>

          <div className="flex items-center justify-between p-4 bg-[#2B2F3A]/50 rounded-lg opacity-60">
            <div>
              <div className="text-white mb-1">Gold (16+ amici)</div>
              <div className="text-sm text-[#A9AFBC]">2000 FP per invito + 20% sui guadagni</div>
            </div>
            <div className="text-[#A9AFBC]">🔒 Locked</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
