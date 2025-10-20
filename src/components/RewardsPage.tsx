import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Gift, Shirt, DoorOpen, Star, Ticket, Camera, Trophy, Zap } from "lucide-react";
import { HexagonPattern } from "./HexagonPattern";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface Reward {
  id: number;
  title: string;
  category: "merchandise" | "experience" | "vip" | "digital";
  pointsCost: number;
  stock: number;
  imageUrl: string;
  description: string;
  featured?: boolean;
}

export function RewardsPage() {
  const rewards: Reward[] = [
    {
      id: 1,
      title: "Maglietta Ufficiale Home",
      category: "merchandise",
      pointsCost: 15000,
      stock: 45,
      imageUrl: "https://images.unsplash.com/photo-1708577907839-1240466aee53?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBqZXJzZXklMjBtZXJjaGFuZGlzZXxlbnwxfHx8fDE3NTk4NjMzMzR8MA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Maglia originale della tua squadra del cuore",
      featured: true,
    },
    {
      id: 2,
      title: "Visita agli Spogliatoi",
      category: "experience",
      pointsCost: 50000,
      stock: 8,
      imageUrl: "https://images.unsplash.com/photo-1551384732-fb4f003640e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmYW5zJTIwY2VsZWJyYXRpb24lMjBzdGFkaXVtfGVufDF8fHx8MTc1OTg2MzMzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Tour esclusivo degli spogliatoi prima della partita",
      featured: true,
    },
    {
      id: 3,
      title: "Esperienza VIP - Skybox",
      category: "vip",
      pointsCost: 100000,
      stock: 3,
      imageUrl: "https://images.unsplash.com/photo-1584178082310-005d68b421e5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXAlMjBsb3VuZ2UlMjBsdXh1cnl8ZW58MXx8fHwxNzU5ODMzMzM5fDA&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Partita in skybox privato con catering incluso",
      featured: true,
    },
    {
      id: 4,
      title: "Sciarpa Celebrativa",
      category: "merchandise",
      pointsCost: 5000,
      stock: 120,
      imageUrl: "https://images.unsplash.com/photo-1559930198-26e8d7f0a4f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjcm93ZCUyMGNoZWVyaW5nfGVufDF8fHx8MTc1OTg2MzMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Sciarpa ufficiale edizione limitata",
    },
    {
      id: 5,
      title: "Meet & Greet con Giocatore",
      category: "experience",
      pointsCost: 75000,
      stock: 5,
      imageUrl: "https://images.unsplash.com/photo-1746333253387-5aac26260c96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1hdGNoJTIwYWN0aW9ufGVufDF8fHx8MTc1OTgyOTY3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Incontro esclusivo con un giocatore della squadra",
    },
    {
      id: 6,
      title: "Ingresso VIP Pre-Partita",
      category: "vip",
      pointsCost: 35000,
      stock: 15,
      imageUrl: "https://images.unsplash.com/photo-1661450279873-01fe386873d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFkaXVtJTIwYXRtb3NwaGVyZSUyMG5pZ2h0fGVufDF8fHx8MTc1OTg2MzMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Accesso al campo durante il riscaldamento",
    },
    {
      id: 7,
      title: "Pallone Autografato",
      category: "merchandise",
      pointsCost: 25000,
      stock: 20,
      imageUrl: "https://images.unsplash.com/photo-1551384732-fb4f003640e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBmYW5zJTIwY2VsZWJyYXRpb24lMjBzdGFkaXVtfGVufDF8fHx8MTc1OTg2MzMzM3ww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Pallone ufficiale firmato dalla squadra",
    },
    {
      id: 8,
      title: "Foto sul Campo",
      category: "experience",
      pointsCost: 20000,
      stock: 30,
      imageUrl: "https://images.unsplash.com/photo-1746333253387-5aac26260c96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMG1hdGNoJTIwYWN0aW9ufGVufDF8fHx8MTc1OTgyOTY3Mnww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Sessione fotografica professionale sul campo",
    },
    {
      id: 9,
      title: "Card NFT Leggendaria",
      category: "digital",
      pointsCost: 40000,
      stock: 50,
      imageUrl: "https://images.unsplash.com/photo-1559930198-26e8d7f0a4f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjcm93ZCUyMGNoZWVyaW5nfGVufDF8fHx8MTc1OTg2MzMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Card NFT rara di giocatore leggendario",
    },
    {
      id: 10,
      title: "Biglietto Premium Stagione",
      category: "vip",
      pointsCost: 150000,
      stock: 2,
      imageUrl: "https://images.unsplash.com/photo-1661450279873-01fe386873d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdGFkaXVtJTIwYXRtb3NwaGVyZSUyMG5pZ2h0fGVufDF8fHx8MTc1OTg2MzMzNHww&ixlib=rb-4.1.0&q=80&w=1080",
      description: "Abbonamento premium per tutte le partite casalinghe",
    },
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "merchandise":
        return Shirt;
      case "experience":
        return Camera;
      case "vip":
        return Star;
      case "digital":
        return Zap;
      default:
        return Gift;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "merchandise":
        return "text-[#A7FF1A]";
      case "experience":
        return "text-[#00E0FF]";
      case "vip":
        return "text-[#FFD700]";
      case "digital":
        return "text-[#A7FF1A]";
      default:
        return "text-white";
    }
  };

  const featuredRewards = rewards.filter((r) => r.featured);
  const merchandiseRewards = rewards.filter((r) => r.category === "merchandise");
  const experienceRewards = rewards.filter((r) => r.category === "experience");
  const vipRewards = rewards.filter((r) => r.category === "vip");
  const digitalRewards = rewards.filter((r) => r.category === "digital");

  return (
    <div className="space-y-6 pb-24 md:pb-8">
      {/* Hero Banner */}
      <div className="relative rounded-2xl overflow-hidden h-48 md:h-64">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1559930198-26e8d7f0a4f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBjcm93ZCUyMGNoZWVyaW5nfGVufDF8fHx8MTc1OTg2MzMzNHww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Sports Crowd"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A1020] via-[#0A1020]/80 to-transparent" />
        <HexagonPattern />
        <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
          <Badge className="bg-[#A7FF1A] text-[#0A1020] border-0 w-fit mb-3">
            <Trophy className="w-3 h-3 mr-1" />
            Premi Esclusivi
          </Badge>
          <h1 className="text-3xl md:text-4xl text-white mb-2">Catalogo Premi</h1>
          <p className="text-[#A9AFBC] max-w-2xl">
            Riscatta i tuoi Fans Points per esperienze uniche, merchandise esclusivo e accessi VIP
          </p>
        </div>
      </div>

      {/* Featured Rewards */}
      <div className="space-y-4">
        <h2 className="text-2xl text-white">In Evidenza</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {featuredRewards.map((reward) => {
            const Icon = getCategoryIcon(reward.category);
            return (
              <Card
                key={reward.id}
                className="bg-gradient-to-br from-[#111318] to-[#2B2F3A] border-[#A7FF1A]/30 overflow-hidden group hover:border-[#A7FF1A]/50 transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <ImageWithFallback
                    src={reward.imageUrl}
                    alt={reward.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111318] via-transparent to-transparent" />
                  <Badge className="absolute top-3 left-3 bg-[#A7FF1A] text-[#0A1020] border-0">
                    In Evidenza
                  </Badge>
                </div>
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-white">{reward.title}</h3>
                    <Icon className={`w-5 h-5 ${getCategoryColor(reward.category)} flex-shrink-0`} />
                  </div>
                  <p className="text-sm text-[#A9AFBC]">{reward.description}</p>
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <div className="flex items-center gap-1 text-[#A7FF1A]">
                        <Zap className="w-4 h-4" />
                        <span>{reward.pointsCost.toLocaleString()} FP</span>
                      </div>
                      <div className="text-xs text-[#A9AFBC] mt-1">
                        {reward.stock} disponibili
                      </div>
                    </div>
                    <Button
                      size="sm"
                      className="bg-[#A7FF1A] hover:bg-[#8FE515] text-[#0A1020]"
                    >
                      Riscatta
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* All Rewards */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-[#2B2F3A] border-white/10">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-[#A7FF1A] data-[state=active]:text-[#0A1020]"
          >
            Tutti
          </TabsTrigger>
          <TabsTrigger
            value="merchandise"
            className="data-[state=active]:bg-[#A7FF1A] data-[state=active]:text-[#0A1020]"
          >
            Merchandise
          </TabsTrigger>
          <TabsTrigger
            value="experience"
            className="data-[state=active]:bg-[#A7FF1A] data-[state=active]:text-[#0A1020]"
          >
            Esperienze
          </TabsTrigger>
          <TabsTrigger
            value="vip"
            className="data-[state=active]:bg-[#A7FF1A] data-[state=active]:text-[#0A1020]"
          >
            VIP
          </TabsTrigger>
          <TabsTrigger
            value="digital"
            className="data-[state=active]:bg-[#A7FF1A] data-[state=active]:text-[#0A1020]"
          >
            Digital
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-3">
          {rewards.map((reward) => (
            <RewardListItem key={reward.id} reward={reward} />
          ))}
        </TabsContent>

        <TabsContent value="merchandise" className="space-y-3">
          {merchandiseRewards.map((reward) => (
            <RewardListItem key={reward.id} reward={reward} />
          ))}
        </TabsContent>

        <TabsContent value="experience" className="space-y-3">
          {experienceRewards.map((reward) => (
            <RewardListItem key={reward.id} reward={reward} />
          ))}
        </TabsContent>

        <TabsContent value="vip" className="space-y-3">
          {vipRewards.map((reward) => (
            <RewardListItem key={reward.id} reward={reward} />
          ))}
        </TabsContent>

        <TabsContent value="digital" className="space-y-3">
          {digitalRewards.map((reward) => (
            <RewardListItem key={reward.id} reward={reward} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function RewardListItem({ reward }: { reward: Reward }) {
  const Icon = reward.category === "merchandise" ? Shirt
    : reward.category === "experience" ? Camera
    : reward.category === "vip" ? Star
    : Zap;

  return (
    <Card className="bg-[#111318] border-white/10 hover:border-[#A7FF1A]/30 transition-all">
      <div className="p-4 flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
          <ImageWithFallback
            src={reward.imageUrl}
            alt={reward.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-1">
            <h4 className="text-white truncate">{reward.title}</h4>
            <Icon className={`w-4 h-4 flex-shrink-0 ${
              reward.category === "merchandise" ? "text-[#A7FF1A]"
              : reward.category === "experience" ? "text-[#00E0FF]"
              : reward.category === "vip" ? "text-[#FFD700]"
              : "text-[#A7FF1A]"
            }`} />
          </div>
          <p className="text-sm text-[#A9AFBC] mb-2 line-clamp-1">{reward.description}</p>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1 text-[#A7FF1A]">
              <Zap className="w-3 h-3" />
              {reward.pointsCost.toLocaleString()} FP
            </div>
            <div className="text-[#A9AFBC]">{reward.stock} disponibili</div>
          </div>
        </div>
        <Button
          size="sm"
          className="bg-[#A7FF1A] hover:bg-[#8FE515] text-[#0A1020] flex-shrink-0"
        >
          Riscatta
        </Button>
      </div>
    </Card>
  );
}
