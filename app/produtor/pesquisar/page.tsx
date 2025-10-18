import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { RegionSelector } from "@/components/producer/region-selector"
import { Search, SlidersHorizontal, Calendar, Users, ShoppingBasket } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Image from "next/image"

const products = [
  {
    id: "1",
    name: "Farinha de Peixe - 25kg",
    creator: "João Silva - Fazenda Santo Antonio",
    image: "/fish-meal-powder-pile.jpg",
    expiresAt: "26/Nov",
    quotas: 3,
    quantity: 500,
  },
  {
    id: "2",
    name: "Farinha de Soja - 30kg",
    creator: "Maria Santos - Sítio Boa Vista",
    image: "/soybean-meal-in-bowl.jpg",
    expiresAt: "28/Nov",
    quotas: 5,
    quantity: 800,
  },
]

export default function ProducerSearch() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <RegionSelector />

        <div>
          <h1 className="text-2xl font-bold text-foreground mb-4">Insumos</h1>

          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar insumo" className="pl-10 h-12 bg-muted/30" />
            </div>
            <Button variant="outline" size="icon" className="h-12 w-12 bg-transparent">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Product List */}
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>

              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                  <p className="text-sm text-muted-foreground">Criado por: {product.creator}</p>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button variant="secondary" className="h-auto flex-col gap-1 py-2">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs">Expira em</span>
                    <span className="text-sm font-semibold">{product.expiresAt}</span>
                  </Button>

                  <Button variant="secondary" className="h-auto flex-col gap-1 py-2">
                    <Users className="h-4 w-4" />
                    <span className="text-xs">Nº cotas</span>
                    <span className="text-sm font-semibold">{product.quotas}</span>
                  </Button>

                  <Button variant="secondary" className="h-auto flex-col gap-1 py-2">
                    <ShoppingBasket className="h-4 w-4" />
                    <span className="text-xs">Quantidade</span>
                    <span className="text-sm font-semibold">{product.quantity}</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </main>

      <MobileNav userType="produtor" />
    </div>
  )
}
