# 🚀 Instructions de Déploiement - À Compléter

## ✅ Ce qui a déjà été fait

- ✅ Repository GitHub créé : https://github.com/ErwanHenry/personal-finance-tracker
- ✅ Projet Vercel créé et lié au repo GitHub
- ✅ Code source complet avec documentation
- ✅ Configuration vercel.json prête

## 🔧 Ce qu'il reste à faire (5-10 minutes)

### Étape 1 : Créer la base de données Vercel Postgres

1. **Allez sur votre dashboard Vercel** : https://vercel.com/erwan-henrys-projects/personal-finance-tracker

2. **Cliquez sur l'onglet "Storage"** (dans le menu du projet)

3. **Cliquez sur "Create Database"**

4. **Sélectionnez "Postgres"**

5. **Configurez** :
   - Database Name : `personal-finance-db`
   - Region : `Frankfurt (fra1)` (proche de la France)

6. **Cliquez sur "Create"**

7. **Attendez 30 secondes** que la base soit créée

8. **IMPORTANT** : Vercel va automatiquement ajouter les variables d'environnement suivantes à votre projet :
   - `POSTGRES_URL`
   - `POSTGRES_URL_NON_POOLING`
   - `POSTGRES_PRISMA_URL`
   - Etc.

---

### Étape 2 : Mettre à jour les variables d'environnement

Dans Vercel Dashboard, allez dans **Settings → Environment Variables**

#### 2.1 Modifier les variables DATABASE

1. **Supprimez** les variables suivantes si elles existent avec des références `@secret` :
   - `DATABASE_URL`
   - `DIRECT_URL`

2. **Ajoutez-les à nouveau** avec les valeurs de Postgres :
   - Variable : `DATABASE_URL`
     - Value : Copiez la valeur de `POSTGRES_PRISMA_URL` (ou `POSTGRES_URL`)
     - Environments : Production, Preview, Development

   - Variable : `DIRECT_URL`
     - Value : Copiez la valeur de `POSTGRES_URL_NON_POOLING`
     - Environments : Production, Preview, Development

#### 2.2 Ajouter NextAuth Secret

Générez une clé secrète :

```bash
openssl rand -base64 32
```

Puis ajoutez :
- Variable : `NEXTAUTH_SECRET`
- Value : [la clé générée]
- Environments : Production, Preview, Development

#### 2.3 Ajouter NextAuth URL

- Variable : `NEXTAUTH_URL`
- Value : Laissez vide pour l'instant (on le mettra à jour après le déploiement)
- Environments : Production uniquement

#### 2.4 Google OAuth (OPTIONNEL pour l'instant)

**Vous pouvez sauter cette étape maintenant et la faire plus tard**

Pour configurer Google OAuth :
1. Allez sur https://console.cloud.google.com
2. Créez un projet
3. Activez Google+ API
4. Créez des credentials OAuth 2.0
5. Ajoutez les variables :
   - `GOOGLE_CLIENT_ID` : votre client ID
   - `GOOGLE_CLIENT_SECRET` : votre client secret

#### 2.5 Anthropic Claude AI (OPTIONNEL pour l'instant)

**Vous pouvez sauter cette étape maintenant et la faire plus tard**

Pour les insights IA :
1. Allez sur https://console.anthropic.com
2. Créez une API key
3. Ajoutez la variable :
   - `ANTHROPIC_API_KEY` : sk-ant-...

---

### Étape 3 : Déployer

1. **Retournez dans l'onglet "Deployments"**

