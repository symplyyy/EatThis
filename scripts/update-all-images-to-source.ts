/**
 * Script pour mettre à jour toutes les images des recettes avec les nouvelles URLs source.unsplash.com
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// Dupliquer la fonction getRecipeImageUrl pour éviter les problèmes d'import avec ts-node
function getRecipeImageUrl(title: string): string | null {
  const normalizedTitle = title.toLowerCase().trim()
  
  // Mapping des recettes vers des images Unsplash
  const recipeImageMap: Record<string, string> = {
    // Omelettes
    'omelette': 'https://source.unsplash.com/800x600/?scrambled-eggs',
    'omelette aux champignons': 'https://source.unsplash.com/800x600/?omelette-mushroom',
    'omelette au fromage': 'https://source.unsplash.com/800x600/?omelette-cheese',
    'omelette nature': 'https://source.unsplash.com/800x600/?scrambled-eggs',
    'omelette au sucre': 'https://source.unsplash.com/800x600/?scrambled-eggs',
    
    // Pâtes
    'pâtes': 'https://source.unsplash.com/800x600/?pasta',
    'pâtes à l\'ail et à l\'huile': 'https://source.unsplash.com/800x600/?pasta-garlic',
    'pâtes à la tomate': 'https://source.unsplash.com/800x600/?pasta-tomato',
    'pâtes au beurre et parmesan': 'https://source.unsplash.com/800x600/?pasta-parmesan',
    'pâtes carbonara': 'https://source.unsplash.com/800x600/?carbonara',
    'pâtes aux champignons': 'https://source.unsplash.com/800x600/?pasta-mushroom',
    'spaghetti': 'https://source.unsplash.com/800x600/?spaghetti',
    'spaghetti à la carbonara': 'https://source.unsplash.com/800x600/?carbonara',
    'bolognaise': 'https://source.unsplash.com/800x600/?spaghetti-bolognese',
    
    // Pizza
    'pizza': 'https://source.unsplash.com/800x600/?pizza',
    'pizza margherita': 'https://source.unsplash.com/800x600/?pizza-margherita',
    
    // Lasagnes
    'lasagnes': 'https://source.unsplash.com/800x600/?lasagna',
    
    // Salades
    'salade': 'https://source.unsplash.com/800x600/?salad',
    'salade césar': 'https://source.unsplash.com/800x600/?caesar-salad',
    'salade de tomates et mozzarella': 'https://source.unsplash.com/800x600/?caprese-salad',
    'salade de tomates': 'https://source.unsplash.com/800x600/?tomato-salad',
    'salade de carottes râpées': 'https://source.unsplash.com/800x600/?carrot-salad',
    
    // Risotto
    'risotto': 'https://source.unsplash.com/800x600/?risotto',
    'risotto aux champignons': 'https://source.unsplash.com/800x600/?risotto-mushroom',
    
    // Poulet
    'poulet': 'https://source.unsplash.com/800x600/?chicken',
    'poulet rôti': 'https://source.unsplash.com/800x600/?roasted-chicken',
    'poulet rôti aux herbes': 'https://source.unsplash.com/800x600/?roasted-chicken-herbs',
    'riz au poulet': 'https://source.unsplash.com/800x600/?chicken-rice',
    
    // Riz
    'riz': 'https://source.unsplash.com/800x600/?rice',
    'riz aux légumes': 'https://source.unsplash.com/800x600/?rice-vegetables',
    'riz cantonais': 'https://source.unsplash.com/800x600/?fried-rice',
    'riz à la tomate': 'https://source.unsplash.com/800x600/?rice-tomato',
    'riz au beurre': 'https://source.unsplash.com/800x600/?rice',
    'riz aux œufs': 'https://source.unsplash.com/800x600/?rice-egg',
    'riz aux oeufs': 'https://source.unsplash.com/800x600/?rice-egg',
    
    // Soupes
    'soupe': 'https://source.unsplash.com/800x600/?soup',
    'soupe de légumes': 'https://source.unsplash.com/800x600/?vegetable-soup',
    'soupe à la tomate': 'https://source.unsplash.com/800x600/?tomato-soup',
    'soupe miso': 'https://source.unsplash.com/800x600/?miso-soup',
    
    // Gratins
    'gratin': 'https://source.unsplash.com/800x600/?gratin',
    'gratin de pommes de terre': 'https://source.unsplash.com/800x600/?potato-gratin',
    'gratin de pâtes': 'https://source.unsplash.com/800x600/?pasta-gratin',
    
    // Sandwichs
    'sandwich': 'https://source.unsplash.com/800x600/?sandwich',
    'sandwich jambon-beurre': 'https://source.unsplash.com/800x600/?ham-sandwich',
    'sandwich au fromage': 'https://source.unsplash.com/800x600/?cheese-sandwich',
    'sandwich thon-mayonnaise': 'https://source.unsplash.com/800x600/?tuna-sandwich',
    
    // Pommes de terre
    'pommes de terre sautées': 'https://source.unsplash.com/800x600/?fried-potatoes',
    'pommes de terre à l\'eau': 'https://source.unsplash.com/800x600/?boiled-potatoes',
    
    // Currys
    'curry de légumes': 'https://source.unsplash.com/800x600/?vegetable-curry',
    'massaman curry': 'https://source.unsplash.com/800x600/?curry',
    'green curry': 'https://source.unsplash.com/800x600/?green-curry',
    'red curry': 'https://source.unsplash.com/800x600/?red-curry',
    'yellow curry': 'https://source.unsplash.com/800x600/?yellow-curry',
    
    // Plats asiatiques
    'tacos': 'https://source.unsplash.com/800x600/?tacos',
    'sushi': 'https://source.unsplash.com/800x600/?sushi',
    'ramen': 'https://source.unsplash.com/800x600/?ramen',
    
    // Crêpes et pancakes
    'pancakes': 'https://source.unsplash.com/800x600/?pancakes',
    'crêpes': 'https://source.unsplash.com/800x600/?crepes',
    'crepes': 'https://source.unsplash.com/800x600/?crepes',
    'crêpes sucrées': 'https://source.unsplash.com/800x600/?sweet-crepes',
    'crepes sucrees': 'https://source.unsplash.com/800x600/?sweet-crepes',
    'crêpes salées': 'https://source.unsplash.com/800x600/?savory-crepes',
    'crepes salees': 'https://source.unsplash.com/800x600/?savory-crepes',
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
      'œufs': 'https://source.unsplash.com/800x600/?eggs',
      'oeufs': 'https://source.unsplash.com/800x600/?eggs',
      'champignons': 'https://source.unsplash.com/800x600/?mushrooms',
      'pâtes': 'https://source.unsplash.com/800x600/?pasta',
      'pates': 'https://source.unsplash.com/800x600/?pasta',
      'carbonara': 'https://source.unsplash.com/800x600/?carbonara',
      'bolognaise': 'https://source.unsplash.com/800x600/?bolognese',
      'saumon': 'https://source.unsplash.com/800x600/?salmon',
      'salade': 'https://source.unsplash.com/800x600/?salad',
      'tomates': 'https://source.unsplash.com/800x600/?tomatoes',
      'tomate': 'https://source.unsplash.com/800x600/?tomato',
      'mozzarella': 'https://source.unsplash.com/800x600/?mozzarella',
      'risotto': 'https://source.unsplash.com/800x600/?risotto',
      'poulet': 'https://source.unsplash.com/800x600/?chicken',
      'fromage': 'https://source.unsplash.com/800x600/?cheese',
      'spaghetti': 'https://source.unsplash.com/800x600/?spaghetti',
      'pizza': 'https://source.unsplash.com/800x600/?pizza',
      'lasagnes': 'https://source.unsplash.com/800x600/?lasagna',
      'riz': 'https://source.unsplash.com/800x600/?rice',
      'soupe': 'https://source.unsplash.com/800x600/?soup',
      'gratin': 'https://source.unsplash.com/800x600/?gratin',
      'sandwich': 'https://source.unsplash.com/800x600/?sandwich',
      'pommes de terre': 'https://source.unsplash.com/800x600/?potatoes',
      'purée': 'https://source.unsplash.com/800x600/?mashed-potatoes',
    }
    
    for (const keyword of keywords) {
      if (keywordImageMap[keyword]) {
        return keywordImageMap[keyword]
      }
    }
    
    return 'https://source.unsplash.com/800x600/?food'
  }
  
  return 'https://source.unsplash.com/800x600/?food'
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function updateAllImages() {
  console.log('🔄 Mise à jour de toutes les images avec source.unsplash.com...\n')

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
    const suggestedImage = getRecipeImageUrl(recipe.title)
    
    if (!suggestedImage) {
      skippedRecipes.push({
        id: recipe.id,
        title: recipe.title,
        reason: 'Aucune image suggérée trouvée'
      })
      continue
    }

    // Toujours mettre à jour pour utiliser les nouvelles URLs source.unsplash.com
    const { error: updateError } = await supabase
      .from('recipes')
      .update({ image_url: suggestedImage })
      .eq('id', recipe.id)

    if (updateError) {
      console.error(`❌ Erreur pour "${recipe.title}" (ID: ${recipe.id}):`, updateError.message)
      skippedRecipes.push({
        id: recipe.id,
        title: recipe.title,
        reason: `Erreur: ${updateError.message}`
      })
      continue
    }

    console.log(`✅ "${recipe.title}" (ID: ${recipe.id})`)
    updatedRecipes.push({
      id: recipe.id,
      title: recipe.title,
      oldImage: recipe.image_url,
      newImage: suggestedImage
    })
  }

  console.log('\n📈 Résumé:')
  console.log(`  ✅ Mises à jour réussies: ${updatedRecipes.length}`)
  console.log(`  ❌ Échecs: ${skippedRecipes.length}`)
  console.log(`  📊 Total: ${allRecipes.length}`)

  if (skippedRecipes.length > 0) {
    console.log('\n⚠️  Recettes en échec:')
    skippedRecipes.forEach(recipe => {
      console.log(`  - "${recipe.title}" (ID: ${recipe.id}): ${recipe.reason}`)
    })
  }
}

updateAllImages().catch(console.error)
