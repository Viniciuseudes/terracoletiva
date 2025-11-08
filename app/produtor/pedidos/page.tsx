// Ficheiro: app/produtor/pedidos/page.tsx
// VERSÃO 3.0 (Definitiva - Corrigindo a exibição do botão de chat)

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserProfile } from "@/lib/auth";
import type { UserProfile } from "@/lib/auth";
import { MobileHeader } from "@/components/layout/mobile-header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  Calendar,
  DollarSign,
  Loader2,
  Info,
  Users,
  Check,
  X,
  Clock,
  Briefcase,
  MessageCircle, // <-- Ícone de chat
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// --- INTERFACES ---

interface Participant {
  id: string;
  quantity: number;
  status: "pending" | "active" | "cancelled";
  profiles: {
    full_name: string;
  } | null;
}

interface MyCreatedQuota {
  id: string;
  status: "open" | "closed" | "completed" | "cancelled";
  quantity: number;
  target_price: number;
  delivery_date: string;
  unit: string;
  products: {
    name: string;
  } | null;
  quota_participants: Participant[];
}

interface MyParticipation {
  id: string;
  quantity: number;
  status: "pending" | "active" | "cancelled";
  quotas: {
    id: string;
    status: "open" | "closed" | "completed" | "cancelled";
    delivery_date: string;
    target_price: number;
    unit: string;
    products: {
      name: string;
    } | null;
    profiles: {
      full_name: string;
    } | null;
  } | null;
}

// --- FIM DAS INTERFACES ---

// Mapeamento de status da COTA
const quotaStatusMap = {
  open: {
    label: "Aberta",
    className: "bg-blue-500/10 text-blue-700 border-blue-500/20",
  },
  closed: {
    label: "Fechada",
    className: "bg-gray-500/10 text-gray-700 border-gray-500/20",
  },
  completed: {
    label: "Concluída",
    className: "bg-green-500/10 text-green-700 border-green-500/20",
  },
  cancelled: {
    label: "Cancelada",
    className: "bg-red-500/10 text-red-700 border-red-500/20",
  },
};

// Mapeamento de status do PARTICIPANTE (reutilizado)
const participantStatusMap = {
  pending: {
    label: "Pendente",
    className: "text-yellow-600 bg-yellow-500/10",
    icon: Clock,
  },
  active: {
    label: "Aprovado",
    className: "text-green-700 bg-green-500/10",
    icon: Check,
  },
  cancelled: {
    label: "Rejeitado",
    className: "text-red-700 bg-red-500/10",
    icon: X,
  },
};

