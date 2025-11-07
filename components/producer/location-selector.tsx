"use client";

import { useState, useEffect } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LocationSelector() {
  const [location, setLocation] = useState<string>("Definir sua região");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setLocation("Geolocalização não suportada");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setLocation("Buscando localização...");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Usando uma API pública para geocodificação reversa (Nominatim)
          // Para produção, considere uma API com chave como Google Maps ou Mapbox
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          if (data.address) {
            const city =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "Cidade não encontrada";
            const state = data.address.state || "";
            setLocation(`${city}, ${state}`);
          } else {
            setLocation("Não foi possível identificar a cidade");
          }
        } catch (error) {
          console.error("Erro ao buscar nome da cidade:", error);
          setLocation("Erro ao obter cidade");
        } finally {
          setIsLoading(false);
        }
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocation("Permissão de localização negada");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocation("Localização indisponível");
            break;
          case error.TIMEOUT:
            setLocation("Tempo esgotado para buscar local");
            break;
          default:
            setLocation("Erro ao obter localização");
            break;
        }
        setIsLoading(false);
      }
    );
  };

  // Pede a localização ao carregar o componente
  useEffect(() => {
    handleGetLocation();
  }, []);

  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-2 h-12 bg-secondary/10 border-secondary/20 text-secondary hover:bg-secondary/20"
      onClick={handleGetLocation}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MapPin className="h-4 w-4" />
      )}
      <span className="font-medium">{location}</span>
    </Button>
  );
}
