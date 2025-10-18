"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Users, ShoppingCart, TrendingUp } from "lucide-react"

export function AdminNav() {
  const pathname = usePathname()

  const navItems = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/usuarios",
      label: "Usuários",
      icon: Users,
    },
    {
      href: "/admin/negociacoes",
      label: "Negociações",
      icon: ShoppingCart,
    },
    {
      href: "/admin/vendas",
      label: "Vendas",
      icon: TrendingUp,
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
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
