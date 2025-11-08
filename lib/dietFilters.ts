/**
 * Utilitaires pour déterminer les régimes alimentaires d'une recette
 * Basé sur les ingrédients
 */

// Ingrédients non-végétariens (viandes, poissons, etc.)
const nonVegetarianIngredients = [
  'poulet', 'boeuf', 'porc', 'agneau', 'veau', 'canard', 'dinde',
  'saumon', 'thon', 'crevette', 'crabe', 'moule', 'huître', 'calamar',
  'jambon', 'bacon', 'lardons', 'chorizo', 'salami', 'viande',
  'poisson', 'fruits de mer', 'crustacé', 'mollusque'
]

// Ingrédients non-vegans (produits laitiers, œufs, miel, etc.)
const nonVeganIngredients = [
  'lait', 'fromage', 'beurre', 'crème', 'yaourt', 'fromage blanc',
  'œuf', 'oeuf', 'œufs', 'oeufs', 'jaune d\'œuf', 'jaune d\'oeuf',
  'miel', 'gelée royale', 'lactose', 'caséine', 'whey', 'protéine de lait'
]

// Ingrédients contenant du gluten
const glutenIngredients = [
  'blé', 'froment', 'épeautre', 'seigle', 'orge', 'avoine',
  'farine', 'pâtes', 'spaghetti', 'lasagne', 'pain', 'biscuit',
  'gâteau', 'pizza', 'tarte', 'quiche', 'pâte', 'pâte à pizza',
  'chapelure', 'panure', 'semoule', 'couscous', 'boulgour'
]

/**
 * Vérifie si une recette est végétarienne
 */
export function isVegetarian(ingredients: string[]): boolean {
  const normalizedIngredients = ingredients.map(ing => ing.toLowerCase().trim())
  
  for (const ingredient of normalizedIngredients) {
    for (const nonVeg of nonVegetarianIngredients) {
      if (ingredient.includes(nonVeg) || nonVeg.includes(ingredient)) {
        return false
      }
    }
  }
  
  return true
}

/**
 * Vérifie si une recette est vegan
 */
export function isVegan(ingredients: string[]): boolean {
  if (!isVegetarian(ingredients)) {
    return false
  }
  
  const normalizedIngredients = ingredients.map(ing => ing.toLowerCase().trim())
  
  for (const ingredient of normalizedIngredients) {
    for (const nonVegan of nonVeganIngredients) {
      if (ingredient.includes(nonVegan) || nonVegan.includes(ingredient)) {
        return false
      }
    }
  }
  
  return true
}

/**
 * Vérifie si une recette est sans gluten
 */
export function isGlutenFree(ingredients: string[]): boolean {
  const normalizedIngredients = ingredients.map(ing => ing.toLowerCase().trim())
  
  for (const ingredient of normalizedIngredients) {
    for (const gluten of glutenIngredients) {
      if (ingredient.includes(gluten) || gluten.includes(ingredient)) {
        return false
      }
    }
  }
  
  return true
}

