"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Bell } from "lucide-react"

export function NotificationSettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificações
        </CardTitle>
        <CardDescription>Configure como você deseja receber notificações</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="email-notifications">Notificações por Email</Label>
            <p className="text-sm text-muted-foreground">Receba atualizações importantes por email</p>
          </div>
          <Switch id="email-notifications" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="new-quotas">Novas Cotas</Label>
            <p className="text-sm text-muted-foreground">Notificar quando novas cotas forem criadas</p>
          </div>
          <Switch id="new-quotas" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="bid-updates">Atualizações de Propostas</Label>
            <p className="text-sm text-muted-foreground">Notificar sobre mudanças nas suas propostas</p>
          </div>
          <Switch id="bid-updates" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="order-updates">Atualizações de Pedidos</Label>
            <p className="text-sm text-muted-foreground">Notificar sobre status dos seus pedidos</p>
          </div>
          <Switch id="order-updates" defaultChecked />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="marketing">Novidades e Promoções</Label>
            <p className="text-sm text-muted-foreground">Receber informações sobre novidades da plataforma</p>
          </div>
          <Switch id="marketing" />
        </div>
      </CardContent>
    </Card>
  )
}
