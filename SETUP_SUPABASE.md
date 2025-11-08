# Configuration Supabase pour EatThis

## 📋 Étapes pour connecter votre base de données Supabase

### 1. Récupérer vos clés Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet (ou créez-en un nouveau)
3. Allez dans **Settings** > **API**
4. Vous trouverez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Créer le fichier `.env.local`

À la racine du projet, créez un fichier `.env.local` avec le contenu suivant :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici

# URL de base (optionnel)
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**⚠️ Important :**
- Le fichier `.env.local` est déjà dans `.gitignore` et ne sera pas commité
- Ne partagez JAMAIS votre `SUPABASE_SERVICE_ROLE_KEY` publiquement
- La `service_role` key contourne RLS - gardez-la secrète !

### 3. Vérifier la connexion

Une fois le fichier `.env.local` créé et le serveur redémarré, testez la connexion :

```bash
# Redémarrer le serveur de développement
npm run dev
```

Puis ouvrez dans votre navigateur :
```
http://localhost:3000/api/test-connection
```

Vous devriez voir une réponse JSON indiquant si la connexion est réussie.

### 4. Structure de base de données requise

Assurez-vous que votre base de données Supabase contient :

#### Tables :
- `recipes` (id, title, description, steps, time_min, difficulty, image_url, ingredients_count, embedding, created_at)
- `ingredients` (id, name - citext unique)
- `recipe_ingredients` (recipe_id, ingredient_id, quantity)

#### RPC (fonctions) :
- `rpc_autocomplete_ingredients(p_query text, p_limit int)`
- `rpc_match_recipes_by_names(p_names text[], p_limit int)`
- `rpc_match_recipes_by_ids(p_ingredient_ids bigint[], p_limit int)`

#### Vues :
- `v_recipe_with_ingredients`

#### RLS (Row Level Security) :
- SELECT public sur toutes les tables
- INSERT/UPDATE/DELETE via service role uniquement

### 5. (Optionnel) Seed des données de test

Pour ajouter des recettes de démo, utilisez l'endpoint de seed :

```bash
curl -X POST http://localhost:3000/api/admin/seed \
  -H "Authorization: Bearer VOTRE_SERVICE_ROLE_KEY"
```

Ou utilisez un client HTTP comme Postman/Insomnia.

## 🔍 Dépannage

### Erreur "Missing Supabase environment variables"
- Vérifiez que le fichier `.env.local` existe à la racine du projet
- Vérifiez que les noms des variables sont corrects (sans espaces)
- Redémarrez le serveur de développement après avoir créé/modifié `.env.local`

### Erreur de connexion à Supabase
- Vérifiez que votre URL Supabase est correcte
- Vérifiez que vos clés sont valides
- Vérifiez que votre projet Supabase est actif

### Erreur "PGRST116" (not found)
- Vérifiez que les tables et RPC existent dans votre base de données
- Vérifiez que RLS est correctement configuré

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Guide RLS Supabase](https://supabase.com/docs/guides/auth/row-level-security)
- [API Supabase](https://supabase.com/docs/reference/javascript/introduction)

