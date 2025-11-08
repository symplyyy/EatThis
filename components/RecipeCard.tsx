'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, ChefHat, ImageIcon, HelpCircle, Heart, ShoppingCart } from 'lucide-react'
import { convertToPlaceholder } from '@/lib/utils'
import { useFavorites } from '@/hooks/useFavorites'
import { useShoppingList } from '@/hooks/useShoppingList'
import type { RecipeCard as RecipeCardType } from '@/lib/types'

interface RecipeCardProps {
  recipe: RecipeCardType
}

const difficultyLabels = {
  1: 'Facile',
  2: 'Moyen',
  3: 'Difficile'
}

const difficultyColors = {
  1: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  2: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  3: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const { isFavorite, toggleFavorite } = useFavorites()
  const { addItems } = useShoppingList()
  const isComplete = recipe.missing === 0
  const favorite = isFavorite(recipe.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(recipe.id)
  }

  const handleAddToShoppingList = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (recipe.missingIngredients && recipe.missingIngredients.length > 0) {
      addItems(recipe.missingIngredients, recipe.id, recipe.title)
    }
  }

  return (
    <Card className="group h-full flex flex-col overflow-hidden relative border border-border/50 hover:border-primary/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 ease-in-out">
      <Link href={`/r/${recipe.id}`} className="block h-full flex flex-col touch-manipulation">
        <div className="relative w-full h-48 sm:h-56 md:h-64 overflow-hidden rounded-t-2xl bg-muted group-hover:shadow-lg transition-shadow duration-300 ease-in-out">
          {/* Bouton Favori */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-300 ease-in-out shadow-lg"
            onClick={handleFavoriteClick}
          >
            <Heart 
              className={`h-5 w-5 transition-all duration-300 ease-in-out ${
                favorite 
                  ? 'fill-red-500 text-red-500 scale-110' 
                  : 'text-muted-foreground hover:text-red-500'
              }`}
            />
          </Button>
          
          {isComplete && (
            <div className="absolute top-3 left-3 z-10 bg-green-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <span>✓</span>
              <span>Tous les ingrédients</span>
            </div>
          )}
          {recipe.timeMin && recipe.timeMin < 15 && (
            <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground text-xs font-bold px-2.5 py-1 rounded-full shadow-lg flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Rapide</span>
            </div>
          )}
          {(() => {
            const imageSrc = convertToPlaceholder(recipe.imageUrl, recipe.title)
            return imageSrc ? (
              <Image
                src={imageSrc}
                alt={recipe.title}
                fill
                className="object-cover transition-all duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const placeholder = target.parentElement?.querySelector('.image-placeholder') as HTMLElement
                  if (placeholder) {
                    placeholder.style.display = 'flex'
                  }
                }}
              />
            ) : null
          })()}
          <div className={`absolute inset-0 flex items-center justify-center ${recipe.imageUrl ? 'image-placeholder hidden' : ''}`}>
            <div className="text-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground/70">Aucune image</p>
            </div>
          </div>
        </div>
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="line-clamp-2 text-lg sm:text-xl font-semibold leading-tight mb-2 group-hover:text-primary transition-colors duration-300 ease-in-out">
            {recipe.title}
          </CardTitle>
          <CardDescription className="flex items-center gap-3 sm:gap-4 flex-wrap mt-2">
            {recipe.timeMin && (
              <span className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {recipe.timeMin} min
              </span>
            )}
            {recipe.difficulty && (
              <span className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium ${difficultyColors[recipe.difficulty]}`}>
                <ChefHat className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                {difficultyLabels[recipe.difficulty]}
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 relative pt-0 pb-4 sm:pb-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm sm:text-base">
              <span className="text-muted-foreground">Ingrédients disponibles</span>
              <span className="font-semibold text-green-600 dark:text-green-400 text-lg sm:text-xl">{recipe.have}</span>
            </div>
            {recipe.missing > 0 ? (
              <div className="flex items-center justify-between text-sm sm:text-base">
                <span className="text-muted-foreground">Ingrédients manquants</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-orange-600 dark:text-orange-400 text-lg sm:text-xl">{recipe.missing}</span>
                  {recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
                    <div 
                      className="relative inline-block z-10"
                      onMouseEnter={() => setShowTooltip(true)}
                      onMouseLeave={() => setShowTooltip(false)}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                      }}
                    >
                      <HelpCircle 
                        className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground cursor-pointer hover:text-foreground transition-colors bg-background/80 rounded-full p-0.5 touch-manipulation"
                      />
                      {showTooltip && (
                        <div className="absolute right-0 bottom-full mb-2 z-[100] w-64 sm:w-72">
                          <div className="bg-popover border rounded-2xl shadow-xl p-3 sm:p-4 text-xs sm:text-sm">
                            <div className="font-semibold mb-2 text-foreground">Ingrédients manquants :</div>
                            <ul className="space-y-1.5 max-h-48 overflow-y-auto">
                              {recipe.missingIngredients.slice(0, 10).map((ingredient, index) => (
                                <li key={index} className="text-muted-foreground">• {ingredient}</li>
                              ))}
                              {recipe.missingIngredients.length > 10 && (
                                <li className="text-muted-foreground italic">... et {recipe.missingIngredients.length - 10} autre(s)</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm sm:text-base font-semibold text-green-600 dark:text-green-400 text-center py-2 flex items-center justify-center gap-2">
                <span className="text-lg">✨</span>
                <span>Tous les ingrédients disponibles</span>
              </div>
            )}
          </div>
          {/* Bouton Ajouter à la liste de courses */}
          {recipe.missing > 0 && recipe.missingIngredients && recipe.missingIngredients.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full gap-2"
              onClick={handleAddToShoppingList}
            >
              <ShoppingCart className="h-4 w-4" />
              Ajouter à la liste
            </Button>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}

