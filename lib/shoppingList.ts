/**
 * Utilitaires pour la gestion de la liste de courses (localStorage)
 */

const SHOPPING_LIST_KEY = 'eatthis_shopping_list'

export type ShoppingListItem = {
  id: string
  name: string
  checked: boolean
  recipeId?: number
  recipeTitle?: string
}

export function getShoppingList(): ShoppingListItem[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(SHOPPING_LIST_KEY)
    if (!stored) return []
    return JSON.parse(stored) as ShoppingListItem[]
  } catch (error) {
    console.error('Error reading shopping list:', error)
    return []
  }
}

export function addToShoppingList(ingredients: string[], recipeId?: number, recipeTitle?: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const list = getShoppingList()
    const existingNames = new Set(list.map(item => item.name.toLowerCase()))
    
    ingredients.forEach(ingredient => {
      const normalized = ingredient.toLowerCase().trim()
      if (normalized && !existingNames.has(normalized)) {
        list.push({
          id: `${Date.now()}-${Math.random()}`,
          name: ingredient,
          checked: false,
          recipeId,
          recipeTitle
        })
        existingNames.add(normalized)
      }
    })
    
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(list))
    window.dispatchEvent(new CustomEvent('shoppingListChanged'))
  } catch (error) {
    console.error('Error adding to shopping list:', error)
  }
}

export function removeFromShoppingList(itemId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const list = getShoppingList()
    const updated = list.filter(item => item.id !== itemId)
    localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('shoppingListChanged'))
  } catch (error) {
    console.error('Error removing from shopping list:', error)
  }
}

export function toggleShoppingListItem(itemId: string): void {
  if (typeof window === 'undefined') return
  
  try {
    const list = getShoppingList()
    const item = list.find(i => i.id === itemId)
    if (item) {
      item.checked = !item.checked
      localStorage.setItem(SHOPPING_LIST_KEY, JSON.stringify(list))
      window.dispatchEvent(new CustomEvent('shoppingListChanged'))
    }
  } catch (error) {
    console.error('Error toggling shopping list item:', error)
  }
}

export function clearShoppingList(): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.removeItem(SHOPPING_LIST_KEY)
    window.dispatchEvent(new CustomEvent('shoppingListChanged'))
  } catch (error) {
    console.error('Error clearing shopping list:', error)
  }
}

export function getShoppingListCount(): number {
  return getShoppingList().filter(item => !item.checked).length
}

