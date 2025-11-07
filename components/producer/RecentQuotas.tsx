// Ficheiro: components/producer/RecentQuotas.tsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserProfile } from "@/lib/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Package } from "lucide-react";
import Link from "next/link";

// CORREÇÃO: A relação 'products' pode ser um array (mesmo que com um só item) ou um objeto único.
// Esta interface cobre ambos os casos de forma segura.
interface Quota {
  id: string;
  status: "open" | "closed" | "completed" | "cancelled";
  target_price: number;
  unit: string;
  products:
    | {
        name: string;
      }
    | { name: string }[]
    | null;
}

const statusMap = {
  open: { label: "Aberta", variant: "default" as const },
  closed: { label: "Fechada", variant: "secondary" as const },
  completed: { label: "Concluída", variant: "outline" as const },
  cancelled: { label: "Cancelada", variant: "destructive" as const },
};

export function RecentQuotas() {
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para obter o nome do produto de forma segura
  const getProductName = (products: Quota["products"]) => {
    if (!products) return "Produto não encontrado";
    if (Array.isArray(products)) {
      return products[0]?.name || "Produto não encontrado";
    }
    return products.name;
  };

  useEffect(() => {
    async function fetchRecentQuotas() {
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
            target_price,
            unit,
            products ( name )
          `
          )
          .eq("producer_id", user.id)
          .order("created_at", { ascending: false })
          .limit(3);

        if (error) {
          throw error;
        }

        // A conversão direta agora é segura com a interface corrigida.
        setQuotas(data || []);
      } catch (error) {
        console.error("Erro ao buscar cotas recentes:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchRecentQuotas();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 bg-muted/30 rounded-xl border border-dashed border-border">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (quotas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-40 bg-muted/30 rounded-xl border border-dashed border-border p-4">
        <Package className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground font-medium">
          Nenhuma cota criada ainda
        </p>
        <p className="text-sm text-muted-foreground">
          As suas cotas mais recentes aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {quotas.map((quota) => (
        <Card key={quota.id}>
          <CardContent className="p-4 flex items-center justify-between gap-4">
            <div className="flex-1">
              <p className="font-semibold text-foreground">
                {getProductName(quota.products)}
              </p>
              <p className="text-sm text-muted-foreground">
                Preço Alvo: R$ {quota.target_price.toFixed(2)} / {quota.unit}
              </p>
            </div>
            <Badge variant={statusMap[quota.status]?.variant || "secondary"}>
              {statusMap[quota.status]?.label || "Desconhecido"}
            </Badge>
          </CardContent>
        </Card>
      ))}
      {quotas.length > 0 && (
        <Link href="/produtor/pedidos" passHref>
          <Button variant="outline" className="w-full">
            Ver todas as cotas
          </Button>
        </Link>
      )}
    </div>
  );
}
