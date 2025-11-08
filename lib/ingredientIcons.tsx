/**
 * Mapping des ingrédients vers des emojis iOS colorés
 * Utilise des emojis natifs iOS qui sont naturellement colorés
 */

// Mapping des ingrédients vers leurs emojis iOS
const ingredientEmojiMap: Record<string, string> = {
  // Œufs et produits laitiers
  'œufs': '🥚',
  'oeufs': '🥚',
  'fromage': '🧀',
  'parmesan': '🧀',
  'mozzarella': '🧀',
  'crème fraîche': '🥛',
  'creme fraiche': '🥛',
  'lait': '🥛',
  'beurre': '🧈',
  
  // Viandes et poissons
  'saumon': '🐟',
  'saumon fumé': '🐟',
  'saumon fume': '🐟',
  'poisson': '🐟',
  'poulet': '🍗',
  'lardons': '🥓',
  'viande': '🥩',
  
  // Légumes
  'champignons': '🍄',
  'tomates': '🍅',
  'tomate': '🍅',
  'oignon': '🧅',
  'carotte': '🥕',
  'laitue': '🥬',
  'salade': '🥬',
  'basilic': '🌿',
  
  // Pâtes et céréales
  'pâtes': '🍝',
  'pates': '🍝',
  'spaghetti': '🍝',
  'riz': '🍚',
  'riz arborio': '🍚',
  
  // Fruits
  'pomme': '🍎',
  'cerise': '🍒',
  'raisin': '🍇',
  
  // Autres
  'croûtons': '🍞',
  'croûton': '🍞',
  'sauce césar': '🥗',
  'sauce cesar': '🥗',
  'herbes de provence': '🌿',
  'herbes': '🌿',
  'huile d\'olive': '🫒',
  'huile dolive': '🫒',
  'vinaigre balsamique': '🍶',
  'vin blanc': '🍷',
  'bouillon': '🍲',
  'sel': '🧂',
  'poivre': '🌶️',
}

// Fonction pour obtenir l'emoji d'un ingrédient
export function getIngredientEmoji(ingredientName: string): string {
  const normalized = ingredientName.toLowerCase().trim()
  
  // Chercher une correspondance exacte
  if (ingredientEmojiMap[normalized]) {
    return ingredientEmojiMap[normalized]
  }
  
  // Chercher une correspondance partielle
  for (const [key, emoji] of Object.entries(ingredientEmojiMap)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return emoji
    }
  }
  
  // Emoji par défaut
  return '🍽️'
}

// Composant pour afficher l'emoji d'un ingrédient (style iOS)
export function IngredientIcon({ name, className, size = "text-base" }: { name: string; className?: string; size?: string }) {
  const emoji = getIngredientEmoji(name)
  const defaultClassName = `${size} inline-block`
  const finalClassName = className ? `${defaultClassName} ${className}` : defaultClassName
  
  return <span className={finalClassName} role="img" aria-label={name}>{emoji}</span>
}