export default function ProducerQuotasPage() {
  const router = useRouter();
  const [myCreatedQuotas, setMyCreatedQuotas] = useState<MyCreatedQuota[]>([]);
  const [myParticipations, setMyParticipations] = useState<MyParticipation[]>(
    []
  );
  const [loadingCreated, setLoadingCreated] = useState(true);
  const [loadingParticipations, setLoadingParticipations] = useState(true);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  // Busca as cotas que EU CRIE_I (com os participantes)
  const fetchMyCreatedQuotas = async (userId: string) => {
    setLoadingCreated(true);
    try {
      const { data, error } = await supabase
        .from("quotas")
        .select(
          `
          id, status, quantity, target_price, delivery_date, unit,
          products ( name ),
          quota_participants ( id, quantity, status, profiles ( full_name ) )
        `
        )
        .eq("producer_id", userId) // Apenas cotas que EU criei
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyCreatedQuotas((data as unknown as MyCreatedQuota[]) || []);
    } catch (error) {
      console.error("Erro ao buscar cotas criadas:", error);
      toast.error("Erro ao carregar as suas cotas criadas.");
    } finally {
      setLoadingCreated(false);
    }
  };

  // Busca as cotas que EU PARTICIPO
  const fetchMyParticipations = async (userId: string) => {
    setLoadingParticipations(true);
    try {
      const { data, error } = await supabase
        .from("quota_participants")
        .select(
          `
          id,
          quantity,
          status,
          quotas (
            id, status, delivery_date, target_price, unit,
            products ( name ),
            profiles ( full_name )
          )
        `
        )
        .eq("producer_id", userId) // Apenas participações minhas
        .neq("quotas.producer_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setMyParticipations((data as unknown as MyParticipation[]) || []);
    } catch (error) {
      console.error("Erro ao buscar participações:", error);
      toast.error("Erro ao carregar suas participações.");
    } finally {
      setLoadingParticipations(false);
    }
  };

  useEffect(() => {
    async function loadAllData() {
      const user = await getCurrentUserProfile();
      if (!user) {
        setLoadingCreated(false);
        setLoadingParticipations(false);
        router.push("/login");
        return;
      }
      setCurrentUser(user);
      await Promise.all([
        fetchMyCreatedQuotas(user.id),
        fetchMyParticipations(user.id),
      ]);
    }
    loadAllData();
  }, [router]);

  // Função para aprovar ou rejeitar um participante (só se aplica à Tab 1)
  const handleParticipantUpdate = async (
    participantId: string,
    newStatus: "active" | "cancelled"
  ) => {
    setMyCreatedQuotas((currentQuotas) =>
      currentQuotas.map((quota) => ({
        ...quota,
        quota_participants: quota.quota_participants.map((p) =>
          p.id === participantId ? { ...p, status: newStatus } : p
        ),
      }))
    );

    const { error } = await supabase
      .from("quota_participants")
      .update({ status: newStatus })
      .eq("id", participantId);

    if (error) {
      toast.error("Erro ao atualizar status do participante.");
      console.error("Erro de update:", error);
      if (currentUser) fetchMyCreatedQuotas(currentUser.id); // Reverte
    } else {
      toast.success(
        newStatus === "active"
          ? "Participante aprovado!"
          : "Participante rejeitado."
      );
    }
  };

  const getProductName = (products: { name: string } | null | undefined) => {
    if (!products) return "Produto desconhecido";
    return products.name;
  };

  // --- COMPONENTES DE RENDERIZAÇÃO DAS TABS ---

  // Tab 1: Cotas que criei
  const renderMyCreatedQuotas = () => {
    if (loadingCreated) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }
    if (myCreatedQuotas.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64 bg-muted/30 rounded-xl border border-dashed border-border p-4">
          <Info className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-semibold">
            Nenhuma cota criada
          </p>
          <p className="text-sm text-muted-foreground">
            Crie a sua primeira cota para começar a economizar.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {myCreatedQuotas.map((quota) => (
          <Card key={quota.id} className="overflow-hidden">
            <CardContent className="p-4">
              {/* Detalhes da Cota */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground mb-1">
                    {getProductName(quota.products)}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    ID da Cota: {quota.id.substring(0, 8)}
                  </p>
                </div>
                <Badge
                  className={
                    quotaStatusMap[quota.status]?.className ||
                    quotaStatusMap.closed.className
                  }
                  variant="outline"
                >
                  {quotaStatusMap[quota.status]?.label || "Desconhecido"}
                </Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border">
                {/* ... (Detalhes de Quantidade, Preço, Entrega) ... */}
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Qtd. Total</p>
                    <p className="text-sm font-medium">
                      {quota.quantity} {quota.unit}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Preço Alvo</p>
                    <p className="text-sm font-medium">
                      R$ {quota.target_price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Entrega</p>
                    <p className="text-sm font-medium">
                      {new Date(quota.delivery_date).toLocaleDateString(
                        "pt-BR",
                        {
                          day: "2-digit",
                          month: "short",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Lista de Participantes (para aprovação) */}
              {quota.quota_participants.length > 0 && (
                <div className="pt-4 mt-4 border-t border-border">
                  <h4 className="flex items-center gap-2 text-sm font-semibold mb-3">
                    <Users className="h-4 w-4" />
                    Solicitações ({quota.quota_participants.length})
                  </h4>
                  <div className="space-y-3">
                    {quota.quota_participants.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center justify-between gap-2"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">
                            {p.profiles?.full_name || "Desconhecido"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Qtd: {p.quantity} {quota.unit}
                          </p>
                        </div>

                        {/* --- ESTE É O BLOCO CORRIGIDO --- */}
                        <div className="flex items-center gap-2">
                          {p.status === "pending" ? (
                            <>
                              <Badge
                                variant="outline"
                                className={
                                  participantStatusMap.pending.className
                                }
                              >
                                {participantStatusMap.pending.label}
                              </Badge>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={() =>
                                  handleParticipantUpdate(p.id, "cancelled")
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 text-green-600 hover:bg-green-50 hover:text-green-700"
                                onClick={() =>
                                  handleParticipantUpdate(p.id, "active")
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            // Renderiza o badge para active ou cancelled
                            <Badge
                              variant="outline"
                              className={
                                participantStatusMap[p.status]?.className
                              }
                            >
                              {participantStatusMap[p.status]?.label}
                            </Badge>
                          )}

                          {/* ADICIONA O BOTÃO DE CHAT SE ESTIVER ATIVO */}
                          {p.status === "active" && (
                            <Link href={`/produtor/chat/${quota.id}`} passHref>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-muted-foreground hover:text-primary"
                                aria-label="Ir para o chat"
                              >
                                <MessageCircle className="h-4 w-4" />
                              </Button>
                            </Link>
                          )}
                        </div>
                        {/* --- FIM DO BLOCO CORRIGIDO --- */}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  // Tab 2: Cotas que participo
  const renderMyParticipations = () => {
    if (loadingParticipations) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      );
    }
    if (myParticipations.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center text-center h-64 bg-muted/30 rounded-xl border border-dashed border-border p-4">
          <Info className="h-10 w-10 text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-semibold">
            Nenhuma participação
          </p>
          <p className="text-sm text-muted-foreground">
            Vá para "Pesquisar" para entrar na sua primeira cota.
          </p>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        {myParticipations.map((p) => {
          if (!p.quotas) return null; // Segurança
          const MyStatusIcon = participantStatusMap[p.status].icon;
          return (
            <Link
              href={`/produtor/pesquisar/${p.quotas.id}`}
              key={p.id}
              passHref
            >
              <Card className="overflow-hidden hover:bg-accent/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">
                        {getProductName(p.quotas.products)}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Dono da cota: {p.quotas.profiles?.full_name || "N/A"}
                      </p>
                    </div>
                    <Badge
                      className={
                        quotaStatusMap[p.quotas.status]?.className ||
                        quotaStatusMap.closed.className
                      }
                      variant="outline"
                    >
                      {quotaStatusMap[p.quotas.status]?.label || "Desconhecido"}
                    </Badge>
                  </div>

                  {/* --- SEÇÃO DE STATUS ATUALIZADA (COM CHAT) --- */}
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Minha Qtd.
                        </p>
                        <p className="text-sm font-medium">
                          {p.quantity} {p.quotas.unit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <MyStatusIcon
                          className={`h-4 w-4 ${
                            participantStatusMap[p.status].className.split(
                              " "
                            )[0]
                          }`}
                        />
                        <div>
                          <p className="text-xs text-muted-foreground">
                            Meu Status
                          </p>
                          <p className="text-sm font-medium">
                            {participantStatusMap[p.status].label}
                          </p>
                        </div>
                      </div>

                      {/* ATALHO DE CHAT PARA A SEGUNDA TAB */}
                      {p.status === "active" && (
                        <Link href={`/produtor/chat/${p.quotas.id}`} passHref>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-muted-foreground hover:text-primary"
                            aria-label="Ir para o chat"
                            onClick={(e) => e.stopPropagation()} // Impede o card-link de disparar
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                  {/* --- FIM DA SEÇÃO DE STATUS --- */}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    );
  };

  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen bg-background pb-20">
        <MobileHeader />

        <main className="max-w-lg mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-foreground mb-6">
            Minha Atividade
          </h1>

          <Tabs defaultValue="created" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="created" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Cotas que Criei
              </TabsTrigger>
              <TabsTrigger value="joined" className="gap-2">
                <Users className="h-4 w-4" />
                Cotas que Participo
              </TabsTrigger>
            </TabsList>

            {/* Tab 1: Cotas que Criei (com gestão de participantes) */}
            <TabsContent value="created">{renderMyCreatedQuotas()}</TabsContent>

            {/* Tab 2: Cotas que Participo (com status da minha solicitação) */}
            <TabsContent value="joined">{renderMyParticipations()}</TabsContent>
          </Tabs>
        </main>

        <MobileNav userType="produtor" />
      </div>
    </>
  );
}
