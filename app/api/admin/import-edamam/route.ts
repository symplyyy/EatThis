import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { normalizeIngredientName } from '@/lib/utils'
import { getRecipeImageUrl } from '@/lib/recipeImages'

export const dynamic = 'force-dynamic'

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

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'autorisation
    const authHeader = request.headers.get('authorization')
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    if (token !== serviceRoleKey) {
      return NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 403 }
      )
    }

    const body = await request.json()
    const { query = 'chicken', maxRecipes = 50 } = body

    const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID
    const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY

    if (!EDAMAM_APP_ID || !EDAMAM_APP_KEY) {
      return NextResponse.json(
        { error: 'Edamam API credentials not configured' },
        { status: 500 }
      )
    }

    const imported: number[] = []
    let from = 0
    const batchSize = 100

    while (imported.length < maxRecipes) {
      try {
        const url = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(query)}&app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&from=${from}&to=${Math.min(batchSize, from + batchSize)}`
        
        const response = await fetch(url)
        if (!response.ok) {
          console.error(`Edamam API error: ${response.status}`)
          break
        }

        const data = await response.json()
        const hits: EdamamRecipe[] = data.hits || []

        if (hits.length === 0) break

        for (const hit of hits) {
          if (imported.length >= maxRecipes) break

          try {
            // Extraire les ingrédients
            const ingredientNames = new Set<string>()
            hit.recipe.ingredients.forEach(ing => {
              const normalized = normalizeIngredientName(ing.food || ing.text)
              if (normalized.length > 1) {
                ingredientNames.add(normalized)
              }
            })

            // Créer/récupérer les ingrédients
            const ingredientIds: number[] = []
            for (const ingName of Array.from(ingredientNames)) {
              let { data: existing } = await supabaseServer
                .from('ingredients')
                .select('id')
                .eq('name', ingName)
                .single()

              if (!existing) {
                const { data: newIng, error } = await supabaseServer
                  .from('ingredients')
                  .insert({ name: ingName })
                  .select()
                  .single()

                if (error) continue
                existing = newIng
              }

              if (existing?.id) {
                ingredientIds.push(existing.id)
              }
            }

            // Déterminer la difficulté
            let difficulty: 1 | 2 | 3 = 1
            if (ingredientNames.size > 8 || (hit.recipe.totalTime && hit.recipe.totalTime > 60)) {
              difficulty = 3
            } else if (ingredientNames.size > 5 || (hit.recipe.totalTime && hit.recipe.totalTime > 30)) {
              difficulty = 2
            }

            // Extraire les étapes
            const steps = hit.recipe.ingredientLines.length > 0
              ? hit.recipe.ingredientLines.map((line, idx) => `${idx + 1}. ${line}`)
              : ['Voir les instructions sur le site source']

            // Générer l'image
            const imageUrl = getRecipeImageUrl(hit.recipe.label) || hit.recipe.image || null

            // Insérer la recette
            const { data: recipeData, error: recipeError } = await supabaseServer
              .from('recipes')
              .insert({
                title: hit.recipe.label,
                description: `Recette importée depuis Edamam (${hit.recipe.yield} portions)`,
                steps: steps,
                time_min: hit.recipe.totalTime || null,
                difficulty: difficulty,
                image_url: imageUrl
              })
              .select()
              .single()

            if (recipeError) {
              console.error(`Erreur recette ${hit.recipe.label}:`, recipeError)
              continue
            }

            // Lier les ingrédients
            for (const ingId of ingredientIds) {
              await supabaseServer
                .from('recipe_ingredients')
                .insert({
                  recipe_id: recipeData.id,
                  ingredient_id: ingId
                })
            }

            imported.push(recipeData.id)
          } catch (error) {
            console.error('Erreur import recette:', error)
            continue
          }
        }

        if (hits.length < batchSize) break
        from += batchSize
      } catch (error) {
        console.error('Erreur batch:', error)
        break
      }
    }

    return NextResponse.json({
      success: true,
      imported: imported.length,
      recipeIds: imported
    })
  } catch (error) {
    console.error('Import API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

