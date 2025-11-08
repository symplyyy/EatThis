/**
 * Script de diagnostic pour la recherche de recettes
 * 
 * Ce script vérifie :
 * - La connexion à Supabase
 * - L'existence des fonctions RPC
 * - Les ingrédients dans la base
 * - Le matching des recettes
 * 
 * Usage:
 *   npx ts-node scripts/diagnose-search.ts
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

async function diagnoseSearch() {
  console.log('🔍 Diagnostic de la recherche de recettes...\n')

  try {
    // 1. Vérifier la connexion
    console.log('1️⃣  Test de connexion à Supabase...')
    const { data: testData, error: testError } = await supabase
      .from('recipes')
      .select('id')
      .limit(1)

    if (testError) {
      console.error('   ❌ Erreur de connexion:', testError.message)
      return
    }
    console.log('   ✅ Connexion OK\n')

    // 2. Compter les recettes et ingrédients
    console.log('2️⃣  Statistiques de la base de données...')
    const { count: recipesCount } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true })

    const { count: ingredientsCount } = await supabase
      .from('ingredients')
      .select('*', { count: 'exact', head: true })

    const { count: relationsCount } = await supabase
      .from('recipe_ingredients')
      .select('*', { count: 'exact', head: true })

    console.log(`   📊 Recettes: ${recipesCount || 0}`)
    console.log(`   📊 Ingrédients: ${ingredientsCount || 0}`)
    console.log(`   📊 Relations: ${relationsCount || 0}\n`)

    // 3. Vérifier quelques ingrédients
    console.log('3️⃣  Exemples d\'ingrédients dans la base...')
    const { data: sampleIngredients, error: ingError } = await supabase
      .from('ingredients')
      .select('id, name')
      .limit(10)

    if (ingError) {
      console.error('   ❌ Erreur:', ingError.message)
    } else if (sampleIngredients) {
      sampleIngredients.forEach((ing, index) => {
        console.log(`   ${index + 1}. [ID: ${ing.id}] "${ing.name}"`)
      })
    }
    console.log('')

    // 4. Tester la fonction RPC autocomplete
    console.log('4️⃣  Test de la fonction RPC autocomplete...')
    const { data: autocompleteData, error: autocompleteError } = await supabase.rpc('rpc_autocomplete_ingredients', {
      p_query: 'oeufs',
      p_limit: 5
    })

    if (autocompleteError) {
      console.error('   ❌ Erreur RPC autocomplete:', autocompleteError.message)
      console.error('   Code:', autocompleteError.code)
      console.error('   Hint:', autocompleteError.hint)
      console.error('   Details:', autocompleteError.details)
    } else {
      console.log('   ✅ Fonction RPC autocomplete OK')
      if (autocompleteData && Array.isArray(autocompleteData)) {
        console.log(`   📊 Résultats: ${autocompleteData.length}`)
        autocompleteData.forEach((item, index) => {
          console.log(`      ${index + 1}. "${item.name}"`)
        })
      }
    }
    console.log('')

    // 5. Tester la fonction RPC match_recipes_by_names
    console.log('5️⃣  Test de la fonction RPC match_recipes_by_names...')
    const testIngredients = ['oeufs', 'fromage']
    const { data: matchData, error: matchError } = await supabase.rpc('rpc_match_recipes_by_names', {
      p_names: testIngredients,
      p_limit: 5
    })

    if (matchError) {
      console.error('   ❌ Erreur RPC match:', matchError.message)
      console.error('   Code:', matchError.code)
      console.error('   Hint:', matchError.hint)
      console.error('   Details:', matchError.details)
    } else {
      console.log('   ✅ Fonction RPC match OK')
      if (matchData && Array.isArray(matchData)) {
        console.log(`   📊 Résultats: ${matchData.length} recettes trouvées`)
        matchData.forEach((item, index) => {
          console.log(`      ${index + 1}. "${item.title}" (ID: ${item.recipe_id}, Score: ${item.score}, Have: ${item.have_count}, Missing: ${item.missing_count})`)
        })
      } else {
        console.log('   ⚠️  Aucun résultat trouvé')
      }
    }
    console.log('')

    // 6. Vérifier la fonction normalize_name dans Supabase
    console.log('6️⃣  Test de la fonction normalize_name dans Supabase...')
    const { data: normalizeData, error: normalizeError } = await supabase.rpc('normalize_name', {
      name: 'œufs'
    })

    if (normalizeError) {
      console.error('   ❌ Erreur normalize_name:', normalizeError.message)
      console.error('   ⚠️  La fonction normalize_name n\'existe peut-être pas')
    } else {
      console.log(`   ✅ normalize_name('œufs') = "${normalizeData}"`)
      if (normalizeData !== 'oeufs') {
        console.error('   ⚠️  ATTENTION: La fonction normalize_name ne convertit pas œ en oe !')
        console.error('   ⚠️  Il faut mettre à jour la fonction dans Supabase')
      }
    }
    console.log('')

    // 7. Vérifier les relations recipe_ingredients
    console.log('7️⃣  Exemples de relations recipe_ingredients...')
    const { data: sampleRelations, error: relError } = await supabase
      .from('recipe_ingredients')
      .select(`
        recipe_id,
        ingredient_id,
        recipes!inner(title),
        ingredients!inner(name)
      `)
      .limit(5)

    if (relError) {
      console.error('   ❌ Erreur:', relError.message)
    } else if (sampleRelations) {
      sampleRelations.forEach((rel, index) => {
        const recipe = rel.recipes as any
        const ingredient = rel.ingredients as any
        console.log(`   ${index + 1}. Recette "${recipe.title}" (ID: ${rel.recipe_id}) <-> Ingrédient "${ingredient.name}" (ID: ${rel.ingredient_id})`)
      })
    }
    console.log('')

    // 8. Recommandations
    console.log('💡 Recommandations:')
    console.log('')
    
    if (recipesCount === 0) {
      console.log('   ⚠️  Aucune recette dans la base. Importez des recettes d\'abord.')
    }
    
    if (ingredientsCount === 0) {
      console.log('   ⚠️  Aucun ingrédient dans la base. Importez des recettes d\'abord.')
    }
    
    if (matchError) {
      console.log('   ⚠️  La fonction RPC rpc_match_recipes_by_names ne fonctionne pas.')
      console.log('   📝 Vérifiez qu\'elle existe dans Supabase SQL Editor.')
    }
    
    if (autocompleteError) {
      console.log('   ⚠️  La fonction RPC rpc_autocomplete_ingredients ne fonctionne pas.')
      console.log('   📝 Vérifiez qu\'elle existe dans Supabase SQL Editor.')
    }

    console.log('')

  } catch (error) {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  }
}

// Exécution
diagnoseSearch()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('Erreur fatale:', error)
    process.exit(1)
  })

