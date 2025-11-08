# 🔧 Guide de dépannage - Erreur 500 sur /api/search

## 🚨 Problème : Erreur 500 lors de la recherche de recettes

Si vous obtenez une erreur 500 sur `/api/search`, voici comment diagnostiquer et résoudre le problème.

## 🔍 Diagnostic

### 1. Vérifier les logs du serveur

Ouvrez la console de votre terminal où tourne `npm run dev` et regardez les erreurs détaillées.

### 2. Utiliser l'endpoint de diagnostic

Créez une requête POST vers `/api/debug-search` avec vos ingrédients :

```bash
curl -X POST http://localhost:3000/api/debug-search \
  -H "Content-Type: application/json" \
  -d '{"ingredients": ["œufs", "fromage"]}'
```

Cela vous donnera des informations détaillées sur :
- La configuration Supabase
- La connexion à la base de données
- L'existence de la fonction RPC
- Les tables et leurs données

### 3. Vérifier les variables d'environnement

Assurez-vous que votre fichier `.env.local` contient :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

**Important** : Redémarrez le serveur après avoir modifié `.env.local` :
```bash
# Arrêtez le serveur (Ctrl+C)
npm run dev
```

## 🐛 Causes courantes et solutions

### Cause 1 : La fonction RPC n'existe pas dans Supabase

**Symptôme** : Erreur avec code `42883` ou message "function does not exist"

**Solution** : Créez la fonction RPC dans Supabase :

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Exécutez ce script SQL :

```sql
-- Fonction pour matcher les recettes par noms d'ingrédients
CREATE OR REPLACE FUNCTION rpc_match_recipes_by_names(
  p_names text[],
  p_limit int DEFAULT 50
)
RETURNS TABLE (
  recipe_id bigint,
  title text,
  time_min int,
  difficulty smallint,
  have_count int,
  missing_count int,
  score int,
  image_url text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH matched_ingredients AS (
    SELECT DISTINCT i.id, i.name
    FROM ingredients i
    WHERE normalize_name(i.name) = ANY(
      SELECT normalize_name(unnest(p_names))
    )
  ),
  recipe_matches AS (
    SELECT 
      r.id AS recipe_id,
      r.title,
      r.time_min,
      r.difficulty,
      r.image_url,
      COUNT(DISTINCT mi.id) AS have_count,
      COUNT(DISTINCT ri.ingredient_id) - COUNT(DISTINCT mi.id) AS missing_count,
      COUNT(DISTINCT mi.id) * 2 - (COUNT(DISTINCT ri.ingredient_id) - COUNT(DISTINCT mi.id)) AS score
    FROM recipes r
    INNER JOIN recipe_ingredients ri ON ri.recipe_id = r.id
    LEFT JOIN matched_ingredients mi ON mi.id = ri.ingredient_id
    GROUP BY r.id, r.title, r.time_min, r.difficulty, r.image_url
    HAVING COUNT(DISTINCT mi.id) > 0
  )
  SELECT 
    rm.recipe_id,
    rm.title,
    rm.time_min,
    rm.difficulty,
    rm.have_count,
    rm.missing_count,
    rm.score,
    rm.image_url
  FROM recipe_matches rm
  ORDER BY rm.score DESC, rm.missing_count ASC, rm.recipe_id ASC
  LIMIT p_limit;
END;
$$;
```

### Cause 2 : La fonction `normalize_name` n'existe pas

**Symptôme** : Erreur avec message "function normalize_name does not exist"

**Solution** : Créez la fonction `normalize_name` :

```sql
-- Fonction pour normaliser les noms (gestion accents, casse)
CREATE OR REPLACE FUNCTION normalize_name(name text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lower(unaccent(name))
$$;
```

**Note** : Si l'extension `unaccent` n'est pas disponible, utilisez cette version qui gère aussi les ligatures (œ, æ) :

```sql
CREATE OR REPLACE FUNCTION normalize_name(name text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lower(trim(
    REPLACE(
      REPLACE(name, 'œ', 'oe'),
      'æ', 'ae'
    )
  ))
$$;
```

**⚠️ IMPORTANT** : Cette fonction doit convertir `œ` en `oe` et `æ` en `ae` pour que le matching fonctionne correctement avec les ingrédients normalisés côté JavaScript.

### Cause 3 : Les tables n'existent pas

**Symptôme** : Erreur avec code `42P01` ou message "relation does not exist"

**Solution** : Vérifiez que les tables existent dans Supabase :

1. Allez dans **Table Editor** dans Supabase
2. Vérifiez que vous avez :
   - `recipes`
   - `ingredients`
   - `recipe_ingredients`

Si elles n'existent pas, créez-les selon le schéma dans `SETUP_SUPABASE.md`.

### Cause 4 : Variables d'environnement manquantes

**Symptôme** : Erreur "Supabase not configured"

**Solution** :
1. Vérifiez que `.env.local` existe à la racine du projet
2. Vérifiez que les variables sont correctes (sans espaces, sans guillemets)
3. Redémarrez le serveur

### Cause 5 : La base de données est vide

**Symptôme** : Aucune erreur mais aucun résultat

**Solution** : Utilisez le seed pour ajouter des recettes :

```bash
curl -X POST http://localhost:3000/api/admin/seed \
  -H "Authorization: Bearer VOTRE_SERVICE_ROLE_KEY"
```

## 📊 Vérifier les logs détaillés

L'API de recherche affiche maintenant des erreurs détaillées dans la console. Regardez :

1. **Les logs du serveur** (terminal où tourne `npm run dev`)
2. **La console du navigateur** (F12 > Console)
3. **La réponse JSON** de l'erreur (dans l'onglet Network)

Les erreurs incluent maintenant :
- `error.message` : Message d'erreur Supabase
- `error.code` : Code d'erreur PostgreSQL
- `error.hint` : Indice pour résoudre le problème

## ✅ Vérification rapide

1. **Test de connexion** : `http://localhost:3000/api/test-connection`
2. **Test de diagnostic** : POST vers `/api/debug-search` avec des ingrédients
3. **Vérifier les tables** : Dans Supabase > Table Editor

## 🆘 Si le problème persiste

1. Vérifiez que votre projet Supabase est actif
2. Vérifiez que les RPC existent dans **Database** > **Functions**
3. Vérifiez les logs Supabase dans **Logs** > **Postgres Logs**
4. Testez directement la fonction RPC dans l'éditeur SQL de Supabase :

```sql
SELECT * FROM rpc_match_recipes_by_names(
  ARRAY['œufs', 'fromage']::text[],
  10
);
```

