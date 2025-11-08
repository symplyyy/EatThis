import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Test de connexion simple
    const { data, error } = await supabaseServer
      .from('recipes')
      .select('count')
      .limit(1)

    if (error) {
      return NextResponse.json(
        {
          connected: false,
          error: error.message,
          code: error.code,
          hint: error.hint
        },
        { status: 500 }
      )
    }

    // Test des RPC
    const { data: rpcData, error: rpcError } = await supabaseServer.rpc('rpc_autocomplete_ingredients', {
      p_query: 'test',
      p_limit: 1
    })

    return NextResponse.json({
      connected: true,
      message: 'Connexion Supabase réussie',
      tables: {
        recipes: 'accessible',
        rpc: rpcError ? `Erreur RPC: ${rpcError.message}` : 'accessible'
      },
      env: {
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    })
  } catch (error) {
    return NextResponse.json(
      {
        connected: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        env: {
          hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          hasServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY
        }
      },
      { status: 500 }
    )
  }
}

