# 🚀 Guide de Configuration - Personal Finance Tracker

Guide pas à pas pour configurer et déployer votre application de gestion financière.

## ✅ Étape 1 : Vercel Postgres Database

### 1.1 Créer le projet Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Cliquez sur "Add New" → "Project"
3. Ne déployez PAS encore, nous allons d'abord configurer la base de données

### 1.2 Créer la base de données Postgres

1. Dans Vercel Dashboard, allez dans l'onglet "Storage"
2. Cliquez sur "Create Database"
3. Sélectionnez "Postgres"
4. Donnez un nom : `personal-finance-db`
5. Sélectionnez la région : `Frankfurt (cdg1)` (plus proche de la France)
6. Cliquez sur "Create"

### 1.3 Récupérer les URLs de connexion

1. Une fois la database créée, cliquez dessus
2. Allez dans l'onglet ".env.local"
3. Copiez les valeurs suivantes :
   ```env
   POSTGRES_URL="..."
   POSTGRES_URL_NON_POOLING="..."
   ```

4. Dans votre fichier `.env` local, ajoutez :
   ```env
   DATABASE_URL="[POSTGRES_URL]"
   DIRECT_URL="[POSTGRES_URL_NON_POOLING]"
   ```

⚠️ **Important** : Utilisez `POSTGRES_URL` pour `DATABASE_URL` et `POSTGRES_URL_NON_POOLING` pour `DIRECT_URL`

## ✅ Étape 2 : Google OAuth Configuration

### 2.1 Créer un projet Google Cloud

