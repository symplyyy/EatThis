import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import type { RecipeFull } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 60

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id, 10)

    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid recipe ID' },
        { status: 400 }
      )
    }

    // Récupérer la recette via la vue v_recipe_with_ingredients
    const { data, error } = await supabaseServer
      .from('v_recipe_with_ingredients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Recipe not found' },
          { status: 404 }
        )
      }
      console.error('Supabase query error:', error)
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      )
    }

    // Transformer les données pour correspondre au type RecipeFull
    const recipe: RecipeFull = {
      id: data.id,
      title: data.title,
      description: data.description,
      steps: data.steps || [],
      timeMin: data.time_min,
      difficulty: data.difficulty,
      imageUrl: data.image_url,
      ingredients: data.ingredients || []
    }

    // Trier les ingrédients de manière unique et triée
    recipe.ingredients = [...new Set(recipe.ingredients)].sort()

    const headers = new Headers()
    headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=300')

    return NextResponse.json(recipe, { headers })
  } catch (error) {
    console.error('Recipe API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

