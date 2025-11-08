// app/vendedor/propostas/page.tsx

import { SellerNav } from "@/components/layout/seller-nav";
import { MyBids } from "@/components/seller/my-bids";
import { Toaster } from "@/components/ui/sonner";

export default function SellerBidsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SellerNav />
      <main className="container mx-auto px-4 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Minhas Propostas
          </h1>
          <p className="text-muted-foreground">
            Acompanhe o status dos seus lances enviados
          </p>
        </div>
        <MyBids />
      </main>
      <Toaster richColors />
    </div>
  );
}