1. Allez sur [console.cloud.google.com](https://console.cloud.google.com)
2. Créez un nouveau projet ou sélectionnez un existant
3. Nommez-le : `Personal Finance Tracker`

### 2.2 Activer Google+ API

1. Dans le menu, allez dans "APIs & Services" → "Library"
2. Recherchez "Google+ API"
3. Cliquez sur "Enable"

### 2.3 Créer les identifiants OAuth

1. Allez dans "APIs & Services" → "Credentials"
2. Cliquez sur "Create Credentials" → "OAuth 2.0 Client ID"
3. Si demandé, configurez l'écran de consentement OAuth :
   - User Type : External
   - App name : Personal Finance Tracker
   - User support email : votre email
   - Developer contact : votre email
   - Cliquez sur "Save and Continue" jusqu'à la fin

4. Créez l'OAuth Client ID :
   - Application type : Web application
   - Name : Personal Finance Tracker

5. **Origines JavaScript autorisées** :
   ```
   http://localhost:3000
   https://votre-app.vercel.app
   ```

6. **URI de redirection autorisés** :
   ```
   http://localhost:3000/api/auth/callback/google
   https://votre-app.vercel.app/api/auth/callback/google
   ```

7. Cliquez sur "Create"

### 2.4 Copier les identifiants

1. Copiez le "Client ID" et le "Client Secret"
2. Dans votre `.env` :
   ```env
   GOOGLE_CLIENT_ID="123456789-xxxxxxxxxxxx.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="GOCSPX-xxxxxxxxxxxxxxxx"
   ```

## ✅ Étape 3 : NextAuth Configuration

### 3.1 Générer une clé secrète

Dans votre terminal :
```bash
openssl rand -base64 32
```

### 3.2 Configurer NextAuth

Dans votre `.env` :
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="[la-cle-generee-ci-dessus]"
```

## ✅ Étape 4 : Anthropic Claude AI

### 4.1 Créer un compte Anthropic

1. Allez sur [console.anthropic.com](https://console.anthropic.com)
2. Créez un compte ou connectez-vous
3. Ajoutez un moyen de paiement (carte bancaire)

### 4.2 Générer une API Key

1. Dans le menu, allez dans "API Keys"
2. Cliquez sur "Create Key"
3. Nommez-la : `Personal Finance Tracker`
4. Copiez la clé (elle ne sera affichée qu'une fois !)

### 4.3 Configurer la clé

Dans votre `.env` :
```env
ANTHROPIC_API_KEY="sk-ant-api03-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

💡 **Astuce** : Les premiers $5 sont offerts pour tester l'API !

## ✅ Étape 5 : Initialiser la base de données

### 5.1 Vérifier votre fichier .env

Assurez-vous d'avoir toutes les variables :
```env
# Database
DATABASE_URL="postgres://..."
DIRECT_URL="postgres://..."

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Anthropic
ANTHROPIC_API_KEY="sk-ant-..."
```

### 5.2 Installer les dépendances

```bash
npm install
```

### 5.3 Générer le client Prisma

```bash
npx prisma generate
```

### 5.4 Créer les tables

```bash
npx prisma db push
```

Vous devriez voir :
```
✔ Generated Prisma Client
✔ Your database is now in sync with your Prisma schema
```

### 5.5 (Optionnel) Ouvrir Prisma Studio

Pour visualiser votre base de données :
```bash
npx prisma studio
```

Cela ouvrira une interface web sur `http://localhost:5555`

## ✅ Étape 6 : Tester en local

### 6.1 Lancer le serveur

```bash
npm run dev
```

### 6.2 Tester l'authentification

1. Ouvrez [http://localhost:3000](http://localhost:3000)
2. Cliquez sur "Se connecter avec Google"
3. Autorisez l'application
4. Vous devriez être redirigé vers le dashboard

### 6.3 Vérifier que l'utilisateur est créé

```bash
npx prisma studio
```

Allez dans la table "User", vous devriez voir votre compte Google !

## ✅ Étape 7 : Déployer sur Vercel

### 7.1 Initialiser Git

```bash
# Initialisez git si ce n'est pas déjà fait
git init

# Ajoutez tous les fichiers
git add .

# Créez le premier commit
git commit -m "feat: initial personal finance tracker setup"
```

### 7.2 Créer un repo GitHub

```bash
# Avec GitHub CLI
gh repo create personal-finance-tracker --public --source=. --push

# OU manuellement sur github.com
# 1. Créez un nouveau repo sur github.com
# 2. Suivez les instructions pour pusher votre code
```

### 7.3 Déployer sur Vercel

1. Allez sur [vercel.com](https://vercel.com)
2. Cliquez sur "Add New" → "Project"
3. Importez votre repo GitHub
4. Vercel détectera automatiquement Next.js

### 7.4 Configurer les variables d'environnement

Dans Vercel, avant de déployer, ajoutez les variables d'environnement :

1. Allez dans "Environment Variables"
2. Ajoutez **TOUTES** les variables de votre `.env` local :
   - `DATABASE_URL` (depuis Vercel Postgres)
   - `DIRECT_URL` (depuis Vercel Postgres)
   - `NEXTAUTH_SECRET` (votre clé générée)
   - `NEXTAUTH_URL` → `https://votre-app.vercel.app` ⚠️ **À MODIFIER APRÈS LE DEPLOY**
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `ANTHROPIC_API_KEY`

3. Cliquez sur "Deploy"

### 7.5 Configuration post-déploiement

Une fois déployé, Vercel vous donnera une URL (ex: `https://personal-finance-tracker-xxx.vercel.app`)

#### 7.5.1 Mettre à jour NEXTAUTH_URL

1. Dans Vercel, allez dans "Settings" → "Environment Variables"
2. Modifiez `NEXTAUTH_URL` avec votre URL de production
3. Redéployez : "Deployments" → "..." → "Redeploy"

#### 7.5.2 Mettre à jour Google OAuth

1. Retournez sur [Google Cloud Console](https://console.cloud.google.com)
2. "APIs & Services" → "Credentials"
3. Cliquez sur votre OAuth Client ID
4. Ajoutez les URLs de production :
   - **Origines autorisées** : `https://votre-app.vercel.app`
   - **URIs de redirection** : `https://votre-app.vercel.app/api/auth/callback/google`
5. Sauvegardez

#### 7.5.3 Initialiser la base de données en production

La base de données Vercel Postgres est déjà liée à votre projet, les tables ont été créées automatiquement lors du build.

Pour vérifier :
```bash
# Dans le terminal Vercel (ou en local avec l'URL de prod)
npx prisma studio --url="[VOTRE_DATABASE_URL]"
```

## ✅ Étape 8 : Vérification finale

### Checklist

- [ ] ✅ Base de données Vercel Postgres créée et connectée
- [ ] ✅ Google OAuth configuré (local + production)
- [ ] ✅ NextAuth configuré avec secret
- [ ] ✅ Claude AI API Key configurée
- [ ] ✅ Tables Prisma créées (`npx prisma db push`)
- [ ] ✅ Application fonctionne en local
- [ ] ✅ Application déployée sur Vercel
- [ ] ✅ Authentification Google fonctionne en production

### Test de production

1. Allez sur `https://votre-app.vercel.app`
2. Cliquez sur "Se connecter avec Google"
3. Autorisez l'application
4. Vous devriez être redirigé vers le dashboard

## 🐛 Troubleshooting

### Erreur : "Prisma Client could not be generated"

```bash
npx prisma generate
npm run dev
```

### Erreur : "Invalid Google OAuth redirect URI"

Vérifiez que les URIs dans Google Cloud Console correspondent exactement à :
- `http://localhost:3000/api/auth/callback/google` (local)
- `https://votre-app.vercel.app/api/auth/callback/google` (production)

### Erreur : "NEXTAUTH_SECRET missing"

Assurez-vous que la variable `NEXTAUTH_SECRET` est bien définie dans Vercel.

### Erreur de connexion à la database

Vérifiez que :
- `DATABASE_URL` et `DIRECT_URL` sont corrects
- La base de données Vercel Postgres est bien créée
- Vous avez run `npx prisma db push`

### Claude AI ne répond pas

Vérifiez :
- Que `ANTHROPIC_API_KEY` est bien configurée
- Que vous avez du crédit sur votre compte Anthropic
- Les logs Vercel pour voir les erreurs détaillées

## 📚 Ressources utiles

- [Documentation Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Documentation NextAuth](https://next-auth.js.org/)
- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Anthropic](https://docs.anthropic.com/)

## 🎉 Félicitations !

Votre application de gestion de finances personnelles est maintenant configurée et déployée !

### Prochaines étapes

1. **Créer votre premier compte bancaire** dans l'application
2. **Ajouter des transactions** pour tester
3. **Définir des budgets** par catégorie
4. **Créer des objectifs d'épargne**
5. **Demander des insights AI** à Claude

### Support

Si vous rencontrez des problèmes, consultez :
- Le fichier `README.md` pour la documentation complète
- Les logs Vercel pour les erreurs de production
- La documentation officielle des services utilisés

---

**Bonne gestion de vos finances ! 💰**
