"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sprout, Home, Package, ShoppingCart, User, Menu } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/produtor", label: "Início", icon: Home },
  { href: "/produtor/cotas", label: "Cotas", icon: Package },
  { href: "/produtor/pedidos", label: "Pedidos", icon: ShoppingCart },
  { href: "/produtor/perfil", label: "Perfil", icon: User },
]

export function ProducerNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b bg-card">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/produtor" className="flex items-center gap-2">
          <Sprout className="h-8 w-8 text-primary" />
          <span className="text-xl font-bold text-foreground">Terra Coletiva RN</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-sm font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col gap-4 mt-8">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 text-base font-medium transition-colors py-2",
                      isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
