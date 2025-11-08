/**
 * Script pour importer des recettes depuis l'API Edamam
 * 
 * Usage:
 *   npm install dotenv
 *   ts-node scripts/import-edamam.ts
 * 
 * Variables d'environnement requises:
 *   EDAMAM_APP_ID=...
 *   EDAMAM_APP_KEY=...
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { config } from 'dotenv'

// Charger les variables d'environnement depuis .env.local
config({ path: '.env.local' })

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
  console.error('❌ Variables EDAMAM_APP_ID et EDAMAM_APP_KEY requises')
  process.exit(1)
}

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

interface EdamamRecipe {
  recipe: {
    label: string
    image: string
    url: string
    yield: number
    totalTime: number
    ingredientLines: string[]
    ingredients: Array<{
      text: string
      food: string
    }>
  }
}

// Normaliser les noms d'ingrédients
function normalizeIngredientName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/Œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/Æ/g, 'ae')
}

// Extraire les étapes depuis les instructions (simplifié)
function extractSteps(instructions: string): string[] {
  if (!instructions) return []
  
  // Séparer par points, sauts de ligne, ou numéros
  return instructions
    .split(/\n|\.\s+|(?=\d+\.)/)
    .map(step => step.trim())
    .filter(step => step.length > 10) // Filtrer les étapes trop courtes
    .slice(0, 20) // Limiter à 20 étapes max
}

// Importer une recette depuis Edamam
async function importRecipe(edamamRecipe: EdamamRecipe): Promise<number | null> {
  try {
    const recipe = edamamRecipe.recipe
    
    // Extraire les ingrédients uniques
    const ingredientNames = new Set<string>()
    recipe.ingredients.forEach(ing => {
      const normalized = normalizeIngredientName(ing.food || ing.text)
      if (normalized.length > 1) {
        ingredientNames.add(normalized)
      }
    })
    
    // Créer ou récupérer les ingrédients
    const ingredientIds: number[] = []
    for (const ingName of Array.from(ingredientNames)) {
      // Vérifier si l'ingrédient existe
      let { data: existing } = await supabase
        .from('ingredients')
        .select('id')
        .eq('name', ingName)
        .single()
      
      if (!existing) {
        // Créer l'ingrédient
        const { data: newIng, error } = await supabase
          .from('ingredients')
          .insert({ name: ingName })
          .select()
          .single()
        
        if (error) {
          console.error(`Erreur création ingrédient ${ingName}:`, error)
          continue
        }
        existing = newIng
      }
      
      if (existing?.id) {
        ingredientIds.push(existing.id)
      }
    }
    
    // Déterminer la difficulté (basé sur le nombre d'ingrédients et le temps)
    let difficulty: 1 | 2 | 3 = 1
    if (ingredientNames.size > 8 || (recipe.totalTime && recipe.totalTime > 60)) {
      difficulty = 3
    } else if (ingredientNames.size > 5 || (recipe.totalTime && recipe.totalTime > 30)) {
      difficulty = 2
    }
    
    // Extraire les étapes (simplifié - utiliser les instructions comme une seule étape)
    const steps = recipe.ingredientLines.length > 0 
      ? recipe.ingredientLines.map((line, idx) => `${idx + 1}. ${line}`)
      : ['Voir les instructions sur le site source']
    
    // Insérer la recette
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        title: recipe.label,
        description: `Recette importée depuis Edamam (${recipe.yield} portions)`,
        steps: steps,
        time_min: recipe.totalTime || null,
        difficulty: difficulty,
        image_url: recipe.image || null
      })
      .select()
      .single()
    
    if (recipeError) {
      console.error(`Erreur insertion recette ${recipe.label}:`, recipeError)
      return null
    }
    
    // Lier les ingrédients
    for (const ingId of ingredientIds) {
      await supabase
        .from('recipe_ingredients')
        .insert({
          recipe_id: recipeData.id,
          ingredient_id: ingId
        })
    }
    
    return recipeData.id
  } catch (error) {
    console.error('Erreur import recette:', error)
    return null
  }
}

// Fonction principale
async function importFromEdamam(query: string, maxRecipes: number = 100) {
  console.log(`🌱 Import de ${maxRecipes} recettes pour "${query}"...`)
  
  const imported: number[] = []
  let from = 0
  const to = 100 // Edamam limite à 100 par requête
  
  while (imported.length < maxRecipes) {
    try {
      const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(query)}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&from=${from}&to=${Math.min(to, from + 100)}`
      
      const response = await fetch(url)
      if (!response.ok) {
        console.error(`Erreur API Edamam: ${response.status} ${response.statusText}`)
        break
      }
      
      const data = await response.json()
      const hits = data.hits || []
      
      if (hits.length === 0) {
        console.log('Aucune recette trouvée')
        break
      }
      
      console.log(`📥 Récupération de ${hits.length} recettes (${from}-${from + hits.length})...`)
      
      for (const hit of hits) {
        if (imported.length >= maxRecipes) break
        
        const recipeId = await importRecipe(hit)
        if (recipeId) {
          imported.push(recipeId)
          console.log(`✅ Importé: ${hit.recipe.label} (ID: ${recipeId})`)
        }
        
        // Pause pour éviter de surcharger l'API
        await new Promise(resolve => setTimeout(resolve, 200))
      }
      
      if (hits.length < 100) break // Plus de résultats
      
      from += 100
    } catch (error) {
      console.error('Erreur lors de l\'import:', error)
      break
    }
  }
  
  console.log(`\n✅ Import terminé: ${imported.length} recettes importées`)
  return imported
}

// Exécution
const query = process.argv[2] || 'chicken'
const maxRecipes = parseInt(process.argv[3] || '50', 10)

importFromEdamam(query, maxRecipes)
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Erreur fatale:', error)
    process.exit(1)
  })

