"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { mockQuotas } from "@/lib/mock-data"
import { Search, MapPin, Calendar, Package, Users } from "lucide-react"

export function SearchQuotas() {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredQuotas = mockQuotas.filter((quota) => {
    const matchesSearch =
      quota.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quota.deliveryLocation.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === "all" || quota.product.category === categoryFilter
    return matchesSearch && matchesCategory && quota.status === "open"
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por produto ou localização..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            <SelectItem value="Fertilizantes">Fertilizantes</SelectItem>
            <SelectItem value="Defensivos">Defensivos</SelectItem>
            <SelectItem value="Sementes">Sementes</SelectItem>
            <SelectItem value="Corretivos">Corretivos</SelectItem>
            <SelectItem value="Equipamentos">Equipamentos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredQuotas.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhuma cota encontrada com os filtros selecionados</p>
            </CardContent>
          </Card>
        ) : (
          filteredQuotas.map((quota) => {
            const progress = (quota.currentQuantity / quota.quantity) * 100

            return (
              <Card key={quota.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{quota.product.name}</CardTitle>
                        <Badge variant="secondary">{quota.product.category}</Badge>
                      </div>
                      <CardDescription>Organizada por {quota.producerName}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground mb-1">Preço alvo</div>
                      <div className="text-2xl font-bold text-primary">R$ {quota.targetPrice.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">por {quota.unit}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>
                        {quota.quantity} {quota.unit}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{quota.participantsCount} participantes</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{quota.deliveryLocation}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(quota.deliveryDate).toLocaleDateString("pt-BR")}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progresso</span>
                      <span className="font-medium">{progress.toFixed(0)}% preenchido</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm">
                      <span className="text-muted-foreground">Valor total estimado: </span>
                      <span className="font-bold text-foreground">
                        R$ {(quota.quantity * quota.targetPrice).toFixed(2)}
                      </span>
                    </div>
                    <Button>Fazer Proposta</Button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
