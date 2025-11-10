import Link from "next/link"
import {
  Wallet,
  TrendingUp,
  Target,
  Brain,
  Shield,
  Zap,
  ArrowRight,
  BarChart3,
  PiggyBank
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            <Zap className="w-4 h-4" />
            Gérez vos finances intelligemment
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 max-w-4xl leading-tight">
            Maîtrisez votre argent,
            <br />
            <span className="text-green-600">atteignez vos objectifs</span>
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl">
            Suivez vos dépenses, créez des budgets intelligents et recevez des conseils personnalisés
            propulsés par l'IA pour optimiser votre santé financière.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/demo">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 h-12 text-base">
                Voir la démo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/api/auth/signin">
              <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 h-12 text-base">
                Commencer gratuitement
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Une suite complète d'outils pour gérer vos finances personnelles avec simplicité et efficacité
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Wallet className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Suivi des transactions</CardTitle>
              <CardDescription>
                Enregistrez et catégorisez automatiquement toutes vos dépenses et revenus en temps réel
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 2 */}
          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Budgets intelligents</CardTitle>
              <CardDescription>
                Créez des budgets mensuels par catégorie et suivez vos dépenses en temps réel avec des alertes
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 3 */}
          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Objectifs d'épargne</CardTitle>
              <CardDescription>
                Définissez vos objectifs financiers et suivez votre progression avec des visualisations claires
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 4 */}
          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Flux de trésorerie</CardTitle>
              <CardDescription>
                Visualisez vos revenus et dépenses avec des graphiques détaillés et des prévisions
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 5 */}
          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-pink-100 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-pink-600" />
              </div>
              <CardTitle>Insights IA</CardTitle>
              <CardDescription>
                Recevez des conseils personnalisés propulsés par Claude AI pour optimiser vos finances
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature 6 */}
          <Card className="border-green-100 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Sécurisé et privé</CardTitle>
              <CardDescription>
                Vos données sont cryptées et sécurisées. Connexion via Google OAuth pour une sécurité maximale
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-green-600 to-green-700 text-white border-0">
          <CardContent className="p-12">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="flex items-center justify-center mb-2">
                  <PiggyBank className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold mb-2">100%</div>
                <div className="text-green-100">Gratuit</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold mb-2">Sécurisé</div>
                <div className="text-green-100">Cryptage de bout en bout</div>
              </div>
              <div>
                <div className="flex items-center justify-center mb-2">
                  <Brain className="w-8 h-8" />
                </div>
                <div className="text-4xl font-bold mb-2">IA</div>
                <div className="text-green-100">Propulsé par Claude</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 mb-16">
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Prêt à prendre le contrôle de vos finances ?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Commencez dès aujourd'hui à gérer intelligemment votre argent.
              Aucune carte de crédit requise.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/demo">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 h-12">
                  Essayer la démo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/api/auth/signin">
                <Button size="lg" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50 px-8 h-12">
                  Créer un compte
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Gestionnaire de Finances Personnelles - Propulsé par Next.js, Prisma & Claude AI</p>
        </div>
      </footer>
    </div>
  )
}
