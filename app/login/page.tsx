"use client";

import type React from "react";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
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
import { Sprout, AlertCircle } from "lucide-react";
import { login, getCurrentUserProfile } from "@/lib/auth";
import type { UserProfile } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Usa a nova função de login do Supabase
      const user = await login(email, password);

      if (user) {
        // Após o login bem-sucedido, buscar o perfil completo para obter o user_type
        const userProfile: UserProfile | null = await getCurrentUserProfile();

        if (userProfile?.user_type) {
          // Redireciona com base no tipo de usuário do perfil
          if (userProfile.user_type === "producer") {
            // 'producer' conforme a tabela SQL
            router.push("/produtor");
          } else if (userProfile.user_type === "seller") {
            // 'seller' conforme a tabela SQL
            router.push("/vendedor");
          } else if (userProfile.user_type === "admin") {
            router.push("/admin");
          } else {
            // Caso tenha um tipo inesperado ou não definido
            console.warn(
              "Tipo de usuário desconhecido:",
              userProfile.user_type
            );
            router.push("/"); // Redireciona para a home como fallback
          }
        } else {
          // Se não encontrar o perfil ou o tipo, redireciona para a home
          // Nota: Isso pode acontecer se o cadastro do perfil falhar após a autenticação.
          console.warn("Perfil ou tipo de usuário não encontrado após login.");
          setError("Não foi possível carregar os dados do seu perfil.");
          setIsLoading(false); // Para o loading para mostrar o erro
          // Opcionalmente, pode redirecionar para uma página de erro ou home
          // router.push("/");
        }
      } else {
        // Teoricamente não deve chegar aqui se a função login lança erro, mas por segurança:
        setError("Falha no login. Verifique suas credenciais.");
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error("Erro detalhado no login:", error);
      // Pega a mensagem de erro do Supabase ou uma mensagem genérica
      // Adapta a mensagem de erro para ser mais amigável
      if (
        error?.message &&
        error.message.includes("Invalid login credentials")
      ) {
        setError("Email ou senha incorretos.");
      } else {
        setError("Ocorreu um erro. Tente novamente mais tarde.");
      }
    } finally {
      // Garante que o estado de loading seja desativado, exceto em caso de redirecionamento imediato
      if (pathname === "/login") {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-accent/30 to-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Sprout className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl">Entrar</CardTitle>
          <CardDescription>Acesse sua conta Terra Coletiva RN</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  href="/recuperar-senha"
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Entrando..." : "Entrar"}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              Não tem uma conta?{" "}
              <Link href="/cadastro" className="text-primary hover:underline">
                Cadastre-se
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
