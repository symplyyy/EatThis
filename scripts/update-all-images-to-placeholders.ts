/**
 * Script pour mettre à jour toutes les images des recettes avec des placeholders
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Fonction pour générer un placeholder
function getRecipeImageUrl(title: string): string {
  const encodedTitle = encodeURIComponent(title.substring(0, 20))
  return `https://via.placeholder.com/800x600/CCCCCC/666666?text=${encodedTitle}`
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateAllImages() {
  console.log('🔄 Mise à jour de toutes les images avec des placeholders...\n')

  // Récupérer toutes les recettes
  const { data: allRecipes, error: fetchError } = await supabase
    .from('recipes')
    .select('id, title, image_url')

  if (fetchError) {
    console.error('❌ Erreur lors de la récupération des recettes:', fetchError)
    return
  }

  if (!allRecipes || allRecipes.length === 0) {
    console.log('✅ Aucune recette trouvée')
    return
  }

  console.log(`📊 ${allRecipes.length} recette(s) à traiter\n`)

  const updatedRecipes = []
  const failedRecipes = []

  // Mettre à jour chaque recette avec un placeholder
  for (const recipe of allRecipes) {
    const placeholderUrl = getRecipeImageUrl(recipe.title)

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ image_url: placeholderUrl })
      .eq('id', recipe.id)

    if (updateError) {
      console.error(`❌ Erreur pour "${recipe.title}" (ID: ${recipe.id}):`, updateError.message)
      failedRecipes.push({
        id: recipe.id,
        title: recipe.title,
        error: updateError.message
      })
      continue
    }

    console.log(`✅ "${recipe.title}" (ID: ${recipe.id})`)
    updatedRecipes.push({
      id: recipe.id,
      title: recipe.title,
      oldImage: recipe.image_url,
      newImage: placeholderUrl
    })
  }

  console.log('\n📈 Résumé:')
  console.log(`  ✅ Mises à jour réussies: ${updatedRecipes.length}`)
  console.log(`  ❌ Échecs: ${failedRecipes.length}`)
  console.log(`  📊 Total: ${allRecipes.length}`)

  if (failedRecipes.length > 0) {
    console.log('\n⚠️  Recettes en échec:')
    failedRecipes.forEach(recipe => {
      console.log(`  - "${recipe.title}" (ID: ${recipe.id}): ${recipe.error}`)
    })
  }
}

updateAllImages().catch(console.error)

