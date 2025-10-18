import { MobileHeader } from "@/components/layout/mobile-header"
import { AdminNav } from "@/components/layout/admin-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { mockUsers } from "@/lib/mock-data"
import { Search, Filter, MoreVertical } from "lucide-react"

export default function AdminUsers() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader title="Gerenciar Usuários" showNotifications />

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Search and Filter */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar usuários..." className="pl-9" />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Produtores</p>
            <p className="text-2xl font-bold">156</p>
          </Card>
          <Card className="p-4">
            <p className="text-sm text-muted-foreground">Vendedores</p>
            <p className="text-2xl font-bold">92</p>
          </Card>
        </div>

        {/* Users List */}
        <div>
          <h2 className="text-lg font-bold mb-4">Todos os Usuários</h2>
          <div className="space-y-3">
            {mockUsers.map((user) => (
              <Card key={user.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{user.name}</h3>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          user.type === "produtor" ? "bg-green-100 text-green-700" : "bg-purple-100 text-purple-700"
                        }`}
                      >
                        {user.type === "produtor" ? "Produtor" : "Vendedor"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{user.location}</span>
                      <span>•</span>
                      <span>{user.totalOrders} pedidos</span>
                    </div>
                    <div className="mt-2">
                      <span className="text-sm font-medium">
                        {user.type === "produtor"
                          ? `R$ ${user.totalSpent?.toLocaleString()}`
                          : `R$ ${user.totalSales?.toLocaleString()}`}
                      </span>
                      <span className="text-xs text-muted-foreground ml-1">
                        {user.type === "produtor" ? "gastos" : "em vendas"}
                      </span>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
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
