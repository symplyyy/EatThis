import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { normalizeIngredientName, hashIngredients } from '@/lib/utils'
import type { RecipeCard } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 30

export async function POST(request: NextRequest) {
  try {
    // Lire le body avec gestion correcte de l'encodage UTF-8
    const body = await request.json()
    const { ingredients, limit = 30 } = body

    if (!Array.isArray(ingredients) || ingredients.length === 0) {
      return NextResponse.json(
        { error: 'ingredients must be a non-empty array' },
        { status: 400 }
      )
    }

    // Normaliser les ingrédients (convertir ligatures et nettoyer)
    const normalizedIngredients = ingredients
      .map((name: string) => normalizeIngredientName(name))
      .filter((name: string) => name.length > 0)

    if (normalizedIngredients.length === 0) {
      return NextResponse.json({ results: [] })
    }

    // Vérifier que Supabase est configuré
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase not configured')
      return NextResponse.json(
        { 
          error: 'Supabase not configured',
          details: 'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY'
        },
        { status: 500 }
      )
    }

    // Appel RPC Supabase avec encodage UTF-8 explicite
    const { data, error } = await supabaseServer.rpc('rpc_match_recipes_by_names', {
      p_names: normalizedIngredients,
      p_limit: limit
    })

    if (error) {
      console.error('Supabase RPC error:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        hint: error.hint,
        details: error.details
      })
      return NextResponse.json(
        { 
          error: 'Database query failed',
          details: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      )
    }

    // Vérifier que data existe et est un tableau
    if (!data) {
      console.error('RPC returned null or undefined')
      return NextResponse.json(
        { 
          error: 'Invalid response from database',
          details: 'RPC returned null or undefined'
        },
        { status: 500 }
      )
    }

    if (!Array.isArray(data)) {
      console.error('RPC returned non-array:', typeof data, data)
      return NextResponse.json(
        { 
          error: 'Invalid response format from database',
          details: `Expected array, got ${typeof data}`
        },
        { status: 500 }
      )
    }

    // Transformer les résultats pour correspondre au type RecipeCard
    const results: RecipeCard[] = data
      .filter((row: any) => row && typeof row.recipe_id !== 'undefined')
      .map((row: any) => ({
        id: row.recipe_id,
        title: row.title || 'Sans titre',
        timeMin: row.time_min ?? null,
        difficulty: row.difficulty ?? null,
        have: row.have_count ?? 0,
        missing: row.missing_count ?? 0,
        score: row.score ?? 0,
        imageUrl: row.image_url || null,
        missingIngredients: row.missing_ingredients || []
      }))

    // Tri : score desc, missing asc, id asc
    results.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      if (a.missing !== b.missing) return a.missing - b.missing
      return a.id - b.id
    })

    // Cache headers
    const cacheKey = hashIngredients(normalizedIngredients, limit)
    const headers = new Headers()
    headers.set('Cache-Control', 's-maxage=30, stale-while-revalidate=120')
    headers.set('X-Cache-Key', cacheKey)

    return NextResponse.json({ results }, { headers })
  } catch (error) {
    console.error('Search API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}

