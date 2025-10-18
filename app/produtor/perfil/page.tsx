import { MobileHeader } from "@/components/layout/mobile-header"
import { MobileNav } from "@/components/layout/mobile-nav"
import { ProfileForm } from "@/components/profile/profile-form"
import { SecuritySettings } from "@/components/profile/security-settings"
import { NotificationSettings } from "@/components/profile/notification-settings"

export default function ProducerProfilePage() {
  return (
    <div className="min-h-screen bg-background pb-20">
      <MobileHeader />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Meu Perfil</h1>
          <p className="text-sm text-muted-foreground">Gerencie suas informações e configurações</p>
        </div>

        <ProfileForm userType="producer" />
        <SecuritySettings />
        <NotificationSettings />
      </main>

      <MobileNav userType="produtor" />
    </div>
  )
}
