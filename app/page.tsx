// app/page.tsx

import Link from "next/link";
import Image from "next/image"; // Importar o componente Image
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sprout,
  Store,
  Users,
  TrendingDown,
  MapPin,
  ShieldCheck,
  Search,
  Handshake,
  PackageCheck,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* LOGO ATUALIZADO (MAIOR) AQUI */}
            <Image
              src="/logonova.png"
              alt="Terra Coletiva RN Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-xl font-bold text-foreground">
              Terra Coletiva RN
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#como-funciona"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Como Funciona
            </Link>
            <Link
              href="#beneficios"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Benefícios
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-accent/30 to-background/0">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Compre Insumos Agrícolas em Grupo e Economize
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Una forças com outros produtores rurais do RN para conseguir
            melhores preços em fertilizantes, sementes, defensivos e muito mais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/cadastro?tipo=produtor">
                <Sprout className="mr-2 h-5 w-5" />
                Sou Produtor
              </Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8"
              asChild
            >
              <Link href="/cadastro?tipo=vendedor">
                <Store className="mr-2 h-5 w-5" />
                Sou Vendedor
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works - Fluxo Principal */}
      <section id="como-funciona" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground">
            Como Funciona
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Nossa plataforma conecta produtores e vendedores em 3 passos
            simples.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <Card className="flex flex-col text-center border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Users className="h-7 w-7" />
                </div>
                <CardTitle className="mt-4 text-2xl">1. Una Forças</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base text-muted-foreground">
                  O <strong>Produtor</strong> cria uma "cota" para o insumo que
                  precisa (ex: 500 sacos de fertilizante) ou se junta a uma cota
                  já existente na sua região.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 2 */}
            <Card className="flex flex-col text-center border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary">
                  <Search className="h-7 w-7" />
                </div>
                <CardTitle className="mt-4 text-2xl">
                  2. Receba Ofertas
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base text-muted-foreground">
                  O <strong>Vendedor</strong> vê essa cota (agora um grande
                  volume) e envia uma proposta competitiva, disputando o pedido
                  com outros fornecedores.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Step 3 */}
            <Card className="flex flex-col text-center border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10 text-green-600">
                  <Handshake className="h-7 w-7" />
                </div>
                <CardTitle className="mt-4 text-2xl">
                  3. Feche Negócio
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base text-muted-foreground">
                  O <strong>Produtor</strong> (dono da cota) aceita a melhor
                  proposta. Todos os participantes economizam, e o vendedor
                  realiza uma grande venda.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SEÇÃO VENDEDORES (SEM IMAGEM) */}
      <section id="para-vendedores" className="pb-20 pt-10 px-4">
        <div className="container mx-auto max-w-5xl">
          <Card className="border-2 bg-card/50">
            {/* MODIFICAÇÃO: Removido o grid e a div da imagem */}
            <div className="p-8 md:p-12">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10 text-secondary mb-4">
                <Store className="h-7 w-7" />
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Oportunidade para Vendedores
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Cansado de prospectar clientes um a um? Na Terra Coletiva, você
                encontra demandas reais de produtores, já agrupadas em grandes
                volumes.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <PackageCheck className="h-5 w-5 text-secondary" />
                  <span>Encontre pedidos de alto volume.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Search className="h-5 w-5 text-secondary" />
                  <span>Filtre cotas por região e produto.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Handshake className="h-5 w-5 text-secondary" />
                  <span>Envie propostas e feche mais negócios.</span>
                </li>
              </ul>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8"
                asChild
              >
                <Link href="/cadastro?tipo=vendedor">Quero Vender</Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>
      {/* FIM DA SEÇÃO VENDEDORES */}

      {/* Benefits */}
      <section id="beneficios" className="py-20 px-4 bg-accent/20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Benefícios da Plataforma
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <TrendingDown className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Preços Reduzidos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compre em volume e negocie melhores preços com fornecedores
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Força Coletiva</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Una-se a outros produtores e tenha mais poder de negociação
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Entrega Regional</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Encontre cotas próximas à sua propriedade e economize no frete
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ShieldCheck className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Plataforma segura com avaliações de vendedores e histórico de
                  transações
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Store className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Múltiplos Fornecedores</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compare propostas de diversos vendedores e escolha a melhor
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sprout className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Foco no RN</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Plataforma desenvolvida especialmente para produtores
                  potiguares
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
            Pronto para Economizar?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se a centenas de produtores rurais que já estão economizando
            com compras coletivas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/cadastro?tipo=produtor">
                Cadastrar como Produtor
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent"
              asChild
            >
              <Link href="/cadastro?tipo=vendedor">
                Cadastrar como Vendedor
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              {/* LOGO ATUALIZADO (MAIOR) AQUI */}
              <Image
                src="/logonova.png"
                alt="Terra Coletiva RN Logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="font-bold text-foreground">
                Terra Coletiva RN
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Terra Coletiva RN. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
