-- Script SQL pour créer/mettre à jour toutes les fonctions nécessaires dans Supabase
-- 
-- Usage:
--   1. Allez sur https://app.supabase.com
--   2. Sélectionnez votre projet
--   3. Allez dans SQL Editor
--   4. Copiez-collez ce script
--   5. Exécutez le script

-- ============================================
-- 1. Fonction normalize_name
-- ============================================
-- Cette fonction normalise les noms d'ingrédients (minuscules, trim, gestion ligatures)

-- Supprimer la fonction existante si elle existe (avec différents noms de paramètres possibles)
DROP FUNCTION IF EXISTS normalize_name(text);
DROP FUNCTION IF EXISTS normalize_name(txt text);
DROP FUNCTION IF EXISTS public.normalize_name(text);
DROP FUNCTION IF EXISTS public.normalize_name(txt text);

-- Créer la fonction normalize_name
CREATE FUNCTION normalize_name(name text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT lower(trim(
    REPLACE(
      REPLACE(
        REPLACE(
          REPLACE(name, 'œ', 'oe'),
          'Œ', 'oe'
        ),
        'æ', 'ae'
      ),
      'Æ', 'ae'
    )
  ))
$$;

-- ============================================
-- 2. Activer l'extension pg_trgm (nécessaire pour la recherche floue)
-- ============================================
-- Cette extension doit être activée dans Supabase Dashboard > Database > Extensions
-- Ou via cette commande (nécessite les droits admin) :
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================
-- 3. Fonction rpc_autocomplete_ingredients
-- ============================================
-- Autocomplete d'ingrédients avec recherche floue (trigrammes)

-- Supprimer la fonction existante si elle existe
DROP FUNCTION IF EXISTS rpc_autocomplete_ingredients(text, int);
DROP FUNCTION IF EXISTS rpc_autocomplete_ingredients(text);
DROP FUNCTION IF EXISTS public.rpc_autocomplete_ingredients(text, int);
DROP FUNCTION IF EXISTS public.rpc_autocomplete_ingredients(text);

-- Créer la fonction rpc_autocomplete_ingredients
-- Version simplifiée qui fonctionne sans pg_trgm
CREATE FUNCTION rpc_autocomplete_ingredients(
  p_query text,
  p_limit int DEFAULT 20
)
RETURNS TABLE (
  id bigint,
  name text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    i.id,
    i.name::text  -- Convertir citext en text
  FROM ingredients i
  WHERE 
    -- Recherche par préfixe (fonctionne toujours)
    normalize_name(i.name::text) LIKE normalize_name(p_query) || '%'
    OR
    -- Recherche par contenu (contient la requête)
    normalize_name(i.name::text) LIKE '%' || normalize_name(p_query) || '%'
  ORDER BY 
    -- Prioriser les correspondances exactes
    CASE WHEN normalize_name(i.name::text) = normalize_name(p_query) THEN 1 ELSE 2 END,
    -- Puis les correspondances par préfixe
    CASE WHEN normalize_name(i.name::text) LIKE normalize_name(p_query) || '%' THEN 1 ELSE 2 END,
    -- Puis par longueur (plus court = plus pertinent)
    LENGTH(i.name::text) ASC,
    -- Puis par nom alphabétique
    i.name::text ASC
  LIMIT p_limit;
END;
$$;

-- ============================================
-- 4. Fonction rpc_match_recipes_by_names
-- ============================================
-- Matching de recettes par noms d'ingrédients

-- Supprimer la fonction existante si elle existe
DROP FUNCTION IF EXISTS rpc_match_recipes_by_names(text[], int);
DROP FUNCTION IF EXISTS rpc_match_recipes_by_names(text[]);
DROP FUNCTION IF EXISTS public.rpc_match_recipes_by_names(text[], int);
DROP FUNCTION IF EXISTS public.rpc_match_recipes_by_names(text[]);

-- Créer la fonction rpc_match_recipes_by_names
-- Version améliorée qui retourne aussi la liste des ingrédients manquants
CREATE FUNCTION rpc_match_recipes_by_names(
  p_names text[],
  p_limit int DEFAULT 50
)
RETURNS TABLE (
  recipe_id bigint,
  title text,
  time_min int,
  difficulty smallint,
  have_count bigint,  -- COUNT() retourne bigint
  missing_count bigint,  -- COUNT() retourne bigint
  score bigint,  -- COUNT() retourne bigint
  image_url text,
  missing_ingredients text[]  -- Liste des ingrédients manquants
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH matched_ingredients AS (
    SELECT DISTINCT i.id, i.name
    FROM ingredients i
    WHERE normalize_name(i.name::text) = ANY(
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
      COUNT(DISTINCT mi.id)::bigint AS have_count,
      (COUNT(DISTINCT ri.ingredient_id) - COUNT(DISTINCT mi.id))::bigint AS missing_count,
      (COUNT(DISTINCT mi.id) * 2 - (COUNT(DISTINCT ri.ingredient_id) - COUNT(DISTINCT mi.id)))::bigint AS score
    FROM recipes r
    INNER JOIN recipe_ingredients ri ON ri.recipe_id = r.id
    LEFT JOIN matched_ingredients mi ON mi.id = ri.ingredient_id
    GROUP BY r.id, r.title, r.time_min, r.difficulty, r.image_url
    HAVING COUNT(DISTINCT mi.id) > 0
  ),
  recipe_missing_ingredients AS (
    SELECT 
      rm.recipe_id,
      ARRAY_AGG(DISTINCT i.name::text ORDER BY i.name::text) FILTER (
        WHERE i.id NOT IN (SELECT id FROM matched_ingredients)
      ) AS missing_ingredients
    FROM recipe_matches rm
    INNER JOIN recipe_ingredients ri ON ri.recipe_id = rm.recipe_id
    INNER JOIN ingredients i ON i.id = ri.ingredient_id
    GROUP BY rm.recipe_id
  )
  SELECT 
    rm.recipe_id,
    rm.title,
    rm.time_min,
    rm.difficulty,
    rm.have_count,
    rm.missing_count,
    rm.score,
    rm.image_url,
    COALESCE(rmi.missing_ingredients, ARRAY[]::text[]) AS missing_ingredients
  FROM recipe_matches rm
  LEFT JOIN recipe_missing_ingredients rmi ON rmi.recipe_id = rm.recipe_id
  ORDER BY rm.score DESC, rm.missing_count ASC, rm.recipe_id ASC
  LIMIT p_limit;
END;
$$;

-- ============================================
-- 5. Fonction rpc_match_recipes_by_ids
-- ============================================
-- Matching de recettes par IDs d'ingrédients (alternative)

-- Supprimer la fonction existante si elle existe
DROP FUNCTION IF EXISTS rpc_match_recipes_by_ids(bigint[], int);
DROP FUNCTION IF EXISTS rpc_match_recipes_by_ids(bigint[]);
DROP FUNCTION IF EXISTS public.rpc_match_recipes_by_ids(bigint[], int);
DROP FUNCTION IF EXISTS public.rpc_match_recipes_by_ids(bigint[]);

-- Créer la fonction rpc_match_recipes_by_ids
CREATE FUNCTION rpc_match_recipes_by_ids(
  p_ingredient_ids bigint[],
  p_limit int DEFAULT 50
)
RETURNS TABLE (
  recipe_id bigint,
  title text,
  time_min int,
  difficulty smallint,
  have_count bigint,  -- COUNT() retourne bigint
  missing_count bigint,  -- COUNT() retourne bigint
  score bigint,  -- COUNT() retourne bigint
  image_url text
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH recipe_matches AS (
    SELECT 
      r.id AS recipe_id,
      r.title,
      r.time_min,
      r.difficulty,
      r.image_url,
      COUNT(DISTINCT CASE WHEN ri.ingredient_id = ANY(p_ingredient_ids) THEN ri.ingredient_id END)::bigint AS have_count,
      (COUNT(DISTINCT ri.ingredient_id) - COUNT(DISTINCT CASE WHEN ri.ingredient_id = ANY(p_ingredient_ids) THEN ri.ingredient_id END))::bigint AS missing_count,
      (COUNT(DISTINCT CASE WHEN ri.ingredient_id = ANY(p_ingredient_ids) THEN ri.ingredient_id END) * 2 - (COUNT(DISTINCT ri.ingredient_id) - COUNT(DISTINCT CASE WHEN ri.ingredient_id = ANY(p_ingredient_ids) THEN ri.ingredient_id END)))::bigint AS score
    FROM recipes r
    INNER JOIN recipe_ingredients ri ON ri.recipe_id = r.id
    WHERE ri.ingredient_id = ANY(p_ingredient_ids)
    GROUP BY r.id, r.title, r.time_min, r.difficulty, r.image_url
    HAVING COUNT(DISTINCT CASE WHEN ri.ingredient_id = ANY(p_ingredient_ids) THEN ri.ingredient_id END) > 0
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

-- ============================================
-- 6. Vue v_recipe_with_ingredients
-- ============================================
-- Vue pratique pour récupérer les recettes avec leurs ingrédients
CREATE OR REPLACE VIEW v_recipe_with_ingredients AS
SELECT 
  r.id,
  r.title,
  r.description,
  r.steps,
  r.time_min,
  r.difficulty,
  r.image_url,
  r.ingredients_count,
  r.created_at,
  ARRAY_AGG(i.name ORDER BY i.name) AS ingredients
FROM recipes r
LEFT JOIN recipe_ingredients ri ON ri.recipe_id = r.id
LEFT JOIN ingredients i ON i.id = ri.ingredient_id
GROUP BY r.id, r.title, r.description, r.steps, r.time_min, r.difficulty, r.image_url, r.ingredients_count, r.created_at;

-- ============================================
-- Vérification
-- ============================================
-- Testez les fonctions avec ces requêtes :

-- Test normalize_name
-- SELECT normalize_name('œufs'); -- Doit retourner 'oeufs'

-- Test autocomplete
-- SELECT * FROM rpc_autocomplete_ingredients('oeufs', 10);

-- Test match_recipes_by_names
-- SELECT * FROM rpc_match_recipes_by_names(ARRAY['oeufs', 'fromage']::text[], 10);

