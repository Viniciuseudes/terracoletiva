// app/produtor/pesquisar/page.tsx

"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LocationSelector } from "@/components/producer/location-selector";
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
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface QuotaProduct {
  id: string;
  name: string;
  category: string;
}

// 1. INTERFACE ATUALIZADA
interface Quota {
  id: string;
  producer_id: string;
  delivery_date: string;
  participants_count: number;
  quantity: number; // Total da cota
  current_quantity: number; // Qtd. já comprometida
  max_participants: number; // N° máximo de vagas
  products: QuotaProduct | null;
  profiles: {
    full_name: string;
  } | null;
}

const categories = [
  { id: "all", name: "Todas" },
  { id: "Grãos", name: "Grãos" },
  { id: "Ração", name: "Ração" },
  { id: "Volumosos", name: "Volumosos" },
  { id: "Suplementos", name: "Suplementos" },
];

export default function ProducerSearch() {
  const [quotas, setQuotas] = useState<Quota[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isMobile = useIsMobile();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    async function fetchOpenQuotas() {
      setLoading(true);

      // 2. QUERY ATUALIZADA (para buscar os novos campos)
      let query = supabase
        .from("quotas")
        .select(
          `
          id,
          producer_id,
          delivery_date,
          participants_count,
          quantity,
          current_quantity,
          max_participants,
          products!inner ( id, name, category ), 
          profiles ( full_name )
        `
        )
        .eq("status", "open");

      if (categoryFilter !== "all") {
        query = query.eq("products.category", categoryFilter);
      }

      if (debouncedSearchTerm) {
        query = query.ilike("products.name", `%${debouncedSearchTerm}%`);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        console.error("Erro ao buscar cotas:", error);
      } else {
        setQuotas(data as unknown as Quota[]);
      }
      setLoading(false);
    }

    fetchOpenQuotas();
  }, [debouncedSearchTerm, categoryFilter]);

  const getProductName = (quota: Quota) => {
    return quota.products?.name || "Produto desconhecido";
  };

  const getProducerName = (quota: Quota) => {
    return quota.profiles?.full_name || "Produtor desconhecido";
  };

  const FilterContent = () => (
    <RadioGroup
      value={categoryFilter}
      onValueChange={(value) => {
        setCategoryFilter(value);
        setIsFilterOpen(false);
      }}
      className="p-1"
    >
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center space-x-2 py-2 rounded-md hover:bg-accent"
        >
          <RadioGroupItem
            value={category.id}
            id={`${category.id}-${isMobile ? "drawer" : "popover"}`}
            className="ml-2"
          />
          <Label
            htmlFor={`${category.id}-${isMobile ? "drawer" : "popover"}`}
            className="text-base w-full cursor-pointer"
          >
            {category.name}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <LocationSelector />

        <div>
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Participar de Cotas
          </h1>

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

            {isMobile ? (
              <Drawer open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <DrawerTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 bg-transparent flex-shrink-0"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Filtrar por Categoria</DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 pt-0">
                    <FilterContent />
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Cancelar</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            ) : (
              <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-12 w-12 bg-transparent flex-shrink-0"
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="end">
                  <h3 className="px-3 py-2 text-sm font-semibold">
                    Filtrar por Categoria
                  </h3>
                  <FilterContent />
                </PopoverContent>
              </Popover>
            )}
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
              {searchTerm || categoryFilter !== "all"
                ? "Tente rever seus filtros ou termo de busca."
                : "Ainda não há cotas abertas."}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {quotas.map((quota) => (
              <Card key={quota.id} className="overflow-hidden">
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg text-foreground">
                      {getProductName(quota)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Criado por: {getProducerName(quota)}
                    </p>
                  </div>

                  {/* 3. CARDS ATUALIZADOS */}
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
                        Vagas Restantes
                      </span>
                      <span className="text-sm font-semibold">
                        {Math.max(
                          0,
                          quota.max_participants - quota.participants_count
                        )}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center text-center bg-secondary/10 rounded-lg p-2 h-auto">
                      <ShoppingBasket className="h-4 w-4 text-secondary mb-1" />
                      <span className="text-xs text-muted-foreground">
                        Qtd. Restante
                      </span>
                      <span className="text-sm font-semibold">
                        {Math.max(0, quota.quantity - quota.current_quantity)}
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
