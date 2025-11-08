/**
 * Script pour mettre à jour toutes les images des recettes avec les anciennes URLs images.unsplash.com
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Dupliquer la fonction getRecipeImageUrl pour éviter les problèmes d'import avec ts-node
function getRecipeImageUrl(title: string): string | null {
  const normalizedTitle = title.toLowerCase().trim()
  
  // Mapping des recettes vers des images Unsplash avec IDs spécifiques
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
    'riz à la tomate': 'https://images.unsplash.com/photo-1512058564366-bb876779402f?w=800&h=600&fit=crop&q=80',
    'riz au beurre': 'https://images.unsplash.com/photo-1512058564366-bb876779402f?w=800&h=600&fit=crop&q=80',
    'riz aux œufs': 'https://images.unsplash.com/photo-1512058564366-bb876779402f?w=800&h=600&fit=crop&q=80',
    'riz aux oeufs': 'https://images.unsplash.com/photo-1512058564366-bb876779402f?w=800&h=600&fit=crop&q=80',
    
    // Soupes
    'soupe': 'https://images.unsplash.com/photo-1547592180-85f173990a49?w=800&h=600&fit=crop&q=80',
    'soupe de légumes': 'https://images.unsplash.com/photo-1547592180-85f173990a49?w=800&h=600&fit=crop&q=80',
    'soupe à la tomate': 'https://images.unsplash.com/photo-1547592180-85f173990a49?w=800&h=600&fit=crop&q=80',
    'soupe miso': 'https://images.unsplash.com/photo-1547592180-85f173990a49?w=800&h=600&fit=crop&q=80',
    
    // Gratins
    'gratin': 'https://images.unsplash.com/photo-1574672290893-f761799b5447?w=800&h=600&fit=crop&q=80',
    'gratin de pommes de terre': 'https://images.unsplash.com/photo-1574672290893-f761799b5447?w=800&h=600&fit=crop&q=80',
    'gratin de pâtes': 'https://images.unsplash.com/photo-1574672290893-f761799b5447?w=800&h=600&fit=crop&q=80',
    
    // Sandwichs
    'sandwich': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7fe?w=800&h=600&fit=crop&q=80',
    'sandwich jambon-beurre': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7fe?w=800&h=600&fit=crop&q=80',
    'sandwich au fromage': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7fe?w=800&h=600&fit=crop&q=80',
    'sandwich thon-mayonnaise': 'https://images.unsplash.com/photo-1528735602780-2552fd46c7fe?w=800&h=600&fit=crop&q=80',
    
    // Pommes de terre
    'pommes de terre sautées': 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&h=600&fit=crop&q=80',
    'pommes de terre à l\'eau': 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&h=600&fit=crop&q=80',
    'purée de pommes de terre': 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&h=600&fit=crop&q=80',
    
    // Currys
    'curry de légumes': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80',
    'massaman curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80',
    'green curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80',
    'red curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80',
    'yellow curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80',
    
    // Plats asiatiques
    'tacos': 'https://images.unsplash.com/photo-1565299585323-38174c0c0e8a?w=800&h=600&fit=crop&q=80',
    'sushi': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80',
    'ramen': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop&q=80',
    
    // Crêpes et pancakes
    'pancakes': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&h=600&fit=crop&q=80',
    'crêpes': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&h=600&fit=crop&q=80',
    'crepes': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&h=600&fit=crop&q=80',
    'crêpes sucrées': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&h=600&fit=crop&q=80',
    'crepes sucrees': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&h=600&fit=crop&q=80',
    'crêpes salées': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&h=600&fit=crop&q=80',
    'crepes salees': 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&h=600&fit=crop&q=80',
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
  
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80'
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateAllImages() {
  console.log('🔄 Mise à jour de toutes les images avec images.unsplash.com...\n')

  // Récupérer toutes les recettes
  const { data: allRecipes, error: fetchError } = await supabase
    .from('recipes')
    .select('id, title, image_url')

  if (fetchError) {
    console.error('❌ Erreur lors de la récupération des recettes:', fetchError)
    return
  }

  if (!allRecipes || allRecipes.length === 0) {
    console.log('✅ Aucune recette trouvée')
    return
  }

  console.log(`📊 ${allRecipes.length} recette(s) à traiter\n`)

  const updatedRecipes = []
  const skippedRecipes = []

  // Mettre à jour chaque recette avec une nouvelle image basée sur le titre
  for (const recipe of allRecipes) {
    const newImageUrl = getRecipeImageUrl(recipe.title)
    
    if (!newImageUrl) {
      skippedRecipes.push({
        id: recipe.id,
        title: recipe.title,
        reason: 'Aucune image trouvée'
      })
      continue
    }

    // Si l'image est déjà la bonne, on skip
    if (recipe.image_url === newImageUrl) {
      skippedRecipes.push({
        id: recipe.id,
        title: recipe.title,
        reason: 'Image déjà correcte'
      })
      continue
    }

    const { error: updateError } = await supabase
      .from('recipes')
      .update({ image_url: newImageUrl })
      .eq('id', recipe.id)

    if (updateError) {
      console.error(`❌ Erreur lors de la mise à jour de la recette ${recipe.id} (${recipe.title}):`, updateError.message)
      skippedRecipes.push({
        id: recipe.id,
        title: recipe.title,
        reason: `Erreur: ${updateError.message}`
      })
    } else {
      console.log(`✅ "${recipe.title}" (ID: ${recipe.id})`)
      updatedRecipes.push({
        id: recipe.id,
        title: recipe.title,
        oldImage: recipe.image_url,
        newImage: newImageUrl
      })
    }
  }

  console.log('\n📈 Résumé:')
  console.log(`  ✅ Mises à jour réussies: ${updatedRecipes.length}`)
  console.log(`  ⏭️  Ignorées: ${skippedRecipes.length}`)
  console.log(`  📊 Total: ${allRecipes.length}\n`)
}

updateAllImages().catch(console.error)
