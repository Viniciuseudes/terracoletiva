"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save } from "lucide-react"

interface ProfileFormProps {
  userType: "producer" | "seller"
}

export function ProfileForm({ userType }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>Gerencie seus dados cadastrais</CardDescription>
          </div>
          <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Cancelar" : "Editar"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input id="name" defaultValue="João Silva" disabled={!isEditing} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue="joao@exemplo.com" disabled={!isEditing} />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input id="phone" type="tel" defaultValue="(84) 99999-9999" disabled={!isEditing} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input id="city" defaultValue="Mossoró" disabled={!isEditing} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" defaultValue="Rua das Flores, 123, Centro" disabled={!isEditing} />
          </div>

          {userType === "seller" && (
            <div className="space-y-2">
              <Label htmlFor="company">Nome da Empresa</Label>
              <Input id="company" defaultValue="AgroSuprimentos Ltda" disabled={!isEditing} />
            </div>
          )}

          {userType === "producer" && (
            <div className="space-y-2">
              <Label htmlFor="property">Nome da Propriedade</Label>
              <Input id="property" defaultValue="Fazenda Boa Vista" disabled={!isEditing} />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="bio">Sobre</Label>
            <Textarea
              id="bio"
              rows={4}
              defaultValue={
                userType === "producer"
                  ? "Produtor rural há 15 anos, especializado em cultivo de frutas tropicais."
                  : "Fornecedor de insumos agrícolas com mais de 20 anos de experiência no mercado."
              }
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <Button type="submit" className="w-full sm:w-auto">
              <Save className="mr-2 h-4 w-4" />
              Salvar Alterações
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
