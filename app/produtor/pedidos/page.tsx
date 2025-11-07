// Ficheiro: app/produtor/pedidos/page.tsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserProfile } from "@/lib/auth";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Calendar, DollarSign, Loader2, Info } from "lucide-react";

// CORREÇÃO: A relação 'products' pode ser um array (mesmo que com um só item) ou um objeto único.
interface Quota {
  id: string;
  status: "open" | "closed" | "completed" | "cancelled";
  quantity: number;
  target_price: number;
  delivery_date: string;
  unit: string;
  products:
    | {
        name: string;
      }
    | { name: string }[]
    | null;
}

const statusMap = {
  open: {
    label: "Aberta",
    className: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  },
  closed: {
    label: "Fechada",
    className: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  },
  completed: {
    label: "Concluída",
    className: "bg-green-500/10 text-green-700 border-green-500/20",
  },
  cancelled: {
    label: "Cancelada",
    className: "bg-red-500/10 text-red-700 border-red-500/20",
  },
};

export default function ProducerQuotasPage() {
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para obter o nome do produto de forma segura
  const getProductName = (products: Quota["products"]) => {
    if (!products) return "Produto desconhecido";
    if (Array.isArray(products)) {
      return products[0]?.name || "Produto desconhecido";
    }
    return products.name;
  };

  useEffect(() => {
    async function fetchQuotas() {
      try {
        const user = await getCurrentUserProfile();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("quotas")
          .select(
            `
            id,
            status,
            quantity,
            target_price,
            delivery_date,
            unit,
            products ( name )
          `
          )
          .eq("producer_id", user.id)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setQuotas(data || []);
      } catch (error) {
        console.error("Erro ao buscar cotas:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchQuotas();
  }, []);

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />

      <main className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">
          Minhas Cotas
        </h1>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : quotas.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-64 bg-muted/30 rounded-xl border border-dashed border-border p-4">
            <Info className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-semibold">
              Nenhuma cota encontrada
            </p>
            <p className="text-sm text-muted-foreground">
              Crie a sua primeira cota para começar a economizar.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {quotas.map((quota) => (
              <Card key={quota.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {getProductName(quota.products)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        ID da Cota: {quota.id.substring(0, 8)}
                      </p>
                    </div>
                    <Badge
                      className={
                        statusMap[quota.status]?.className ||
                        statusMap.closed.className
                      }
                      variant="outline"
                    >
                      {statusMap[quota.status]?.label || "Desconhecido"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Quantidade
                        </p>
                        <p className="text-sm font-medium">
                          {quota.quantity} {quota.unit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Preço Alvo
                        </p>
                        <p className="text-sm font-medium">
                          R$ {quota.target_price.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Entrega</p>
                        <p className="text-sm font-medium">
                          {new Date(quota.delivery_date).toLocaleDateString(
                            "pt-BR",
                            {
                              day: "2-digit",
                              month: "short",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      <MobileNav userType="produtor" />
    </div>
  );
}
