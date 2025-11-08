/**
 * Utilitaires pour la gestion des favoris (localStorage)
 */

const FAVORITES_KEY = 'eatthis_favorites'

export function getFavorites(): number[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    if (!stored) return []
    return JSON.parse(stored) as number[]
  } catch (error) {
    console.error('Error reading favorites:', error)
    return []
  }
}

export function addFavorite(recipeId: number): void {
  if (typeof window === 'undefined') return
  
  try {
    const favorites = getFavorites()
    if (!favorites.includes(recipeId)) {
      favorites.push(recipeId)
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
      // Émettre un événement pour notifier les composants
      window.dispatchEvent(new CustomEvent('favoritesChanged'))
    }
  } catch (error) {
    console.error('Error adding favorite:', error)
  }
}

export function removeFavorite(recipeId: number): void {
  if (typeof window === 'undefined') return
  
  try {
    const favorites = getFavorites()
    const updated = favorites.filter(id => id !== recipeId)
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated))
    // Émettre un événement pour notifier les composants
    window.dispatchEvent(new CustomEvent('favoritesChanged'))
  } catch (error) {
    console.error('Error removing favorite:', error)
  }
}

export function toggleFavorite(recipeId: number): boolean {
  if (typeof window === 'undefined') return false
  
  const favorites = getFavorites()
  if (favorites.includes(recipeId)) {
    removeFavorite(recipeId)
    return false
  } else {
    addFavorite(recipeId)
    return true
  }
}

export function isFavorite(recipeId: number): boolean {
  if (typeof window === 'undefined') return false
  return getFavorites().includes(recipeId)
}

