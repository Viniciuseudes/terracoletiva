"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { mockQuotas } from "@/lib/mock-data"
import { MapPin } from "lucide-react"

export function OpportunitiesMap() {
  const openQuotas = mockQuotas.filter((q) => q.status === "open")

  // Group quotas by location
  const quotasByLocation = openQuotas.reduce(
    (acc, quota) => {
      if (!acc[quota.deliveryLocation]) {
        acc[quota.deliveryLocation] = []
      }
      acc[quota.deliveryLocation].push(quota)
      return acc
    },
    {} as Record<string, typeof openQuotas>,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-secondary" />
          Oportunidades por Região
        </CardTitle>
        <CardDescription>Cotas abertas organizadas por localização de entrega</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Object.entries(quotasByLocation).map(([location, quotas]) => (
            <div key={location} className="flex items-center justify-between p-3 rounded-lg border bg-card">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-foreground">{location}</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {quotas.length} {quotas.length === 1 ? "cota aberta" : "cotas abertas"}
                </div>
              </div>
              <Badge variant="secondary">{quotas.length}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