2. **Cliquez sur "Redeploy"** (ou "Deploy" si c'est le premier déploiement)

3. **Attendez 2-3 minutes** que le build se termine

4. **Vérifiez que le build réussit** (vous verrez un ✅ vert)

---

### Étape 4 : Initialiser la base de données

Une fois le déploiement réussi :

1. **Récupérez l'URL de production** (ex: `https://personal-finance-tracker-xxx.vercel.app`)

2. **Mettez à jour NEXTAUTH_URL** :
   - Allez dans Settings → Environment Variables
   - Modifiez `NEXTAUTH_URL` avec votre URL de production
   - Redéployez

3. **Initialisez le schéma Prisma** :

Deux options :

**Option A : Via Vercel CLI** (recommandé)
```bash
# Dans votre terminal local
vercel env pull .env.production
npx prisma db push --url="[VOTRE_DATABASE_URL]"
```

**Option B : Via le terminal Vercel**
1. Allez dans Settings → Functions
2. Cliquez sur "Add Function"
3. Créez une fonction temporaire qui exécute :
```typescript
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
export default async function handler() {
  // Prisma migrations
  return new Response('DB initialized')
}
```

OU plus simplement :

**Option C : Push manuel**
```bash
# En local, avec l'URL de production
DATABASE_URL="[votre POSTGRES_URL]" npx prisma db push
```

---

### Étape 5 : Tester l'application

1. **Visitez votre URL de production** : `https://personal-finance-tracker-xxx.vercel.app`

2. **Vérifiez que** :
   - ✅ La page s'affiche correctement
   - ✅ Pas d'erreurs dans la console
   - ✅ Les styles sont chargés

3. **Si OAuth est configuré** :
   - Testez la connexion Google
   - Vérifiez que l'utilisateur est créé en DB

---

## 🎉 Configuration Minimale pour Démarrer

Si vous voulez juste voir l'app tourner rapidement, voici le MINIMUM :

1. ✅ Créer Vercel Postgres (Étape 1)
2. ✅ Configurer `DATABASE_URL` et `DIRECT_URL` (Étape 2.1)
3. ✅ Ajouter `NEXTAUTH_SECRET` (Étape 2.2)
4. ✅ Redéployer (Étape 3)
5. ✅ Initialiser la DB (Étape 4, Option C)

Les fonctionnalités Google OAuth et Claude AI peuvent être ajoutées plus tard !

---

## 📝 Checklist Complète

- [ ] Base de données Vercel Postgres créée
- [ ] Variables `DATABASE_URL` et `DIRECT_URL` configurées
- [ ] Variable `NEXTAUTH_SECRET` générée et ajoutée
- [ ] Application déployée avec succès
- [ ] URL de production récupérée
- [ ] `NEXTAUTH_URL` mise à jour avec l'URL de prod
- [ ] Base de données initialisée avec `prisma db push`
- [ ] Application testée et fonctionnelle
- [ ] (Optionnel) Google OAuth configuré
- [ ] (Optionnel) Claude AI configuré

---

## 🐛 Troubleshooting

### Erreur : "Prisma Client could not be generated"

C'est normal si c'est la première fois. La solution :
1. Vérifiez que `DATABASE_URL` est bien configurée
2. Redéployez l'application
3. Le build Vercel générera automatiquement le client Prisma

### Erreur : "Invalid Google OAuth redirect URI"

Solution :
1. Allez sur Google Cloud Console
2. Ajoutez `https://votre-app.vercel.app/api/auth/callback/google` aux URIs autorisés
3. Attendez 5 minutes pour la propagation
4. Réessayez

### Application déployée mais page blanche

Solution :
1. Vérifiez les logs Vercel (onglet "Deployments" → "View Function Logs")
2. Vérifiez que toutes les variables d'environnement sont définies
3. Vérifiez que la base de données est accessible

---

## 📞 Besoin d'aide ?

Si vous rencontrez un problème :

1. **Vérifiez les logs Vercel** : Deployments → View Function Logs
2. **Consultez la documentation** : README.md et SETUP_GUIDE.md
3. **Variables d'environnement** : Vérifiez qu'elles sont toutes définies dans Settings → Environment Variables

---

## 🚀 URLs Utiles

- **Repo GitHub** : https://github.com/ErwanHenry/personal-finance-tracker
- **Dashboard Vercel** : https://vercel.com/erwan-henrys-projects/personal-finance-tracker
- **Google Cloud Console** : https://console.cloud.google.com
- **Anthropic Console** : https://console.anthropic.com

---

**Bon déploiement ! 🎉**
