"use client"

import { Home, Search, ShoppingCart, User } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface MobileNavProps {
  userType: "produtor" | "vendedor"
}

export function MobileNav({ userType }: MobileNavProps) {
  const pathname = usePathname()
  const basePath = `/${userType}`

  const navItems = [
    { href: basePath, icon: Home, label: "Início" },
    { href: `${basePath}/pesquisar`, icon: Search, label: "Pesquisar" },
    { href: `${basePath}/pedidos`, icon: ShoppingCart, label: "Pedidos" },
    { href: `${basePath}/perfil`, icon: User, label: "Perfil" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors",
                isActive ? "text-secondary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
