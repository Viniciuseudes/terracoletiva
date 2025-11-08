// components/producer/product-carousel.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  image: string;
}

// ATUALIZADO: Lista de produtos conforme solicitado
const featuredProducts: Product[] = [
  { id: "1", name: "Milho (em grão)", image: "/milho.jpeg" },
  { id: "2", name: "Soja (em grão)", image: "/soja.jpg" },
  { id: "3", name: "Torta de Algodão", image: "/resido.jpeg" }, // Usando placeholder
  { id: "4", name: "Silagem de Milho", image: "/silagem.webp" }, // Usando placeholder
  { id: "5", name: "Sal Mineral", image: "/sal.png" }, // Usando placeholder
  { id: "6", name: "Ração para Tilápia", image: "/tilapia.png" }, // Usando placeholder
];

export function ProductCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-2xl">
        <div
          // ATUALIZADO: Duração de 300ms para 200ms (mais rápido)
          className="flex transition-transform duration-200 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {featuredProducts.map((product) => (
            <div key={product.id} className="min-w-full relative h-48">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <h3 className="absolute bottom-4 left-4 text-white font-semibold text-lg">
                {product.name}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Os botões de paginação agora terão 6 pontos automaticamente */}
      <div className="flex justify-center gap-2 mt-3">
        {featuredProducts.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-2 rounded-full transition-all",
              index === currentIndex
                ? "w-6 bg-secondary"
                : "w-2 bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}
