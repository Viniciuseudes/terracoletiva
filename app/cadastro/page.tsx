"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Sprout, Store } from "lucide-react"

function SignupForm() {
  const searchParams = useSearchParams()
  const [userType, setUserType] = useState(searchParams.get("tipo") || "produtor")

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-accent/30 to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Sprout className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
          <CardDescription>Junte-se à Terra Coletiva RN</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Conta</Label>
              <RadioGroup value={userType} onValueChange={setUserType} className="grid grid-cols-2 gap-4">
                <div>
                  <RadioGroupItem value="produtor" id="produtor" className="peer sr-only" />
                  <Label
                    htmlFor="produtor"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Sprout className="mb-2 h-6 w-6" />
                    <span className="text-sm font-medium">Produtor</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="vendedor" id="vendedor" className="peer sr-only" />
                  <Label
                    htmlFor="vendedor"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-secondary [&:has([data-state=checked])]:border-secondary cursor-pointer"
                  >
                    <Store className="mb-2 h-6 w-6" />
                    <span className="text-sm font-medium">Vendedor</span>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" placeholder="João Silva" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="joao@exemplo.com" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" type="tel" placeholder="(84) 99999-9999" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input id="password" type="password" placeholder="••••••••" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input id="confirm-password" type="password" placeholder="••••••••" required />
            </div>

            <Button type="submit" className="w-full">
              Criar Conta
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" className="text-primary hover:underline">
                Entrar
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SignupForm />
    </Suspense>
  )
}
