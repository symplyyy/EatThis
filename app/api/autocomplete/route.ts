import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import type { IngredientSuggestion } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0  // Pas de cache pour éviter les données obsolètes

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    let q = searchParams.get('q')?.trim() || ''

    // Déclencher uniquement à ≥2 caractères
    if (q.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    // Normaliser la requête (convertir ligatures)
    q = q
      .toLowerCase()
      .replace(/œ/g, 'oe')
      .replace(/Œ/g, 'oe')
      .replace(/æ/g, 'ae')
      .replace(/Æ/g, 'ae')

    const limit = parseInt(searchParams.get('limit') || '20', 10)

    // Appel RPC Supabase
    const { data, error } = await supabaseServer.rpc('rpc_autocomplete_ingredients', {
      p_query: q,
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

    // Transformer les résultats
    const suggestions: IngredientSuggestion[] = (data || []).map((row: any) => ({
      id: row.id,
      name: row.name
    }))

    const headers = new Headers()
    // Cache réduit pour éviter les données obsolètes
    headers.set('Cache-Control', 's-maxage=60, stale-while-revalidate=120')
    // Ajouter un header pour forcer la mise à jour
    headers.set('X-Timestamp', Date.now().toString())

    return NextResponse.json({ suggestions }, { headers })
  } catch (error) {
    console.error('Autocomplete API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

