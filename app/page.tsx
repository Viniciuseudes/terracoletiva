import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sprout, Store, Users, TrendingDown, MapPin, ShieldCheck } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Terra Coletiva RN</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#como-funciona"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Como Funciona
            </Link>
            <Link href="#beneficios" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Benefícios
            </Link>
            <Button variant="outline" size="sm" asChild>
              <Link href="/login">Entrar</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-accent/30 to-background">
        <div className="container mx-auto max-w-6xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Compre Insumos Agrícolas em Grupo e Economize
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
            Una forças com outros produtores rurais do RN para conseguir melhores preços em fertilizantes, sementes,
            defensivos e muito mais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/cadastro?tipo=produtor">
                <Sprout className="mr-2 h-5 w-5" />
                Sou Produtor
              </Link>
            </Button>
            <Button size="lg" variant="secondary" className="text-lg px-8" asChild>
              <Link href="/cadastro?tipo=vendedor">
                <Store className="mr-2 h-5 w-5" />
                Sou Vendedor
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="como-funciona" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Como Funciona</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Sprout className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Para Produtores</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Crie ou Participe de Cotas</h4>
                    <p className="text-sm text-muted-foreground">
                      Inicie uma compra coletiva ou junte-se a outras já existentes na sua região
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Receba Propostas</h4>
                    <p className="text-sm text-muted-foreground">
                      Vendedores enviam ofertas competitivas para sua cota coletiva
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Economize</h4>
                    <p className="text-sm text-muted-foreground">
                      Escolha a melhor oferta e receba seus insumos com preço reduzido
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Store className="h-6 w-6 text-secondary" />
                  </div>
                  <CardTitle className="text-2xl">Para Vendedores</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Encontre Oportunidades</h4>
                    <p className="text-sm text-muted-foreground">
                      Busque cotas coletivas abertas na sua região de atuação
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Envie Propostas</h4>
                    <p className="text-sm text-muted-foreground">
                      Faça ofertas competitivas para grandes volumes de produtos
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Aumente Vendas</h4>
                    <p className="text-sm text-muted-foreground">Conquiste novos clientes e venda em maior volume</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="py-20 px-4 bg-accent/20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">Benefícios da Plataforma</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <TrendingDown className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Preços Reduzidos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Compre em volume e negocie melhores preços com fornecedores</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Força Coletiva</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Una-se a outros produtores e tenha mais poder de negociação</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <MapPin className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Entrega Regional</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Encontre cotas próximas à sua propriedade e economize no frete</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ShieldCheck className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Segurança</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Plataforma segura com avaliações de vendedores e histórico de transações
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Store className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Múltiplos Fornecedores</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Compare propostas de diversos vendedores e escolha a melhor</CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sprout className="h-10 w-10 text-primary mb-3" />
                <CardTitle>Foco no RN</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Plataforma desenvolvida especialmente para produtores potiguares</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Pronto para Economizar?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Junte-se a centenas de produtores rurais que já estão economizando com compras coletivas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link href="/cadastro?tipo=produtor">Cadastrar como Produtor</Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent" asChild>
              <Link href="/cadastro?tipo=vendedor">Cadastrar como Vendedor</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Sprout className="h-6 w-6 text-primary" />
              <span className="font-bold text-foreground">Terra Coletiva RN</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2025 Terra Coletiva RN. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
