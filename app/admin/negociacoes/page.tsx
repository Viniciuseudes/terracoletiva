import { MobileHeader } from "@/components/layout/mobile-header"
import { AdminNav } from "@/components/layout/admin-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mockQuotas, mockBids } from "@/lib/mock-data"
import { MapPin, Calendar, Users, TrendingUp } from "lucide-react"

export default function AdminNegotiations() {
  const quotasWithBids = mockQuotas.map((quota) => {
    const bids = mockBids.filter((bid) => bid.quotaId === quota.id)
    return { ...quota, bids }
  })

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader title="Negociações" showNotifications />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Abertas</p>
            <p className="text-xl font-bold">34</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Em Análise</p>
            <p className="text-xl font-bold">12</p>
          </Card>
          <Card className="p-3">
            <p className="text-xs text-muted-foreground">Fechadas</p>
            <p className="text-xl font-bold">128</p>
          </Card>
        </div>

        {/* Active Quotas */}
        <div>
          <h2 className="text-lg font-bold mb-4">Cotas Ativas</h2>
          <div className="space-y-4">
            {quotasWithBids.map((quota) => (
              <Card key={quota.id} className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-1">{quota.product.name}</h3>
                    <p className="text-sm text-muted-foreground">Criado por {quota.producerName}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{quota.deliveryLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(quota.deliveryDate).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{quota.participantsCount} participantes</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4" />
                      <span>{quota.bids.length} lances</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <p className="text-xs text-muted-foreground">Quantidade</p>
                      <p className="font-semibold">
                        {quota.quantity} {quota.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Preço Alvo</p>
                      <p className="font-semibold">R$ {quota.targetPrice.toFixed(2)}</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Detalhes
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <AdminNav />
    </div>
  )
}
