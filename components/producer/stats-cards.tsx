import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, Package, Users, ShoppingCart } from "lucide-react"

export function StatsCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Economia Total</CardTitle>
          <TrendingDown className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">R$ 4.850,00</div>
          <p className="text-xs text-muted-foreground mt-1">+12% em relação ao mês anterior</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Cotas Ativas</CardTitle>
          <Package className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">8</div>
          <p className="text-xs text-muted-foreground mt-1">3 criadas por você</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Participações</CardTitle>
          <Users className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">12</div>
          <p className="text-xs text-muted-foreground mt-1">Em cotas coletivas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos</CardTitle>
          <ShoppingCart className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">24</div>
          <p className="text-xs text-muted-foreground mt-1">3 aguardando entrega</p>
        </CardContent>
      </Card>
    </div>
  )
}
