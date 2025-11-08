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

    const body = await request.json().catch(() => ({}))
    const { force = false } = body

    // Récupérer toutes les recettes
    const { data: allRecipes, error: fetchError } = await supabaseServer
      .from('recipes')
      .select('id, title, image_url')

    if (fetchError) {
      console.error('Error fetching recipes:', fetchError)
      return NextResponse.json(
        { error: 'Database query failed' },
        { status: 500 }
      )
    }

    if (!allRecipes || allRecipes.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Aucune recette trouvée',
        updated: 0,
        total: 0
      })
    }

    const updatedRecipes = []
    const skippedRecipes = []

    // Mettre à jour chaque recette avec une nouvelle image basée sur le titre
    for (const recipe of allRecipes) {
      const suggestedImage = getRecipeImageUrl(recipe.title)
      
      // Si force = false, ne mettre à jour que si l'image est différente ou absente
      if (!force && recipe.image_url && recipe.image_url === suggestedImage) {
        skippedRecipes.push({
          id: recipe.id,
          title: recipe.title,
          reason: 'Image déjà correcte'
        })
        continue
      }

      if (!suggestedImage) {
        skippedRecipes.push({
          id: recipe.id,
          title: recipe.title,
          reason: 'Aucune image suggérée trouvée'
        })
        continue
      }

      const { error: updateError } = await supabaseServer
        .from('recipes')
        .update({ image_url: suggestedImage })
        .eq('id', recipe.id)

      if (updateError) {
        console.error(`Error updating recipe ${recipe.id}:`, updateError)
        skippedRecipes.push({
          id: recipe.id,
          title: recipe.title,
          reason: `Erreur: ${updateError.message}`
        })
        continue
      }

      updatedRecipes.push({
        id: recipe.id,
        title: recipe.title,
        oldImage: recipe.image_url,
        newImage: suggestedImage
      })
    }

    return NextResponse.json({
      success: true,
      updated: updatedRecipes.length,
      skipped: skippedRecipes.length,
      total: allRecipes.length,
      recipes: updatedRecipes,
      skippedSamples: skippedRecipes.slice(0, 10) // Limiter les skipped pour la réponse
    })
  } catch (error) {
    console.error('Update all images API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

