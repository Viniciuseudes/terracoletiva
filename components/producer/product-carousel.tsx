"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface Product {
  id: string
  name: string
  image: string
}

const featuredProducts: Product[] = [
  { id: "1", name: "Farinha de Peixe - 25kg", image: "/fish-meal-powder-pile.jpg" },
  { id: "2", name: "Farinha de Soja - 30kg", image: "/soybean-meal-in-bowl.jpg" },
  { id: "3", name: "Milho Triturado - 50kg", image: "/ground-corn-feed.jpg" },
]

export function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl">
        <div
          className="flex transition-transform duration-300 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {featuredProducts.map((product) => (
            <div key={product.id} className="min-w-full relative h-48">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-4 left-4 text-white font-semibold text-lg">{product.name}</h3>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center gap-2 mt-3">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === currentIndex ? "w-6 bg-secondary" : "w-2 bg-muted-foreground/30",
            )}
          />
        ))}
      </div>
    </div>
  )
}
