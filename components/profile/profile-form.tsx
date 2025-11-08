// components/profile/profile-form.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Save, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserProfile } from "@/lib/auth";
import type { UserProfile } from "@/lib/auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ProfileFormProps {
  userType: "producer" | "seller";
}

export function ProfileForm({ userType }: ProfileFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [user, setUser] = useState<UserProfile | null>(null);

  // States para os campos do formulário
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [companyName, setCompanyName] = useState(""); // Específico do Vendedor
  const [propertyName, setPropertyName] = useState(""); // Específico do Produtor
  const [bio, setBio] = useState("");

  // Carrega os dados do usuário ao iniciar o componente
  useEffect(() => {
    async function loadUserData() {
      setIsLoading(true);
      const userProfile = await getCurrentUserProfile();
      if (!userProfile) {
        toast.error("Sessão não encontrada. Redirecionando para o login.");
        router.push("/login");
        return;
      }

      setUser(userProfile);

      // Popula os states do formulário com os dados do Supabase
      setFullName(userProfile.full_name || "");
      setEmail(userProfile.email || ""); // Email vem do 'auth.user'
      setPhone(userProfile.phone || "");
      setCity(userProfile.city || "");
      setAddress(userProfile.address || "");

      // Campos específicos (assumindo que estão na tabela 'profiles')
      // @ts-ignore
      setCompanyName(userProfile.company_name || "");
      // @ts-ignore
      setPropertyName(userProfile.property_name || "");
      // @ts-ignore
      setBio(userProfile.bio || "");

      setIsLoading(false);
    }
    loadUserData();
  }, [router]);

  // Função de salvamento
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Usuário não encontrado.");
      return;
    }

    setIsSaving(true);

    // 1. Atualizar dados na tabela 'profiles'
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone,
        city: city,
        address: address,
        company_name: userType === "seller" ? companyName : undefined,
        property_name: userType === "producer" ? propertyName : undefined,
        bio: bio,
        // Adicione aqui quaisquer outros campos que você tenha na tabela profiles
      })
      .eq("id", user.id);

    if (profileError) {
      toast.error("Erro ao salvar perfil.", {
        description: profileError.message,
      });
      setIsSaving(false);
      return;
    }

    // 2. (Opcional) Atualizar o email na tabela 'auth.users'
    // Isso requer confirmação por email, então é um fluxo mais complexo.
    // Por enquanto, vamos manter o email como não-editável.

    setIsSaving(false);
    setIsEditing(false);
    toast.success("Perfil salvo com sucesso!");
  };

  // Mostra um skeleton/loading enquanto os dados carregam
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Informações Pessoais</CardTitle>
          <CardDescription>Carregando seus dados...</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

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
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                // Email não é editável por padrão (requer verificação)
                disabled
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={!isEditing}
            />
          </div>

          {userType === "seller" && (
            <div className="space-y-2">
              <Label htmlFor="company">Nome da Empresa</Label>
              <Input
                id="company"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          )}

          {userType === "producer" && (
            <div className="space-y-2">
              <Label htmlFor="property">Nome da Propriedade</Label>
              <Input
                id="property"
                value={propertyName}
                onChange={(e) => setPropertyName(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="bio">Sobre</Label>
            <Textarea
              id="bio"
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder={
                userType === "producer"
                  ? "Ex: Produtor rural há 15 anos, especializado em..."
                  : "Ex: Fornecedor de insumos agrícolas com mais de 20 anos..."
              }
              disabled={!isEditing}
            />
          </div>

          {isEditing && (
            <Button
              type="submit"
              className="w-full sm:w-auto"
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save className="mr-2 h-4 w-4" />
              )}
              {isSaving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
