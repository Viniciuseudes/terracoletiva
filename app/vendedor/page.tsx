import { SellerNav } from "@/components/layout/seller-nav"
import { SellerStatsCards } from "@/components/seller/stats-cards"
import { SearchQuotas } from "@/components/seller/search-quotas"
import { MyBids } from "@/components/seller/my-bids"
import { OpportunitiesMap } from "@/components/seller/opportunities-map"

export default function SellerDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <SellerNav />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Bem-vindo, Vendedor!</h1>
          <p className="text-muted-foreground">Encontre oportunidades de vendas em cotas coletivas</p>
        </div>

        <SellerStatsCards />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <SearchQuotas />
            <MyBids />
          </div>
          <div>
            <OpportunitiesMap />
          </div>
        </div>
      </main>
    </div>
  )
}
