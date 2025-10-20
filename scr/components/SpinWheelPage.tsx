import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Gift, Zap, Trophy, Clock } from "lucide-react";
import { HeroBanner } from "./HeroBanner";
import { HexagonPattern } from "./HexagonPattern";

interface WheelPrize {
  id: string;
  label: string;
  points?: number;
  type: "points" | "multiplier" | "card" | "jackpot";
  color: string;
  icon: string;
}

export function SpinWheelPage() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [prize, setPrize] = useState<WheelPrize | null>(null);
  const [spinsLeft, setSpinsLeft] = useState(1);

  const prizes: WheelPrize[] = [
    { id: "1", label: "50 FP", points: 50, type: "points", color: "#2B2F3A", icon: "🎯" },
    { id: "2", label: "x1.5", type: "multiplier", color: "#00E0FF", icon: "⚡" },
    { id: "3", label: "100 FP", points: 100, type: "points", color: "#2B2F3A", icon: "💎" },
    { id: "4", label: "Card Rara", type: "card", color: "#A7FF1A", icon: "🃏" },
    { id: "5", label: "200 FP", points: 200, type: "points", color: "#2B2F3A", icon: "💰" },
    { id: "6", label: "x2.0", type: "multiplier", color: "#00E0FF", icon: "🔥" },
    { id: "7", label: "500 FP", points: 500, type: "points", color: "#2B2F3A", icon: "🌟" },
    { id: "8", label: "JACKPOT!", type: "jackpot", color: "#FFD700", icon: "🏆" }
  ];

  const handleSpin = () => {
    if (isSpinning || spinsLeft === 0) return;

    setIsSpinning(true);
    setShowResult(false);

    // Random rotation (5-10 full spins + random position)
    const fullSpins = 5 + Math.floor(Math.random() * 5);
    const randomDegree = Math.floor(Math.random() * 360);
    const totalRotation = rotation + fullSpins * 360 + randomDegree;
    
    setRotation(totalRotation);

    // Determine prize based on final position
    setTimeout(() => {
      const finalPosition = totalRotation % 360;
      const prizeIndex = Math.floor((8 - (finalPosition / 45)) % 8);
      setPrize(prizes[prizeIndex]);
      setShowResult(true);
      setIsSpinning(false);
      setSpinsLeft(prev => prev - 1);
    }, 4000);
  };

  const getNextSpinTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnb2xkZW4lMjBsaWdodCUyMGNlbGVicmF0aW9ufGVufDF8fHx8MTc1OTg2MzMzNXww&ixlib=rb-4.1.0&q=80&w=1080"
        title="Ruota della Fortuna"
        subtitle="Gira la ruota ogni giorno e vinci premi incredibili!"
        badge="SPIN GIORNALIERO"
        height="small"
      />

      {/* Spins Available */}
      <Card className="p-6 bg-gradient-to-br from-[#A7FF1A]/10 to-[#00E0FF]/5 border-[#A7FF1A]/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#A7FF1A] flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-[#0A1020]" />
            </div>
            <div>
              <h3 className="text-white">Spin Disponibili</h3>
              <p className="text-sm text-[#A9AFBC]">
                {spinsLeft > 0 ? `Hai ${spinsLeft} spin gratuito oggi!` : `Prossimo spin tra ${getNextSpinTime()}`}
              </p>
            </div>
          </div>
          {spinsLeft === 0 && (
            <Badge className="bg-[#2B2F3A] text-[#A9AFBC] border-white/10 border flex items-center gap-2">
              <Clock className="w-3 h-3" />
              {getNextSpinTime()}
            </Badge>
          )}
        </div>
      </Card>

      {/* Wheel Container */}
      <div className="relative">
        <Card className="p-8 md:p-12 bg-[#111318] border-white/10 overflow-hidden">
          <HexagonPattern opacity={0.05} />
          
          <div className="relative flex flex-col items-center gap-8">
            {/* Pointer */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20">
              <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[40px] border-t-[#A7FF1A] glow-neon" />
            </div>

            {/* Wheel */}
            <div className="relative w-80 h-80 md:w-96 md:h-96">
              <motion.div
                className="w-full h-full rounded-full relative"
                style={{
                  rotate: rotation,
                  background: `conic-gradient(
                    from 0deg,
                    ${prizes.map((prize, i) => 
                      `${prize.color} ${(i * 45)}deg ${((i + 1) * 45)}deg`
                    ).join(', ')}
                  )`
                }}
                animate={{ rotate: rotation }}
                transition={{ duration: 4, ease: "easeOut" }}
              >
                {/* Prize Labels */}
                {prizes.map((prize, index) => {
                  const angle = (index * 45) + 22.5;
                  const radius = 140; // Distance from center
                  const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                  const y = Math.sin((angle - 90) * Math.PI / 180) * radius;

                  return (
                    <div
                      key={prize.id}
                      className="absolute top-1/2 left-1/2 text-white text-center"
                      style={{
                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${angle}deg)`,
                      }}
                    >
                      <div className="text-2xl mb-1">{prize.icon}</div>
                      <div className="text-xs whitespace-nowrap">{prize.label}</div>
                    </div>
                  );
                })}

                {/* Center Circle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-[#0A1020] border-4 border-[#A7FF1A] glow-neon flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-[#A7FF1A]" />
                </div>
              </motion.div>

              {/* Outer Glow Ring */}
              <div className="absolute inset-0 rounded-full border-4 border-[#A7FF1A]/30 glow-neon pointer-events-none" />
            </div>

            {/* Spin Button */}
            <Button
              onClick={handleSpin}
              disabled={isSpinning || spinsLeft === 0}
              className="px-12 py-6 bg-gradient-to-r from-[#A7FF1A] to-[#00E0FF] hover:from-[#8FE000] hover:to-[#00C5E0] text-[#0A1020] disabled:opacity-50 disabled:cursor-not-allowed glow-neon"
            >
              {isSpinning ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Girando...
                </span>
              ) : spinsLeft > 0 ? (
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  GIRA LA RUOTA
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Torna Domani
                </span>
              )}
            </Button>
          </div>
        </Card>
      </div>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && prize && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setShowResult(false)}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="relative"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="p-8 bg-[#111318] border-2 border-[#A7FF1A] max-w-md">
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                    className="text-6xl"
                  >
                    {prize.icon}
                  </motion.div>
                  
                  <h3 className="text-2xl text-white">Congratulazioni!</h3>
                  
                  <div className="p-4 bg-gradient-to-br from-[#A7FF1A]/20 to-transparent rounded-xl border border-[#A7FF1A]/30">
                    <p className="text-3xl text-[#A7FF1A] mb-2">{prize.label}</p>
                    {prize.type === "points" && (
                      <p className="text-sm text-[#A9AFBC]">
                        Hai vinto {prize.points} Fans Points!
                      </p>
                    )}
                    {prize.type === "multiplier" && (
                      <p className="text-sm text-[#A9AFBC]">
                        Moltiplicatore attivo per 24 ore!
                      </p>
                    )}
                    {prize.type === "card" && (
                      <p className="text-sm text-[#A9AFBC]">
                        Una card rara è stata aggiunta alla tua collezione!
                      </p>
                    )}
                    {prize.type === "jackpot" && (
                      <p className="text-sm text-[#A9AFBC]">
                        JACKPOT! Hai vinto 5000 Fans Points!
                      </p>
                    )}
                  </div>

                  <Button
                    onClick={() => setShowResult(false)}
                    className="w-full bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
                  >
                    Fantastico!
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prize Pool */}
      <div className="space-y-4">
        <h3 className="text-xl text-white">Premi Disponibili</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {prizes.map((prize) => (
            <Card key={prize.id} className="p-4 bg-[#111318] border-white/10 text-center">
              <div className="text-3xl mb-2">{prize.icon}</div>
              <p className="text-white mb-1">{prize.label}</p>
              {prize.type === "points" && (
                <Badge className="bg-[#A7FF1A]/10 text-[#A7FF1A] border-[#A7FF1A]/30 border">
                  {prize.points} FP
                </Badge>
              )}
              {prize.type === "multiplier" && (
                <Badge className="bg-[#00E0FF]/10 text-[#00E0FF] border-[#00E0FF]/30 border">
                  Boost 24h
                </Badge>
              )}
              {prize.type === "card" && (
                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30 border">
                  NFT Card
                </Badge>
              )}
              {prize.type === "jackpot" && (
                <Badge className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border-yellow-500/30 border">
                  5000 FP
                </Badge>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
