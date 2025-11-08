"use client";

import { Suspense, useState, useTransition } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image"; // 1. IMPORTAR O COMPONENTE IMAGE
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

// --- FUNÇÕES DE VALIDAÇÃO DE CPF/CNPJ ---

const isValidCPF = (cpf: string) => {
  if (typeof cpf !== "string") return false;
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  const cpfDigits = cpf.split("").map((el) => +el);
  const rest = (count: number): number => {
    return (
      ((cpfDigits
        .slice(0, count - 12)
        .reduce((soma, el, index) => soma + el * (count - index), 0) *
        10) %
        11) %
      10
    );
  };
  return rest(10) === cpfDigits[9] && rest(11) === cpfDigits[10];
};

const isValidCNPJ = (cnpj: string) => {
  if (typeof cnpj !== "string") return false;
  cnpj = cnpj.replace(/[^\d]+/g, "");
  if (cnpj.length !== 14 || !!cnpj.match(/(\d)\1{13}/)) return false;
  const cnpjDigits = cnpj.split("").map((el) => +el);
  const validateDigit = (length: number): boolean => {
    const weights =
      length === 12
        ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
        : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = cnpjDigits
      .slice(0, length)
      .reduce((s, el, i) => s + el * weights[i], 0);
    const digit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    return digit === cnpjDigits[length];
  };
  return validateDigit(12) && validateDigit(13);
};

const isValidCpfCnpj = (doc: string) => {
  if (typeof doc !== "string") return false;
  const cleanDoc = doc.replace(/[^\d]+/g, "");
  if (cleanDoc.length === 11) {
    return isValidCPF(cleanDoc);
  }
  if (cleanDoc.length === 14) {
    return isValidCNPJ(cleanDoc);
  }
  return false;
};

// --- COMPONENTE DO FORMULÁRIO ---

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [fullName, setFullName] = useState("");
  const [cpfCnpj, setCpfCnpj] = useState("");
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

  // 2. FUNÇÃO DA MÁSCARA AUTOMÁTICA
  const formatCpfCnpj = (value: string) => {
    const numericValue = value.replace(/[^\d]/g, "");

    if (numericValue.length <= 11) {
      // Formato CPF: ###.###.###-##
      return numericValue
        .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona o primeiro ponto
        .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona o segundo ponto
        .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Adiciona o traço
    } else {
      // Formato CNPJ: ##.###.###/####-##
      return numericValue
        .slice(0, 14) // Limita a 14 dígitos
        .replace(/^(\d{2})(\d)/, "$1.$2") // Adiciona o primeiro ponto
        .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3") // Adiciona o segundo ponto
        .replace(/\.(\d{3})(\d)/, ".$1/$2") // Adiciona a barra
        .replace(/(\d{4})(\d)/, "$1-$2"); // Adiciona o traço
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    // VALIDAÇÃO DE CPF/CNPJ
    if (!isValidCpfCnpj(cpfCnpj)) {
      setError("CPF ou CNPJ inválido. Verifique os dados.");
      return;
    }

    // VALIDAÇÃO DE TELEFONE (simples, apenas para ver se não está vazio)
    if (!phone.trim()) {
      setError("O campo Telefone é obrigatório.");
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
            cpf_cnpj: cpfCnpj.replace(/[^\d]+/g, ""), // Salva só os números
          }
        );

        if (signUpError) {
          if (signUpError.message.includes("User already registered")) {
            setError("Este e-mail já está em uso.");
          } else if (
            signUpError.message.includes(
              'duplicate key value violates unique constraint "profiles_cpf_cnpj_key"'
            )
          ) {
            setError("Este CPF/CNPJ já está cadastrado.");
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
          {/* 3. LOGO ATUALIZADA E MAIOR */}
          <div className="flex justify-center mb-4">
            <Image
              src="/logonova.png"
              alt="Terra Coletiva Logo"
              width={64}
              height={64}
              className="h-16 w-16"
            />
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
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-accent-foreground cursor-pointer"
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
                    className="flex flex-col items-center justify-center rounded-lg border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-secondary peer-data-[state=checked]:bg-accent peer-data-[state=checked]:text-accent-foreground cursor-pointer"
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

            {/* 4. INPUT COM A MÁSCARA AUTOMÁTICA */}
            <div className="space-y-2">
              <Label htmlFor="cpfCnpj">CPF ou CNPJ</Label>
              <Input
                id="cpfCnpj"
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                required
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(formatCpfCnpj(e.target.value))}
                disabled={isPending}
                maxLength={18} // Tamanho máximo da máscara de CNPJ (##.###.###/####-##)
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
                required
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
