/**
 * Script pour vérifier les ingrédients dans la base de données
 * 
 * Usage:
 *   npx ts-node scripts/check-ingredients.ts
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Charger les variables d'environnement depuis .env.local
config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Variables Supabase requises')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function checkIngredients() {
  console.log('🔍 Vérification des ingrédients dans la base de données...\n')

  try {
    // 1. Compter tous les ingrédients
    const { count: totalCount } = await supabase
      .from('ingredients')
      .select('*', { count: 'exact', head: true })

    console.log(`📊 Total d'ingrédients: ${totalCount || 0}\n`)

    // 2. Chercher "tomato" et variations
    console.log('🔍 Recherche de "tomato" et variations...')
    const { data: tomatoData, error: tomatoError } = await supabase
      .from('ingredients')
      .select('id, name')
      .or('name.ilike.%tomato%,name.ilike.%tomate%')

    if (tomatoError) {
      console.error('   ❌ Erreur:', tomatoError.message)
    } else if (tomatoData && tomatoData.length > 0) {
      console.log(`   ⚠️  Trouvé ${tomatoData.length} ingrédient(s) contenant "tomato" ou "tomate":`)
      tomatoData.forEach((ing) => {
        console.log(`      - [ID: ${ing.id}] "${ing.name}"`)
      })
    } else {
      console.log('   ✅ Aucun ingrédient contenant "tomato" trouvé')
    }
    console.log('')

    // 3. Lister tous les ingrédients (premiers 50)
    console.log('📋 Liste des ingrédients (premiers 50):')
    const { data: allIngredients, error: allError } = await supabase
      .from('ingredients')
      .select('id, name')
      .order('name', { ascending: true })
      .limit(50)

    if (allError) {
      console.error('   ❌ Erreur:', allError.message)
    } else if (allIngredients) {
      allIngredients.forEach((ing, index) => {
        console.log(`   ${index + 1}. [ID: ${ing.id}] "${ing.name}"`)
      })
      if ((totalCount || 0) > 50) {
        console.log(`   ... et ${(totalCount || 0) - 50} autres`)
      }
    }
    console.log('')

    // 4. Tester la fonction RPC autocomplete avec "tomato"
    console.log('🧪 Test de la fonction RPC autocomplete avec "tomato"...')
    const { data: rpcData, error: rpcError } = await supabase.rpc('rpc_autocomplete_ingredients', {
      p_query: 'tomato',
      p_limit: 10
    })

    if (rpcError) {
      console.error('   ❌ Erreur RPC:', rpcError.message)
    } else if (rpcData && Array.isArray(rpcData)) {
      console.log(`   📊 Résultats RPC: ${rpcData.length} ingrédient(s)`)
      rpcData.forEach((ing, index) => {
        console.log(`      ${index + 1}. [ID: ${ing.id}] "${ing.name}"`)
      })
    } else {
      console.log('   ✅ Aucun résultat RPC')
    }
    console.log('')

    // 5. Recommandations
    console.log('💡 Recommandations:')
    if (tomatoData && tomatoData.length > 0) {
      console.log('   ⚠️  Des ingrédients contenant "tomato" existent dans la base.')
      console.log('   📝 Pour les supprimer, utilisez:')
      console.log('      DELETE FROM ingredients WHERE name ILIKE \'%tomato%\';')
    } else {
      console.log('   ✅ Aucun ingrédient "tomato" trouvé dans la base.')
      console.log('   🔄 Si vous voyez encore "tomato" dans l\'interface, c\'est probablement un problème de cache.')
      console.log('   💡 Essayez de:')
      console.log('      1. Vider le cache du navigateur (Ctrl+Shift+Delete)')
      console.log('      2. Redémarrer le serveur Next.js')
      console.log('      3. Vérifier les headers Cache-Control dans l\'API')
    }

  } catch (error) {
    console.error('❌ Erreur fatale:', error)
    process.exit(1)
  }
}

// Exécution
checkIngredients()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('Erreur fatale:', error)
    process.exit(1)
  })

