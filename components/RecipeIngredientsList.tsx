'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ShoppingCart, CheckCircle2, ListChecks } from 'lucide-react'
import { IngredientIcon } from '@/lib/ingredientIcons'
import { useShoppingList } from '@/hooks/useShoppingList'

interface RecipeIngredientsListProps {
  ingredients: string[]
  recipeId: number
  recipeTitle: string
}

export function RecipeIngredientsList({ ingredients, recipeId, recipeTitle }: RecipeIngredientsListProps) {
  const { addItems, list } = useShoppingList()
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([])
  const [isAdding, setIsAdding] = useState(false)

  // Vérifier quels ingrédients sont déjà dans la liste
  const existingIngredients = new Set(
    list.map(item => item.name.toLowerCase().trim())
  )

  const handleToggleIngredient = (ingredient: string) => {
    setSelectedIngredients(prev => {
      if (prev.includes(ingredient)) {
        return prev.filter(ing => ing !== ingredient)
      } else {
        return [...prev, ingredient]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedIngredients.length === ingredients.length) {
      setSelectedIngredients([])
    } else {
      setSelectedIngredients([...ingredients])
    }
  }

  const handleAddToShoppingList = () => {
    if (selectedIngredients.length === 0) return

    setIsAdding(true)
    addItems(selectedIngredients, recipeId, recipeTitle)
    
    // Réinitialiser la sélection après un court délai
    setTimeout(() => {
      setSelectedIngredients([])
      setIsAdding(false)
    }, 500)
  }

  const isIngredientInList = (ingredient: string) => {
    return existingIngredients.has(ingredient.toLowerCase().trim())
  }

  return (
    <Card className="animate-fade-in-up-fast">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <ListChecks className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">Ingrédients</CardTitle>
              <CardDescription className="text-base mt-2">
                {ingredients.length} ingrédient{ingredients.length > 1 ? 's' : ''} nécessaire{ingredients.length > 1 ? 's' : ''}
              </CardDescription>
            </div>
          </div>
          {ingredients.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              className="gap-2"
            >
              {selectedIngredients.length === ingredients.length ? 'Tout désélectionner' : 'Tout sélectionner'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ingredients.map((ingredient, index) => {
              const isSelected = selectedIngredients.includes(ingredient)
              const isInList = isIngredientInList(ingredient)
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ease-in-out group cursor-pointer ${
                    isSelected
                      ? 'bg-primary/10 border-2 border-primary'
                      : isInList
                      ? 'bg-green-500/10 border border-green-500/30'
                      : 'bg-muted/50 hover:bg-muted border border-transparent'
                  }`}
                  onClick={() => handleToggleIngredient(ingredient)}
                >
                  <Checkbox
                    checked={isSelected}
                    onCheckedChange={() => handleToggleIngredient(ingredient)}
                    className="h-5 w-5"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-background flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IngredientIcon name={ingredient} size="text-2xl" />
                  </div>
                  <span className={`flex-1 font-medium transition-colors duration-300 ${
                    isSelected
                      ? 'text-primary'
                      : isInList
                      ? 'text-green-700 dark:text-green-400'
                      : 'text-foreground group-hover:text-primary'
                  }`}>
                    {ingredient}
                  </span>
                  {isInList && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>
              )
            })}
          </div>
          
          {selectedIngredients.length > 0 && (
            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleAddToShoppingList}
                disabled={isAdding}
                className="w-full gap-2"
                size="lg"
              >
                <ShoppingCart className="h-5 w-5" />
                {isAdding 
                  ? 'Ajout en cours...' 
                  : `Ajouter ${selectedIngredients.length} ingrédient${selectedIngredients.length > 1 ? 's' : ''} à la liste`
                }
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

