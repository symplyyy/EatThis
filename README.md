# EatThis

Application Next.js qui permet de trouver des recettes en fonction des ingrédients disponibles. L'application utilise Supabase (PostgreSQL) pour le stockage et le matching des recettes via des RPC optimisés.

## 🚀 Pour commencer

### Prérequis

- Node.js 18+ 
- Un projet Supabase avec la base de données configurée (voir schéma ci-dessous)

### Installation

1. Clonez le projet et installez les dépendances :

```bash
npm install
```

2. Créez un fichier `.env.local` avec vos variables d'environnement :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

📖 **Guides détaillés** :
- [SETUP_SUPABASE.md](./SETUP_SUPABASE.md) - Configuration Supabase
- [GUIDE_SEED.md](./GUIDE_SEED.md) - Alimenter votre base de données avec des recettes
- [GUIDE_IMPORT_MASSE.md](./GUIDE_IMPORT_MASSE.md) - Importer des milliers de recettes

3. Lancez le serveur de développement :

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

## 📋 Scripts disponibles

- `npm run dev` - Lance le serveur de développement
- `npm run build` - Compile l'application pour la production
- `npm start` - Lance le serveur de production
- `npm run lint` - Lance ESLint

## 🛠 Technologies utilisées

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS utilitaire
- **shadcn/ui** - Composants UI réutilisables
- **Supabase** - Backend PostgreSQL avec RPC
- **ESLint** - Linter pour le code

## 📁 Structure du projet

```
EatThis/
├── app/
│   ├── api/
│   │   ├── search/          # POST /api/search - Recherche de recettes
│   │   ├── recipes/[id]/    # GET /api/recipes/:id - Détail d'une recette
│   │   ├── autocomplete/    # GET /api/autocomplete - Autocomplete ingrédients
│   │   └── admin/seed/      # POST /api/admin/seed - Seed de données (protégé)
│   ├── r/[id]/              # Page de détail d'une recette
│   ├── page.tsx             # Page d'accueil avec recherche
│   └── layout.tsx            # Layout principal
├── components/
│   ├── ui/                   # Composants shadcn/ui (button, card, input)
│   ├── IngredientInput.tsx   # Input avec autocomplete et tags
│   └── RecipeCard.tsx        # Carte de recette
├── lib/
│   ├── supabaseBrowser.ts    # Client Supabase (anon) pour le client
│   ├── supabaseServer.ts     # Client Supabase (service role) pour le serveur
│   ├── types.ts              # Types TypeScript (RecipeCard, RecipeFull)
│   └── utils.ts              # Utilitaires (cn, normalizeIngredientName)
└── ...
```

## 🗄 Schéma de base de données (Supabase)

Le schéma est déjà créé dans Supabase. Ne pas modifier la structure.

### Tables

- **recipes** : Recettes avec titre, description, étapes, temps, difficulté, etc.
- **ingredients** : Ingrédients avec nom unique (citext)
- **recipe_ingredients** : Table de liaison N-N entre recettes et ingrédients

### RPC disponibles

- `rpc_autocomplete_ingredients(p_query text, p_limit int)` - Autocomplete ingrédients
- `rpc_match_recipes_by_names(p_names text[], p_limit int)` - Matching par noms
- `rpc_match_recipes_by_ids(p_ingredient_ids bigint[], p_limit int)` - Matching par IDs

### Vues

- `v_recipe_with_ingredients` - Vue avec recettes et leurs ingrédients

## 🔌 API Routes

### POST /api/search

Recherche de recettes par ingrédients.

**Body:**
```json
{
  "ingredients": ["pâtes", "œufs", "saumon fumé"],
  "limit": 30
}
```

**Response:**
```json
{
  "results": [
    {
      "id": 123,
      "title": "Pâtes au saumon",
      "timeMin": 20,
      "difficulty": 1,
      "have": 3,
      "missing": 1,
      "score": 5
    }
  ]
}
```

### GET /api/recipes/:id

Récupère les détails d'une recette.

**Response:**
```json
{
  "id": 123,
  "title": "...",
  "description": "...",
  "steps": ["...", "..."],
  "timeMin": 20,
  "difficulty": 1,
  "imageUrl": null,
  "ingredients": ["pâtes", "..."]
}
```

### GET /api/autocomplete?q=...

Autocomplete d'ingrédients (déclenche à ≥2 caractères).

**Response:**
```json
{
  "suggestions": [
    { "id": 1, "name": "saumon fumé" }
  ]
}
```

### POST /api/admin/seed

Seed de données de démo (protégé par service role key).

**Headers:**
```
Authorization: Bearer <SUPABASE_SERVICE_ROLE_KEY>
```

## 🎨 Ajouter des composants shadcn/ui

Pour ajouter des composants shadcn/ui, utilisez la CLI :

```bash
npx shadcn@latest add [nom-du-composant]
```

Par exemple :
```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

## 🔒 Sécurité

- **RLS activé** : SELECT public, INSERT/UPDATE/DELETE via service role uniquement
- **Service role key** : Jamais exposée côté client, uniquement dans Route Handlers serveur
- **Cache** : Headers Cache-Control configurés pour optimiser les performances

## ⚡ Performance

- Matching via RPC SQL optimisé (pas de boucles JS)
- Cache côté serveur avec revalidation (30-60s)
- Autocomplete débouncé (200ms)
- Limitation des résultats (limit param)
- Tri optimisé : score desc, missing asc, id asc

## 🧪 Tests d'acceptation

- ✅ Recherche avec `["œufs","fromage"]` retourne des omelettes
- ✅ Autocomplete "sau" → "saumon fumé" si présent
- ✅ Page recette affiche étapes ordonnées et ingrédients triés
- ✅ Zéro écriture possible via clé anon (401/403)
- ✅ Temps de réponse < 150ms (hors cold start)

