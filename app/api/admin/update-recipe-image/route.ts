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

    const body = await request.json()
    const { recipeId, imageUrl, useSuggestion = false } = body

    if (!recipeId) {
      return NextResponse.json(
        { error: 'recipeId is required' },
        { status: 400 }
      )
    }

    // Récupérer la recette
    const { data: recipe, error: fetchError } = await supabaseServer
      .from('recipes')
      .select('id, title, image_url')
      .eq('id', recipeId)
      .single()

    if (fetchError || !recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    let finalImageUrl = imageUrl

    // Si useSuggestion est true, utiliser la suggestion basée sur le titre
    if (useSuggestion) {
      finalImageUrl = getRecipeImageUrl(recipe.title)
      if (!finalImageUrl) {
        return NextResponse.json(
          { error: 'No image suggestion found for this recipe' },
          { status: 400 }
        )
      }
    }

    if (!finalImageUrl) {
      return NextResponse.json(
        { error: 'imageUrl is required or useSuggestion must be true' },
        { status: 400 }
      )
    }

    // Mettre à jour l'image
    const { error: updateError } = await supabaseServer
      .from('recipes')
      .update({ image_url: finalImageUrl })
      .eq('id', recipeId)

    if (updateError) {
      console.error('Error updating recipe image:', updateError)
      return NextResponse.json(
        { error: 'Failed to update image' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      recipe: {
        id: recipe.id,
        title: recipe.title,
        oldImage: recipe.image_url,
        newImage: finalImageUrl
      }
    })
  } catch (error) {
    console.error('Update recipe image API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

