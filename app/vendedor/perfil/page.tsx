// app/vendedor/perfil/page.tsx

import { SellerNav } from "@/components/layout/seller-nav";
import { ProfileForm } from "@/components/profile/profile-form";
import { SecuritySettings } from "@/components/profile/security-settings";
import { NotificationSettings } from "@/components/profile/notification-settings";
import { Toaster } from "@/components/ui/sonner"; // <-- IMPORTAÇÃO ADICIONADA

export default function SellerProfilePage() {
  return (
    <>
      {" "}
      {/* Adicionado Fragment */}
      <Toaster richColors /> {/* <-- TOASTER ADICIONADO */}
      <div className="min-h-screen bg-background">
        <SellerNav />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Meu Perfil
            </h1>
            <p className="text-muted-foreground">
              Gerencie suas informações e configurações
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="space-y-6">
              <ProfileForm userType="seller" />
            </div>
            <div className="space-y-6">
              <SecuritySettings />
              <NotificationSettings />
            </div>
          </div>
        </main>
      </div>
    </> /* Adicionado Fragment */
  );
}
