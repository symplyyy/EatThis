import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Variables d\'environnement Supabase manquantes (serveur)')
  console.error('Veuillez créer un fichier .env.local avec:')
  console.error('NEXT_PUBLIC_SUPABASE_URL=...')
  console.error('SUPABASE_SERVICE_ROLE_KEY=...')
}

// Client avec service role key - UNIQUEMENT côté serveur (Route Handlers)
// Ne jamais bundler côté client
// Utilise des placeholders si les variables manquent pour éviter les crashes en développement
export const supabaseServer = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceRoleKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

