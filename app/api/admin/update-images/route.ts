import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { getRecipeImageUrl } from '@/lib/recipeImages'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'autorisation via service role key
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

    // Récupérer toutes les recettes sans image
    const { data: recipesWithoutImages, error: fetchError } = await supabaseServer
      .from('recipes')
      .select('id, title, image_url')
      .or('image_url.is.null,image_url.eq.')

    if (fetchError) {
      console.error('Error fetching recipes:', fetchError)
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      )
    }

    if (!recipesWithoutImages || recipesWithoutImages.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Toutes les recettes ont déjà une image',
        updated: 0
      })
    }

    const updatedRecipes = []

    // Mettre à jour chaque recette avec une image
    for (const recipe of recipesWithoutImages) {
      const imageUrl = getRecipeImageUrl(recipe.title)
      
      if (imageUrl) {
        const { error: updateError } = await supabaseServer
          .from('recipes')
          .update({ image_url: imageUrl })
          .eq('id', recipe.id)

        if (updateError) {
          console.error(`Error updating recipe ${recipe.id}:`, updateError)
          continue
        }

        updatedRecipes.push({
          id: recipe.id,
          title: recipe.title,
          imageUrl
        })
      }
    }

    return NextResponse.json({
      success: true,
      updated: updatedRecipes.length,
      total: recipesWithoutImages.length,
      recipes: updatedRecipes
    })
  } catch (error) {
    console.error('Update images API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

