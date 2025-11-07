"use client";

import { Suspense, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sprout, Store, AlertCircle, CheckCircle } from "lucide-react";
import { signUp } from "@/lib/auth";

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState<"producer" | "seller">(
    (searchParams.get("tipo") as "producer" | "seller") || "producer"
  );

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    startTransition(async () => {
      try {
        const { error: signUpError } = await signUp(
          { email, password },
          {
            full_name: fullName,
            user_type: userType,
            phone: phone,
          }
        );

        if (signUpError) {
          if (signUpError.message.includes("User already registered")) {
            setError("Este e-mail já está em uso.");
          } else {
            setError("Ocorreu um erro ao criar a conta. Tente novamente.");
          }
        } else {
          setSuccessMessage(
            "Conta criada com sucesso! Você será redirecionado para o login."
          );
          // Redireciona para a página de login após 2 segundos
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } catch (err) {
        console.error("Erro inesperado no cadastro:", err);
        setError("Ocorreu um erro inesperado. Tente novamente mais tarde.");
      }
    });
  };

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
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
            {successMessage && (
              <div className="flex items-center gap-2 p-3 text-sm text-green-700 bg-green-500/10 rounded-lg">
                <CheckCircle className="h-4 w-4" />
                <span>{successMessage}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label>Tipo de Conta</Label>
              <RadioGroup
                value={userType}
                onValueChange={(value) =>
                  setUserType(value as "producer" | "seller")
                }
                className="grid grid-cols-2 gap-4"
                disabled={isPending}
              >
                <div>
                  <RadioGroupItem
                    value="producer"
                    id="produtor"
                    className="peer sr-only"
                  />
                  <Label
                    htmlFor="produtor"
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                  >
                    <Sprout className="mb-2 h-6 w-6" />
                    <span className="text-sm font-medium">Produtor</span>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem
                    value="seller"
                    id="vendedor"
                    className="peer sr-only"
                  />
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
              <Input
                id="name"
                placeholder="João Silva"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="joao@exemplo.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(84) 99999-9999"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirmar Senha</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isPending}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Criando conta..." : "Criar Conta"}
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
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <SignupForm />
    </Suspense>
  );
}
