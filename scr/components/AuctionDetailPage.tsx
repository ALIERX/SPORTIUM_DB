import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import { toast } from "sonner@2.0.3";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { useAuth } from "../utils/supabase/AuthContext";
import { supabase, Auction, Bid } from "../utils/supabase/client";
import confetti from "canvas-confetti";
import { 
  ArrowLeft, 
  Clock, 
  TrendingUp, 
  Users, 
  Flame, 
  Trophy,
  Shield,
  Sparkles,
  Star,
  Zap,
  Heart,
  Share2,
  Info,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Gavel,
  ShoppingCart,
  Bell,
  BellOff,
  Award,
  Target,
  Timer,
  BarChart3,
  Crown
} from "lucide-react";
import { HexagonPattern } from "./HexagonPattern";
import confetti from "canvas-confetti";

interface AuctionDetailPageProps {
  auctionId: string;
  onBack: () => void;
}

export function AuctionDetailPage({ auctionId, onBack }: AuctionDetailPageProps) {
  const { user, wallet, session, refreshWallet } = useAuth();
  const userPoints = wallet?.balance_points || 0;
  const [bidAmount, setBidAmount] = useState("");
  const [autoBidMax, setAutoBidMax] = useState("");
  const [isAutoBidEnabled, setIsAutoBidEnabled] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds

  // Mock auction data - in real app, fetch by auctionId from Supabase
  const auctionData: { [key: string]: any } = {
    "1": {
      title: "Maglia Inter Autografata Lautaro Martinez",
      subtitle: "Derby Inter-Milan Serie A 2024/25",
      description: "Maglia gara originale indossata da Lautaro Martínez durante il Derby della Madonnina. Autografata personalmente dal Toro dopo la partita storica. Include certificato di autenticità ufficiale Inter e ologramma FIFA.",
      category: "Maglie",
      team: "Inter Milano",
      currentBid: 7500,
      buyNowPrice: 12000,
      reservePrice: 7000,
      minIncrement: 250,
      totalBids: 47,
      uniqueBidders: 12,
      verified: true,
      serialNumber: "INT-2025-047",
      images: [
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200",
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200",
        "https://images.unsplash.com/photo-1551854838-f4fc54b81c6b?w=1200"
      ],
      bidHistory: [
        { user: "Tifoso_Inter_92", amount: 7500, time: "2 min fa" },
        { user: "FanNerazzurro", amount: 7250, time: "5 min fa" },
        { user: "InterForever", amount: 7000, time: "8 min fa" },
        { user: "Tifoso_Inter_92", amount: 6750, time: "12 min fa" },
        { user: "MilanelloFan", amount: 6500, time: "18 min fa" },
      ],
      details: {
        "Condizione": "Match-Worn",
        "Taglia": "L",
        "Stagione": "2024/25",
        "Partita": "Inter vs Milan - 22 Set 2024",
        "Autografo": "Sì, con dedica",
        "Certificato": "Ufficiale Inter + FIFA"
      }
    },
    "2": {
      title: "Pallone Finale Champions League 2024",
      subtitle: "UEFA Champions League Final",
      description: "Pallone ufficiale utilizzato nella finale di Champions League 2024. Autografato da entrambe le squadre finaliste. Pezzo da collezione unico con certificazione UEFA.",
      category: "Memorabilia",
      team: "UEFA",
      currentBid: 15200,
      reservePrice: 12000,
      minIncrement: 500,
      totalBids: 89,
      uniqueBidders: 23,
      verified: true,
      serialNumber: "UCL-2024-FIN",
      images: [
        "https://images.unsplash.com/photo-1614632537087-3b14e50c9f7d?w=1200",
        "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200"
      ],
      bidHistory: [
        { user: "ChampionsFan", amount: 15200, time: "1 min fa" },
        { user: "UEFACollector", amount: 14700, time: "3 min fa" },
        { user: "FootballLegend", amount: 14200, time: "6 min fa" },
      ],
      details: {
        "Tipo": "Pallone Ufficiale Finale",
        "Marca": "Adidas",
        "Anno": "2024",
        "Autografi": "Squadre Finaliste",
        "Certificato": "UEFA Originale"
      }
    },
    "3": {
      title: "Scarpini Jannik Sinner Match-Worn",
      subtitle: "ATP Finals 2024",
      description: "Scarpe da tennis indossate da Jannik Sinner durante la semifinale degli ATP Finals 2024. Firmate dall'atleta. Pezzo unico per veri collezionisti.",
      category: "Scarpe",
      team: "Tennis",
      currentBid: 4200,
      buyNowPrice: 8000,
      reservePrice: 5000,
      minIncrement: 200,
      totalBids: 28,
      uniqueBidders: 9,
      verified: true,
      serialNumber: "SINNER-ATP-24",
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200",
        "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=1200"
      ],
      bidHistory: [
        { user: "TennisFan_ITA", amount: 4200, time: "4 min fa" },
        { user: "SinnerFanClub", amount: 4000, time: "10 min fa" },
        { user: "ATPCollector", amount: 3800, time: "15 min fa" },
      ],
      details: {
        "Marca": "Nike",
        "Taglia": "43 EU",
        "Evento": "ATP Finals Semifinale",
        "Anno": "2024",
        "Autografo": "Sì",
        "Certificato": "Originale ATP"
      }
    },
    "4": {
      title: "Meet & Greet AC Milan",
      subtitle: "Incontro esclusivo a Milanello",
      description: "Esperienza VIP unica: incontra la squadra del Milan a Milanello, tour dello stadio, foto con i giocatori e pranzo con lo staff. Include merchandising ufficiale.",
      category: "Esperienze",
      team: "AC Milan",
      currentBid: 3800,
      reservePrice: 3500,
      minIncrement: 200,
      totalBids: 15,
      uniqueBidders: 8,
      verified: true,
      serialNumber: "MILAN-EXP-01",
      images: [
        "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200"
      ],
      bidHistory: [
        { user: "MilanFan_88", amount: 3800, time: "3 min fa" },
        { user: "Rossonero4Ever", amount: 3600, time: "12 min fa" },
        { user: "ACMCollector", amount: 3400, time: "20 min fa" },
      ],
      details: {
        "Tipo": "Esperienza VIP",
        "Location": "Milanello",
        "Durata": "1 giornata completa",
        "Incluso": "Tour + Meet & Greet + Pranzo",
        "Partecipanti": "Max 2 persone",
        "Validità": "Stagione 2024/25"
      }
    },
    "5": {
      title: "Maglia Juventus Vintage Del Piero",
      subtitle: "Maglia storica anni '90",
      description: "Maglia originale Juventus anni '90 autografata da Alessandro Del Piero. Pezzo da collezione raro in condizioni eccellenti. Include certificato di autenticità.",
      category: "Maglie",
      team: "Juventus",
      currentBid: 12500,
      reservePrice: 10000,
      minIncrement: 500,
      totalBids: 156,
      uniqueBidders: 34,
      verified: true,
      serialNumber: "JUVE-DEL-90",
      images: [
        "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200"
      ],
      bidHistory: [
        { user: "VintageCollector", amount: 12500, time: "Chiusa 2h fa" },
        { user: "JuventusFan92", amount: 12000, time: "Chiusa 2h fa" },
        { user: "DelPieroLegend", amount: 11500, time: "Chiusa 2h fa" },
      ],
      details: {
        "Condizione": "Eccellente",
        "Taglia": "XL",
        "Anno": "1995-96",
        "Autografo": "Alessandro Del Piero",
        "Rarità": "Molto Rara",
        "Certificato": "Ufficiale Juventus"
      }
    },
    "6": {
      title: "Casco Ferrari F1 Sainz Replica",
      subtitle: "GP Monza 2024",
      description: "Casco replica firmato da Carlos Sainz del Gran Premio d'Italia a Monza 2024. Scala 1:1 con tutti i dettagli originali. Pezzo unico per appassionati F1.",
      category: "F1",
      team: "Ferrari",
      currentBid: 5600,
      reservePrice: 5000,
      minIncrement: 250,
      totalBids: 67,
      uniqueBidders: 18,
      verified: true,
      serialNumber: "FER-SAI-MON24",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200"
      ],
      bidHistory: [
        { user: "F1Collector", amount: 5600, time: "7 min fa" },
        { user: "TifosiFerrarista", amount: 5350, time: "15 min fa" },
        { user: "MonzaGP_Fan", amount: 5100, time: "25 min fa" },
      ],
      details: {
        "Marca": "Bell Racing",
        "Scala": "1:1",
        "GP": "Monza 2024",
        "Pilota": "Carlos Sainz",
        "Autografo": "Sì",
        "Certificato": "Ferrari Originale"
      }
    },
    "7": {
      title: "Guanti Portiere Buffon Autografati",
      subtitle: "Indossati in Nazionale",
      description: "Guanti da portiere indossati da Gianluigi Buffon durante una partita della Nazionale Italiana. Autografati con dedica personale. Certificato FIGC.",
      category: "Memorabilia",
      team: "Italia",
      currentBid: 6200,
      buyNowPrice: 10000,
      reservePrice: 6000,
      minIncrement: 200,
      totalBids: 42,
      uniqueBidders: 14,
      verified: true,
      serialNumber: "ITA-BUF-GK",
      images: [
        "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200"
      ],
      bidHistory: [
        { user: "BuffonLegend", amount: 6200, time: "5 min fa" },
        { user: "AzzurroForever", amount: 6000, time: "10 min fa" },
        { user: "GKCollector", amount: 5800, time: "18 min fa" },
      ],
      details: {
        "Marca": "Puma",
        "Taglia": "10",
        "Match": "Nazionale Italiana",
        "Anno": "2010s",
        "Autografo": "Con dedica",
        "Certificato": "FIGC Originale"
      }
    },
    "8": {
      title: "VIP Box Inter vs Milan Derby",
      subtitle: "2 Biglietti VIP Box",
      description: "Due biglietti VIP Box per il Derby della Madonnina. Include accesso esclusivo al lounge, catering premium, parcheggio riservato e meet & greet pre-partita.",
      category: "Esperienze",
      team: "Serie A",
      currentBid: 18900,
      reservePrice: 15000,
      minIncrement: 500,
      totalBids: 203,
      uniqueBidders: 67,
      verified: true,
      serialNumber: "DERBY-VIP-24",
      images: [
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200"
      ],
      bidHistory: [
        { user: "DerbyFanatic", amount: 18900, time: "30 sec fa" },
        { user: "MilanoLover", amount: 18400, time: "2 min fa" },
        { user: "InterMilanFan", amount: 17900, time: "4 min fa" },
      ],
      details: {
        "Tipo": "VIP Box",
        "Partita": "Inter vs Milan",
        "Biglietti": "2 posti",
        "Incluso": "Lounge + Catering + Parking",
        "Stadio": "San Siro",
        "Stagione": "2024/25"
      }
    }
  };

  const auction = auctionData[auctionId] || auctionData["1"];
  
  // Safety checks
  if (!auction) {
    return (
      <div className="p-8 text-center">
        <p className="text-white">Asta non trovata</p>
        <Button onClick={onBack} className="mt-4">Torna alle Aste</Button>
      </div>
    );
  }

  const reserveProgress = Math.min((auction.currentBid / auction.reservePrice) * 100, 100);
  const reserveMet = auction.currentBid >= auction.reservePrice;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}h ${minutes}m ${secs}s`;
  };

  const handleQuickBid = (increment: number) => {
    const amount = auction.currentBid + increment;
    
    if (amount > userPoints) {
      toast.error("Fans Points insufficienti!", {
        description: `Ti servono ${amount.toLocaleString()} FP, hai solo ${userPoints.toLocaleString()} FP`,
        icon: <AlertCircle className="w-4 h-4" />
      });
      return;
    }

    triggerConfetti();
    toast.success("Offerta Piazzata! 🔥", {
      description: `Hai offerto ${amount.toLocaleString()} FP`,
      icon: <Gavel className="w-4 h-4" />
    });
  };

  const handleCustomBid = () => {
    const amount = parseInt(bidAmount);
    
    if (!amount || isNaN(amount)) {
      toast.error("Inserisci un importo valido");
      return;
    }

    if (amount > userPoints) {
      toast.error("Fans Points insufficienti!", {
        description: `Hai solo ${userPoints.toLocaleString()} FP disponibili`,
        icon: <AlertCircle className="w-4 h-4" />
      });
      return;
    }

    if (amount < auction.currentBid + auction.minIncrement) {
      toast.error("Offerta troppo bassa", {
        description: `Incremento minimo: ${auction.minIncrement.toLocaleString()} FP`,
        icon: <AlertCircle className="w-4 h-4" />
      });
      return;
    }

    triggerConfetti();
    toast.success("Offerta Piazzata! 🔥", {
      description: `Hai offerto ${amount.toLocaleString()} FP`,
      icon: <Gavel className="w-4 h-4" />
    });
    setBidAmount("");
  };

  const handleBuyNow = () => {
    if (!auction.buyNowPrice) return;
    
    if (auction.buyNowPrice > userPoints) {
      toast.error("Fans Points insufficienti!", {
        description: `Ti servono ${auction.buyNowPrice.toLocaleString()} FP`,
        icon: <AlertCircle className="w-4 h-4" />
      });
      return;
    }

    triggerConfetti();
    toast.success("🎉 Acquisto Confermato!", {
      description: `Hai comprato "${auction.title}" per ${auction.buyNowPrice.toLocaleString()} FP`,
      icon: <ShoppingCart className="w-4 h-4" />
    });
  };

  const handleEnableAutoBid = () => {
    const maxBid = parseInt(autoBidMax);
    
    if (!maxBid || isNaN(maxBid)) {
      toast.error("Inserisci un importo massimo valido");
      setIsAutoBidEnabled(false);
      return;
    }

    if (maxBid > userPoints) {
      toast.error("Fans Points insufficienti!", {
        description: `Hai solo ${userPoints.toLocaleString()} FP disponibili`,
        icon: <AlertCircle className="w-4 h-4" />
      });
      setIsAutoBidEnabled(false);
      return;
    }

    if (maxBid <= auction.currentBid) {
      toast.error("Offerta massima troppo bassa", {
        description: `Deve essere superiore all'offerta corrente`,
        icon: <AlertCircle className="w-4 h-4" />
      });
      setIsAutoBidEnabled(false);
      return;
    }

    toast.success("Auto-Bid Attivato! 🤖", {
      description: `Sistema farà offerte automatiche fino a ${maxBid.toLocaleString()} FP`,
      icon: <Zap className="w-4 h-4" />
    });
  };

  const toggleWatchlist = () => {
    setIsWatchlisted(!isWatchlisted);
    
    if (!isWatchlisted) {
      toast.success("Aggiunta alla Watchlist! 🔔", {
        description: "Riceverai notifiche per questa asta",
        icon: <Bell className="w-4 h-4" />
      });
    } else {
      toast.success("Rimossa dalla Watchlist", {
        icon: <BellOff className="w-4 h-4" />
      });
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#A7FF1A', '#00E0FF', '#FFFFFF']
    });
  };

  const nextImage = () => {
    if (auction?.images && Array.isArray(auction.images) && auction.images.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % auction.images.length);
    }
  };

  const prevImage = () => {
    if (auction?.images && Array.isArray(auction.images) && auction.images.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + auction.images.length) % auction.images.length);
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="text-white hover:text-[#A7FF1A] hover:bg-[#A7FF1A]/10"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Torna alle Aste
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Image Gallery */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Image */}
          <Card className="overflow-hidden bg-[#111318] border-[#A7FF1A]/30 border-2 relative">
            <div className="relative aspect-video">
              <img 
                src={
                  auction?.images && Array.isArray(auction.images) && auction.images[currentImageIndex] 
                    ? auction.images[currentImageIndex] 
                    : (auction?.images?.[0] || "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=1200")
                } 
                alt={auction?.title || "Auction item"}
                className="w-full h-full object-cover"
              />

              {/* Image Navigation */}
              {auction.images && Array.isArray(auction.images) && auction.images.length > 1 && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={prevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={nextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </>
              )}

              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {auction.verified && (
                  <Badge className="bg-blue-500 text-white">
                    <Shield className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
                <Badge className="bg-[#A7FF1A] text-[#0A1020]">
                  <Star className="w-3 h-3 mr-1" />
                  {auction.category}
                </Badge>
              </div>

              {/* Timer */}
              <div className="absolute bottom-4 left-4">
                <Badge className={`${
                  timeLeft < 3600 
                    ? "bg-red-500 text-white animate-pulse" 
                    : "bg-black/70 text-white backdrop-blur-sm"
                } text-lg px-4 py-2`}>
                  <Clock className="w-5 h-5 mr-2" />
                  {formatTime(timeLeft)}
                </Badge>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {auction.images && Array.isArray(auction.images) && auction.images.length > 1 && (
              <div className="p-4 bg-[#0A1020] flex gap-3 overflow-x-auto">
                {auction.images.map((img: string, idx: number) => (
                  <button
                    key={`thumb-${auctionId}-${idx}`}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex 
                        ? "border-[#A7FF1A]" 
                        : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </Card>

          {/* Description */}
          <Card className="p-6 bg-[#111318] border-white/10">
            <h2 className="text-white mb-4 flex items-center gap-2">
              <Info className="w-5 h-5 text-[#A7FF1A]" />
              Descrizione
            </h2>
            <p className="text-[#A9AFBC] leading-relaxed mb-6">
              {auction.description}
            </p>

            {/* Details Grid */}
            {auction.details && Object.keys(auction.details).length > 0 && (
              <>
                <Separator className="bg-white/10 my-6" />
                <h3 className="text-white mb-4">Dettagli</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(auction.details).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <div className="text-xs text-[#A9AFBC]">{key}</div>
                      <div className="text-white">{String(value)}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Serial Number */}
            {auction.serialNumber && (
              <>
                <Separator className="bg-white/10 my-6" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    <div>
                      <div className="text-xs text-[#A9AFBC]">Serial Number</div>
                      <div className="text-white font-mono">{auction.serialNumber}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="text-[#00E0FF]">
                    <Share2 className="w-4 h-4 mr-2" />
                    Condividi
                  </Button>
                </div>
              </>
            )}
          </Card>

          {/* Bid History */}
          {auction.bidHistory && Array.isArray(auction.bidHistory) && auction.bidHistory.length > 0 && (
            <Card className="p-6 bg-[#111318] border-white/10">
              <h2 className="text-white mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#00E0FF]" />
                Cronologia Offerte ({auction.totalBids || auction.bidHistory.length})
              </h2>
              <div className="space-y-3">
                {auction.bidHistory.map((bid: { user: string; amount: number; time: string }, idx: number) => (
                  <motion.div
                    key={`bid-${auctionId}-${idx}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#A7FF1A]/20 flex items-center justify-center">
                        {idx === 0 ? (
                          <Crown className="w-4 h-4 text-[#A7FF1A]" />
                        ) : (
                          <Target className="w-4 h-4 text-[#A9AFBC]" />
                        )}
                      </div>
                      <div>
                        <div className="text-white">{bid.user}</div>
                        <div className="text-xs text-[#A9AFBC]">{bid.time}</div>
                      </div>
                    </div>
                    <div className={`text-lg ${idx === 0 ? "text-[#A7FF1A]" : "text-white"}`}>
                      {bid.amount.toLocaleString()} FP
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column - Bidding Panel */}
        <div className="space-y-6">
          {/* Title Card */}
          <Card className="p-6 bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30 border-2 relative overflow-hidden">
            <HexagonPattern opacity={0.05} />
            <div className="relative">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h1 className="text-white mb-1">{auction.title}</h1>
                  <p className="text-[#A9AFBC] text-sm">{auction.subtitle}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleWatchlist}
                  className={`${
                    isWatchlisted 
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30" 
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isWatchlisted ? "fill-current" : ""}`} />
                </Button>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Badge className="bg-[#00E0FF]/20 text-[#00E0FF] border-[#00E0FF]/30 border">
                  {auction.team}
                </Badge>
                <Badge className="bg-white/10 text-white border-white/20 border flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {auction.uniqueBidders} offerenti
                </Badge>
              </div>
            </div>
          </Card>

          {/* Current Bid */}
          <Card className="p-6 bg-[#111318] border-white/10">
            <div className="space-y-4">
              <div>
                <div className="text-sm text-[#A9AFBC] mb-2">Offerta Corrente</div>
                <div className="text-4xl text-[#A7FF1A]">
                  {auction.currentBid.toLocaleString()} FP
                </div>
                <div className="text-sm text-[#A9AFBC] mt-1">
                  Incremento minimo: +{auction.minIncrement.toLocaleString()} FP
                </div>
              </div>

              {/* Reserve Price Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A9AFBC]">Prezzo di Riserva</span>
                  <span className={reserveMet ? "text-green-400" : "text-orange-400"}>
                    {reserveMet ? "✓ Raggiunta" : `${reserveProgress.toFixed(0)}%`}
                  </span>
                </div>
                <Progress 
                  value={reserveProgress} 
                  className={`h-2 ${
                    reserveMet ? "bg-green-500/20" : "bg-orange-500/20"
                  }`}
                />
              </div>

              {/* Your Balance */}
              <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#A9AFBC]">Il Tuo Saldo</span>
                  <span className="text-lg text-white">{userPoints.toLocaleString()} FP</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Buy Now Option */}
          {auction.buyNowPrice && (
            <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30 border-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-[#A9AFBC] mb-1">Compralo Subito</div>
                    <div className="text-2xl text-yellow-400">
                      {auction.buyNowPrice.toLocaleString()} FP
                    </div>
                  </div>
                  <ShoppingCart className="w-8 h-8 text-yellow-400" />
                </div>
                <Button
                  onClick={handleBuyNow}
                  disabled={auction.buyNowPrice > userPoints}
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-[#0A1020]"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Acquista Ora
                </Button>
                {auction.buyNowPrice > userPoints && (
                  <div className="flex items-center gap-2 text-xs text-orange-400">
                    <AlertCircle className="w-4 h-4" />
                    FP insufficienti per acquisto immediato
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Quick Bid Buttons */}
          <Card className="p-6 bg-[#111318] border-white/10">
            <h3 className="text-white mb-4">Offerta Rapida</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={() => handleQuickBid(auction.minIncrement)}
                disabled={auction.currentBid + auction.minIncrement > userPoints}
                className="bg-[#A7FF1A]/10 hover:bg-[#A7FF1A]/20 text-[#A7FF1A] border border-[#A7FF1A]/30"
              >
                +{auction.minIncrement.toLocaleString()}
              </Button>
              <Button
                onClick={() => handleQuickBid(auction.minIncrement * 2)}
                disabled={auction.currentBid + auction.minIncrement * 2 > userPoints}
                className="bg-[#A7FF1A]/10 hover:bg-[#A7FF1A]/20 text-[#A7FF1A] border border-[#A7FF1A]/30"
              >
                +{(auction.minIncrement * 2).toLocaleString()}
              </Button>
              <Button
                onClick={() => handleQuickBid(auction.minIncrement * 4)}
                disabled={auction.currentBid + auction.minIncrement * 4 > userPoints}
                className="bg-[#A7FF1A]/10 hover:bg-[#A7FF1A]/20 text-[#A7FF1A] border border-[#A7FF1A]/30"
              >
                +{(auction.minIncrement * 4).toLocaleString()}
              </Button>
              <Button
                onClick={() => handleQuickBid(auction.minIncrement * 10)}
                disabled={auction.currentBid + auction.minIncrement * 10 > userPoints}
                className="bg-[#A7FF1A]/10 hover:bg-[#A7FF1A]/20 text-[#A7FF1A] border border-[#A7FF1A]/30"
              >
                +{(auction.minIncrement * 10).toLocaleString()}
              </Button>
            </div>
          </Card>

          {/* Custom Bid */}
          <Card className="p-6 bg-[#111318] border-white/10">
            <h3 className="text-white mb-4">Offerta Personalizzata</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="bidAmount" className="text-[#A9AFBC]">
                  Importo (min. {(auction.currentBid + auction.minIncrement).toLocaleString()} FP)
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="bidAmount"
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={(auction.currentBid + auction.minIncrement).toString()}
                    className="bg-[#2B2F3A] border-white/10 text-white pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A9AFBC] text-sm">
                    FP
                  </span>
                </div>
              </div>
              <Button
                onClick={handleCustomBid}
                className="w-full bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
              >
                <Gavel className="w-5 h-5 mr-2" />
                Piazza Offerta
              </Button>
            </div>
          </Card>

          {/* Auto-Bid */}
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/30 border-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-400" />
                <h3 className="text-white">Auto-Bid</h3>
              </div>
              <Switch
                checked={isAutoBidEnabled}
                onCheckedChange={(checked) => {
                  setIsAutoBidEnabled(checked);
                  if (checked) handleEnableAutoBid();
                }}
              />
            </div>
            
            <p className="text-sm text-[#A9AFBC] mb-4">
              Il sistema farà offerte automatiche per te fino al tuo limite massimo
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="autoBidMax" className="text-[#A9AFBC]">
                  Offerta Massima
                </Label>
                <div className="relative mt-2">
                  <Input
                    id="autoBidMax"
                    type="number"
                    value={autoBidMax}
                    onChange={(e) => setAutoBidMax(e.target.value)}
                    placeholder={(auction.currentBid + auction.minIncrement * 2).toString()}
                    className="bg-[#2B2F3A] border-white/10 text-white pr-12"
                    disabled={!isAutoBidEnabled}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A9AFBC] text-sm">
                    FP
                  </span>
                </div>
              </div>

              {isAutoBidEnabled && autoBidMax && (
                <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/30 flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-purple-400">
                    Auto-Bid attivo fino a {parseInt(autoBidMax).toLocaleString()} FP
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Info Banner */}
          <Card className="p-4 bg-[#00E0FF]/10 border-[#00E0FF]/30 border">
            <div className="flex items-start gap-3">
              <Timer className="w-5 h-5 text-[#00E0FF] mt-0.5 flex-shrink-0" />
              <div className="text-sm text-[#00E0FF]">
                <div className="font-medium mb-1">Anti-Snipe Attivo</div>
                <div className="text-xs opacity-80">
                  Se un'offerta arriva negli ultimi 2 minuti, il timer si estende automaticamente
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
