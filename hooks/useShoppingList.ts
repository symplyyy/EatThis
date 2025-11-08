/**
 * Hook React pour gérer la liste de courses
 */

'use client'

import { useState, useEffect } from 'react'
import { 
  getShoppingList, 
  addToShoppingList, 
  removeFromShoppingList, 
  toggleShoppingListItem,
  clearShoppingList,
  getShoppingListCount,
  type ShoppingListItem
} from '@/lib/shoppingList'

export function useShoppingList() {
  const [list, setList] = useState<ShoppingListItem[]>([])

  useEffect(() => {
    // Charger la liste au montage
    setList(getShoppingList())

    // Écouter les changements
    const handleChange = () => {
      setList(getShoppingList())
    }

    window.addEventListener('shoppingListChanged', handleChange)
    return () => {
      window.removeEventListener('shoppingListChanged', handleChange)
    }
  }, [])

  return {
    list,
    count: getShoppingListCount(),
    addItems: (ingredients: string[], recipeId?: number, recipeTitle?: string) => {
      addToShoppingList(ingredients, recipeId, recipeTitle)
      setList(getShoppingList())
    },
    removeItem: (itemId: string) => {
      removeFromShoppingList(itemId)
      setList(getShoppingList())
    },
    toggleItem: (itemId: string) => {
      toggleShoppingListItem(itemId)
      setList(getShoppingList())
    },
    clear: () => {
      clearShoppingList()
      setList([])
    }
  }
}

