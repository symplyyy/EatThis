'use client'

import { useState, useEffect, useRef, KeyboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { X, Search, Loader2 } from 'lucide-react'
import { IngredientIcon } from '@/lib/ingredientIcons'
import { normalizeIngredientName } from '@/lib/utils'
import type { IngredientSuggestion } from '@/lib/types'

interface IngredientInputProps {
  ingredients: string[]
  onIngredientsChange: (ingredients: string[]) => void
  onSearch: () => void
}

export function IngredientInput({ ingredients, onIngredientsChange, onSearch }: IngredientInputProps) {
  const [inputValue, setInputValue] = useState('')
  const [suggestions, setSuggestions] = useState<IngredientSuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout>()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Fermer la liste déroulante si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    if (showSuggestions) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showSuggestions])

  // Debounce pour l'autocomplete (200ms)
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    const query = inputValue.trim()
    if (query.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsLoading(true)
      try {
        // Ajouter un timestamp pour éviter le cache
        const timestamp = Date.now()
        const response = await fetch(`/api/autocomplete?q=${encodeURIComponent(query)}&limit=10&_t=${timestamp}`, {
          cache: 'no-store'  // Désactiver le cache
        })
        if (response.ok) {
          const text = await response.text()
          try {
            const data = JSON.parse(text)
            setSuggestions(data.suggestions || [])
            setShowSuggestions(true)
          } catch (parseError) {
            console.error('JSON parse error:', parseError, 'Response:', text)
            setSuggestions([])
            setShowSuggestions(false)
          }
        } else {
          const errorText = await response.text()
          console.error('Autocomplete API error:', response.status, errorText)
          setSuggestions([])
          setShowSuggestions(false)
        }
      } catch (error) {
        console.error('Autocomplete error:', error)
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setIsLoading(false)
      }
    }, 200)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [inputValue])

  const addIngredient = (name: string) => {
    // Utiliser la même fonction de normalisation que l'API de recherche
    const normalized = normalizeIngredientName(name)
    
    if (normalized && !ingredients.includes(normalized)) {
      const newIngredients = [...ingredients, normalized]
      onIngredientsChange(newIngredients)
      setInputValue('')
      setShowSuggestions(false)
      // La recherche sera déclenchée automatiquement par le useEffect dans app/page.tsx
    }
  }

  const removeIngredient = (index: number) => {
    onIngredientsChange(ingredients.filter((_, i) => i !== index))
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      addIngredient(inputValue)
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="relative" ref={containerRef}>
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Tapez un ingrédient (ex: oeufs, pates, saumon...)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (suggestions.length > 0) {
                setShowSuggestions(true)
              }
            }}
            className="w-full text-base sm:text-lg pl-12 focus:ring-2 focus:ring-primary/20 transition-all duration-200"
          />
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
            <Search className="h-5 w-5" />
          </div>
        </div>
        {isLoading && inputValue.trim().length >= 2 && (
          <div className="absolute z-[9999] w-full mt-2 bg-card border rounded-2xl shadow-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Recherche...</span>
            </div>
          </div>
        )}
        
        {showSuggestions && suggestions.length > 0 && !isLoading && (
          <div className="absolute z-[9999] w-full mt-2 bg-card border rounded-2xl shadow-xl max-h-64 sm:max-h-72 overflow-auto">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => addIngredient(suggestion.name)}
                className="w-full text-left px-4 sm:px-5 py-3.5 sm:py-4 hover:bg-accent active:bg-accent/80 hover:text-accent-foreground transition-all duration-300 ease-in-out flex items-center gap-3 sm:gap-4 group first:rounded-t-2xl last:rounded-b-2xl touch-manipulation"
              >
                <div className="flex-shrink-0">
                  <IngredientIcon name={suggestion.name} size="text-xl sm:text-2xl" />
                </div>
                <span className="flex-1 text-sm sm:text-base font-medium">{suggestion.name}</span>
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out" />
              </button>
            ))}
          </div>
        )}
        
        {showSuggestions && suggestions.length === 0 && !isLoading && inputValue.trim().length >= 2 && (
          <div className="absolute z-[9999] w-full mt-2 bg-card border rounded-2xl shadow-lg p-4">
            <p className="text-sm text-muted-foreground text-center">
              Aucun ingrédient trouvé
            </p>
          </div>
        )}
      </div>

      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2 sm:gap-3">
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full bg-primary/10 text-primary text-sm sm:text-base font-medium border border-primary/20 transition-all duration-300 ease-in-out hover:bg-primary/15 active:bg-primary/20 hover:scale-105 active:scale-95 touch-manipulation"
            >
              <IngredientIcon name={ingredient} size="text-lg sm:text-xl" />
              <span>{ingredient}</span>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="hover:text-destructive active:text-destructive/80 transition-all duration-300 ease-in-out ml-1 rounded-full p-1 hover:bg-destructive/10 active:bg-destructive/20 touch-manipulation min-w-[28px] min-h-[28px] flex items-center justify-center"
                aria-label={`Retirer ${ingredient}`}
              >
                <X className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Button
        onClick={onSearch}
        disabled={ingredients.length === 0}
        className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold touch-manipulation shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <Search className="mr-2 h-5 w-5" />
        Trouver des recettes
      </Button>
    </div>
  )
}

