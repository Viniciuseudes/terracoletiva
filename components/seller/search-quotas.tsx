// components/seller/search-quotas.tsx
"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserProfile } from "@/lib/auth";
import type { UserProfile } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  MapPin,
  Calendar,
  Package,
  Users,
  Loader2,
  Info,
  DollarSign,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// --- CORREÇÃO ESTÁ AQUI ---
// 1. O tipo de produto
type ProductType =
  | { name: string; category: string }
  | { name: string; category: string }[]
  | null;

// 2. A interface da Cota
interface Quota {
  id: string;
  quantity: number;
  unit: string;
  target_price: number;
  delivery_location: string;
  delivery_date: string;
  participants_count: number;
  products: ProductType; // <-- Agora usa o ProductType corretamente
  profiles: {
    // Perfil do criador (Produtor)
    full_name: string;
  } | null;
}
// --- FIM DA CORREÇÃO ---

export function SearchQuotas() {
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // States para o Modal de Proposta
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<Quota | null>(null);
  const [bidPrice, setBidPrice] = useState("");
  const [deliveryTerms, setDeliveryTerms] = useState("");

  const fetchQuotas = async (userId: string) => {
    setLoading(true);
    try {
      let query = supabase
        .from("quotas")
        .select(
          `
          id, quantity, unit, target_price, delivery_location, 
          delivery_date, participants_count,
          products ( name, category ),
          profiles ( full_name )
        `
        )
        .eq("status", "open") // Apenas cotas ABERTAS
        .not("producer_id", "eq", userId);

      if (categoryFilter !== "all") {
        query = query.eq("products.category", categoryFilter);
      }

      if (searchTerm) {
        query = query.or(
          `products.name.ilike.%${searchTerm}%,delivery_location.ilike.%${searchTerm}%`
        );
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) throw error;
      setQuotas((data as unknown as Quota[]) || []);
    } catch (error) {
      console.error("Erro ao buscar cotas:", error);
      toast.error("Erro ao carregar cotas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const user = await getCurrentUserProfile();
      if (!user) {
        toast.error("Sessão não encontrada.", {
          description: "A redirecionar para o login...",
        });
        window.location.href = "/login";
        return;
      }
      setCurrentUser(user);
      fetchQuotas(user.id);
    };
    init();
  }, []);

  useEffect(() => {
    if (currentUser) {
      const delayDebounceFn = setTimeout(() => {
        fetchQuotas(currentUser.id);
      }, 300);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [searchTerm, categoryFilter, currentUser]);

  const handleOpenModal = (quota: Quota) => {
    setSelectedQuota(quota);
    setBidPrice((quota.target_price * 0.95).toFixed(2));
    setDeliveryTerms("Frete incluso. Entrega em até 10 dias úteis.");
    setIsModalOpen(true);
  };

  const handleMakeBid = async () => {
    if (!currentUser || !selectedQuota || !bidPrice) {
      toast.warning("Dados insuficientes", {
        description: "Preencha o preço por unidade.",
      });
      return;
    }

    setIsSubmitting(true);
    const pricePerUnit = parseFloat(bidPrice);
    const totalPrice = pricePerUnit * selectedQuota.quantity;

    const { error } = await supabase.from("bids").insert({
      quota_id: selectedQuota.id,
      seller_id: currentUser.id,
      price_per_unit: pricePerUnit,
      total_price: totalPrice,
      delivery_terms: deliveryTerms,
    });

    if (error) {
      console.error("Erro ao criar proposta:", error);
      toast.error("Erro ao enviar proposta", { description: error.message });
    } else {
      toast.success("Proposta enviada com sucesso!", {
        description: `O produtor foi notificado e irá analisar o seu lance.`,
      });
      setIsModalOpen(false);
      setQuotas(quotas.filter((q) => q.id !== selectedQuota.id));
    }
    setIsSubmitting(false);
  };

  // Funções auxiliares seguras
  const getProductName = (products?: ProductType) => {
    if (!products) return "Produto desconhecido";
    if (Array.isArray(products))
      return products[0]?.name || "Produto desconhecido";
    return (products as { name: string }).name;
  };
  const getProductCategory = (products?: ProductType) => {
    if (!products) return "Sem Categoria";
    if (Array.isArray(products))
      return products[0]?.category || "Sem Categoria";
    return (products as { category: string }).category;
  };
  const getProducerName = (profiles: { full_name: string } | null) => {
    return profiles?.full_name || "Produtor N/A";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por produto ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            <SelectItem value="Grãos">Grãos</SelectItem>
            <SelectItem value="Ração">Ração</SelectItem>
            <SelectItem value="Volumosos">Volumosos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : quotas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Info className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nenhuma cota aberta encontrada.
              </p>
            </CardContent>
          </Card>
        ) : (
          quotas.map((quota) => (
            <Card key={quota.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">
                        {getProductName(quota.products)}
                      </CardTitle>
                      <Badge variant="secondary">
                        {getProductCategory(quota.products)}
                      </Badge>
                    </div>
                    <CardDescription>
                      Organizada por {getProducerName(quota.profiles)}
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground mb-1">
                      Preço alvo
                    </div>
                    <div className="text-2xl font-bold text-primary">
                      R$ {quota.target_price.toFixed(2)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      por {quota.unit}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>
                      {quota.quantity} {quota.unit}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{quota.participants_count || 0} participantes</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{quota.delivery_location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(quota.delivery_date).toLocaleDateString(
                        "pt-BR"
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="text-sm">
                    <span className="text-muted-foreground">
                      Valor total (alvo):{" "}
                    </span>
                    <span className="font-bold text-foreground">
                      R$ {(quota.quantity * quota.target_price).toFixed(2)}
                    </span>
                  </div>

                  <Dialog
                    open={isModalOpen && selectedQuota?.id === quota.id}
                    onOpenChange={setIsModalOpen}
                  >
                    <DialogTrigger asChild>
                      <Button onClick={() => handleOpenModal(quota)}>
                        Fazer Proposta
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Fazer Proposta</DialogTitle>
                        <DialogDescription>
                          {/* Esta linha está agora correta */}
                          {`Cota para ${selectedQuota?.quantity} ${
                            selectedQuota?.unit
                          } de ${getProductName(selectedQuota?.products)}`}
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-2">
                        <div className="space-y-2">
                          <Label htmlFor="price">
                            Seu preço (por {selectedQuota?.unit})
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              id="price"
                              type="number"
                              value={bidPrice}
                              onChange={(e) => setBidPrice(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="terms">Termos de Entrega</Label>
                          <Textarea
                            id="terms"
                            placeholder="Especifique frete, prazo, etc..."
                            value={deliveryTerms}
                            onChange={(e) => setDeliveryTerms(e.target.value)}
                          />
                        </div>
                        <div className="p-4 bg-muted/50 rounded-lg">
                          <p className="text-sm text-muted-foreground">
                            Preço Total da Proposta:
                          </p>
                          <p className="text-2xl font-bold">
                            R${" "}
                            {(
                              parseFloat(bidPrice || "0") *
                              (selectedQuota?.quantity || 0)
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline" disabled={isSubmitting}>
                            Cancelar
                          </Button>
                        </DialogClose>
                        <Button onClick={handleMakeBid} disabled={isSubmitting}>
                          {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {isSubmitting ? "A enviar..." : "Confirmar Proposta"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
