# 🌱 Guide pour alimenter votre base de données Supabase

Votre base de données Supabase est vide ? Pas de problème ! Voici plusieurs méthodes pour l'alimenter avec des recettes de démo.

## 📋 Prérequis

1. ✅ Votre fichier `.env.local` est configuré avec vos clés Supabase
2. ✅ Votre serveur Next.js est en cours d'exécution (`npm run dev`)
3. ✅ Votre base de données Supabase contient les tables nécessaires (recipes, ingredients, recipe_ingredients)

## 🚀 Méthode 1 : Via l'endpoint HTTP (Recommandé)

### Avec curl (Terminal)

```bash
curl -X POST http://localhost:3000/api/admin/seed \
  -H "Authorization: Bearer VOTRE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json"
```

**Remplacez `VOTRE_SERVICE_ROLE_KEY`** par votre clé service role depuis `.env.local`

### Avec PowerShell (Windows)

```powershell
$headers = @{
    "Authorization" = "Bearer VOTRE_SERVICE_ROLE_KEY"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:3000/api/admin/seed" -Method POST -Headers $headers
```

### Avec un client HTTP (Postman, Insomnia, etc.)

1. **Méthode** : `POST`
2. **URL** : `http://localhost:3000/api/admin/seed`
3. **Headers** :
   - `Authorization`: `Bearer VOTRE_SERVICE_ROLE_KEY`
   - `Content-Type`: `application/json`
4. Cliquez sur **Send**

## 🎯 Méthode 2 : Via l'interface Supabase (Manuel)

Si vous préférez insérer les données manuellement :

### 1. Aller sur l'éditeur SQL de Supabase

1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **SQL Editor**

### 2. Insérer des ingrédients

```sql
INSERT INTO ingredients (name) VALUES
  ('œufs'),
  ('champignons'),
  ('beurre'),
  ('sel'),
  ('poivre'),
  ('pâtes'),
  ('saumon fumé'),
  ('crème fraîche'),
  ('laitue'),
  ('parmesan'),
  ('croûtons'),
  ('sauce césar'),
  ('fromage'),
  ('spaghetti'),
  ('lardons'),
  ('riz arborio'),
  ('oignon'),
  ('vin blanc'),
  ('bouillon'),
  ('tomates'),
  ('mozzarella'),
  ('huile d''olive'),
  ('vinaigre balsamique'),
  ('basilic'),
  ('poulet'),
  ('herbes de provence')
ON CONFLICT (name) DO NOTHING;
```

### 3. Insérer des recettes

```sql
-- Insérer une recette
INSERT INTO recipes (title, description, steps, time_min, difficulty)
VALUES (
  'Omelette aux champignons',
  'Une omelette simple et savoureuse',
  ARRAY[
    'Casser les œufs dans un bol',
    'Battre les œufs',
    'Faire chauffer une poêle avec un peu de beurre',
    'Verser les œufs battus',
    'Ajouter les champignons',
    'Cuire 3-4 minutes de chaque côté'
  ],
  10,
  1
)
RETURNING id;
```

### 4. Lier les ingrédients aux recettes

```sql
-- Remplacer RECIPE_ID et INGREDIENT_ID par les IDs réels
INSERT INTO recipe_ingredients (recipe_id, ingredient_id)
SELECT 
  (SELECT id FROM recipes WHERE title = 'Omelette aux champignons'),
  id
FROM ingredients
WHERE name IN ('œufs', 'champignons', 'beurre', 'sel', 'poivre');
```

## 🔧 Méthode 3 : Script Node.js (Avancé)

Créez un fichier `seed.js` à la racine :

