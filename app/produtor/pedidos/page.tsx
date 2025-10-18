import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { mockOrders } from "@/lib/mock-data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Package, Calendar, DollarSign } from "lucide-react"

export default function ProducerOrders() {
  const statusColors = {
    pending: "bg-yellow-500/10 text-yellow-700 border-yellow-500/20",
    confirmed: "bg-blue-500/10 text-blue-700 border-blue-500/20",
    delivered: "bg-green-500/10 text-green-700 border-green-500/20",
    cancelled: "bg-red-500/10 text-red-700 border-red-500/20",
  }

  const statusLabels = {
    pending: "Pendente",
    confirmed: "Confirmado",
    delivered: "Entregue",
    cancelled: "Cancelado",
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />

      <main className="max-w-lg mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Meus Pedidos</h1>

        {mockOrders.length === 0 ? (
          <div className="flex items-center justify-center h-64 bg-muted/30 rounded-xl border border-dashed border-border">
            <p className="text-muted-foreground">Nenhum pedido encontrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {mockOrders.map((order) => (
              <Card key={order.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{order.productName}</h3>
                      <p className="text-sm text-muted-foreground">{order.sellerName}</p>
                    </div>
                    <Badge className={statusColors[order.status]} variant="outline">
                      {statusLabels[order.status]}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Quantidade</p>
                        <p className="text-sm font-medium">{order.quantity}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-sm font-medium">R$ {order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Entrega</p>
                        <p className="text-sm font-medium">
                          {new Date(order.deliveryDate).toLocaleDateString("pt-BR", {
                            day: "2-digit",
                            month: "short",
                          })}
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
  )
}
