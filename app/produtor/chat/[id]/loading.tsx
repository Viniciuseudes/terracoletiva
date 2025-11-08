// app/produtor/chat/[id]/loading.tsx
// VERSÃO CORRIGIDA

import { Loader2, ArrowLeft, Send } from "lucide-react"; // <-- A CORREÇÃO ESTÁ AQUI
import { Button } from "@/components/ui/button";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Cabeçalho Fixo */}
      <header className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="flex items-center h-16 px-4 max-w-lg mx-auto gap-4">
          <Button variant="ghost" size="icon" disabled>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">
            A carregar chat...
          </h1>
        </div>
      </header>

      {/* Estado de Loading */}
      <main className="flex-1 flex items-center justify-center p-4 max-w-lg mx-auto w-full">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </main>

      {/* Input Fixo (Desativado) */}
      <footer className="sticky bottom-0 z-10 bg-card border-t p-2 max-w-lg mx-auto w-full">
        <div className="flex items-center gap-2 px-2">
          <div className="h-9 w-full rounded-md border border-input bg-muted" />
          <Button size="icon" disabled>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
