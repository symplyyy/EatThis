import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

// POST - Enregistrer un temps de réalisation
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = parseInt(params.id, 10)
    if (isNaN(recipeId)) {
      return NextResponse.json(
        { error: 'ID de recette invalide' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const { timeSeconds } = body

    if (!timeSeconds || typeof timeSeconds !== 'number' || timeSeconds <= 0) {
      return NextResponse.json(
        { error: 'Temps invalide' },
        { status: 400 }
      )
    }

    // Insérer le temps dans la table recipe_times
    const { error } = await supabaseServer
      .from('recipe_times')
      .insert({
        recipe_id: recipeId,
        time_seconds: timeSeconds
      })

    if (error) {
      console.error('Erreur lors de l\'enregistrement du temps:', error)
      return NextResponse.json(
        { error: 'Erreur lors de l\'enregistrement' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erreur API timer:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

// GET - Récupérer le temps moyen
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const recipeId = parseInt(params.id, 10)
    if (isNaN(recipeId)) {
      return NextResponse.json(
        { error: 'ID de recette invalide' },
        { status: 400 }
      )
    }

    // Calculer la moyenne des temps
    const { data, error } = await supabaseServer
      .from('recipe_times')
      .select('time_seconds')
      .eq('recipe_id', recipeId)

    if (error) {
      console.error('Erreur lors de la récupération des temps:', error)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ averageTimeSeconds: null })
    }

    const totalSeconds = data.reduce((sum, item) => sum + item.time_seconds, 0)
    const averageSeconds = Math.round(totalSeconds / data.length)

    return NextResponse.json({ 
      averageTimeSeconds: averageSeconds,
      count: data.length
    })
  } catch (error) {
    console.error('Erreur API timer:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}

