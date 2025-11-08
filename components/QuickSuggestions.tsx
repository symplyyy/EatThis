'use client'

import { Button } from '@/components/ui/button'
import { IngredientIcon } from '@/lib/ingredientIcons'
import { Sparkles } from 'lucide-react'

const popularIngredients = [
  'oeufs',
  'pâtes',
  'riz',
  'tomate',
  'fromage',
  'poulet',
  'oignon',
  'ail',
  'beurre',
  'farine'
]

interface QuickSuggestionsProps {
  onSelectIngredient: (ingredient: string) => void
  selectedIngredients: string[]
}

export function QuickSuggestions({ onSelectIngredient, selectedIngredients }: QuickSuggestionsProps) {
  const availableIngredients = popularIngredients.filter(
    ing => !selectedIngredients.includes(ing)
  )

  if (availableIngredients.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="font-medium">Suggestions rapides</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {availableIngredients.slice(0, 8).map((ingredient) => (
          <Button
            key={ingredient}
            variant="outline"
            size="sm"
            onClick={() => onSelectIngredient(ingredient)}
            className="h-9 px-3 rounded-full gap-2 hover:bg-primary/10 hover:border-primary/30 hover:scale-105 transition-all duration-300 ease-in-out"
          >
            <IngredientIcon name={ingredient} size="text-base" />
            <span className="text-sm font-medium capitalize">{ingredient}</span>
          </Button>
        ))}
      </div>
    </div>
  )
}

