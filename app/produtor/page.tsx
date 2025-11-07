// File: app/produtor/page.tsx

import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { LocationSelector } from "@/components/producer/location-selector";
import { ProductCarousel } from "@/components/producer/product-carousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { RecentQuotas } from "@/components/producer/RecentQuotas"; // Importando o novo componente

export default function ProducerHome() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-8">
        {/* Location Selector (Dinâmico) */}
        <LocationSelector />

        {/* Featured Products Carousel */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Insumos em Destaque
          </h2>
          <ProductCarousel />
        </section>

        {/* Seção Nova: Call to Action para Criar Cota */}
        <section>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/20 border-primary/30 text-center">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground">
                Pronto para economizar de verdade?
              </CardTitle>
              <CardDescription className="text-foreground/80 text-base mt-2">
                Ao iniciar uma cota, você une forças com outros produtores,
                aumenta o poder de negociação e consegue preços muito melhores
                para seus insumos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/produtor/nova-cota" passHref>
                <Button size="lg" className="w-full text-lg">
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Criar Nova Cota Coletiva
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Seção atualizada para mostrar Cotas Recentes */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">
            Minhas Cotas Recentes
          </h2>
          <RecentQuotas />
        </section>
      </main>

      <MobileNav userType="produtor" />
    </div>
  );
}
