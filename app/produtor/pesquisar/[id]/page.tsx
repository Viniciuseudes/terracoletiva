import { MobileNav } from "@/components/layout/mobile-nav"
import { ArrowLeft, Bell, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import Link from "next/link"

export default function ProductDetail() {
  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Custom Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center justify-between h-16 px-4 max-w-lg mx-auto">
          <Link href="/produtor/pesquisar">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="max-w-lg mx-auto">
        {/* Product Image */}
        <div className="relative h-64 w-full">
          <Image src="/fish-meal-powder-pile.jpg" alt="Farinha de Peixe" fill className="object-cover" />
        </div>

        <div className="px-4 py-6 space-y-6">
          {/* Product Title */}
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">Farinha de Peixe - 25kg</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Usado na alimentação animal e também em ceveiros, pescaria, tratos e massas para peixe!
            </p>
          </div>

          {/* Quantity */}
          <div>
            <h2 className="text-xl font-bold text-foreground">Quantidade: 500 uni.</h2>
          </div>

          {/* Region */}
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-12 bg-secondary/10 border-secondary/20 text-secondary"
          >
            <MapPin className="h-4 w-4" />
            <span className="font-medium">Região: Macaíba/RN</span>
          </Button>

          {/* Current Price */}
          <div className="bg-muted/30 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Valor Atual por unidade</p>
                <p className="text-sm text-muted-foreground">Oceanic Feeds Co.</p>
              </div>
              <p className="text-2xl font-bold text-foreground">R$ 36,00</p>
            </div>
          </div>

          {/* Recent Bids */}
          <div>
            <h3 className="font-semibold text-foreground mb-3">Últimos lances</h3>
            <div className="flex gap-2">
              <Badge variant="outline" className="px-4 py-2 text-sm">
                MarinePro Foods
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-sm">
                AquaHarvest Inc
              </Badge>
            </div>
          </div>

          {/* Countdown */}
          <div className="bg-muted/30 rounded-xl p-6 text-center space-y-2">
            <p className="text-lg font-semibold text-foreground">Tempo Restante:</p>
            <p className="text-3xl font-bold text-secondary">6 dias e 23:59:21</p>
          </div>

          {/* CTA Button */}
          <Button
            size="lg"
            className="w-full h-14 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            Tenho interesse
          </Button>
        </div>
      </main>

      <MobileNav userType="produtor" />
    </div>
  )
}
