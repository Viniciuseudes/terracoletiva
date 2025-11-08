// app/produtor/pesquisar/page.tsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { RegionSelector } from "@/components/producer/region-selector";
import {
  Search,
  SlidersHorizontal,
  Calendar,
  Users,
  ShoppingBasket,
  Loader2,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

// Interface para as cotas que vamos buscar
interface QuotaProduct {
  id: string;
  name: string;
  // Adicione image_url se existir na sua tabela de produtos
  // image_url: string;
}

interface Quota {
  id: string;
  producer_id: string; // Vamos precisar disto
  delivery_date: string;
  participants_count: number;
  quantity: number;
  products: QuotaProduct | null; // Produto relacionado
  profiles: {
    // Perfil do criador
    full_name: string;
  } | null;
}

export default function ProducerSearch() {
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchOpenQuotas() {
      setLoading(true);

      let query = supabase
        .from("quotas")
        .select(
          `
          id,
          producer_id,
          delivery_date,
          participants_count,
          quantity,
          products ( id, name ),
          profiles ( full_name )
        `
        )
        .eq("status", "open"); // Apenas cotas ABERTAS

      // Filtro de pesquisa
      if (searchTerm) {
        // Pesquisa no nome do produto (através da tabela relacionada)
        query = query.ilike("products.name", `%${searchTerm}%`);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Erro ao buscar cotas:", error);
      } else {
        // O Supabase retorna um array, mesmo que a relação seja 1-para-1 às vezes
        // Este cast garante que o tipo está correto
        setQuotas(data as unknown as Quota[]);
      }
      setLoading(false);
    }

    // Usamos um debounce para não pesquisar a cada tecla
    const delayDebounceFn = setTimeout(() => {
      fetchOpenQuotas();
    }, 500); // 500ms de espera

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // Re-executa a busca quando o searchTerm muda

  const getProductName = (quota: Quota) => {
    return quota.products?.name || "Produto desconhecido";
  };

  const getProducerName = (quota: Quota) => {
    return quota.profiles?.full_name || "Produtor desconhecido";
  };

  const getProductImage = (quota: Quota) => {
    // Adicione a lógica da sua imagem aqui
    // Ex: return quota.products?.image_url || "/placeholder.jpg";
    return "/placeholder.jpg"; // Placeholder temporário
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <RegionSelector />

        <div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Participar de Cotas
          </h1>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por milho, soja..."
                className="pl-10 h-12 bg-muted/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-12 w-12 bg-transparent"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product List */}
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        ) : quotas.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-48 bg-muted/30 rounded-xl border border-dashed border-border p-4">
            <Info className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground font-semibold">
              Nenhuma cota encontrada
            </p>
            <p className="text-sm text-muted-foreground">
              {searchTerm
                ? "Tente rever o seu termo de busca."
                : "Ainda não há cotas abertas."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {quotas.map((quota) => (
              <Card key={quota.id} className="overflow-hidden">
                {/* Removi a imagem por agora, pois ela não está no seu schema 'products'.
                  Pode adicionar de volta se incluir 'image_url' no select.
                */}
                {/* <div className="relative h-48 w-full">
                  <Image src={getProductImage(quota)} alt={getProductName(quota)} fill className="object-cover" />
                </div> */}

                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {getProductName(quota)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Criado por: {getProducerName(quota)}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col items-center justify-center text-center bg-secondary/10 rounded-lg p-2 h-auto">
                      <Calendar className="h-4 w-4 text-secondary mb-1" />
                      <span className="text-xs text-muted-foreground">
                        Expira em
                      </span>
                      <span className="text-sm font-semibold">
                        {new Date(quota.delivery_date).toLocaleDateString(
                          "pt-BR",
                          {
                            day: "2-digit",
                            month: "short",
                          }
                        )}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center bg-secondary/10 rounded-lg p-2 h-auto">
                      <Users className="h-4 w-4 text-secondary mb-1" />
                      <span className="text-xs text-muted-foreground">
                        Nº cotas
                      </span>
                      <span className="text-sm font-semibold">
                        {quota.participants_count || 0}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center bg-secondary/10 rounded-lg p-2 h-auto">
                      <ShoppingBasket className="h-4 w-4 text-secondary mb-1" />
                      <span className="text-xs text-muted-foreground">
                        Quantidade
                      </span>
                      <span className="text-sm font-semibold">
                        {quota.quantity}
                      </span>
                    </div>
                  </div>

                  <Link href={`/produtor/pesquisar/${quota.id}`} passHref>
                    <Button
                      size="lg"
                      className="w-full h-12 text-base font-semibold"
                    >
                      Ver Detalhes e Participar
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <MobileNav userType="produtor" />
    </div>
  );
}
