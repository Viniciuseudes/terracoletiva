import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { RegionSelector } from "@/components/producer/region-selector"
import { ProductCarousel } from "@/components/producer/product-carousel"
import { PriceTrackingCard } from "@/components/producer/price-tracking-card"

export default function ProducerHome() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        {/* Region Selector */}
        <RegionSelector />

        {/* Featured Products Carousel */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Insumos em Destaques</h2>
          <ProductCarousel />
        </section>

        {/* Price Tracking */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Saiba quando comprar</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            <PriceTrackingCard productName="Farinha de Peixe" currentPrice={55.0} date="05, Dec 56:20" trend="down" />
            <PriceTrackingCard productName="Farinha de Soja" currentPrice={25.0} date="03, Dec 56:20" trend="down" />
            <PriceTrackingCard productName="Milho Triturado" currentPrice={42.0} date="07, Dec 12:15" trend="up" />
          </div>
        </section>

        {/* Recent Orders */}
        <section>
          <h2 className="text-xl font-bold text-foreground mb-4">Últimos pedidos</h2>
          <div className="flex items-center justify-center h-32 bg-muted/30 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">Nenhum pedido feito</p>
          </div>
        </section>
      </main>

      <MobileNav userType="produtor" />
    </div>
  )
}
