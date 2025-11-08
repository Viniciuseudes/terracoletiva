// app/vendedor/buscar/page.tsx

import { SellerNav } from "@/components/layout/seller-nav";
import { SearchQuotas } from "@/components/seller/search-quotas";
import { Toaster } from "@/components/ui/sonner";

export default function SellerSearchPage() {
  return (
    <div className="min-h-screen bg-background">
      <SellerNav />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Buscar Cotas Abertas
          </h1>
          <p className="text-muted-foreground">
            Encontre oportunidades e faça a sua proposta
          </p>
        </div>
        <SearchQuotas />
      </main>
      <Toaster richColors />
    </div>
  );
}
