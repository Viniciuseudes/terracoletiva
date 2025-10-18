"use client"

import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export function RegionSelector() {
  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-2 h-12 bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary/20"
    >
      <MapPin className="h-4 w-4" />
      <span className="font-medium">Região: Macaíba/RN</span>
    </Button>
  )
}
