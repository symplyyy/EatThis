# 🔧 Guide pour réparer la barre de recherche

## 🚨 Problème

La barre de recherche ne fonctionne pas après l'importation des ingrédients/recettes.

## 🔍 Diagnostic

Exécutez le script de diagnostic pour identifier le problème :

```bash
npx ts-node scripts/diagnose-search.ts
```

## ✅ Solution : Créer les fonctions SQL dans Supabase

Le problème vient probablement du fait que la fonction `normalize_name` n'existe pas dans Supabase, ou que les fonctions RPC ne sont pas à jour.

### Étape 1 : Créer/mettre à jour les fonctions SQL

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**
4. Ouvrez le fichier `scripts/setup-supabase-functions.sql`
5. Copiez tout le contenu du fichier
6. Collez-le dans l'éditeur SQL de Supabase
7. Cliquez sur **Run** pour exécuter le script

### Étape 2 : Vérifier que les fonctions existent

Dans Supabase SQL Editor, exécutez :

```sql
-- Vérifier que normalize_name existe
SELECT normalize_name('œufs');
-- Doit retourner : 'oeufs'

-- Vérifier que rpc_autocomplete_ingredients existe
SELECT * FROM rpc_autocomplete_ingredients('oeufs', 5);

-- Vérifier que rpc_match_recipes_by_names existe
SELECT * FROM rpc_match_recipes_by_names(ARRAY['oeufs', 'fromage']::text[], 5);
```

### Étape 3 : Tester dans l'application

1. Redémarrez votre serveur Next.js :
   ```bash
   npm run dev
   ```

2. Allez sur `http://localhost:3000`

3. Testez la recherche :
   - Tapez "oeufs" dans la barre de recherche
   - Ajoutez "fromage"
   - Cliquez sur "Trouver des recettes"

## 🐛 Problèmes possibles

### Problème 1 : La fonction normalize_name n'existe pas

**Symptôme** : Erreur "function normalize_name does not exist"

**Solution** : Exécutez le script SQL `scripts/setup-supabase-functions.sql` dans Supabase

### Problème 2 : L'extension pg_trgm n'est pas activée

**Symptôme** : Erreur "function similarity does not exist"

**Solution** : Activez l'extension dans Supabase SQL Editor :

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

### Problème 3 : Les ingrédients ne sont pas normalisés

**Symptôme** : La recherche ne trouve pas de recettes même si elles existent

**Solution** : Vérifiez que les ingrédients sont bien normalisés dans la base :

```sql
-- Voir quelques ingrédients
SELECT id, name, normalize_name(name) as normalized
FROM ingredients
LIMIT 10;
```

Si les ingrédients ne sont pas normalisés, exécutez le script de nettoyage :

```bash
npx ts-node scripts/clean-ingredients.ts
```

### Problème 4 : Les fonctions RPC ne retournent rien

**Symptôme** : Les fonctions RPC fonctionnent mais ne retournent aucun résultat

**Solution** : Vérifiez que les relations recipe_ingredients existent :

```sql
-- Vérifier les relations
SELECT COUNT(*) FROM recipe_ingredients;

-- Voir quelques relations
SELECT 
  r.title,
  i.name
FROM recipe_ingredients ri
JOIN recipes r ON r.id = ri.recipe_id
JOIN ingredients i ON i.id = ri.ingredient_id
LIMIT 10;
```

## 🔍 Vérification finale

Après avoir exécuté le script SQL, testez à nouveau :

1. **Test de diagnostic** :
   ```bash
   npx ts-node scripts/diagnose-search.ts
   ```

2. **Test dans l'application** :
   - Ouvrez `http://localhost:3000`
   - Tapez "oeufs" dans la barre de recherche
   - Vérifiez que l'autocomplete fonctionne
   - Ajoutez "fromage"
   - Cliquez sur "Trouver des recettes"
   - Vérifiez que des recettes apparaissent

## 📝 Notes importantes

- Les fonctions SQL doivent être créées dans Supabase, pas dans votre code
- La fonction `normalize_name` doit gérer les ligatures (œ -> oe, æ -> ae)
- Les fonctions RPC utilisent `normalize_name` pour faire le matching
- Les ingrédients doivent être normalisés dans la base de données

## 🆘 Si le problème persiste

1. Vérifiez les logs du serveur Next.js pour voir les erreurs détaillées
2. Vérifiez les logs Supabase dans **Logs** > **Postgres Logs**
3. Testez directement les fonctions RPC dans Supabase SQL Editor
4. Vérifiez que les tables contiennent bien des données

