'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Heart, ChefHat } from 'lucide-react'
import { useFavorites } from '@/hooks/useFavorites'
import { RecipeCard } from '@/components/RecipeCard'
import { RecipeCardSkeleton } from '@/components/RecipeCardSkeleton'
import type { RecipeCard as RecipeCardType } from '@/lib/types'

export default function FavoritesPage() {
  const { favorites } = useFavorites()
  const [recipes, setRecipes] = useState<RecipeCardType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFavorites() {
      if (favorites.length === 0) {
        setRecipes([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Récupérer les recettes favorites depuis l'API
        const response = await fetch('/api/recipes/batch', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ids: favorites })
        })

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des favoris')
        }

        const data = await response.json()
        setRecipes(data.recipes || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Une erreur est survenue')
        setRecipes([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchFavorites()
  }, [favorites])

  return (
    <div className="min-h-full bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
              <Heart className="h-5 w-5 text-red-500 fill-red-500" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Mes recettes favorites</h1>
              <p className="text-sm text-muted-foreground">
                {favorites.length} recette{favorites.length > 1 ? 's' : ''} sauvegardée{favorites.length > 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-5 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <RecipeCardSkeleton key={i} />
            ))}
          </div>
        )}

        {!isLoading && favorites.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl mb-2">Aucune recette favorite</CardTitle>
            <CardDescription className="mb-6">
              Ajoutez des recettes à vos favoris en cliquant sur le cœur sur les cartes de recettes.
            </CardDescription>
            <Link href="/">
              <Button variant="default">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Découvrir des recettes
              </Button>
            </Link>
          </Card>
        )}

        {!isLoading && recipes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
            {recipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

