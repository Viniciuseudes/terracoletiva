import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { mockQuotas } from "@/lib/mock-data"
import { Calendar, MapPin, Users, Package } from "lucide-react"

export function ActiveQuotas() {
  const openQuotas = mockQuotas.filter((q) => q.status === "open")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Cotas Coletivas Abertas</h2>
        <Button>Criar Nova Cota</Button>
      </div>

      {openQuotas.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma cota aberta no momento</p>
            <Button className="mt-4">Criar Primeira Cota</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {openQuotas.map((quota) => {
            const progress = (quota.currentQuantity / quota.quantity) * 100

            return (
              <Card key={quota.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{quota.product.name}</CardTitle>
                        <Badge variant={quota.status === "open" ? "default" : "secondary"}>
                          {quota.status === "open" ? "Aberta" : "Fechada"}
                        </Badge>
                      </div>
                      <CardDescription>Criada por {quota.producerName}</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">R$ {quota.targetPrice.toFixed(2)}</div>
                      <div className="text-sm text-muted-foreground">por {quota.unit}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Package className="h-4 w-4" />
                      <span>
                        {quota.currentQuantity} / {quota.quantity} {quota.unit}
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
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progresso da Cota</span>
                      <span className="font-medium">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Entrega: {new Date(quota.deliveryDate).toLocaleDateString("pt-BR")}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Ver Propostas
                      </Button>
                      <Button size="sm">Participar</Button>
                    </div>
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
