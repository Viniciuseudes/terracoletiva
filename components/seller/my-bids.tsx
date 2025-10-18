import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockBids, mockQuotas } from "@/lib/mock-data"
import { Calendar, Package, TrendingUp } from "lucide-react"

const statusMap = {
  pending: { label: "Pendente", variant: "secondary" as const },
  accepted: { label: "Aceita", variant: "default" as const },
  rejected: { label: "Recusada", variant: "destructive" as const },
}

export function MyBids() {
  const bidsWithQuotas = mockBids.map((bid) => ({
    ...bid,
    quota: mockQuotas.find((q) => q.id === bid.quotaId),
  }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Minhas Propostas</h2>
        <Button variant="outline" size="sm">
          Ver Todas
        </Button>
      </div>

      {bidsWithQuotas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Você ainda não enviou nenhuma proposta</p>
            <Button className="mt-4">Buscar Oportunidades</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {bidsWithQuotas.map((bid) => {
            if (!bid.quota) return null

            return (
              <Card key={bid.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{bid.quota.product.name}</CardTitle>
                        <Badge variant={statusMap[bid.status].variant}>{statusMap[bid.status].label}</Badge>
                      </div>
                      <CardDescription>Cota organizada por {bid.quota.producerName}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-foreground">R$ {bid.totalPrice.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">
                        R$ {bid.pricePerUnit.toFixed(2)} / {bid.quota.unit}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Condições de entrega:</span> {bid.deliveryTerms}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        <span>
                          {bid.quota.quantity} {bid.quota.unit}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Enviada em {new Date(bid.createdAt).toLocaleDateString("pt-BR")}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
