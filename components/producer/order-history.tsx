import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { mockOrders } from "@/lib/mock-data"
import { Calendar, Package } from "lucide-react"

const statusMap = {
  pending: { label: "Pendente", variant: "secondary" as const },
  confirmed: { label: "Confirmado", variant: "default" as const },
  delivered: { label: "Entregue", variant: "outline" as const },
  cancelled: { label: "Cancelado", variant: "destructive" as const },
}

export function OrderHistory() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Histórico de Pedidos</h2>
        <Button variant="outline" size="sm">
          Ver Todos
        </Button>
      </div>

      {mockOrders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhum pedido realizado ainda</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {mockOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-lg">{order.productName}</CardTitle>
                      <Badge variant={statusMap[order.status].variant}>{statusMap[order.status].label}</Badge>
                    </div>
                    <CardDescription>Vendedor: {order.sellerName}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-foreground">R$ {order.totalAmount.toFixed(2)}</div>
                    <div className="text-sm text-muted-foreground">{order.quantity} unidades</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Entrega: {new Date(order.deliveryDate).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Package className="h-4 w-4" />
                      <span>Pedido #{order.id}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
