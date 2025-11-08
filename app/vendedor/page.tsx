// app/vendedor/page.tsx

import { SellerNav } from "@/components/layout/seller-nav";
import { SellerStatsCards } from "@/components/seller/stats-cards";
// import { SearchQuotas } from "@/components/seller/search-quotas"; // Removido
// import { MyBids } from "@/components/seller/my-bids"; // Removido
import { OpportunitiesMap } from "@/components/seller/opportunities-map";

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <SellerNav />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Bem-vindo, Vendedor!
          </h1>
          <p className="text-muted-foreground">
            Veja um resumo das suas atividades e oportunidades
          </p>
        </div>

        <SellerStatsCards />

        {/* A busca e as propostas foram movidas para as suas próprias páginas */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-3">
            <OpportunitiesMap />
          </div>
        </div>
      </main>
    </div>
  );
}
