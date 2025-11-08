// app/produtor/chat/[id]/page.tsx
// VERSÃO 3.0 (Com correção de erros + Chat Otimista)

"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getCurrentUserProfile } from "@/lib/auth";
import type { UserProfile } from "@/lib/auth";
// A importação da MobileNav foi removida pois não está a ser usada no return
import { ArrowLeft, Loader2, Info, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// Interface para as mensagens do chat
interface ChatMessage {
  id: string;
  content: string;
  created_at: string;
  sender_id: string;
  profiles: {
    // Perfil do remetente
    full_name: string;
  } | null;
}

// Interface para o tipo de produto (pode ser objeto ou array)
type ProductType = { name: string } | { name: string }[] | null;

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const quotaId = params.id as string;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);

  const [cotaName, setCotaName] = useState("Chat da Cota");
  const [isParticipant, setIsParticipant] = useState(false);

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Função para rolar para o final
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Função para buscar mensagens
  const fetchMessages = async (): Promise<ChatMessage[]> => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select(`*, profiles ( full_name )`)
      .eq("quota_id", quotaId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Erro ao buscar mensagens:", error);
      toast.error("Não foi possível carregar as mensagens.");
      return [];
    }
    return (data as ChatMessage[]) || [];
  };

  // Carregamento inicial e verificação de permissão
  useEffect(() => {
    if (!quotaId) return;

    async function loadChatData() {
      setLoading(true);
      const user = await getCurrentUserProfile();
      if (!user) {
        toast.error("Sessão inválida. A redirecionar para o login.");
        router.push("/login");
        return;
      }
      setCurrentUser(user);

      // 1. Verifica se o utilizador tem permissão para estar neste chat
      const { data: participationData, error: rpcError } = await supabase.rpc(
        "is_quota_participant",
        {
          quota_id_to_check: quotaId,
          user_id_to_check: user.id,
        }
      );

      if (rpcError || !participationData) {
        console.error("Erro ao verificar participação:", rpcError);
        toast.error("Acesso Negado", {
          description: "Você não tem permissão para aceder a este chat.",
        });
        router.push("/produtor/pedidos"); // Volta para a lista de cotas
        return;
      }

      setIsParticipant(true);

      // 2. Busca o nome da cota para o cabeçalho
      const { data: cotaData } = await supabase
        .from("quotas")
        .select(`products ( name )`)
        .eq("id", quotaId)
        .single();

      const productsData = cotaData?.products as ProductType;
      let productName = "Chat da Cota";

      if (productsData) {
        if (Array.isArray(productsData)) {
          productName = productsData[0]?.name || "Chat da Cota";
        } else {
          productName =
            (productsData as { name: string }).name || "Chat da Cota";
        }
      }
      setCotaName(`Chat: ${productName}`);

      // 3. Busca as mensagens iniciais
      const initialMessages = await fetchMessages();
      setMessages(initialMessages);
      setLoading(false);
    }

    loadChatData();
  }, [quotaId, router]);

  // Efeito para o Realtime (escutar novas mensagens)
  useEffect(() => {
    if (!isParticipant) return; // Só escuta se for participante

    const channel = supabase
      .channel(`chat:quota_id=eq.${quotaId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `quota_id=eq.${quotaId}`,
        },
        async (payload) => {
          // --- MUDANÇA IMPORTANTE ---
          // Ignora a nossa própria mensagem (já foi adicionada otimisticamente)
          if (payload.new.sender_id === currentUser?.id) {
            return;
          }
          // --- FIM DA MUDANÇA ---

          // Busca a mensagem completa com o perfil
          const { data: newMsg, error } = await supabase
            .from("chat_messages")
            .select(`*, profiles ( full_name )`)
            .eq("id", payload.new.id)
            .single();

          if (newMsg && !error) {
            setMessages((currentMessages) => [
              ...currentMessages,
              newMsg as ChatMessage,
            ]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [quotaId, isParticipant, currentUser?.id]); // Adiciona currentUser.id

  // Efeito para rolar para o final quando novas mensagens chegam
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- FUNÇÃO DE ENVIO COM ATUALIZAÇÃO OTIMISTA ---
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === "" || !isParticipant || !currentUser) return;

    setSending(true);

    const content = newMessage.trim();

    // 1. Criar um objeto de mensagem local temporário
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: ChatMessage = {
      id: tempId,
      content: content,
      created_at: new Date().toISOString(),
      sender_id: currentUser.id,
      profiles: {
        full_name: currentUser.full_name || "Eu",
      },
    };

    // 2. Adicionar a mensagem ao estado local IMEDIATAMENTE
    setMessages((currentMessages) => [...currentMessages, optimisticMessage]);
    setNewMessage(""); // Limpar o input

    // 3. Enviar a mensagem real para o Supabase
    const { data: insertedData, error } = await supabase
      .from("chat_messages")
      .insert({
        quota_id: quotaId,
        sender_id: currentUser.id,
        content: content,
      })
      .select("id") // Pede ao Supabase para retornar o ID real
      .single();

    setSending(false);

    if (error) {
      console.error("Erro ao enviar mensagem:", error);
      toast.error("Falha ao enviar mensagem.");
      setNewMessage(content); // Restaura a mensagem no input se falhar
      // Remove a mensagem otimista que falhou
      setMessages((currentMessages) =>
        currentMessages.filter((msg) => msg.id !== tempId)
      );
    } else {
      // (Opcional) Atualiza a mensagem temporária com o ID real
      setMessages((currentMessages) =>
        currentMessages.map((msg) =>
          msg.id === tempId
            ? { ...optimisticMessage, id: insertedData.id }
            : msg
        )
      );
    }
  };

  // Função para obter iniciais do nome
  const getInitials = (name: string | undefined) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return `${names[0][0]}`.toUpperCase();
  };

  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen bg-background flex flex-col">
        {/* Cabeçalho Personalizado do Chat */}
        <header className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="flex items-center h-16 px-4 max-w-lg mx-auto gap-4">
            <Link href={`/produtor/pedidos`} passHref>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-foreground truncate">
              {cotaName}
            </h1>
          </div>
        </header>

        {/* Conteúdo do Chat */}
        <main className="flex-1 overflow-y-auto p-4 max-w-lg mx-auto w-full space-y-4">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-full text-muted-foreground p-4">
              <Info className="h-10 w-10 mb-3" />
              <p className="font-semibold">Nenhuma mensagem</p>
              <p className="text-sm">
                Seja o primeiro a enviar uma mensagem neste grupo!
              </p>
            </div>
          ) : (
            messages.map((msg) => {
              const isMe = msg.sender_id === currentUser?.id;
              const senderName = msg.profiles?.full_name || "Desconhecido";
              return (
                <div
                  key={msg.id}
                  className={cn("flex items-end gap-2", isMe && "justify-end")}
                >
                  {/* Avatar (só para os outros) */}
                  {!isMe && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{getInitials(senderName)}</AvatarFallback>
                    </Avatar>
                  )}

                  {/* Balão da Mensagem */}
                  <div
                    className={cn(
                      "max-w-[75%] rounded-lg p-3",
                      isMe
                        ? "bg-secondary text-secondary-foreground rounded-br-none"
                        : "bg-muted rounded-bl-none"
                    )}
                  >
                    {/* Nome (só para os outros) */}
                    {!isMe && (
                      <p className="text-xs font-semibold text-secondary mb-1">
                        {senderName}
                      </p>
                    )}
                    <p className="text-sm">{msg.content}</p>
                  </div>
                </div>
              );
            })
          )}
          {/* Elemento âncora para rolar para o final */}
          <div ref={messagesEndRef} />
        </main>

        {/* Input de Envio */}
        <footer className="sticky bottom-0 z-10 bg-card border-t p-2 max-w-lg mx-auto w-full">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center gap-2 px-2"
          >
            <Input
              placeholder={
                isParticipant ? "Escreva uma mensagem..." : "Acesso negado"
              }
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={!isParticipant || sending}
            />
            <Button
              type="submit"
              size="icon"
              disabled={!isParticipant || sending}
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </footer>
      </div>
    </>
  );
}
