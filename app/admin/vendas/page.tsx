import { MobileHeader } from "@/components/layout/mobile-header"
import { AdminNav } from "@/components/layout/admin-nav"
import { Card } from "@/components/ui/card"
import { mockOrders } from "@/lib/mock-data"
import { TrendingUp, DollarSign, Package, CheckCircle } from "lucide-react"

export default function AdminSales() {
  const totalSales = mockOrders.reduce((sum, order) => sum + order.totalAmount, 0)
  const completedOrders = mockOrders.filter((order) => order.status === "delivered").length

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader title="Vendas" showNotifications />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <div className="flex items-start justify-between mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-xs font-medium text-green-600">+23%</span>
            </div>
            <p className="text-2xl font-bold">R$ {totalSales.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Volume Total</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-start justify-between mb-2">
              <Package className="h-5 w-5 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">+12%</span>
            </div>
            <p className="text-2xl font-bold">{mockOrders.length}</p>
            <p className="text-xs text-muted-foreground">Total de Pedidos</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-start justify-between mb-2">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
            <p className="text-2xl font-bold">{completedOrders}</p>
            <p className="text-xs text-muted-foreground">Pedidos Entregues</p>
          </Card>

          <Card className="p-4">
            <div className="flex items-start justify-between mb-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
            </div>
            <p className="text-2xl font-bold">R$ {(totalSales / mockOrders.length).toFixed(0)}</p>
            <p className="text-xs text-muted-foreground">Ticket Médio</p>
          </Card>
        </div>

        {/* Recent Sales */}
        <div>
          <h2 className="text-lg font-bold mb-4">Vendas Recentes</h2>
          <div className="space-y-3">
            {mockOrders.map((order) => (
              <Card key={order.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{order.productName}</h3>
                      <p className="text-sm text-muted-foreground">{order.sellerName}</p>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-700"
                          : order.status === "confirmed"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {order.status === "delivered"
                        ? "Entregue"
                        : order.status === "confirmed"
                          ? "Confirmado"
                          : "Pendente"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-muted-foreground">Quantidade</p>
                      <p className="font-medium">{order.quantity} un</p>
                    </div>
                    <div className="text-right">
                      <p className="text-muted-foreground">Valor Total</p>
                      <p className="font-semibold text-green-600">R$ {order.totalAmount.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t text-xs text-muted-foreground">
                    <p>Entrega: {new Date(order.deliveryDate).toLocaleDateString("pt-BR")}</p>
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
