import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { mockProducts } from "@/lib/mock-data"
import { Plus } from "lucide-react"

export function FeaturedProducts() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Produtos em Destaque</h2>
        <Button size="sm" variant="outline">
          Ver Todos
        </Button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockProducts.slice(0, 6).map((product) => (
          <Card key={product.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
                  <Badge variant="secondary" className="mt-2">
                    {product.category}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{product.description}</CardDescription>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Unidade: {product.unit}</span>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Criar Cota
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