```javascript
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const recipes = [
  {
    title: 'Omelette aux champignons',
    description: 'Une omelette simple et savoureuse',
    steps: [
      'Casser les œufs dans un bol',
      'Battre les œufs',
      'Faire chauffer une poêle avec un peu de beurre',
      'Verser les œufs battus',
      'Ajouter les champignons',
      'Cuire 3-4 minutes de chaque côté'
    ],
    time_min: 10,
    difficulty: 1,
    ingredients: ['œufs', 'champignons', 'beurre', 'sel', 'poivre']
  }
  // Ajoutez d'autres recettes ici...
]

async function seed() {
  for (const recipeData of recipes) {
    // Insérer la recette
    const { data: recipe, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        title: recipeData.title,
        description: recipeData.description,
        steps: recipeData.steps,
        time_min: recipeData.time_min,
        difficulty: recipeData.difficulty
      })
      .select()
      .single()

    if (recipeError) {
      console.error('Erreur recette:', recipeError)
      continue
    }

    // Insérer les ingrédients et relations
    for (const ingredientName of recipeData.ingredients) {
      let { data: ingredient } = await supabase
        .from('ingredients')
        .select('id')
        .eq('name', ingredientName)
        .single()

      if (!ingredient) {
        const { data: newIngredient } = await supabase
          .from('ingredients')
          .insert({ name: ingredientName })
          .select()
          .single()
        ingredient = newIngredient
      }

      await supabase
        .from('recipe_ingredients')
        .insert({
          recipe_id: recipe.id,
          ingredient_id: ingredient.id
        })
    }
  }
}

seed().then(() => console.log('✅ Seed terminé!'))
```

Puis exécutez :
```bash
npm install dotenv
node seed.js
```

## 🖼️ Images automatiques (libres de droit)

**Bonne nouvelle !** Le seed inclut automatiquement des images libres de droit pour chaque recette via Unsplash. Les images sont automatiquement assignées en fonction du titre de la recette.

### Mettre à jour les images des recettes existantes

Si vous avez des recettes sans images, vous pouvez les mettre à jour automatiquement :

```bash
curl -X POST http://localhost:3000/api/admin/update-images \
  -H "Authorization: Bearer VOTRE_SERVICE_ROLE_KEY"
```

Cet endpoint :
- Trouve toutes les recettes sans image
- Génère automatiquement une URL d'image Unsplash appropriée
- Met à jour la base de données

**Note** : Toutes les images proviennent d'Unsplash et sont libres de droit (Unsplash License).

## ✅ Vérifier que ça fonctionne

1. Testez la connexion : `http://localhost:3000/api/test-connection`
2. Testez l'autocomplete : `http://localhost:3000/api/autocomplete?q=œuf`
3. Testez la recherche : Utilisez l'interface web avec des ingrédients
4. Vérifiez que les images s'affichent dans les cartes de recettes

## 🎉 Recettes incluses dans le seed

Le seed inclut automatiquement ces recettes :
- Omelette aux champignons
- Pâtes au saumon fumé
- Salade César
- Omelette au fromage
- Spaghetti à la carbonara
- Risotto aux champignons
- Salade de tomates et mozzarella
- Poulet rôti aux herbes

## 🔍 Dépannage

### Erreur 401/403
- Vérifiez que votre `SUPABASE_SERVICE_ROLE_KEY` est correcte
- Vérifiez que le header Authorization est bien formaté : `Bearer VOTRE_CLE`

### Erreur "table does not exist"
- Vérifiez que les tables existent dans votre base de données Supabase
- Consultez `SETUP_SUPABASE.md` pour la structure requise

### Erreur "function does not exist"
- Vérifiez que les RPC existent dans votre base de données
- Les fonctions doivent être créées dans Supabase

### Les recettes ne s'affichent pas
- Vérifiez que les RPC `rpc_match_recipes_by_names` fonctionnent
- Testez directement dans l'éditeur SQL de Supabase

## 📚 Prochaines étapes

Une fois votre base de données alimentée :
1. Testez la recherche avec différents ingrédients
2. Ajoutez vos propres recettes via l'interface Supabase
3. Personnalisez les recettes selon vos besoins

