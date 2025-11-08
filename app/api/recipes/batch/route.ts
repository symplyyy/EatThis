import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import type { RecipeCard } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ids } = body

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ recipes: [] })
    }

    // Récupérer les recettes par IDs
    const { data, error } = await supabaseServer
      .from('recipes')
      .select('id, title, time_min, difficulty, image_url')
      .in('id', ids)

    if (error) {
      console.error('Error fetching recipes:', error)
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ recipes: [] })
    }

    // Pour chaque recette, récupérer les ingrédients et calculer have/missing
    const recipes: RecipeCard[] = await Promise.all(
      data.map(async (recipe) => {
        // Récupérer les ingrédients de la recette
        const { data: ingredientsData } = await supabaseServer
          .from('recipe_ingredients')
          .select('ingredient_id, ingredients(name)')
          .eq('recipe_id', recipe.id)

        const ingredients = ingredientsData?.map((item: any) => item.ingredients?.name).filter(Boolean) || []

        // Pour cette page, on ne peut pas calculer have/missing sans les ingrédients de l'utilisateur
        // On retourne simplement les recettes avec 0 have et 0 missing
        return {
          id: recipe.id,
          title: recipe.title,
          timeMin: recipe.time_min,
          difficulty: recipe.difficulty as 1 | 2 | 3 | null,
          have: 0,
          missing: 0,
          score: 0,
          imageUrl: recipe.image_url,
          missingIngredients: []
        }
      })
    )

    // Préserver l'ordre des IDs
    const orderedRecipes = ids
      .map((id: number) => recipes.find(r => r.id === id))
      .filter(Boolean) as RecipeCard[]

    return NextResponse.json({ recipes: orderedRecipes })
  } catch (error) {
    console.error('Batch recipes API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

