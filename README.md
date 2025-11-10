# 💰 Personal Finance Tracker

Application moderne de gestion de finances personnelles avec intelligence artificielle, construite avec Next.js 15, Prisma, et Claude AI.

## ✨ Fonctionnalités

- **🔐 Authentification Google OAuth** - Connexion sécurisée avec Google
- **💳 Suivi des transactions** - Enregistrez vos revenus et dépenses avec catégorisation automatique
- **📊 Budgets mensuels** - Définissez et suivez vos budgets par catégorie avec alertes intelligentes
- **🎯 Objectifs d'épargne** - Créez et suivez vos objectifs financiers
- **📈 Dashboard de trésorerie** - Visualisez votre cash flow avec prévisions AI
- **🤖 Insights IA (Claude)** - Recommandations personnalisées et analyses de dépenses
- **💰 Calcul de disponibilité** - Sachez combien vous pouvez dépenser en sécurité
- **🔄 Transactions récurrentes** - Support des abonnements et salaires automatiques
- **📱 Responsive** - Interface optimisée mobile, tablette et desktop

## 🎨 Design System

Interface utilisateur moderne avec :
- **Couleurs** : Financial Green (#10b981) comme couleur principale
- **Composants** : shadcn/ui pour une UX premium
- **Graphiques** : Recharts pour visualisations interactives
- **Icônes** : Lucide React
- **Animations** : Transitions fluides et micro-interactions

## 🚀 Installation

### Prérequis

- Node.js 18+
- npm ou yarn
- Base de données PostgreSQL (Vercel Postgres recommandé)
- Compte Anthropic (pour Claude AI)
- Compte Google Cloud (pour OAuth)

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configuration des variables d'environnement

Créez un fichier `.env` à la racine du projet :

```bash
cp .env.example .env
```

Remplissez les variables suivantes :

#### Database (Vercel Postgres)

1. Créez un projet sur [Vercel](https://vercel.com)
2. Ajoutez un Postgres Storage
3. Copiez les URLs de connexion :

```env
DATABASE_URL="postgres://user:password@host:5432/database?sslmode=require"
DIRECT_URL="postgres://user:password@host:5432/database?sslmode=require"
```

#### NextAuth

Générez une clé secrète :

```bash
openssl rand -base64 32
```

```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="votre-cle-secrete-generee"
```

#### Google OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un existant
3. Activez "Google+ API"
4. Credentials → Create Credentials → OAuth 2.0 Client ID
5. Type d'application : Web application
6. Origines JavaScript autorisées : `http://localhost:3000`
7. URI de redirection autorisés : `http://localhost:3000/api/auth/callback/google`

```env
GOOGLE_CLIENT_ID="votre-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="votre-client-secret"
```

#### Anthropic Claude AI

1. Créez un compte sur [Anthropic](https://console.anthropic.com/)
2. Générez une API key

```env
ANTHROPIC_API_KEY="sk-ant-..."
```

### 3. Initialiser la base de données

```bash
# Générer le client Prisma
npx prisma generate

# Créer les tables
npx prisma db push

# (Optionnel) Ouvrir Prisma Studio pour visualiser les données
npx prisma studio
```

### 4. Lancer le serveur de développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📁 Structure du projet

```
personal-finance-tracker/
├── prisma/
│   └── schema.prisma          # Schéma de base de données
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── auth/          # API NextAuth
│   │   ├── (auth)/            # Pages d'authentification
│   │   ├── (dashboard)/       # Pages du dashboard
│   │   ├── layout.tsx         # Layout principal
│   │   └── page.tsx           # Page d'accueil
│   ├── components/
│   │   ├── ui/                # Composants shadcn/ui
│   │   ├── dashboard/         # Composants dashboard (KPI, charts)
│   │   ├── transactions/      # Composants transactions
│   │   ├── budgets/           # Composants budgets
│   │   ├── savings/           # Composants objectifs d'épargne
│   │   └── insights/          # Composants insights AI
│   ├── lib/
│   │   ├── prisma.ts          # Client Prisma
│   │   ├── auth.ts            # Configuration NextAuth
│   │   └── claude.ts          # Intégration Claude AI
│   └── types/
│       ├── index.ts           # Types et helpers
│       └── next-auth.d.ts     # Types NextAuth
├── .env.example               # Template variables d'environnement
├── package.json
└── README.md
```

## 🗄️ Schéma de base de données

### Modèles principaux

- **User** - Utilisateurs avec authentification Google
- **BankAccount** - Comptes bancaires multiples (courant, épargne, crédit)
- **Transaction** - Transactions avec catégorisation et récurrence
- **Budget** - Budgets mensuels par catégorie avec alertes
- **SavingsGoal** - Objectifs d'épargne avec tracking
- **CashFlowForecast** - Prévisions de trésorerie générées par AI
- **AIInsight** - Insights et recommandations de Claude AI

### Relations

- Un utilisateur peut avoir plusieurs comptes bancaires
- Chaque transaction est liée à un compte et optionnellement à un budget
- Les budgets sont créés par période (hebdomadaire, mensuel, trimestriel, annuel)
- Les objectifs d'épargne trackent la progression vers un montant cible

## 🤖 Intégration Claude AI

### Fonctionnalités AI

1. **Analyse des dépenses** (`analyzeSpending`)
   - Identifie les patterns de dépenses
   - Détecte les anomalies
   - Suggère des optimisations

2. **Calcul du disponible** (`calculateSafeToSpend`)
   - Analyse le solde actuel
   - Prend en compte les dépenses à venir
   - Calcule combien vous pouvez dépenser en sécurité

3. **Catégorisation automatique** (`categorizeTransaction`)
   - Catégorise automatiquement les transactions
   - Utilise Claude Haiku pour rapidité et coût

### Exemple d'utilisation

```typescript
import { analyzeSpending, calculateSafeToSpend } from '@/lib/claude'

// Analyser les dépenses
const insights = await analyzeSpending(transactions, budgets)

// Calculer le disponible
const { amount, explanation } = await calculateSafeToSpend(
  currentBalance,
  upcomingExpenses,
  savingsGoal
)
```

## 🎨 Composants UI

Tous les composants UI sont créés et prêts à l'emploi. Consultez le fichier `src/components/README.md` pour la documentation complète.

### Exemple d'utilisation

```tsx
import { KPICard } from '@/components/dashboard/KPICard'
import { TransactionItem } from '@/components/transactions/TransactionItem'
import { BudgetProgress } from '@/components/budgets/BudgetProgress'

// Dashboard
<KPICard label="Solde actuel" amount={4582.34} trend={8.1} />

// Transaction
<TransactionItem transaction={{...}} />

// Budget
<BudgetProgress budget={{...}} daysRemaining={8} />
```

## 🚢 Déploiement sur Vercel

### 1. Préparation

```bash
# Committez votre code
git add .
git commit -m "feat: initial finance tracker setup"

# Créez un repo GitHub
gh repo create personal-finance-tracker --public --source=. --push
```

### 2. Déploiement

1. Allez sur [Vercel](https://vercel.com)
2. Import Git Repository → Sélectionnez votre repo
3. Configurez les variables d'environnement (voir `.env.example`)
4. Deploy

### 3. Configuration post-déploiement

1. **Ajoutez l'URL de production à Google OAuth** :
   - Origines : `https://votre-app.vercel.app`
   - Redirects : `https://votre-app.vercel.app/api/auth/callback/google`

2. **Mettez à jour NEXTAUTH_URL** :
   ```
   NEXTAUTH_URL=https://votre-app.vercel.app
   ```

3. **Lancez la migration Prisma** :
   ```bash
   npx prisma db push
   ```

## 📊 Catégories de transactions

### Revenus
- 💰 SALARY - Salaire
- 💼 FREELANCE - Freelance
- 📈 INVESTMENT_INCOME - Investissements
- 🎁 GIFT_RECEIVED - Cadeau reçu
- 💵 OTHER_INCOME - Autre revenu

### Dépenses
- 🏠 HOUSING - Logement
- 🍔 FOOD_DINING - Restaurant
- 🛒 GROCERIES - Courses
- 🚗 TRANSPORTATION - Transport
- 💡 UTILITIES - Factures
- 💊 HEALTHCARE - Santé
- 🎮 ENTERTAINMENT - Loisirs
- 🛍️ SHOPPING - Shopping
- 💇 PERSONAL_CARE - Soins
- 📚 EDUCATION - Éducation
- 🛡️ INSURANCE - Assurance
- 💳 DEBT_PAYMENT - Remboursement
- 🎁 GIFTS_DONATIONS - Cadeaux & Dons
- 🎯 SAVINGS_TRANSFER - Épargne
- 📦 OTHER_EXPENSE - Autre dépense

## 🛠️ Scripts disponibles

```bash
# Développement
npm run dev              # Lancer le serveur de développement
npm run build            # Compiler pour production
npm start                # Lancer en production

# Base de données
npx prisma generate      # Générer le client Prisma
npx prisma db push       # Appliquer le schéma
npx prisma studio        # Interface de gestion
npx prisma migrate dev   # Créer une migration

# Code quality
npm run lint             # Vérifier le code
```

## 🔒 Sécurité

- ✅ Authentification via Google OAuth (pas de gestion de mots de passe)
- ✅ Sessions sécurisées avec NextAuth
- ✅ Variables d'environnement jamais commitées
- ✅ Requêtes API protégées par authentification
- ✅ Validation des données avec Zod
- ✅ SQL injection prevention avec Prisma ORM

## 📱 Responsive Design

L'application est entièrement responsive :
- **Mobile** (< 768px) : Navigation bottom bar, cartes empilées
- **Tablet** (768px - 1024px) : Layout 2 colonnes
- **Desktop** (> 1024px) : Sidebar + layout 4 colonnes

## 🎯 Prochaines étapes

1. **Créer les pages** :
   - Dashboard principal (`/dashboard`)
   - Liste des transactions (`/transactions`)
   - Gestion des budgets (`/budgets`)
   - Objectifs d'épargne (`/savings`)
   - Insights AI (`/insights`)

2. **Implémenter les API routes** :
   - CRUD transactions
   - CRUD budgets
   - CRUD objectifs d'épargne
   - Endpoints insights AI

3. **Ajouter les fonctionnalités avancées** :
   - Import CSV bancaire
   - Export PDF/Excel
   - Notifications par email
   - Mode multi-devises
   - Comptes partagés (famille)

## 📚 Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Anthropic Claude API](https://docs.anthropic.com)
- [shadcn/ui](https://ui.shadcn.com)

## 🤝 Support

Pour toute question ou problème :
1. Consultez la documentation ci-dessus
2. Vérifiez les variables d'environnement
3. Consultez les logs Vercel en production

## 📄 Licence

MIT - Libre d'utilisation pour projets personnels et commerciaux

---

**Développé avec ❤️ en utilisant Claude Code**
