import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, Sparkles, Plus } from "lucide-react";
import { projectId, publicAnonKey } from "../utils/supabase/info";
import { useAuth } from "../utils/supabase/AuthContext";
import { toast } from "sonner@2.0.3";

interface CreateAuctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateAuctionModal({ isOpen, onClose, onSuccess }: CreateAuctionModalProps) {
  const { session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "jerseys",
    rarity: "common",
    image_url: "",
    starting_bid: "",
    reserve_price: "",
    buy_now_price: "",
    min_increment: "",
    duration_hours: "24",
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("You must be logged in");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-81e425c4/auctions/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            category: formData.category,
            rarity: formData.rarity,
            image_url: formData.image_url || null,
            starting_bid: parseFloat(formData.starting_bid),
            reserve_price: formData.reserve_price ? parseFloat(formData.reserve_price) : null,
            buy_now_price: formData.buy_now_price ? parseFloat(formData.buy_now_price) : null,
            min_increment: parseFloat(formData.min_increment),
            duration_hours: parseFloat(formData.duration_hours),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create auction");
      }

      toast.success("Asta creata con successo! 🎉");
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        category: "jerseys",
        rarity: "common",
        image_url: "",
        starting_bid: "",
        reserve_price: "",
        buy_now_price: "",
        min_increment: "",
        duration_hours: "24",
      });

      onClose();
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Create auction error:", error);
      toast.error(error.message || "Errore nella creazione dell'asta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#111318] border-[#A7FF1A]/30 border-2">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Plus className="w-6 h-6 text-[#A7FF1A]" />
            Crea Nuova Asta
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Titolo *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Es: Maglia Inter Autografata"
              required
              className="bg-[#2B2F3A] border-white/10 text-white"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Descrizione *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Descrizione dettagliata dell'oggetto..."
              required
              rows={4}
              className="bg-[#2B2F3A] border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-white">Categoria *</Label>
              <Select value={formData.category} onValueChange={(v) => handleChange("category", v)}>
                <SelectTrigger className="bg-[#2B2F3A] border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2B2F3A] border-white/10">
                  <SelectItem value="jerseys">Maglie</SelectItem>
                  <SelectItem value="boots">Scarpini</SelectItem>
                  <SelectItem value="memorabilia">Memorabilia</SelectItem>
                  <SelectItem value="experiences">Esperienze</SelectItem>
                  <SelectItem value="equipment">Equipaggiamento</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Rarity */}
            <div className="space-y-2">
              <Label htmlFor="rarity" className="text-white">Rarità *</Label>
              <Select value={formData.rarity} onValueChange={(v) => handleChange("rarity", v)}>
                <SelectTrigger className="bg-[#2B2F3A] border-white/10 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#2B2F3A] border-white/10">
                  <SelectItem value="common">Common</SelectItem>
                  <SelectItem value="rare">Rare</SelectItem>
                  <SelectItem value="epic">Epic</SelectItem>
                  <SelectItem value="legendary">Legendary</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image_url" className="text-white">URL Immagine</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => handleChange("image_url", e.target.value)}
              placeholder="https://..."
              className="bg-[#2B2F3A] border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Starting Bid */}
            <div className="space-y-2">
              <Label htmlFor="starting_bid" className="text-white">Offerta Iniziale (FP) *</Label>
              <Input
                id="starting_bid"
                type="number"
                value={formData.starting_bid}
                onChange={(e) => handleChange("starting_bid", e.target.value)}
                placeholder="5000"
                required
                min="0"
                className="bg-[#2B2F3A] border-white/10 text-white"
              />
            </div>

            {/* Min Increment */}
            <div className="space-y-2">
              <Label htmlFor="min_increment" className="text-white">Incremento Minimo (FP) *</Label>
              <Input
                id="min_increment"
                type="number"
                value={formData.min_increment}
                onChange={(e) => handleChange("min_increment", e.target.value)}
                placeholder="250"
                required
                min="0"
                className="bg-[#2B2F3A] border-white/10 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Reserve Price */}
            <div className="space-y-2">
              <Label htmlFor="reserve_price" className="text-white">Prezzo di Riserva (FP)</Label>
              <Input
                id="reserve_price"
                type="number"
                value={formData.reserve_price}
                onChange={(e) => handleChange("reserve_price", e.target.value)}
                placeholder="10000"
                min="0"
                className="bg-[#2B2F3A] border-white/10 text-white"
              />
            </div>

            {/* Buy Now Price */}
            <div className="space-y-2">
              <Label htmlFor="buy_now_price" className="text-white">Compra Subito (FP)</Label>
              <Input
                id="buy_now_price"
                type="number"
                value={formData.buy_now_price}
                onChange={(e) => handleChange("buy_now_price", e.target.value)}
                placeholder="20000"
                min="0"
                className="bg-[#2B2F3A] border-white/10 text-white"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <Label htmlFor="duration_hours" className="text-white">Durata (ore) *</Label>
            <Select value={formData.duration_hours} onValueChange={(v) => handleChange("duration_hours", v)}>
              <SelectTrigger className="bg-[#2B2F3A] border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#2B2F3A] border-white/10">
                <SelectItem value="1">1 ora</SelectItem>
                <SelectItem value="2">2 ore</SelectItem>
                <SelectItem value="6">6 ore</SelectItem>
                <SelectItem value="12">12 ore</SelectItem>
                <SelectItem value="24">24 ore</SelectItem>
                <SelectItem value="48">48 ore</SelectItem>
                <SelectItem value="72">72 ore</SelectItem>
                <SelectItem value="168">7 giorni</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Annulla
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#A7FF1A] hover:bg-[#8FE000] text-[#0A1020]"
            >
              {loading ? (
                "Creazione..."
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Crea Asta
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
