// app/produtor/pesquisar/[id]/page.tsx
// VERSÃO FINAL (Corrigindo a visibilidade dos lances)

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
  X,
  CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Mapa de Nomes de Produtos para Imagens
const productImages: { [key: string]: string } = {
  "Milho (em grão)": "/milho.jpeg",
  "Soja (em grão)": "/soja.jpg",
  "Torta de Algodão": "/resido.jpeg",
  "Silagem de Milho": "/silagem.webp",
  "Sal Mineral": "/sal.png",
  "Ração para Tilápia": "/tilapia.png",
};

type ProductType =
  | { name: string; description: string }
  | { name: string; description: string }[]
  | null;

interface BidDetail {
  id: string;
  price_per_unit: number;
  total_price: number;
  delivery_terms: string;
  profiles: {
    full_name: string;
  } | null;
}

interface QuotaDetail {
  id: string;
  producer_id: string;
  delivery_date: string;
  delivery_location: string;
  quantity: number;
  unit: string;
  target_price: number;
  status: string; // Adicionado status
  products: ProductType;
  profiles: {
    full_name: string;
  } | null;
  bids: BidDetail[];
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
  const [isAccepting, setIsAccepting] = useState(false);

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

      const { data, error } = await supabase
        .from("quotas")
        .select(
          `
          id, producer_id, delivery_date, delivery_location, quantity, unit,
          target_price, status,
          products ( name, description ),
          profiles ( full_name ),
          bids ( id, price_per_unit, total_price, delivery_terms, profiles ( full_name ) )
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
    });
    if (error) {
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

  const handleAcceptBid = async (bidId: string) => {
    if (!quota) return;
    setIsAccepting(true);

    const { error } = await supabase.rpc("accept_bid_and_close_quota", {
      p_bid_id: bidId,
      p_quota_id: quota.id,
    });

    if (error) {
      toast.error("Erro ao aceitar proposta", { description: error.message });
      console.error("Erro ao chamar RPC:", error);
    } else {
      toast.success("Proposta aceite!", {
        description: "A cota foi fechada e os vendedores notificados.",
      });
      setQuota((prev) => (prev ? { ...prev, status: "closed" } : null));
    }
    setIsAccepting(false);
  };

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

  const getProductImage = () => {
    const name = getProductName();
    return productImages[name] || "/placeholder.jpg";
  };

  const getProducerName = () =>
    quota?.profiles?.full_name || "Produtor não identificado";

  const isOwner = currentUser?.id === quota?.producer_id;
  const isCotaOpen = quota?.status === "open";

  const getButtonContent = () => {
    if (!isCotaOpen && !isOwner && participationStatus !== "active") {
      return (
        <Button size="lg" className="w-full h-14" variant="outline" disabled>
          Cota Fechada
        </Button>
      );
    }

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

    if (participationStatus === "pending") {
      return (
        <Button size="lg" className="w-full h-14" variant="outline" disabled>
          <Clock className="mr-2 h-5 w-5" />
          Solicitação Pendente
        </Button>
      );
    }

    if (participationStatus === "cancelled") {
      return (
        <Button size="lg" className="w-full h-14" variant="outline" disabled>
          <X className="mr-2 h-5 w-5" />
          Solicitação Rejeitada
        </Button>
      );
    }

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

  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen bg-background pb-20">
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
          <div className="relative h-64 w-full">
            <Image
              src={getProductImage()}
              alt={getProductName()}
              fill
              className="object-cover"
            />
          </div>

          <div className="px-4 py-6 space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {getProductName()}
              </h1>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {getProductDescription()}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-bold text-foreground">
                Quantidade total: {quota.quantity} {quota.unit}
              </h2>
            </div>

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

            {/* --- LÓGICA DE LANCES CORRIGIDA --- */}
            <div>
              <h3 className="font-semibold text-foreground mb-3">
                {isOwner ? "Propostas Recebidas" : "Propostas dos Vendedores"}
              </h3>
              {quota.bids.length > 0 ? (
                <div className="space-y-3">
                  {quota.bids.map((bid) => (
                    // O CARD DETALHADO AGORA É MOSTRADO PARA TODOS
                    <Card key={bid.id} className="p-0 overflow-hidden">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-base">
                            {bid.profiles?.full_name || "Vendedor Anônimo"}
                          </h4>
                          <div className="text-right">
                            <p className="text-lg font-bold text-primary">
                              R$ {bid.price_per_unit.toFixed(2)}
                              <span className="text-sm text-muted-foreground">
                                /{quota.unit}
                              </span>
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Total: R$ {bid.total_price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          <strong>Termos:</strong> {bid.delivery_terms || "N/A"}
                        </p>

                        {/* O BOTÃO SÓ APARECE PARA O DONO E SE A COTA ESTIVER ABERTA */}
                        {isOwner && isCotaOpen && (
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                className="w-full"
                                variant="outline"
                                disabled={isAccepting}
                              >
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Aceitar Proposta
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Confirmar Proposta?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Ao aceitar esta proposta de{" "}
                                  <strong>
                                    {bid.profiles?.full_name ||
                                      "Vendedor Anônimo"}
                                  </strong>{" "}
                                  no valor de{" "}
                                  <strong>
                                    R$ {bid.total_price.toFixed(2)}
                                  </strong>
                                  , a cota será fechada e as outras propostas
                                  serão automaticamente rejeitadas.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel disabled={isAccepting}>
                                  Cancelar
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleAcceptBid(bid.id)}
                                  disabled={isAccepting}
                                >
                                  {isAccepting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  )}
                                  Confirmar e Aceitar
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Nenhum vendedor fez um lance ainda.
                </p>
              )}
            </div>
            {/* --- FIM DA LÓGICA DE LANCES --- */}

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
