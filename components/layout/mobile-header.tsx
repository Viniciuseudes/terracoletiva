// components/layout/mobile-header.tsx
"use client";

import { Bell, LogOut, User, Loader2, Info } from "lucide-react";
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
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image"; // Importar o Image

// 1. Interface para a notificação (usando 'link_to')
interface Notification {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  link_to: string | null; // <-- CORREÇÃO ESTÁ AQUI
  created_at: string;
}

export function MobileHeader() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifs, setIsLoadingNotifs] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const fetchNotifications = async (userId: string) => {
    setIsLoadingNotifs(true);

    // Busca as 10 últimas notificações
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Erro ao buscar notificações:", error.message);
    } else {
      setNotifications(data || []);
      const unread = data?.filter((n) => !n.is_read).length || 0;
      setUnreadCount(unread);
    }
    setIsLoadingNotifs(false);
  };

  useEffect(() => {
    const fetchUserAndData = async () => {
      const userProfile = await getCurrentUserProfile();
      setUser(userProfile);

      if (userProfile) {
        await fetchNotifications(userProfile.id);

        const channel = supabase
          .channel(`notifications:user_id=eq.${userProfile.id}`)
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${userProfile.id}`,
            },
            (payload) => {
              fetchNotifications(userProfile.id);
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } else {
        setIsLoadingNotifs(false);
      }
    };

    fetchUserAndData();
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = "/login";
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Se já estiver lida, apenas navega (se houver link)
    if (notification.is_read && notification.link_to) {
      // <-- MUDANÇA AQUI
      window.location.href = notification.link_to;
      return;
    }

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notification.id);

    if (error) {
      console.error("Erro ao marcar como lida:", error.message);
    } else {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notification.id ? { ...n, is_read: true } : n
        )
      );
      setUnreadCount((prev) => (prev > 0 ? prev - 1 : 0));

      if (notification.link_to) {
        // <-- MUDANÇA AQUI
        window.location.href = notification.link_to;
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-card border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 max-w-lg mx-auto">
        {/* Logo/Título */}
        <Link
          href={
            user?.user_type === "producer"
              ? "/produtor"
              : user?.user_type === "seller"
              ? "/vendedor"
              : "/"
          }
          className="flex items-center gap-2"
        >
          <Image
            src="/logonova.png"
            alt="Terra Coletiva Logo"
            width={28}
            height={28}
            className="h-7 w-7"
          />
          <span className="text-xl font-bold text-foreground">
            Terra Coletiva
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Dropdown de Notificações */}
          <DropdownMenu open={isNotifOpen} onOpenChange={setIsNotifOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-destructive rounded-full border-2 border-card" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notificações</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {isLoadingNotifs ? (
                <div className="flex justify-center items-center h-20">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-20 text-center px-4">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground mt-2">
                    Sem notificações no momento
                  </p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <DropdownMenuItem
                    key={notif.id}
                    className={cn(
                      "flex flex-col items-start gap-1 p-3 cursor-pointer",
                      !notif.is_read && "bg-accent/50"
                    )}
                    onClick={() => handleNotificationClick(notif)}
                  >
                    <div className="flex items-center w-full justify-between">
                      <p className="text-sm font-semibold">{notif.title}</p>
                      {!notif.is_read && (
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground w-full whitespace-normal">
                      {notif.message}
                    </p>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dropdown do Usuário */}
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
