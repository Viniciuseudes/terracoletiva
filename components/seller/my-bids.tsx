// components/seller/my-bids.tsx
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Package, TrendingUp, Loader2, Info } from "lucide-react";
import { toast } from "sonner"; // <-- CORREÇÃO: Faltava esta importação

// Mapeamento de status da PROPOSTA
const statusMap = {
  pending: {
    label: "Pendente",
    variant: "secondary" as const,
    className: "text-yellow-600 bg-yellow-500/10",
  },
  accepted: {
    label: "Aceite",
    variant: "default" as const,
    className: "text-green-700 bg-green-500/10",
  },
  rejected: {
    label: "Recusada",
    variant: "destructive" as const,
    className: "text-red-700 bg-red-500/10",
  },
};

// Interface para a Proposta (Bid) com dados da Cota (Quota)
interface BidWithQuota {
  id: string;
  price_per_unit: number;
  total_price: number;
  delivery_terms: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  quotas: {
    id: string;
    unit: string;
    quantity: number;
    products: {
      name: string;
    } | null;
    profiles: {
      // Dono da cota
      full_name: string;
    } | null;
  } | null;
}

// Tipo para os produtos (pode ser objeto ou array)
type ProductType = { name: string } | { name: string }[] | null;

export function MyBids() {
  const [bids, setBids] = useState<BidWithQuota[]>([]);
  const [loading, setLoading] = useState(true);

  const getProductName = (products: ProductType) => {
    if (!products) return "Produto desconhecido";
    if (Array.isArray(products))
      return products[0]?.name || "Produto desconhecido";
    return (products as { name: string }).name;
  };

  const getProducerName = (profiles: { full_name: string } | null) => {
    return profiles?.full_name || "Produtor N/A";
  };

  useEffect(() => {
    const fetchMyBids = async () => {
      setLoading(true);
      const user = await getCurrentUserProfile();
      if (!user) {
        toast.error("Sessão não encontrada."); // <-- Agora o 'toast' existe
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("bids")
          .select(
            `
            id, price_per_unit, total_price, delivery_terms, status, created_at,
            quotas (
              id, unit, quantity,
              products ( name ),
              profiles ( full_name )
            )
          `
          )
          .eq("seller_id", user.id) // Apenas propostas do vendedor logado
          .order("created_at", { ascending: false });

        if (error) throw error;
        setBids((data as unknown as BidWithQuota[]) || []);
      } catch (error) {
        console.error("Erro ao buscar propostas:", error);
        toast.error("Erro ao carregar o seu histórico de propostas.");
      } finally {
        setLoading(false);
      }
    };

    fetchMyBids();
  }, []);

  return (
    <div className="space-y-4">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : bids.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Você ainda não enviou nenhuma proposta.
            </p>
            <Button className="mt-4" asChild>
              <a href="/vendedor/buscar">Buscar Oportunidades</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bids.map((bid) => {
            if (!bid.quotas) return null; // Segurança
            const statusInfo = statusMap[bid.status] || statusMap.pending;

            return (
              <Card key={bid.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">
                          {getProductName(bid.quotas.products)}
                        </CardTitle>
                        <Badge
                          variant="outline"
                          className={statusInfo.className}
                        >
                          {statusInfo.label}
                        </Badge>
                      </div>
                      <CardDescription>
                        Cota de {getProducerName(bid.quotas.profiles)}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">
                        R$ {bid.total_price.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        R$ {bid.price_per_unit.toFixed(2)} / {bid.quotas.unit}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">
                      Minhas Condições:
                    </span>{" "}
                    {bid.delivery_terms}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>
                          {bid.quotas.quantity} {bid.quotas.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Enviada em{" "}
                          {new Date(bid.created_at).toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>
                    {/* Botão de "Ver Detalhes" pode levar à cota ou ao chat se aceite */}
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
