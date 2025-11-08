/**
 * Hook React pour gérer les favoris
 */

'use client'

import { useState, useEffect } from 'react'
import { getFavorites, addFavorite, removeFavorite, toggleFavorite, isFavorite } from '@/lib/favorites'

export function useFavorites() {
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    // Charger les favoris au montage
    setFavorites(getFavorites())

    // Écouter les changements
    const handleChange = () => {
      setFavorites(getFavorites())
    }

    window.addEventListener('favoritesChanged', handleChange)
    return () => {
      window.removeEventListener('favoritesChanged', handleChange)
    }
  }, [])

  return {
    favorites,
    isFavorite: (recipeId: number) => isFavorite(recipeId),
    addFavorite: (recipeId: number) => {
      addFavorite(recipeId)
      setFavorites(getFavorites())
    },
    removeFavorite: (recipeId: number) => {
      removeFavorite(recipeId)
      setFavorites(getFavorites())
    },
    toggleFavorite: (recipeId: number) => {
      const isNowFavorite = toggleFavorite(recipeId)
      setFavorites(getFavorites())
      return isNowFavorite
    }
  }
}

