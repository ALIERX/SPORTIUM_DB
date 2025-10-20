import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { useAuth } from "../utils/supabase/AuthContext";
import { toast } from "sonner@2.0.3";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { 
  Gavel, 
  Heart, 
  Filter,
  Search,
  Clock,
  Zap,
  Trophy,
  Star,
  Shield,
  ShoppingCart,
  TrendingUp,
  Flame,
  ChevronRight,
  Sparkles,
  Users
} from "lucide-react";
import { HeroBanner } from "./HeroBanner";

interface AuctionsPageProps {
  onViewAuction: (auctionId: string) => void;
}

interface Auction {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  team: string;
  currentBid: number;
  buyNowPrice?: number;
  totalBids: number;
  uniqueBidders: number;
  endTime: Date;
  isLive: boolean;
  isFeatured: boolean;
  verified: boolean;
  status: "active" | "ending-soon" | "closed";
}

export function AuctionsPage({ onViewAuction }: AuctionsPageProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch auctions from server
  useEffect(() => {
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-81e425c4/auctions?status=active`,
        {
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch auctions');

      const data = await response.json();
      
      // Transform server data to component format
      const transformedAuctions = data.auctions.map((a: any) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        image: a.image_url || 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800',
        category: a.category,
        team: a.rarity,
        currentBid: a.current_bid,
        buyNowPrice: a.buy_now_price,
        totalBids: a.total_bids,
        uniqueBidders: Math.floor(a.total_bids / 2),
        endTime: new Date(a.end_time),
        isLive: a.status === 'active',
        isFeatured: a.rarity === 'legendary',
        verified: true,
        status: a.status,
      }));

      setAuctions(transformedAuctions);
    } catch (error) {
      console.error('Error fetching auctions:', error);
      toast.error('Failed to load auctions');
      // Fallback to mock data if fetch fails
      setAuctions(getMockAuctions());
    } finally {
      setLoading(false);
    }
  };

  // Mock auctions as fallback
  const getMockAuctions = (): Auction[] => [
    {
      id: "1",
      title: "Maglia Inter Autografata Lautaro Martinez",
      description: "Maglia gara Serie A 2024/25 autografata dal Toro",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
      category: "Maglie",
      team: "Inter Milano",
      currentBid: 7500,
      buyNowPrice: 12000,
      totalBids: 47,
      uniqueBidders: 12,
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
      isLive: true,
      isFeatured: true,
      verified: true,
      status: "active"
    },
    {
      id: "2",
      title: "Pallone Finale Champions League 2024",
      description: "Pallone ufficiale finale Champions, autografato squadre",
      image: "https://images.unsplash.com/photo-1614632537087-3b14e50c9f7d?w=800",
      category: "Memorabilia",
      team: "UEFA",
      currentBid: 15200,
      totalBids: 89,
      uniqueBidders: 23,
      endTime: new Date(Date.now() + 30 * 60 * 1000),
      isLive: true,
      isFeatured: true,
      verified: true,
      status: "ending-soon"
    },
    {
      id: "3",
      title: "Scarpini Jannik Sinner Match-Worn",
      description: "Scarpe indossate agli ATP Finals 2024",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
      category: "Scarpe",
      team: "Tennis",
      currentBid: 4200,
      buyNowPrice: 8000,
      totalBids: 28,
      uniqueBidders: 9,
      endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
      isLive: true,
      isFeatured: false,
      verified: true,
      status: "active"
    },
    {
      id: "4",
      title: "Meet & Greet AC Milan",
      description: "Incontro esclusivo con la squadra a Milanello",
      image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800",
      category: "Esperienze",
      team: "AC Milan",
      currentBid: 3800,
      totalBids: 15,
      uniqueBidders: 8,
      endTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isLive: true,
      isFeatured: false,
      verified: true,
      status: "active"
    },
    {
      id: "5",
      title: "Maglia Juventus Vintage Del Piero",
      description: "Maglia storica anni '90 autografata Alessandro Del Piero",
      image: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800",
      category: "Maglie",
      team: "Juventus",
      currentBid: 12500,
      totalBids: 156,
      uniqueBidders: 34,
      endTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isLive: false,
      isFeatured: false,
      verified: true,
      status: "closed"
    },
    {
      id: "6",
      title: "Casco Ferrari F1 Sainz Replica",
      description: "Casco replica firmato Carlos Sainz GP Monza 2024",
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
      category: "F1",
      team: "Ferrari",
      currentBid: 5600,
      totalBids: 67,
      uniqueBidders: 18,
      endTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
      isLive: true,
      isFeatured: false,
      verified: true,
      status: "active"
    },
    {
      id: "7",
      title: "Guanti Portiere Buffon Autografati",
      description: "Guanti indossati in Nazionale, con dedica",
      image: "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=800",
      category: "Memorabilia",
      team: "Italia",
      currentBid: 6200,
      buyNowPrice: 10000,
      totalBids: 42,
      uniqueBidders: 14,
      endTime: new Date(Date.now() + 8 * 60 * 60 * 1000),
      isLive: true,
      isFeatured: false,
      verified: true,
      status: "active"
    },
    {
      id: "8",
      title: "VIP Box Inter vs Milan Derby",
      description: "2 biglietti VIP Box per il Derby della Madonnina",
      image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
      category: "Esperienze",
      team: "Serie A",
      currentBid: 18900,
      totalBids: 203,
      uniqueBidders: 67,
      endTime: new Date(Date.now() + 45 * 60 * 1000),
      isLive: true,
      isFeatured: true,
      verified: true,
      status: "ending-soon"
    },
  ];

  const categories = ["all", ...Array.from(new Set(auctions.map(a => a.category)))];

  const filteredAuctions = auctions.filter(auction => {
    if (activeTab === "featured" && !auction.isFeatured) return false;
    if (activeTab === "ending" && auction.status !== "ending-soon") return false;
    if (activeTab === "live" && !auction.isLive) return false;
    
    if (searchQuery && !auction.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory !== "all" && auction.category !== selectedCategory) return false;

    return true;
  });

  const getTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff < 0) return "Terminata";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const featuredCount = auctions.filter(a => a.isFeatured).length;
  const endingSoonCount = auctions.filter(a => a.status === "ending-soon").length;
  const liveCount = auctions.filter(a => a.isLive).length;

  const handleSeedAuctions = async () => {
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-81e425c4/seed-auctions`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${publicAnonKey}`,
          },
        }
      );

      if (!response.ok) throw new Error('Failed to seed auctions');

      toast.success('Aste seed completato! Ricarica la pagina.');
      fetchAuctions();
    } catch (error) {
      console.error('Error seeding auctions:', error);
      toast.error('Errore durante il seed delle aste');
    }
  };

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      <HeroBanner
        imageUrl="https://images.unsplash.com/photo-1611329857570-f02f340e7378?w=1200"
        title="Aste Live"
        subtitle="Vinci memorabilia esclusivi e esperienze VIP con i tuoi Fans Points"
        badge="CATALOGO"
      />

      {/* Admin: Seed Auctions Button */}
      {user && (
        <div className="flex justify-end">
          <Button
            onClick={handleSeedAuctions}
            size="sm"
            className="bg-purple-500 hover:bg-purple-600 text-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Seed Aste (Admin)
          </Button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-[#A7FF1A]/10 to-transparent border-[#A7FF1A]/30 border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#A7FF1A]/20 flex items-center justify-center">
              <Gavel className="w-5 h-5 text-[#A7FF1A]" />
            </div>
            <div>
              <div className="text-2xl text-white">{liveCount}</div>
              <div className="text-xs text-[#A9AFBC]">Aste Live</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-yellow-500/10 to-transparent border-yellow-500/30 border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl text-white">{featuredCount}</div>
              <div className="text-xs text-[#A9AFBC]">Featured</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/30 border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
              <Flame className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl text-white">{endingSoonCount}</div>
              <div className="text-xs text-[#A9AFBC]">In Scadenza</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-[#00E0FF]/10 to-transparent border-[#00E0FF]/30 border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#00E0FF]/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#00E0FF]" />
            </div>
            <div>
              <div className="text-2xl text-white">{auctions.length}</div>
              <div className="text-xs text-[#A9AFBC]">Totali</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A9AFBC]" />
          <Input
            placeholder="Cerca asta..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-[#2B2F3A] border-white/10 text-white"
          />
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 pb-2">
        {categories.map((cat) => (
          <Button
            key={cat}
            size="sm"
            variant="outline"
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-[#A7FF1A]/10 border-[#A7FF1A]/30 text-[#A7FF1A]"
                : "border-white/10 text-white"
            }`}
          >
            {cat === "all" ? "Tutte" : cat}
          </Button>
        ))}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#2B2F3A] border-white/10 w-full grid grid-cols-4">
          <TabsTrigger value="all">
            Tutte
          </TabsTrigger>
          <TabsTrigger value="featured">
            <Star className="w-4 h-4 mr-1" />
            Featured
          </TabsTrigger>
          <TabsTrigger value="ending">
            <Flame className="w-4 h-4 mr-1" />
            Scadenza
          </TabsTrigger>
          <TabsTrigger value="live">
            <Zap className="w-4 h-4 mr-1" />
            Live
          </TabsTrigger>
        </TabsList>

        {/* Auction Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAuctions.map((auction, idx) => (
            <motion.div
              key={auction.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => onViewAuction(auction.id)}
              className="cursor-pointer"
            >
              <Card className={`overflow-hidden bg-[#111318] border-2 ${
                auction.isFeatured 
                  ? "border-[#A7FF1A]/50" 
                  : "border-white/10"
              } hover:border-[#A7FF1A]/70 transition-all group`}>
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={auction.image} 
                    alt={auction.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                    <div className="flex gap-2 flex-wrap">
                      {auction.isFeatured && (
                        <Badge className="bg-[#A7FF1A] text-[#0A1020]">
                          <Star className="w-3 h-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                      {auction.verified && (
                        <Badge className="bg-blue-500 text-white">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                      {auction.buyNowPrice && (
                        <Badge className="bg-yellow-500 text-[#0A1020]">
                          <ShoppingCart className="w-3 h-3 mr-1" />
                          Buy Now
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Timer Badge */}
                  {auction.isLive && (
                    <div className="absolute bottom-3 left-3">
                      <Badge className={`${
                        auction.status === "ending-soon"
                          ? "bg-red-500 text-white animate-pulse"
                          : "bg-black/70 text-white backdrop-blur-sm"
                      }`}>
                        <Clock className="w-3 h-3 mr-1" />
                        {getTimeRemaining(auction.endTime)}
                      </Badge>
                    </div>
                  )}

                  {/* Status Overlay */}
                  {!auction.isLive && (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                      <Badge className="bg-white/20 text-white text-lg px-4 py-2">
                        Terminata
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 space-y-3">
                  {/* Title */}
                  <div>
                    <h3 className="text-white line-clamp-2 mb-2 group-hover:text-[#A7FF1A] transition-colors">
                      {auction.title}
                    </h3>
                    <div className="flex gap-2">
                      <Badge className="bg-[#00E0FF]/20 text-[#00E0FF] border-[#00E0FF]/30 border text-xs">
                        {auction.category}
                      </Badge>
                      <Badge className="bg-white/10 text-white border-white/20 border text-xs">
                        {auction.team}
                      </Badge>
                    </div>
                  </div>

                  {/* Current Bid */}
                  <div className="flex items-end justify-between pt-2 border-t border-white/10">
                    <div>
                      <div className="text-xs text-[#A9AFBC] mb-1">Offerta Corrente</div>
                      <div className="text-xl text-[#A7FF1A]">
                        {auction.currentBid.toLocaleString()} FP
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-[#A9AFBC] flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {auction.uniqueBidders}
                      </div>
                      <div className="text-xs text-[#A9AFBC]">{auction.totalBids} offerte</div>
                    </div>
                  </div>

                  {/* View Details Button */}
                  <Button 
                    className="w-full bg-[#A7FF1A]/10 hover:bg-[#A7FF1A]/20 text-[#A7FF1A] border border-[#A7FF1A]/30 group-hover:bg-[#A7FF1A] group-hover:text-[#0A1020] transition-all"
                  >
                    Vedi Dettagli
                    <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredAuctions.length === 0 && (
          <Card className="p-12 bg-[#111318] border-white/10 text-center">
            <div className="w-16 h-16 rounded-full bg-[#A7FF1A]/10 flex items-center justify-center mx-auto mb-4">
              <Gavel className="w-8 h-8 text-[#A7FF1A]" />
            </div>
            <h3 className="text-white mb-2">Nessuna asta trovata</h3>
            <p className="text-[#A9AFBC] mb-4">Prova a modificare i filtri di ricerca</p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setActiveTab("all");
              }}
              className="bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
            >
              Reset Filtri
            </Button>
          </Card>
        )}
      </Tabs>

      {/* Info Banner */}
      <Card className="p-6 bg-gradient-to-r from-[#A7FF1A]/10 via-[#00E0FF]/10 to-purple-500/10 border-[#A7FF1A]/30 border-2">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#A7FF1A]/20 flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-6 h-6 text-[#A7FF1A]" />
          </div>
          <div className="flex-1">
            <h3 className="text-white mb-2">Come Funzionano le Aste</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-start gap-2">
                <Gavel className="w-4 h-4 text-[#A7FF1A] mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white mb-1">Fai Offerte</div>
                  <div className="text-[#A9AFBC] text-xs">Usa i tuoi Fans Points per partecipare</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white mb-1">Auto-Bid</div>
                  <div className="text-[#A9AFBC] text-xs">Sistema automatico di offerte</div>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Trophy className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-white mb-1">Vinci Premi</div>
                  <div className="text-[#A9AFBC] text-xs">Memorabilia ed esperienze esclusive</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
