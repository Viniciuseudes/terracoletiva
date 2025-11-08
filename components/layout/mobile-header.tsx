// components/layout/mobile-header.tsx

"use client";

import { Bell, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout, getCurrentUserProfile } from "../../lib/auth";
import type { UserProfile } from "../../lib/auth";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient"; // <-- IMPORTAR O SUPABASE

// A importação do useRouter foi removida para resolver um problema de compilação.
// A navegação será feita com o objeto 'window'.

export function MobileHeader() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0); // <-- NOVO STATE

  // Função separada para buscar a contagem
  const fetchUnreadCount = async (userId: string) => {
    const { count, error } = await supabase
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);

    if (error) {
      console.error("Erro ao re-buscar contagem:", error.message);
    } else {
      setUnreadCount(count || 0);
    }
  };

  useEffect(() => {
    const fetchUserAndNotifications = async () => {
      const userProfile = await getCurrentUserProfile();
      setUser(userProfile);

      if (userProfile) {
        // 1. Buscar a contagem inicial de notificações não lidas
        await fetchUnreadCount(userProfile.id);

        // 2. Subscrever a mudanças em Realtime
        const channel = supabase
          .channel(`notifications:user_id=eq.${userProfile.id}`)
          .on(
            "postgres_changes",
            {
              event: "*", // Ouvir INSERT, UPDATE, DELETE
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${userProfile.id}`,
            },
            (payload) => {
              // Quando algo mudar (nova notificação, ou marcada como lida)
              // Re-calcula a contagem
              fetchUnreadCount(userProfile.id);
            }
          )
          .subscribe();

        // Função de limpeza para remover o canal ao sair do componente
        return () => {
          supabase.removeChannel(channel);
        };
      }
    };

    fetchUserAndNotifications();

    // O array de dependências vazio [] garante que isto só corre uma vez
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 max-w-lg mx-auto">
        <h1 className="text-2xl font-heading font-semibold">Terra Coletiva</h1>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {/* --- LÓGICA DO PONTO VERMELHO ATUALIZADA --- */}
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-destructive rounded-full" />
            )}
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">
                      {user.full_name || "Usuário"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="text-destructive cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
