/**
 * Script pour alimenter la base de données Supabase avec des recettes de démo
 * 
 * Usage:
 *   node scripts/seed-database.js
 * 
 * Assurez-vous d'avoir vos variables d'environnement dans .env.local
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌ Variables d\'environnement manquantes!')
  console.error('Assurez-vous d\'avoir un fichier .env.local avec:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=...')
  console.error('  SUPABASE_SERVICE_ROLE_KEY=...')
  process.exit(1)
}

async function seedDatabase() {
  try {
    console.log('🌱 Début du seed de la base de données...')
    
    const response = await fetch(`${SUPABASE_URL.replace('/rest/v1', '')}/api/admin/seed`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Erreur:', error)
      process.exit(1)
    }

    const result = await response.json()
    console.log('✅ Seed réussi!')
    console.log(`   ${result.inserted} recette(s) insérée(s)`)
    console.log(`   IDs: ${result.recipeIds.join(', ')}`)
  } catch (error) {
    console.error('❌ Erreur lors du seed:', error.message)
    console.error('\n💡 Alternative: Utilisez directement l\'endpoint HTTP:')
    console.error('   curl -X POST http://localhost:3000/api/admin/seed \\')
    console.error('     -H "Authorization: Bearer ' + SERVICE_ROLE_KEY.substring(0, 20) + '..."')
    process.exit(1)
  }
}

// Note: Ce script nécessite que le serveur Next.js soit en cours d'exécution
// Pour une solution plus directe, utilisez l'endpoint HTTP directement
console.log('⚠️  Ce script nécessite que le serveur Next.js soit en cours d\'exécution')
console.log('   Lancez d\'abord: npm run dev\n')

seedDatabase()

