#!/bin/bash

echo "🔧 Configuration des variables Vercel..."
echo ""
echo "DATABASE_URL:"
echo 'postgresql://neondb_owner:npg_hDJab0TAPE9B@ep-small-cherry-ag4fr78a-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' | vercel env add DATABASE_URL production preview development

echo ""
echo "DIRECT_URL:"
echo 'postgresql://neondb_owner:npg_hDJab0TAPE9B@ep-small-cherry-ag4fr78a-pooler.c-2.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require' | vercel env add DIRECT_URL production preview development

echo ""
echo "NEXTAUTH_SECRET:"
echo 'UiKmtK2slIsfgLOpLmzsQ3F9SE9ARwU2nCOxSRCc2jg=' | vercel env add NEXTAUTH_SECRET production preview development

echo ""
echo "✅ Variables ajoutées!"
