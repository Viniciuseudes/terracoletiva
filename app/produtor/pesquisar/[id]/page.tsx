// app/produtor/pesquisar/[id]/page.tsx
// VERSÃO FINAL CORRIGIDA (com ícone X importado)

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserProfile } from "@/lib/auth";
import type { UserProfile } from "@/lib/auth";
import { MobileNav } from "@/components/layout/mobile-nav";
import {
  ArrowLeft,
  Bell,
  MapPin,
  Loader2,
  Info,
  DollarSign,
  Users,
  Check,
  Clock,
  MessageCircle,
  X, // <-- CORREÇÃO: ÍCONE ADICIONADO
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Interface para o tipo de produto (pode ser objeto ou array)
type ProductType =
  | { name: string; description: string }
  | { name: string; description: string }[]
  | null;

// Interface para os dados detalhados da cota
interface QuotaDetail {
  id: string;
  producer_id: string; // ID do criador
  delivery_date: string;
  delivery_location: string;
  quantity: number;
  unit: string;
  target_price: number;
  products: ProductType; // Tipo corrigido
  profiles: {
    full_name: string;
  } | null;
  bids: {
    id: string;
    profiles: {
      full_name: string;
    } | null;
  }[];
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const quotaId = params.id as string;

  const [quota, setQuota] = useState<QuotaDetail | null>(null);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [participationStatus, setParticipationStatus] = useState<string | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [joinQuantity, setJoinQuantity] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    if (!quotaId) return;

    async function fetchData() {
      setLoading(true);
      const user = await getCurrentUserProfile();
      if (user) {
        setCurrentUser(user);
      } else {
        toast.error("Sessão inválida. A redirecionar para o login.");
        router.push("/login");
        return;
      }

      // 1. Buscar os detalhes da cota
      const { data, error } = await supabase
        .from("quotas")
        .select(
          `
          id, producer_id, delivery_date, delivery_location, quantity, unit,
          target_price,
          products ( name, description ),
          profiles ( full_name ),
          bids ( id, profiles ( full_name ) )
        `
        )
        .eq("id", quotaId)
        .single();

      if (error || !data) {
        console.error("Erro ao buscar detalhe da cota:", error);
        setQuota(null);
      } else {
        setQuota(data as unknown as QuotaDetail);
      }

      // 2. Verificar se o utilizador atual já participa ou solicitou
      const { data: participationData } = await supabase
        .from("quota_participants")
        .select("status")
        .eq("quota_id", quotaId)
        .eq("producer_id", user.id)
        .maybeSingle();

      if (participationData) {
        setParticipationStatus(participationData.status);
      }

      setLoading(false);
    }

    fetchData();
  }, [quotaId, router]);

  // Função para lidar com a participação na cota
  const handleJoinQuota = async () => {
    if (!currentUser || !quota) return;
    if (!joinQuantity || parseFloat(joinQuantity) <= 0) {
      toast.error("Quantidade inválida", {
        description: "Por favor, insira uma quantidade maior que zero.",
      });
      return;
    }

    setIsJoining(true);

    const { error } = await supabase.from("quota_participants").insert({
      quota_id: quota.id,
      producer_id: currentUser.id,
      quantity: parseFloat(joinQuantity),
      // status é 'pending' por defeito (definido no SQL)
    });

    if (error) {
      console.error("Erro ao solicitar participação:", error);
      toast.error("Erro ao solicitar", {
        description:
          "Ocorreu um erro. Talvez você já tenha solicitado. " + error.message,
      });
    } else {
      toast.success("Solicitação enviada!", {
        description: `Você solicitou ${joinQuantity} ${quota.unit}. Aguarde a aprovação do criador da cota.`,
      });
      setParticipationStatus("pending");
      setIsModalOpen(false);
      setJoinQuantity("");
    }

    setIsJoining(false);
  };

  // --- Funções Auxiliares Corrigidas ---
  const getProductName = () => {
    const prod = quota?.products as ProductType;
    if (!prod) return "Produto não carregado";
    if (Array.isArray(prod)) return prod[0]?.name || "Produto não carregado";
    return prod.name;
  };

  const getProductDescription = () => {
    const prod = quota?.products as ProductType;
    if (!prod) return "Sem descrição.";
    if (Array.isArray(prod)) return prod[0]?.description || "Sem descrição.";
    return prod.description;
  };

  const getProducerName = () =>
    quota?.profiles?.full_name || "Produtor não identificado";

  const getProductImage = () => "/placeholder.jpg"; // Placeholder

  const isOwner = currentUser?.id === quota?.producer_id;

  // --- Lógica Corrigida do Botão Principal ---
  const getButtonContent = () => {
    // Se for o Dono OU já for um participante Ativo, mostra o botão de Chat
    if (isOwner || participationStatus === "active") {
      return (
        <Link href={`/produtor/chat/${quota?.id}`} passHref>
          <Button
            size="lg"
            className="w-full h-14 text-lg font-semibold"
            variant="secondary"
          >
            <MessageCircle className="mr-2 h-5 w-5" />
            {isOwner ? "Aceder ao Chat da Cota" : "Aceder ao Chat"}
          </Button>
        </Link>
      );
    }

    // Se a solicitação estiver Pendente
    if (participationStatus === "pending") {
      return (
        <Button size="lg" className="w-full h-14" variant="outline" disabled>
          <Clock className="mr-2 h-5 w-5" />
          Solicitação Pendente
        </Button>
      );
    }

    // Se for Rejeitado (opcional, pode tratar como "participar de novo")
    if (participationStatus === "cancelled") {
      return (
        <Button size="lg" className="w-full h-14" variant="outline" disabled>
          <X className="mr-2 h-5 w-5" />
          Solicitação Rejeitada
        </Button>
      );
    }

    // Botão default para participar (se não for dono, nem pendente, nem ativo)
    return (
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="w-full h-14 text-lg font-semibold bg-secondary hover:bg-secondary/90 text-secondary-foreground"
        >
          <Users className="mr-2 h-5 w-5" />
          Tenho interesse em participar
        </Button>
      </DialogTrigger>
    );
  };

  // Renderização de Loading
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 max-w-lg mx-auto">
            <Link href="/produtor/pesquisar">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
        <MobileNav userType="produtor" />
      </div>
    );
  }

  // Renderização de Cota Não Encontrada
  if (!quota) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 max-w-lg mx-auto">
            <Link href="/produtor/pesquisar">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
          <Info className="h-12 w-12 text-destructive mb-4" />
          <h2 className="text-xl font-bold">Cota não encontrada</h2>
          <p className="text-muted-foreground">
            Esta cota pode ter sido removida ou o link está incorreto.
          </p>
          <Link href="/produtor/pesquisar" className="mt-6">
            <Button variant="outline">Voltar para Pesquisa</Button>
          </Link>
        </div>
        <MobileNav userType="produtor" />
      </div>
    );
  }

  // Renderização Principal
  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen bg-background pb-20">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="flex items-center justify-between h-16 px-4 max-w-lg mx-auto">
            <Link href="/produtor/pesquisar">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="max-w-lg mx-auto">
          {/* Imagem */}
          <div className="relative h-64 w-full">
            <Image
              src={getProductImage()}
              alt={getProductName()}
              fill
              className="object-cover"
            />
          </div>

          <div className="px-4 py-6 space-y-6">
            {/* Título e Descrição */}
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {getProductName()}
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {getProductDescription()}
              </p>
            </div>

            {/* Quantidade */}
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Quantidade total: {quota.quantity} {quota.unit}
              </h2>
            </div>

            {/* Região */}
            <Card className="p-4 bg-secondary/10 border-secondary/20">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-secondary" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Local de Entrega
                  </p>
                  <p className="font-medium text-secondary-foreground">
                    {quota.delivery_location}
                  </p>
                </div>
              </div>
            </Card>

            {/* Preço Alvo */}
            <Card className="p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Preço Alvo (por {quota.unit})
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Criado por: {getProducerName()}
                  </p>
                </div>
                <p className="text-2xl font-bold text-foreground">
                  R$ {quota.target_price.toFixed(2)}
                </p>
              </div>
            </Card>

            {/* Lances de Vendedores */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                Vendedores com Lances
              </h3>
              {quota.bids.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {quota.bids.map((bid) => (
                    <Badge
                      key={bid.id}
                      variant="outline"
                      className="px-4 py-2 text-sm"
                    >
                      {bid.profiles?.full_name || "Vendedor Anônimo"}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum vendedor fez um lance ainda.
                </p>
              )}
            </div>

            {/* Data Limite */}
            <Card className="p-6 text-center space-y-2 bg-muted/30">
              <p className="text-lg font-semibold text-foreground">
                Data Limite para Entrega
              </p>
              <p className="text-3xl font-bold text-secondary">
                {new Date(quota.delivery_date).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </Card>

            {/* Modal de Participação */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              {getButtonContent()}
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Participar da Cota</DialogTitle>
                  <DialogDescription>
                    Qual a quantidade de{" "}
                    <strong>
                      {getProductName()} ({quota.unit})
                    </strong>{" "}
                    que você deseja adicionar a esta cota coletiva?
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="quantity" className="text-right">
                      Qtd.
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="Ex: 50"
                      value={joinQuantity}
                      onChange={(e) => setJoinQuantity(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline" disabled={isJoining}>
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button onClick={handleJoinQuota} disabled={isJoining}>
                    {isJoining ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {isJoining ? "A solicitar..." : "Solicitar Participação"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </main>

        <MobileNav userType="produtor" />
      </div>
    </>
  );
}
