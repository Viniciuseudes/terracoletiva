// app/produtor/nova-cota/page.tsx

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";
import { getCurrentUserProfile } from "../../../lib/auth";
import type { UserProfile } from "../../../lib/auth";
import {
  ArrowLeft,
  Package,
  Calendar,
  DollarSign,
  MapPin,
  ClipboardList,
  Loader2,
  Users,
  User,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Toaster } from "../../../components/ui/sonner";
import { toast } from "sonner";

interface Product {
  id: string;
  name: string;
  unit: string;
}

export default function NewQuotaPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");

  const [totalQuantity, setTotalQuantity] = useState<string>("");
  const [myQuantity, setMyQuantity] = useState<string>("");
  const [maxParticipants, setMaxParticipants] = useState<string>("10");
  const [targetPrice, setTargetPrice] = useState<string>("");
  const [deliveryDate, setDeliveryDate] = useState<string>("");
  const [deliveryLocation, setDeliveryLocation] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      const userProfile = await getCurrentUserProfile();
      if (userProfile) {
        setUser(userProfile);
        if (userProfile.city && userProfile.state) {
          setDeliveryLocation(`${userProfile.city}, ${userProfile.state}`);
        }
      } else {
        router.push("/login");
      }

      const { data: productsData, error } = await supabase
        .from("products")
        .select("id, name, unit")
        .order("name", { ascending: true });

      if (error) {
        toast.error("Erro ao carregar produtos.");
      } else {
        setProducts(productsData || []);
      }
    }
    fetchData();
  }, [router]);

  const handleProductChange = (productId: string) => {
    setSelectedProductId(productId);
    const product = products.find((p) => p.id === productId);
    if (product) {
      setSelectedUnit(product.unit);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("Você precisa estar logado para criar uma cota.");
      return;
    }

    const nTotalQuantity = parseFloat(totalQuantity);
    const nMyQuantity = parseFloat(myQuantity);
    const nMaxParticipants = parseInt(maxParticipants);

    // Validações
    if (
      !selectedProductId ||
      !totalQuantity ||
      !myQuantity ||
      !maxParticipants ||
      !targetPrice ||
      !deliveryDate ||
      !deliveryLocation
    ) {
      toast.warning("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (nMyQuantity > nTotalQuantity) {
      toast.error("Erro de Quantidade", {
        description:
          "Sua quantidade não pode ser maior que a quantidade total.",
      });
      return;
    }

    if (nTotalQuantity <= 0 || nMyQuantity <= 0 || nMaxParticipants <= 0) {
      toast.error("Valores Inválidos", {
        description:
          "As quantidades e o n° de cotistas devem ser maiores que zero.",
      });
      return;
    }

    setIsLoading(true);

    const { data, error } = await supabase.rpc(
      "create_quota_with_participant",
      {
        p_producer_id: user.id,
        p_product_id: selectedProductId,
        p_total_quantity: nTotalQuantity,
        p_unit: selectedUnit,
        p_target_price: parseFloat(targetPrice),
        p_delivery_date: deliveryDate,
        p_delivery_location: deliveryLocation,
        p_my_quantity: nMyQuantity,
        p_max_participants: nMaxParticipants,
      }
    );

    if (error) {
      toast.error("Ocorreu um erro ao criar a cota.");
      console.error("Erro ao chamar RPC create_quota_with_participant:", error);
    } else {
      toast.success("Cota criada com sucesso!");
      console.log("Cota criada, ID:", data);
      setTimeout(() => {
        // ***** CORREÇÃO ESTÁ AQUI *****
        // Mudei de volta para a home do produtor, como você queria.
        router.push("/produtor");
      }, 1500);
    }

    setIsLoading(false);
  };

  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen bg-background pb-8">
        <header className="sticky top-0 z-40 bg-card border-b border-border">
          <div className="flex items-center h-16 px-4 max-w-lg mx-auto gap-4">
            <Link href="/produtor" passHref>
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-lg font-semibold text-foreground">
              Criar Nova Cota
            </h1>
          </div>
        </header>

        <main className="max-w-lg mx-auto px-4 py-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Passo 1: Produto */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <CardTitle>Qual insumo você precisa?</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <Label htmlFor="product">Produto</Label>
                <Select onValueChange={handleProductChange} required>
                  <SelectTrigger id="product" className="mt-2">
                    <SelectValue placeholder="Selecione o produto..." />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Passo 2: Detalhes da Compra (COM NOVOS CAMPOS) */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <CardTitle>Detalhes da Compra</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Linha 1: Quantidade Total e Minha Quantidade */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalQuantity">Quantidade Total</Label>
                    <div className="relative">
                      <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="totalQuantity"
                        type="number"
                        placeholder="Ex: 1000"
                        value={totalQuantity}
                        onChange={(e) => setTotalQuantity(e.target.value)}
                        required
                        className="pl-9"
                      />
                      {selectedUnit && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          {selectedUnit}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="myQuantity">Minha Quantidade</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="myQuantity"
                        type="number"
                        placeholder="Ex: 50"
                        value={myQuantity}
                        onChange={(e) => setMyQuantity(e.target.value)}
                        required
                        className="pl-9"
                      />
                      {selectedUnit && (
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                          {selectedUnit}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Linha 2: Preço Alvo e N° de Cotistas */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetPrice">
                      Preço Alvo (por {selectedUnit || "unidade"})
                    </Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="targetPrice"
                        type="number"
                        placeholder="Ex: 50.00"
                        value={targetPrice}
                        onChange={(e) => setTargetPrice(e.target.value)}
                        className="pl-9"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxParticipants">Nº Máx. de Cotistas</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="maxParticipants"
                        type="number"
                        placeholder="Ex: 10"
                        value={maxParticipants}
                        onChange={(e) => setMaxParticipants(e.target.value)}
                        required
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passo 3: Logística */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <CardTitle>Logística de Entrega</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deliveryDate">Data Limite para Entrega</Label>
                  <Input
                    id="deliveryDate"
                    type="date"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="deliveryLocation">Local de Entrega</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="deliveryLocation"
                      placeholder="Sua Cidade, RN"
                      value={deliveryLocation}
                      onChange={(e) => setDeliveryLocation(e.target.value)}
                      className="pl-9"
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button
              type="submit"
              size="lg"
              className="w-full text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <ClipboardList className="mr-2 h-5 w-5" />
              )}
              {isLoading ? "Publicando..." : "Publicar Cota"}
            </Button>
          </form>
        </main>
      </div>
    </>
  );
}
