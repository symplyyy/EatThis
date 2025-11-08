import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  if (typeof window !== 'undefined') {
    console.error('❌ Variables d\'environnement Supabase manquantes')
    console.error('Veuillez créer un fichier .env.local avec:')
    console.error('NEXT_PUBLIC_SUPABASE_URL=...')
    console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=...')
  }
}

// Créer un client (avec placeholder si les variables manquent pour éviter les crashes)
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
)

