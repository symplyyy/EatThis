/**
 * Script de diagnostic pour identifier pourquoi la base de données se remplit
 * 
 * Ce script vérifie :
 * - L'état actuel de la base de données
 * - Les triggers automatiques
 * - Les fonctions automatiques
 * - Les processus en cours
 * 
 * Usage:
 *   npx ts-node scripts/diagnose-database.ts
 * 
 * Variables d'environnement requises:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
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

async function diagnoseDatabase() {
  console.log('🔍 Diagnostic de la base de données...')
  console.log('')

  try {
    // 1. Vérifier l'état actuel de la base de données
    console.log('1️⃣  État actuel de la base de données:')
    console.log('')

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
    console.log(`   📊 Relations: ${relationsCount || 0}`)
    console.log('')

    // 2. Vérifier les recettes récentes (dernières 10)
    if (recipesCount && recipesCount > 0) {
      console.log('2️⃣  Dernières recettes ajoutées:')
      const { data: recentRecipes, error: recentError } = await supabase
        .from('recipes')
        .select('id, title, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      if (!recentError && recentRecipes) {
        recentRecipes.forEach((recipe, index) => {
          const date = recipe.created_at ? new Date(recipe.created_at).toLocaleString('fr-FR') : 'Date inconnue'
          console.log(`   ${index + 1}. [ID: ${recipe.id}] ${recipe.title} - ${date}`)
        })
      }
      console.log('')
    }

    // 3. Vérifier les ingrédients récents (derniers 10)
    if (ingredientsCount && ingredientsCount > 0) {
      console.log('3️⃣  Derniers ingrédients ajoutés:')
      const { data: recentIngredients, error: recentError } = await supabase
        .from('ingredients')
        .select('id, name, created_at')
        .order('created_at', { ascending: false })
        .limit(10)

      if (!recentError && recentIngredients) {
        recentIngredients.forEach((ingredient, index) => {
          const date = ingredient.created_at ? new Date(ingredient.created_at).toLocaleString('fr-FR') : 'Date inconnue'
          console.log(`   ${index + 1}. [ID: ${ingredient.id}] ${ingredient.name} - ${date}`)
        })
      }
      console.log('')
    }

    // 4. Vérifier s'il y a des triggers dans Supabase
    console.log('4️⃣  Vérification des triggers automatiques...')
    console.log('   ⚠️  Note: Les triggers doivent être vérifiés manuellement dans Supabase Dashboard')
    console.log('   📍 Allez dans: Database > Triggers')
    console.log('   📍 Vérifiez s\'il y a des triggers qui ajoutent automatiquement des données')
    console.log('')

    // 5. Vérifier s'il y a des fonctions automatiques
    console.log('5️⃣  Vérification des fonctions automatiques...')
    console.log('   ⚠️  Note: Les fonctions automatiques doivent être vérifiées manuellement dans Supabase Dashboard')
    console.log('   📍 Allez dans: Database > Functions')
    console.log('   📍 Vérifiez s\'il y a des fonctions qui s\'exécutent automatiquement')
    console.log('')

    // 6. Vérifier s'il y a des webhooks ou cron jobs
    console.log('6️⃣  Vérification des webhooks et cron jobs...')
    console.log('   ⚠️  Note: Les webhooks et cron jobs doivent être vérifiés manuellement dans Supabase Dashboard')
    console.log('   📍 Allez dans: Database > Webhooks')
    console.log('   📍 Allez dans: Database > Cron Jobs (si disponible)')
    console.log('   📍 Vérifiez s\'il y a des processus automatiques configurés')
    console.log('')

    // 7. Recommandations
    console.log('💡 Recommandations:')
    console.log('')

    if (recipesCount && recipesCount > 0) {
      console.log('   ✅ Pour réinitialiser la base de données:')
      console.log('      npx ts-node scripts/reset-database.ts')
      console.log('')
    }

    console.log('   ✅ Pour empêcher l\'ajout automatique de données:')
    console.log('      1. Vérifiez les triggers dans Supabase Dashboard')
    console.log('      2. Vérifiez les fonctions automatiques')
    console.log('      3. Vérifiez les webhooks et cron jobs')
    console.log('      4. Vérifiez si des scripts tournent en arrière-plan')
    console.log('      5. Vérifiez si l\'API /api/admin/seed est appelée automatiquement')
    console.log('')

    console.log('   ✅ Pour vérifier manuellement dans Supabase:')
    console.log('      1. Allez sur https://app.supabase.com')
    console.log('      2. Sélectionnez votre projet')
    console.log('      3. Allez dans Database > Triggers')
    console.log('      4. Allez dans Database > Functions')
    console.log('      5. Allez dans Database > Webhooks')
    console.log('')

  } catch (error) {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  }
}

// Exécution
diagnoseDatabase()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('Erreur fatale:', error)
    process.exit(1)
  })

