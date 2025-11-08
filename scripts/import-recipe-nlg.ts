/**
 * Script pour importer des recettes depuis le dataset RecipeNLG
 * 
 * Le dataset doit être téléchargé depuis:
 * https://github.com/Glorf/RecipeNLG
 * 
 * Usage:
 *   npm install dotenv
 *   ts-node scripts/import-recipe-nlg.ts path/to/recipes.json
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
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

interface RecipeNLG {
  title: string
  ingredients: string[]
  directions: string[]
  link?: string
  source?: string
  NER?: string[]
}

function normalizeIngredientName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/Œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/Æ/g, 'ae')
}

async function importRecipeNLG(recipe: RecipeNLG, index: number): Promise<number | null> {
  try {
    // Normaliser les ingrédients
    const normalizedIngredients = recipe.ingredients
      .map(normalizeIngredientName)
      .filter(name => name.length > 1)
    
    if (normalizedIngredients.length === 0) {
      return null
    }
    
    // Créer ou récupérer les ingrédients
    const ingredientIds: number[] = []
    for (const ingName of normalizedIngredients) {
      let { data: existing } = await supabase
        .from('ingredients')
        .select('id')
        .eq('name', ingName)
        .single()
      
      if (!existing) {
        const { data: newIng, error } = await supabase
          .from('ingredients')
          .insert({ name: ingName })
          .select()
          .single()
        
        if (error) {
          console.error(`Erreur ingrédient ${ingName}:`, error)
          continue
        }
        existing = newIng
      }
      
      if (existing?.id) {
        ingredientIds.push(existing.id)
      }
    }
    
    // Déterminer la difficulté
    let difficulty: 1 | 2 | 3 = 1
    if (normalizedIngredients.length > 10 || recipe.directions.length > 8) {
      difficulty = 3
    } else if (normalizedIngredients.length > 6 || recipe.directions.length > 5) {
      difficulty = 2
    }
    
    // Insérer la recette
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        title: recipe.title,
        description: recipe.source ? `Source: ${recipe.source}` : null,
        steps: recipe.directions,
        time_min: null, // Le dataset ne contient pas le temps
        difficulty: difficulty,
        image_url: null
      })
      .select()
      .single()
    
    if (recipeError) {
      console.error(`Erreur recette ${recipe.title}:`, recipeError)
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
    
    if (index % 100 === 0) {
      console.log(`✅ Importé ${index} recettes...`)
    }
    
    return recipeData.id
  } catch (error) {
    console.error('Erreur import:', error)
    return null
  }
}

async function importFromFile(filePath: string, maxRecipes?: number) {
  console.log(`📖 Lecture du fichier ${filePath}...`)
  
  const fileContent = readFileSync(filePath, 'utf-8')
  const recipes: RecipeNLG[] = JSON.parse(fileContent)
  
  const limit = maxRecipes || recipes.length
  const recipesToImport = recipes.slice(0, limit)
  
  console.log(`🌱 Import de ${recipesToImport.length} recettes...`)
  
  const imported: number[] = []
  
  for (let i = 0; i < recipesToImport.length; i++) {
    const recipeId = await importRecipeNLG(recipesToImport[i], i + 1)
    if (recipeId) {
      imported.push(recipeId)
    }
    
    // Pause pour éviter de surcharger Supabase
    if (i % 50 === 0 && i > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
  }
  
  console.log(`\n✅ Import terminé: ${imported.length}/${recipesToImport.length} recettes importées`)
  return imported
}

// Exécution
const filePath = process.argv[2]
const maxRecipes = process.argv[3] ? parseInt(process.argv[3], 10) : undefined

if (!filePath) {
  console.error('Usage: ts-node scripts/import-recipe-nlg.ts <path-to-recipes.json> [max-recipes]')
  process.exit(1)
}

importFromFile(filePath, maxRecipes)
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Erreur fatale:', error)
    process.exit(1)
  })

