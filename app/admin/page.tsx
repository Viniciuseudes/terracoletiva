import { MobileHeader } from "@/components/layout/mobile-header"
import { AdminNav } from "@/components/layout/admin-nav"
import { Card } from "@/components/ui/card"
import { Users, ShoppingCart, TrendingUp, DollarSign } from "lucide-react"

export default function AdminDashboard() {
  const stats = [
    {
      title: "Total de Usuários",
      value: "248",
      change: "+12%",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Negociações Ativas",
      value: "34",
      change: "+8%",
      icon: ShoppingCart,
      color: "text-purple-600",
    },
    {
      title: "Volume de Vendas",
      value: "R$ 485K",
      change: "+23%",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Receita Mensal",
      value: "R$ 12.5K",
      change: "+15%",
      icon: DollarSign,
      color: "text-orange-600",
    },
  ]

  const recentActivity = [
    {
      type: "Novo Usuário",
      description: "Carlos Oliveira se cadastrou como produtor",
      time: "Há 5 minutos",
    },
    {
      type: "Nova Negociação",
      description: "Cota de Fertilizante NPK criada por João Silva",
      time: "Há 15 minutos",
    },
    {
      type: "Lance Aceito",
      description: "AgroSuprimentos venceu licitação de Calcário",
      time: "Há 1 hora",
    },
    {
      type: "Pedido Entregue",
      description: "Entrega de Ureia para Maria Santos concluída",
      time: "Há 2 horas",
    },
  ]

  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader title="Admin Dashboard" showNotifications />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-xs font-medium text-green-600">{stat.change}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-bold mb-4">Atividade Recente</h2>
          <Card className="divide-y">
            {recentActivity.map((activity, index) => (
              <div key={index} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.type}</p>
                    <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.time}</span>
                </div>
              </div>
            ))}
          </Card>
        </div>

        {/* Quick Stats */}
        <div>
          <h2 className="text-lg font-bold mb-4">Estatísticas Rápidas</h2>
          <div className="grid gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Produtores</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Vendedores</p>
                  <p className="text-2xl font-bold">92</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cotas Abertas</p>
                  <p className="text-2xl font-bold">34</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Cotas Fechadas</p>
                  <p className="text-2xl font-bold">128</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <AdminNav />
    </div>
  )
}
