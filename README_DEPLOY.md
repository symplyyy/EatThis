# Guide de déploiement sur Vercel

## Prérequis

1. Un compte Vercel
2. Un projet Supabase configuré
3. Les variables d'environnement suivantes configurées dans Vercel

## Variables d'environnement

Configurez ces variables dans les paramètres de votre projet Vercel :

```
NEXT_PUBLIC_SUPABASE_URL=votre_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_clé_anon_supabase
SUPABASE_SERVICE_ROLE_KEY=votre_clé_service_role_supabase
```

## Déploiement

### Option 1 : Via l'interface Vercel

1. Connectez votre dépôt GitHub/GitLab/Bitbucket à Vercel
2. Vercel détectera automatiquement Next.js
3. Configurez les variables d'environnement
4. Déployez !

### Option 2 : Via la CLI Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel

# Suivre les instructions pour configurer les variables d'environnement
```

## Configuration

Le projet est déjà configuré pour Vercel avec :

- ✅ Configuration Next.js optimisée
- ✅ Images Unsplash configurées
- ✅ Build sans erreurs
- ✅ TypeScript strict
- ✅ ESLint configuré

## Notes importantes

- Les scripts dans le dossier `scripts/` ne sont pas déployés (voir `.vercelignore`)
- Les fichiers de documentation ne sont pas déployés
- Les variables d'environnement doivent être configurées dans Vercel

