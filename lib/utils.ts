import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Convertit une URL en placeholder si nécessaire (fallback uniquement)
 * Utilise le titre de la recette pour générer un placeholder personnalisé
 */
export function convertToPlaceholder(imageUrl: string | null | undefined, title?: string): string | null {
  if (!imageUrl) return null
  
  // Si c'est déjà un placeholder, on le retourne tel quel
  if (imageUrl.includes('via.placeholder.com')) {
    return imageUrl
  }
  
  // Si c'est une URL Unsplash, on la garde telle quelle (pas de conversion)
  if (imageUrl.includes('unsplash.com') || imageUrl.includes('images.unsplash.com') || imageUrl.includes('source.unsplash.com')) {
    return imageUrl
  }
  
  // Sinon, on retourne l'URL originale
  return imageUrl
}

// Normaliser les noms d'ingrédients (trim, lower, gestion accents et ligatures)
// Extrait uniquement le nom de base de l'ingrédient (ex: "mozzarella slice" -> "mozzarella")
export function normalizeIngredientName(name: string): string {
  let normalized = name.trim().toLowerCase()
  
  // Convertir les ligatures en caractères simples pour éviter les problèmes d'encodage
  normalized = normalized
    .replace(/œ/g, 'oe')  // œ -> oe
    .replace(/Œ/g, 'oe')  // Œ -> oe
    .replace(/æ/g, 'ae')  // æ -> ae
    .replace(/Æ/g, 'ae')  // Æ -> ae
  
  // Enlever les quantités et unités au début (ex: "2 cups", "1/2 cup", "3 tbsp")
  normalized = normalized
    .replace(/^[\d\s\/\-]+\s*(ml|cl|l|g|kg|mg|oz|lb|cup|cups|tbsp|tsp|tablespoon|teaspoon|pound|ounce|pound|pounds|ounces?|grams?|kilograms?|milliliters?|liters?|pieces?|slices?|cloves?|heads?|bunches?|stalks?|sprigs?|leaves?|strips?|dashes?|pinches?|drops?)\s*/i, '')
    .replace(/^[\d\s\/\-\.]+\s*/, '') // Enlever les nombres restants
  
  // Enlever les mots de liaison et descriptions courantes (or, and, slice, blend, etc.)
  const stopWords = [
    /\s+or\s+/gi,
    /\s+and\s+/gi,
    /\s+slice\s*/gi,
    /\s+sliced\s*/gi,
    /\s+blend\s*/gi,
    /\s+blended\s*/gi,
    /\s+hock\s*/gi,
    /\s+whole\s+/gi,
    /\s+chopped\s*/gi,
    /\s+diced\s*/gi,
    /\s+minced\s*/gi,
    /\s+crushed\s*/gi,
    /\s+ground\s*/gi,
    /\s+fresh\s+/gi,
    /\s+dried\s+/gi,
    /\s+frozen\s+/gi,
    /\s+canned\s+/gi,
    /\s+optional\s*/gi,
    /\s+to\s+taste\s*/gi,
    /\s+more\s+to\s+taste\s*/gi,
    /\s+as\s+needed\s*/gi,
    /\s+for\s+serving\s*/gi,
    /\s+for\s+garnish\s*/gi,
  ]
  
  for (const stopWord of stopWords) {
    normalized = normalized.replace(stopWord, ' ')
  }
  
  // Extraire le premier mot significatif (le nom de l'ingrédient)
  const words = normalized.split(/\s+/).filter(word => word.length > 1)
  
  // Si on a des mots, prendre le premier (ou les deux premiers si c'est un nom composé commun)
  if (words.length === 0) {
    return normalized.trim()
  }
  
  // Noms composés communs à garder ensemble (anglais et français)
  const compoundNames = [
    // Anglais
    'green onion', 'red onion', 'yellow onion', 'white onion',
    'olive oil', 'vegetable oil', 'canola oil', 'peanut oil',
    'black pepper', 'white pepper', 'red pepper', 'cayenne pepper',
    'sea salt', 'kosher salt', 'table salt',
    'brown sugar', 'white sugar', 'powdered sugar', 'granulated sugar',
    'cream cheese', 'goat cheese', 'blue cheese', 'parmesan cheese',
    'chicken broth', 'beef broth', 'vegetable broth',
    'tomato paste', 'tomato sauce', 'tomato puree',
    'bell pepper', 'red bell pepper', 'green bell pepper',
    'fresh parsley', 'fresh basil', 'fresh cilantro',
    'ground beef', 'ground turkey', 'ground pork',
    'whole milk', 'skim milk', 'almond milk',
    'heavy cream', 'sour cream', 'whipping cream',
    // Français
    'sauce tomate', 'tomate', 'tomates',
    'creme fraiche', 'crème fraîche',
    'pommes de terre', 'pomme de terre',
    'huile olive', 'huile vegetale', 'huile végétale',
    'poivre noir', 'poivre blanc', 'poivre rouge',
    'sel mer', 'sel table',
    'sucre brun', 'sucre blanc', 'sucre poudre',
    'fromage creme', 'fromage chèvre', 'fromage bleu', 'parmesan',
    'bouillon poulet', 'bouillon boeuf', 'bouillon légumes',
    'pâte tomate', 'purée tomate',
    'poivron', 'poivrons',
    'persil frais', 'basilic frais', 'coriandre frais',
    'viande hachée', 'boeuf haché', 'dinde hachée', 'porc haché',
    'lait entier', 'lait écrémé', 'lait amande',
    'creme epaisse', 'crème épaisse', 'creme fouettee', 'crème fouettée',
    'oignon vert', 'oignon rouge', 'oignon jaune', 'oignon blanc',
  ]
  
  // Vérifier si c'est un nom composé (vérifier d'abord les noms complets)
  const fullName = normalized.trim()
  for (const compound of compoundNames) {
    if (fullName === compound || fullName.startsWith(compound + ' ') || fullName.endsWith(' ' + compound)) {
      return compound
    }
  }
  
  // Vérifier si les deux premiers mots forment un nom composé
  if (words.length >= 2) {
    const firstTwo = words.slice(0, 2).join(' ')
    for (const compound of compoundNames) {
      if (firstTwo === compound || normalized.includes(compound)) {
        return compound
      }
    }
  }
  
  // Si c'est un nom simple (un seul mot), le retourner tel quel
  if (words.length === 1) {
    return words[0]
  }
  
  // Sinon, retourner les deux premiers mots (pour les noms composés non listés)
  if (words.length >= 2) {
    return words.slice(0, 2).join(' ')
  }
  
  // Dernier recours : retourner le premier mot significatif
  return words[0] || normalized.trim()
}

// Hash simple pour le cache (ingrédients triés + limit)
export function hashIngredients(ingredients: string[], limit: number): string {
  const sorted = [...ingredients].sort().join(',')
  return `${sorted}:${limit}`
}
