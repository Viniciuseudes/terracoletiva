import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Package, CheckCircle, Clock } from "lucide-react"

export function SellerStatsCards() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Vendas Totais</CardTitle>
          <TrendingUp className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">R$ 48.500,00</div>
          <p className="text-xs text-muted-foreground mt-1">+18% em relação ao mês anterior</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Propostas Enviadas</CardTitle>
          <Package className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">24</div>
          <p className="text-xs text-muted-foreground mt-1">Este mês</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Propostas Aceitas</CardTitle>
          <CheckCircle className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">8</div>
          <p className="text-xs text-muted-foreground mt-1">Taxa de conversão: 33%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">Aguardando Resposta</CardTitle>
          <Clock className="h-4 w-4 text-secondary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground">5</div>
          <p className="text-xs text-muted-foreground mt-1">Propostas pendentes</p>
        </CardContent>
      </Card>
    </div>
  )
}
