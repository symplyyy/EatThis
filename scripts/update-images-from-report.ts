/**
 * Script pour mettre à jour les images des recettes basé sur le rapport d'analyse
 * Utilise les images suggérées du rapport recipe-images-report.json
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as fs from 'fs'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateImagesFromReport() {
  console.log('📖 Lecture du rapport...\n')

  // Lire le rapport JSON
  let report
  try {
    const reportContent = fs.readFileSync('recipe-images-report.json', 'utf-8')
    report = JSON.parse(reportContent)
  } catch (error) {
    console.error('❌ Erreur lors de la lecture du rapport:', error)
    console.error('Assurez-vous que recipe-images-report.json existe')
    return
  }

  const recipesToUpdate = report.recipes || []
  
  if (recipesToUpdate.length === 0) {
    console.log('✅ Aucune recette à mettre à jour')
    return
  }

  console.log(`📊 ${recipesToUpdate.length} recette(s) à mettre à jour\n`)

  const updatedRecipes = []
  const failedRecipes = []

  // Mettre à jour chaque recette
  for (const recipe of recipesToUpdate) {
    try {
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ image_url: recipe.suggestedImage })
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
        oldImage: recipe.currentImage,
        newImage: recipe.suggestedImage
      })
    } catch (error) {
      console.error(`❌ Erreur pour "${recipe.title}" (ID: ${recipe.id}):`, error)
      failedRecipes.push({
        id: recipe.id,
        title: recipe.title,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  console.log('\n📈 Résumé:')
  console.log(`  ✅ Mises à jour réussies: ${updatedRecipes.length}`)
  console.log(`  ❌ Échecs: ${failedRecipes.length}`)
  console.log(`  📊 Total: ${recipesToUpdate.length}`)

  if (failedRecipes.length > 0) {
    console.log('\n⚠️  Recettes en échec:')
    failedRecipes.forEach(recipe => {
      console.log(`  - "${recipe.title}" (ID: ${recipe.id}): ${recipe.error}`)
    })
  }

  // Générer un rapport de mise à jour
  const updateReport = {
    updatedAt: new Date().toISOString(),
    total: recipesToUpdate.length,
    updated: updatedRecipes.length,
    failed: failedRecipes.length,
    updatedRecipes,
    failedRecipes
  }

  fs.writeFileSync('recipe-images-update-report.json', JSON.stringify(updateReport, null, 2))
  console.log('\n💾 Rapport de mise à jour généré dans recipe-images-update-report.json')
}

updateImagesFromReport().catch(console.error)

