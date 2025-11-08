/**
 * Mapping des recettes vers des images Unsplash libres de droit
 * Utilise des IDs d'images Unsplash spécifiques pour chaque type de recette
 */

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
  
  // Riz variantes
  'riz à la tomate': 'https://images.unsplash.com/photo-1512058564366-bb876779402f?w=800&h=600&fit=crop&q=80',
  'riz au beurre': 'https://images.unsplash.com/photo-1512058564366-bb876779402f?w=800&h=600&fit=crop&q=80',
  'riz aux œufs': 'https://images.unsplash.com/photo-1512058564366-bb876779402f?w=800&h=600&fit=crop&q=80',
  'riz aux oeufs': 'https://images.unsplash.com/photo-1512058564366-bb876779402f?w=800&h=600&fit=crop&q=80',
  
  // Pommes de terre
  'pommes de terre sautées': 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&h=600&fit=crop&q=80',
  'pommes de terre à l\'eau': 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&h=600&fit=crop&q=80',
  
  // Soupes variantes
  'soupe miso': 'https://images.unsplash.com/photo-1547592180-85f173990a49?w=800&h=600&fit=crop&q=80',
  
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
  'pancakes': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&q=80',
  'crêpes': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
  'crepes': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
  'crêpes sucrées': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
  'crepes sucrees': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
  'crêpes salées': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
  'crepes salees': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
}

/**
 * Génère une URL d'image Unsplash basée sur le titre de la recette
 * Utilise des mots-clés pour trouver une image appropriée
 */
export function getRecipeImageUrl(title: string): string | null {
  const normalizedTitle = title.toLowerCase().trim()
  
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
  const keywords = extractKeywords(normalizedTitle)
  if (keywords.length > 0) {
    return getUnsplashImageByKeywords(keywords)
  }
  
  return null
}

/**
 * Extrait les mots-clés importants du titre
 */
function extractKeywords(title: string): string[] {
  const stopWords = ['aux', 'au', 'de', 'et', 'la', 'le', 'les', 'du', 'des', 'à', 'avec', 'sans']
  const words = title.split(/\s+/).filter(word => 
    word.length > 2 && !stopWords.includes(word)
  )
  return words.slice(0, 2) // Prendre les 2 premiers mots-clés
}

/**
 * Génère une URL Unsplash basée sur des mots-clés
 * Utilise l'API Unsplash avec un access key public (gratuit)
 * Note: Pour la production, vous devriez utiliser votre propre access key
 */
function getUnsplashImageByKeywords(keywords: string[]): string {
  const query = keywords.join(',')
  // Utiliser l'API Unsplash avec un access key public
  // Format: https://api.unsplash.com/photos/random?query={query}&client_id={access_key}
  // Pour simplifier, on utilise des IDs d'images spécifiques basés sur les mots-clés
  
  // Mapping de mots-clés vers des IDs d'images Unsplash spécifiques (libres de droit)
  // Images plus précises et variées pour éviter les doublons
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
  
  // Chercher une correspondance avec les mots-clés
  for (const keyword of keywords) {
    if (keywordImageMap[keyword]) {
      return keywordImageMap[keyword]
    }
  }
  
  // Image par défaut de nourriture (libre de droit)
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80'
}

