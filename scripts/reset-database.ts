/**
 * Script pour réinitialiser la base de données
 * 
 * Ce script supprime toutes les données des tables :
 * - recipe_ingredients (relations)
 * - recipes (recettes)
 * - ingredients (ingrédients)
 * 
 * ⚠️ ATTENTION : Cette opération est irréversible !
 * 
 * Usage:
 *   npx ts-node scripts/reset-database.ts
 * 
 * Variables d'environnement requises:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import * as readline from 'readline'

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

// Fonction pour demander confirmation à l'utilisateur
function askConfirmation(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.toLowerCase() === 'oui' || answer.toLowerCase() === 'o' || answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y')
    })
  })
}

// Fonction principale pour réinitialiser la base de données
async function resetDatabase() {
  console.log('⚠️  ATTENTION : Cette opération va supprimer TOUTES les données !')
  console.log('   - Toutes les recettes')
  console.log('   - Tous les ingrédients')
  console.log('   - Toutes les relations recipe_ingredients')
  console.log('')
  console.log('La structure des tables sera conservée.')
  console.log('')

  // Demander confirmation
  const confirmed = await askConfirmation('Êtes-vous sûr de vouloir continuer ? (oui/non): ')

  if (!confirmed) {
    console.log('❌ Opération annulée')
    process.exit(0)
  }

  console.log('')
  console.log('🔄 Réinitialisation de la base de données...')
  console.log('')

  try {
    // Méthode 1: Supprimer toutes les relations d'abord (pour éviter les contraintes de clé étrangère)
    console.log('1️⃣  Suppression des relations recipe_ingredients...')
    
    // Récupérer toutes les relations et les supprimer une par une si nécessaire
    let deletedRelations = 0
    let hasMore = true
    
    while (hasMore) {
      const { data: relations, error: fetchError } = await supabase
        .from('recipe_ingredients')
        .select('recipe_id, ingredient_id')
        .limit(1000)
      
      if (fetchError) {
        console.error('   ❌ Erreur lors de la récupération:', fetchError.message)
        break
      }
      
      if (!relations || relations.length === 0) {
        hasMore = false
        break
      }
      
      // Supprimer par batch
      for (const rel of relations) {
        const { error: delError } = await supabase
          .from('recipe_ingredients')
          .delete()
          .eq('recipe_id', rel.recipe_id)
          .eq('ingredient_id', rel.ingredient_id)
        
        if (!delError) {
          deletedRelations++
        }
      }
      
      if (relations.length < 1000) {
        hasMore = false
      }
    }
    
    console.log(`   ✅ ${deletedRelations} relations supprimées`)

    // Méthode 2: Supprimer toutes les recettes
    console.log('2️⃣  Suppression des recettes...')
    
    let deletedRecipes = 0
    hasMore = true
    
    while (hasMore) {
      const { data: recipes, error: fetchError } = await supabase
        .from('recipes')
        .select('id')
        .limit(1000)
      
      if (fetchError) {
        console.error('   ❌ Erreur lors de la récupération:', fetchError.message)
        break
      }
      
      if (!recipes || recipes.length === 0) {
        hasMore = false
        break
      }
      
      // Supprimer par batch
      const ids = recipes.map(r => r.id)
      for (const id of ids) {
        const { error: delError } = await supabase
          .from('recipes')
          .delete()
          .eq('id', id)
        
        if (!delError) {
          deletedRecipes++
        }
      }
      
      if (recipes.length < 1000) {
        hasMore = false
      }
    }
    
    console.log(`   ✅ ${deletedRecipes} recettes supprimées`)

    // Méthode 3: Supprimer tous les ingrédients
    console.log('3️⃣  Suppression des ingrédients...')
    
    let deletedIngredients = 0
    hasMore = true
    
    while (hasMore) {
      const { data: ingredients, error: fetchError } = await supabase
        .from('ingredients')
        .select('id')
        .limit(1000)
      
      if (fetchError) {
        console.error('   ❌ Erreur lors de la récupération:', fetchError.message)
        break
      }
      
      if (!ingredients || ingredients.length === 0) {
        hasMore = false
        break
      }
      
      // Supprimer par batch
      const ids = ingredients.map(i => i.id)
      for (const id of ids) {
        const { error: delError } = await supabase
          .from('ingredients')
          .delete()
          .eq('id', id)
        
        if (!delError) {
          deletedIngredients++
        }
      }
      
      if (ingredients.length < 1000) {
        hasMore = false
      }
    }
    
    console.log(`   ✅ ${deletedIngredients} ingrédients supprimés`)

    // 4. Vérifier que tout est vide
    console.log('')
    console.log('🔍 Vérification...')

    const { count: recipesCount } = await supabase
      .from('recipes')
      .select('*', { count: 'exact', head: true })

    const { count: ingredientsCount } = await supabase
      .from('ingredients')
      .select('*', { count: 'exact', head: true })

    const { count: relationsCount } = await supabase
      .from('recipe_ingredients')
      .select('*', { count: 'exact', head: true })

    console.log(`   - Recettes: ${recipesCount || 0}`)
    console.log(`   - Ingrédients: ${ingredientsCount || 0}`)
    console.log(`   - Relations: ${relationsCount || 0}`)

    if (recipesCount === 0 && ingredientsCount === 0 && relationsCount === 0) {
      console.log('')
      console.log('✅ Base de données réinitialisée avec succès !')
      console.log('')
      console.log('Vous pouvez maintenant commencer à ajouter vos propres recettes.')
    } else {
      console.log('')
      console.log('⚠️  Certaines données restent dans la base. Vérifiez manuellement.')
    }

  } catch (error) {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  }
}

// Exécution
resetDatabase()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('Erreur fatale:', error)
    process.exit(1)
  })

