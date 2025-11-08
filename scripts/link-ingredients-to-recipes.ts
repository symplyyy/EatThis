/**
 * Script pour lier les ingrédients manquants aux recettes appropriées
 * 
 * Usage:
 *   npx ts-node scripts/link-ingredients-to-recipes.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Charger les variables d'environnement depuis .env.local
config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Variables Supabase requises')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Mapping des ingrédients vers les recettes qui devraient les contenir
const ingredientRecipeMappings: Record<string, string[]> = {
  'sauce tomate': ['bolognaise', 'pizza', 'lasagnes', 'pâtes à la tomate'],
  'tomates': ['bolognaise', 'pizza', 'lasagnes', 'pâtes à la tomate', 'salade de tomates'],
  'fromage': ['pizza', 'lasagnes', 'pâtes carbonara', 'omelette au fromage', 'sandwich au fromage'],
  'pâtes': ['bolognaise', 'pâtes à la tomate', 'pâtes carbonara', 'pâtes à l\'ail et à l\'huile'],
  'riz': ['risotto', 'riz aux légumes', 'riz au poulet', 'riz cantonais'],
  'poulet': ['riz au poulet', 'poulet rôti', 'poulet rôti aux herbes'],
  'œufs': ['omelette', 'omelette au fromage', 'omelette aux champignons', 'œufs au plat', 'œufs brouillés'],
  'oeufs': ['omelette', 'omelette au fromage', 'omelette aux champignons', 'œufs au plat', 'œufs brouillés'],
  'champignons': ['omelette aux champignons', 'risotto aux champignons', 'pâtes aux champignons'],
  'lardons': ['pâtes carbonara', 'quiche lorraine'],
  'crème fraîche': ['pâtes carbonara', 'quiche lorraine', 'risotto'],
  'creme fraiche': ['pâtes carbonara', 'quiche lorraine', 'risotto'],
}

async function linkIngredientsToRecipes() {
  console.log('🔗 Liaison des ingrédients aux recettes...\n')

  try {
    let linked = 0
    let skipped = 0
    let errors = 0

    for (const [ingredientName, recipeTitles] of Object.entries(ingredientRecipeMappings)) {
      console.log(`📝 Traitement de "${ingredientName}"...`)

      // Chercher l'ingrédient
      const { data: ingredient, error: ingError } = await supabase
        .from('ingredients')
        .select('id, name')
        .ilike('name', `%${ingredientName}%`)
        .limit(1)
        .single()

      if (ingError || !ingredient) {
        console.log(`   ⚠️  Ingrédient "${ingredientName}" non trouvé`)
        skipped++
        continue
      }

      console.log(`   ✅ Ingrédient trouvé: [ID: ${ingredient.id}] "${ingredient.name}"`)

      // Pour chaque recette
      for (const recipeTitle of recipeTitles) {
        // Chercher la recette
        const { data: recipe, error: recipeError } = await supabase
          .from('recipes')
          .select('id, title')
          .ilike('title', `%${recipeTitle}%`)
          .limit(1)
          .single()

        if (recipeError || !recipe) {
          console.log(`      ⚠️  Recette "${recipeTitle}" non trouvée`)
          continue
        }

        // Vérifier si la relation existe déjà
        const { data: existing, error: checkError } = await supabase
          .from('recipe_ingredients')
          .select('recipe_id, ingredient_id')
          .eq('recipe_id', recipe.id)
          .eq('ingredient_id', ingredient.id)
          .limit(1)
          .single()

        if (existing) {
          console.log(`      ⏭️  Relation déjà existante: "${recipe.title}"`)
          continue
        }

        // Créer la relation
        const { error: insertError } = await supabase
          .from('recipe_ingredients')
          .insert({
            recipe_id: recipe.id,
            ingredient_id: ingredient.id
          })

        if (insertError) {
          console.error(`      ❌ Erreur lors de la création de la relation:`, insertError.message)
          errors++
        } else {
          console.log(`      ✅ Lié à "${recipe.title}"`)
          linked++
        }
      }
      console.log('')
    }

    console.log('📊 Résumé:')
    console.log(`   ✅ ${linked} relations créées`)
    console.log(`   ⏭️  ${skipped} ingrédients ignorés`)
    console.log(`   ❌ ${errors} erreurs`)

    // Vérifier les ingrédients sans recettes
    console.log('\n🔍 Vérification des ingrédients sans recettes...')
    const { data: allIngredients, error: allIngError } = await supabase
      .from('ingredients')
      .select('id, name')

    if (!allIngError && allIngredients) {
      const ingredientsWithoutRecipes: any[] = []
      
      for (const ing of allIngredients) {
        const { count } = await supabase
          .from('recipe_ingredients')
          .select('*', { count: 'exact', head: true })
          .eq('ingredient_id', ing.id)

        if (count === 0) {
          ingredientsWithoutRecipes.push(ing)
        }
      }

      if (ingredientsWithoutRecipes.length > 0) {
        console.log(`   ⚠️  ${ingredientsWithoutRecipes.length} ingrédient(s) sans recettes:`)
        ingredientsWithoutRecipes.forEach((ing) => {
          console.log(`      - [ID: ${ing.id}] "${ing.name}"`)
        })
      } else {
        console.log('   ✅ Tous les ingrédients ont au moins une recette')
      }
    }

  } catch (error) {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  }
}

// Exécution
linkIngredientsToRecipes()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('Erreur fatale:', error)
    process.exit(1)
  })

