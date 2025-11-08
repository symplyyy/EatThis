/**
 * Script pour vérifier les relations entre recettes et ingrédients
 * 
 * Usage:
 *   npx ts-node scripts/check-recipe-ingredients.ts
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

async function checkRecipeIngredients() {
  console.log('🔍 Vérification des relations recettes-ingrédients...\n')

  try {
    // 1. Chercher l'ingrédient "sauce tomate"
    console.log('1️⃣  Recherche de l\'ingrédient "sauce tomate"...')
    const { data: ingredient, error: ingError } = await supabase
      .from('ingredients')
      .select('id, name')
      .ilike('name', '%sauce tomate%')
      .single()

    if (ingError || !ingredient) {
      console.error('   ❌ Ingrédient "sauce tomate" non trouvé')
      console.error('   Erreur:', ingError?.message)
    } else {
      console.log(`   ✅ Ingrédient trouvé: [ID: ${ingredient.id}] "${ingredient.name}"\n`)

      // 2. Chercher les recettes liées à cet ingrédient
      console.log('2️⃣  Recherche des recettes liées à "sauce tomate"...')
      const { data: recipes, error: recipesError } = await supabase
        .from('recipe_ingredients')
        .select(`
          recipe_id,
          recipes!inner(id, title)
        `)
        .eq('ingredient_id', ingredient.id)

      if (recipesError) {
        console.error('   ❌ Erreur:', recipesError.message)
      } else if (recipes && recipes.length > 0) {
        console.log(`   ✅ ${recipes.length} recette(s) trouvée(s):`)
        recipes.forEach((rel: any) => {
          const recipe = rel.recipes
          console.log(`      - [ID: ${recipe.id}] "${recipe.title}"`)
        })
      } else {
        console.log('   ⚠️  Aucune recette trouvée pour "sauce tomate"')
      }
    }
    console.log('')

    // 3. Chercher la recette "bolognaise"
    console.log('3️⃣  Recherche de la recette "bolognaise"...')
    const { data: bolognaise, error: bolognaiseError } = await supabase
      .from('recipes')
      .select('id, title')
      .ilike('title', '%bolognaise%')
      .limit(5)

    if (bolognaiseError) {
      console.error('   ❌ Erreur:', bolognaiseError.message)
    } else if (bolognaise && bolognaise.length > 0) {
      console.log(`   ✅ ${bolognaise.length} recette(s) "bolognaise" trouvée(s):`)
      for (const recipe of bolognaise) {
        console.log(`      - [ID: ${recipe.id}] "${recipe.title}"`)

        // Chercher les ingrédients de cette recette
        const { data: ingredients, error: ingError2 } = await supabase
          .from('recipe_ingredients')
          .select(`
            ingredient_id,
            ingredients!inner(id, name)
          `)
          .eq('recipe_id', recipe.id)

        if (!ingError2 && ingredients) {
          console.log(`         Ingrédients (${ingredients.length}):`)
          ingredients.forEach((rel: any) => {
            const ing = rel.ingredients
            console.log(`            - [ID: ${ing.id}] "${ing.name}"`)
          })
        }
      }
    } else {
      console.log('   ⚠️  Aucune recette "bolognaise" trouvée')
    }
    console.log('')

    // 4. Vérifier les ingrédients sans recettes
    console.log('4️⃣  Recherche des ingrédients sans recettes...')
    const { data: allIngredients, error: allIngError } = await supabase
      .from('ingredients')
      .select('id, name')

    if (allIngError) {
      console.error('   ❌ Erreur:', allIngError.message)
    } else if (allIngredients) {
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
    console.log('')

    // 5. Recommandations
    console.log('💡 Recommandations:')
    console.log('   📝 Pour lier "sauce tomate" à "bolognaise", exécutez dans Supabase:')
    console.log('      -- Trouver l\'ID de la recette bolognaise')
    console.log('      -- Trouver l\'ID de l\'ingrédient sauce tomate')
    console.log('      -- Insérer dans recipe_ingredients:')
    console.log('         INSERT INTO recipe_ingredients (recipe_id, ingredient_id)')
    console.log('         VALUES (ID_RECETTE, ID_INGREDIENT);')

  } catch (error) {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  }
}

// Exécution
checkRecipeIngredients()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('Erreur fatale:', error)
    process.exit(1)
  })

