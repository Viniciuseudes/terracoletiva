import { TrendingDown, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

interface PriceTrackingCardProps {
  productName: string
  currentPrice: number
  date: string
  trend: "up" | "down"
}

export function PriceTrackingCard({ productName, currentPrice, date, trend }: PriceTrackingCardProps) {
  return (
    <Card className="p-4 space-y-2 min-w-[160px] bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-start justify-between">
        <h4 className="font-medium text-sm text-foreground">{productName}</h4>
        {trend === "down" ? (
          <TrendingDown className="h-4 w-4 text-primary" />
        ) : (
          <TrendingUp className="h-4 w-4 text-destructive" />
        )}
      </div>
      <p className="text-2xl font-bold text-foreground">R$ {currentPrice.toFixed(1)}</p>
      <p className="text-xs text-muted-foreground">{date}</p>
    </Card>
  )
}
