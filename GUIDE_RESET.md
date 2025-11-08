# 🔄 Guide de réinitialisation de la base de données

## 📋 Pourquoi réinitialiser ?

Si vous souhaitez créer vos propres recettes manuellement plutôt que d'utiliser des données importées, vous pouvez réinitialiser la base de données pour repartir de zéro.

## ⚠️ ATTENTION

**Cette opération est irréversible !** Toutes les données seront supprimées :
- ✅ Toutes les recettes
- ✅ Tous les ingrédients
- ✅ Toutes les relations recipe_ingredients

**La structure des tables sera conservée** (colonnes, contraintes, fonctions RPC, etc.)

## 🚀 Utilisation

### 1. Exécuter le script de réinitialisation

```bash
npx ts-node scripts/reset-database.ts
```

### 2. Confirmer l'opération

Le script vous demandera confirmation avant de supprimer les données :
```
Êtes-vous sûr de vouloir continuer ? (oui/non):
```

Tapez `oui` ou `o` pour confirmer, ou `non` pour annuler.

### 3. Vérifier les résultats

Le script affichera :
- Le nombre de recettes supprimées
- Le nombre d'ingrédients supprimés
- Le nombre de relations supprimées
- Une vérification finale pour confirmer que tout est vide

## 📊 Résultats attendus

Après la réinitialisation, vous devriez avoir :
- ✅ 0 recette
- ✅ 0 ingrédient
- ✅ 0 relation
- ✅ Structure des tables intacte

## 🎯 Prochaines étapes

Après la réinitialisation, vous pouvez :

1. **Ajouter des ingrédients manuellement** via Supabase Dashboard
2. **Ajouter des recettes manuellement** via Supabase Dashboard
3. **Créer vos propres scripts** pour ajouter des recettes
4. **Utiliser l'API** `/api/admin/seed` pour ajouter des recettes de test

## 💡 Ajouter des recettes manuellement

### Via Supabase Dashboard

1. Allez sur votre projet Supabase
2. Ouvrez **Table Editor**
3. Ajoutez des ingrédients dans la table `ingredients`
4. Ajoutez des recettes dans la table `recipes`
5. Liez les ingrédients aux recettes dans la table `recipe_ingredients`

### Structure d'une recette

```sql
INSERT INTO recipes (title, description, steps, time_min, difficulty, image_url)
VALUES (
  'Omelette aux champignons',
  'Une délicieuse omelette aux champignons',
  ARRAY[
    'Casser les œufs dans un bol',
    'Battre les œufs',
    'Faire chauffer une poêle',
    'Ajouter les champignons',
    'Verser les œufs',
    'Cuire 5 minutes'
  ],
  15,
  1,
  'https://example.com/image.jpg'
);
```

### Structure d'un ingrédient

```sql
INSERT INTO ingredients (name)
VALUES ('oeufs'), ('champignons'), ('beurre'), ('sel'), ('poivre');
```

### Lier un ingrédient à une recette

```sql
INSERT INTO recipe_ingredients (recipe_id, ingredient_id)
VALUES (1, 1), (1, 2), (1, 3), (1, 4), (1, 5);
```

## 🛠️ Créer un script personnalisé

Vous pouvez créer votre propre script pour ajouter des recettes. Voir `scripts/import-edamam.ts` ou `scripts/import-recipe-nlg.ts` comme exemples.

## 📝 Notes

- Les fonctions RPC (`rpc_match_recipes_by_names`, `rpc_autocomplete_ingredients`) continueront de fonctionner après la réinitialisation
- Les vues (`v_recipe_with_ingredients`) seront conservées
- Les triggers et contraintes seront conservés
- Seules les données sont supprimées, pas la structure

## 🐛 Problèmes possibles

### Erreur : "Variables Supabase requises"
- Vérifiez que `.env.local` contient `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`

### Erreur : "Permission denied"
- Vérifiez que la clé `SUPABASE_SERVICE_ROLE_KEY` a les permissions nécessaires

### Certaines données restent
- Vérifiez manuellement dans Supabase Dashboard
- Il peut y avoir des contraintes qui empêchent la suppression

