/**
 * Script pour analyser les recettes et leurs images
 * Aide à identifier les recettes avec des images non pertinentes
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'
import * as fs from 'fs'

dotenv.config({ path: '.env.local' })

// Dupliquer la fonction getRecipeImageUrl pour éviter les problèmes d'import avec ts-node
function getRecipeImageUrl(title: string): string | null {
  const normalizedTitle = title.toLowerCase().trim()
  
  // Mapping des recettes vers des images Unsplash
  const recipeImageMap: Record<string, string> = {
    // Omelettes
    'omelette': 'https://images.unsplash.com/photo-1611859266236-9c81194a6d0e?w=800&h=600&fit=crop&q=80',
    'omelette aux champignons': 'https://images.unsplash.com/photo-1611859266236-9c81194a6d0e?w=800&h=600&fit=crop&q=80',
    'omelette au fromage': 'https://images.unsplash.com/photo-1611859266236-9c81194a6d0e?w=800&h=600&fit=crop&q=80',
    'omelette nature': 'https://images.unsplash.com/photo-1611859266236-9c81194a6d0e?w=800&h=600&fit=crop&q=80',
    'omelette au sucre': 'https://images.unsplash.com/photo-1611859266236-9c81194a6d0e?w=800&h=600&fit=crop&q=80',
    
    // Pâtes
    'pâtes': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
    'pâtes à l\'ail et à l\'huile': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
    'pâtes à la tomate': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
    'pâtes au beurre et parmesan': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
    'pâtes carbonara': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
    'pâtes aux champignons': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
    'spaghetti': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
    'spaghetti à la carbonara': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
    'bolognaise': 'https://images.unsplash.com/photo-1598515214211-89d3c73fd4f6?w=800&h=600&fit=crop&q=80',
    
    // Pizza
    'pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
    'pizza margherita': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
    
    // Lasagnes
    'lasagnes': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
    
    // Salades
    'salade': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
    'salade césar': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
    'salade de tomates et mozzarella': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
    'salade de tomates': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
    'salade de carottes râpées': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
    
    // Risotto
    'risotto': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop&q=80',
    'risotto aux champignons': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop&q=80',
    
    // Poulet
    'poulet': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop&q=80',
    'poulet rôti': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop&q=80',
    'poulet rôti aux herbes': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop&q=80',
    'riz au poulet': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop&q=80',
    
    // Riz
    'riz': 'https://images.unsplash.com/photo-1512058564366-bb876779402f?w=800&h=600&fit=crop&q=80',
    'riz aux légumes': 'https://images.unsplash.com/photo-1512058564366-bb876779402f?w=800&h=600&fit=crop&q=80',
    'riz cantonais': 'https://images.unsplash.com/photo-1512058564366-bb876779402f?w=800&h=600&fit=crop&q=80',
    
    // Soupes
    'soupe': 'https://images.unsplash.com/photo-1547592180-85f173990a49?w=800&h=600&fit=crop&q=80',
    'soupe de légumes': 'https://images.unsplash.com/photo-1547592180-85f173990a49?w=800&h=600&fit=crop&q=80',
    'soupe à la tomate': 'https://images.unsplash.com/photo-1547592180-85f173990a49?w=800&h=600&fit=crop&q=80',
    
    // Gratins
    'gratin': 'https://images.unsplash.com/photo-1574672290893-f761799b5447?w=800&h=600&fit=crop&q=80',
    'gratin de pommes de terre': 'https://images.unsplash.com/photo-1574672290893-f761799b5447?w=800&h=600&fit=crop&q=80',
    'gratin de pâtes': 'https://images.unsplash.com/photo-1574672290893-f761799b5447?w=800&h=600&fit=crop&q=80',
    
    // Sandwichs
    'sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7fe?w=800&h=600&fit=crop&q=80',
    'sandwich jambon-beurre': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7fe?w=800&h=600&fit=crop&q=80',
    'sandwich au fromage': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7fe?w=800&h=600&fit=crop&q=80',
    'sandwich thon-mayonnaise': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7fe?w=800&h=600&fit=crop&q=80',
  }
  
  // Chercher une correspondance exacte
  if (recipeImageMap[normalizedTitle]) {
    return recipeImageMap[normalizedTitle]
  }
  
  // Chercher une correspondance partielle en priorisant les correspondances les plus longues
  const matches: Array<{ key: string; url: string; length: number }> = []
  for (const [key, url] of Object.entries(recipeImageMap)) {
    if (normalizedTitle.includes(key) || key.includes(normalizedTitle)) {
      matches.push({ key, url, length: key.length })
    }
  }
  
  // Trier par longueur de correspondance (les plus longues en premier)
  if (matches.length > 0) {
    matches.sort((a, b) => b.length - a.length)
    return matches[0].url
  }
  
  // Générer une URL basée sur des mots-clés du titre
  const stopWords = ['aux', 'au', 'de', 'et', 'la', 'le', 'les', 'du', 'des', 'à', 'avec', 'sans']
  const words = normalizedTitle.split(/\s+/).filter(word => 
    word.length > 2 && !stopWords.includes(word)
  )
  const keywords = words.slice(0, 2)
  
  if (keywords.length > 0) {
    const keywordImageMap: Record<string, string> = {
      'œufs': 'https://images.unsplash.com/photo-1611859266236-9c81194a6d0e?w=800&h=600&fit=crop&q=80',
      'oeufs': 'https://images.unsplash.com/photo-1611859266236-9c81194a6d0e?w=800&h=600&fit=crop&q=80',
      'champignons': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=80',
      'pâtes': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
      'pates': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
      'carbonara': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
      'bolognaise': 'https://images.unsplash.com/photo-1598515214211-89d3c73fd4f6?w=800&h=600&fit=crop&q=80',
      'saumon': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80',
      'salade': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
      'tomates': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80',
      'tomate': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80',
      'mozzarella': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
      'risotto': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop&q=80',
      'poulet': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop&q=80',
      'fromage': 'https://images.unsplash.com/photo-1618164436269-4460e6f1f1e6?w=800&h=600&fit=crop&q=80',
      'spaghetti': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
      'pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
      'lasagnes': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
      'riz': 'https://images.unsplash.com/photo-1512058564366-bb876779402f?w=800&h=600&fit=crop&q=80',
      'soupe': 'https://images.unsplash.com/photo-1547592180-85f173990a49?w=800&h=600&fit=crop&q=80',
      'gratin': 'https://images.unsplash.com/photo-1574672290893-f761799b5447?w=800&h=600&fit=crop&q=80',
      'sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7fe?w=800&h=600&fit=crop&q=80',
      'pommes de terre': 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&h=600&fit=crop&q=80',
      'purée': 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&h=600&fit=crop&q=80',
    }
    
    for (const keyword of keywords) {
      if (keywordImageMap[keyword]) {
        return keywordImageMap[keyword]
      }
    }
    
    return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80'
  }
  
  return null
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function analyzeRecipes() {
  console.log('🔍 Analyse des recettes et de leurs images...\n')

  const { data: recipes, error } = await supabase
    .from('recipes')
    .select('id, title, image_url')
    .order('id')

  if (error) {
    console.error('Erreur:', error)
    return
  }

  if (!recipes || recipes.length === 0) {
    console.log('Aucune recette trouvée')
    return
  }

  console.log(`📊 Total de recettes: ${recipes.length}\n`)

  const stats = {
    total: recipes.length,
    withImage: 0,
    withoutImage: 0,
    potentiallyWrong: [] as Array<{ id: number; title: string; currentImage: string | null; suggestedImage: string | null }>
  }

  for (const recipe of recipes) {
    if (recipe.image_url) {
      stats.withImage++
    } else {
      stats.withoutImage++
    }

    // Vérifier si l'image actuelle correspond bien au titre
    const suggestedImage = getRecipeImageUrl(recipe.title)
    
    if (recipe.image_url && suggestedImage && recipe.image_url !== suggestedImage) {
      stats.potentiallyWrong.push({
        id: recipe.id,
        title: recipe.title,
        currentImage: recipe.image_url,
        suggestedImage
      })
    }
  }

  console.log('📈 Statistiques:')
  console.log(`  - Avec image: ${stats.withImage}`)
  console.log(`  - Sans image: ${stats.withoutImage}`)
  console.log(`  - Images potentiellement incorrectes: ${stats.potentiallyWrong.length}\n`)

  if (stats.potentiallyWrong.length > 0) {
    console.log('⚠️  Recettes avec images potentiellement incorrectes:\n')
    stats.potentiallyWrong.slice(0, 20).forEach((recipe, index) => {
      console.log(`${index + 1}. ${recipe.title}`)
      console.log(`   ID: ${recipe.id}`)
      console.log(`   Image actuelle: ${recipe.currentImage?.substring(0, 80)}...`)
      console.log(`   Image suggérée: ${recipe.suggestedImage?.substring(0, 80)}...`)
      console.log('')
    })

    if (stats.potentiallyWrong.length > 20) {
      console.log(`... et ${stats.potentiallyWrong.length - 20} autres recettes\n`)
    }
  }

  // Générer un rapport JSON
  const report = {
    generatedAt: new Date().toISOString(),
    stats,
    recipes: stats.potentiallyWrong.map(r => ({
      id: r.id,
      title: r.title,
      currentImage: r.currentImage,
      suggestedImage: r.suggestedImage
    }))
  }

  console.log('💾 Rapport généré dans recipe-images-report.json')
  fs.writeFileSync('recipe-images-report.json', JSON.stringify(report, null, 2))
}

analyzeRecipes().catch(console.error)

