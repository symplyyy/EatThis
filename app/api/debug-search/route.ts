import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { ingredients } = body

    const diagnostics: any = {
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? 'configured' : 'missing'
      },
      tests: {}
    }

    // Test 1: Connexion à Supabase
    try {
      const { data, error } = await supabaseServer
        .from('recipes')
        .select('id')
        .limit(1)
      
      diagnostics.tests.connection = {
        success: !error,
        error: error?.message,
        code: error?.code
      }
    } catch (e) {
      diagnostics.tests.connection = {
        success: false,
        error: e instanceof Error ? e.message : 'Unknown error'
      }
    }

    // Test 2: Vérifier si la fonction RPC existe
    if (ingredients && Array.isArray(ingredients) && ingredients.length > 0) {
      try {
        const { data, error } = await supabaseServer.rpc('rpc_match_recipes_by_names', {
          p_names: ingredients.map((i: string) => i.toLowerCase().trim()),
          p_limit: 5
        })
        
        diagnostics.tests.rpc = {
          success: !error,
          error: error?.message,
          code: error?.code,
          hint: error?.hint,
          dataType: data ? typeof data : 'null',
          isArray: Array.isArray(data),
          dataLength: Array.isArray(data) ? data.length : 0,
          sampleData: Array.isArray(data) && data.length > 0 ? data[0] : null
        }
      } catch (e) {
        diagnostics.tests.rpc = {
          success: false,
          error: e instanceof Error ? e.message : 'Unknown error'
        }
      }
    }

    // Test 3: Vérifier les tables
    try {
      const { data: recipes, error: recipesError } = await supabaseServer
        .from('recipes')
        .select('id, title')
        .limit(5)
      
      const { data: ingredients, error: ingredientsError } = await supabaseServer
        .from('ingredients')
        .select('id, name')
        .limit(5)

      diagnostics.tests.tables = {
        recipes: {
          exists: !recipesError,
          count: recipes?.length || 0,
          error: recipesError?.message
        },
        ingredients: {
          exists: !ingredientsError,
          count: ingredients?.length || 0,
          error: ingredientsError?.message
        }
      }
    } catch (e) {
      diagnostics.tests.tables = {
        error: e instanceof Error ? e.message : 'Unknown error'
      }
    }

    return NextResponse.json(diagnostics)
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Diagnostic failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

