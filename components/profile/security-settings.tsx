"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"

export function SecuritySettings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Segurança
        </CardTitle>
        <CardDescription>Altere sua senha e gerencie configurações de segurança</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Senha Atual</Label>
            <Input id="current-password" type="password" placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new-password">Nova Senha</Label>
            <Input id="new-password" type="password" placeholder="••••••••" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-new-password">Confirmar Nova Senha</Label>
            <Input id="confirm-new-password" type="password" placeholder="••••••••" />
          </div>

          <Button type="submit">Alterar Senha</Button>
        </form>
      </CardContent>
    </Card>
  )
}
