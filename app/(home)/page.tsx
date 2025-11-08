'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { IngredientInput } from '@/components/IngredientInput'
import { RecipeCard } from '@/components/RecipeCard'
import { RecipeCardSkeleton } from '@/components/RecipeCardSkeleton'
import { QuickSuggestions } from '@/components/QuickSuggestions'
import { RecipeFilters } from '@/components/RecipeFilters'
import { EmptyState } from '@/components/EmptyState'
import { StickyFilters } from '@/components/StickyFilters'
import { ArrowRight, Sparkles, ChefHat, Clock } from 'lucide-react'
import { normalizeIngredientName } from '@/lib/utils'
import type { RecipeCard as RecipeCardType } from '@/lib/types'

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [recipes, setRecipes] = useState<RecipeCardType[]>([])
  const [allRecipes, setAllRecipes] = useState<RecipeCardType[]>([]) // Stocker tous les résultats bruts
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasSearched, setHasSearched] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [timeFilter, setTimeFilter] = useState<'all' | 'fast' | 'medium' | 'slow'>('all')
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 1 | 2 | 3>('all')
  const [dietFilter, setDietFilter] = useState<'all' | 'vegetarian' | 'vegan' | 'gluten-free'>('all')
  const searchSectionRef = useRef<HTMLDivElement>(null)

  // Écouter l'événement de réinitialisation depuis le Header
  useEffect(() => {
    const handleReset = () => {
      setShowSearch(false)
      setIngredients([])
      setRecipes([])
      setAllRecipes([])
      setHasSearched(false)
      setError(null)
      setIsLoading(false)
      setTimeFilter('all')
      setDifficultyFilter('all')
      setDietFilter('all')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    window.addEventListener('resetHomePage', handleReset)
    return () => {
      window.removeEventListener('resetHomePage', handleReset)
    }
  }, [])

  const handleSearch = useCallback(async () => {
    if (ingredients.length === 0) {
      setRecipes([])
      setHasSearched(false)
      setShowSearch(false)
      return
    }

    setIsLoading(true)
    setError(null)
    setHasSearched(true)
    setShowSearch(true)

    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify({
          ingredients,
          limit: 30
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.details || errorData.message || 'Erreur lors de la recherche')
      }

      const data = await response.json()
      const allResults = data.results || []
      
      // Stocker tous les résultats bruts
      setAllRecipes(allResults)
      
      // Appliquer les filtres initiaux directement
      let filtered = [...allResults]
      
      if (timeFilter !== 'all') {
        filtered = filtered.filter((recipe) => {
          if (!recipe.timeMin) return false
          if (timeFilter === 'fast') return recipe.timeMin < 15
          if (timeFilter === 'medium') return recipe.timeMin >= 15 && recipe.timeMin <= 30
          if (timeFilter === 'slow') return recipe.timeMin > 30
          return true
        })
      }
      
      if (difficultyFilter !== 'all') {
        filtered = filtered.filter((recipe) => 
          recipe.difficulty === difficultyFilter
        )
      }
      
      // Appliquer le filtre de régime (basique - basé sur le titre et les ingrédients manquants)
      if (dietFilter !== 'all') {
        filtered = filtered.filter((recipe) => {
          const title = recipe.title.toLowerCase()
          const missing = recipe.missingIngredients || []
          const allIngredients = [...ingredients, ...missing].map(i => i.toLowerCase())
          
          if (dietFilter === 'vegetarian') {
            // Vérifier si la recette contient des viandes/poissons
            const nonVeg = ['poulet', 'boeuf', 'porc', 'saumon', 'thon', 'viande', 'poisson', 'jambon', 'bacon', 'lardons']
            return !nonVeg.some(ing => title.includes(ing) || allIngredients.some(a => a.includes(ing)))
          }
          
          if (dietFilter === 'vegan') {
            // Vérifier si la recette contient des viandes/poissons ou produits laitiers/œufs
            const nonVegan = ['poulet', 'boeuf', 'porc', 'saumon', 'thon', 'viande', 'poisson', 'jambon', 'bacon', 'lardons', 'fromage', 'lait', 'beurre', 'crème', 'œuf', 'oeuf']
            return !nonVegan.some(ing => title.includes(ing) || allIngredients.some(a => a.includes(ing)))
          }
          
          if (dietFilter === 'gluten-free') {
            // Vérifier si la recette contient du gluten
            const gluten = ['pâtes', 'pates', 'spaghetti', 'pain', 'farine', 'blé', 'froment']
            return !gluten.some(ing => title.includes(ing) || allIngredients.some(a => a.includes(ing)))
          }
          
          return true
        })
      }
      
      setRecipes(filtered)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
      setRecipes([])
      setAllRecipes([])
    } finally {
      setIsLoading(false)
    }
  }, [ingredients, timeFilter, difficultyFilter, dietFilter])

  // Fonction pour appliquer les filtres sur les résultats
  const applyFilters = useCallback((recipesToFilter: RecipeCardType[] = allRecipes) => {
    let filtered = [...recipesToFilter]
    
    // Appliquer le filtre de temps
    if (timeFilter !== 'all') {
      filtered = filtered.filter((recipe) => {
        if (!recipe.timeMin) return false
        if (timeFilter === 'fast') return recipe.timeMin < 15
        if (timeFilter === 'medium') return recipe.timeMin >= 15 && recipe.timeMin <= 30
        if (timeFilter === 'slow') return recipe.timeMin > 30
        return true
      })
    }
    
    // Appliquer le filtre de difficulté
    if (difficultyFilter !== 'all') {
      filtered = filtered.filter((recipe) => 
        recipe.difficulty === difficultyFilter
      )
    }
    
    // Appliquer le filtre de régime (basique - basé sur le titre et les ingrédients manquants)
    if (dietFilter !== 'all') {
      filtered = filtered.filter((recipe) => {
        const title = recipe.title.toLowerCase()
        const missing = recipe.missingIngredients || []
        const allIngredients = [...ingredients, ...missing].map(i => i.toLowerCase())
        
        if (dietFilter === 'vegetarian') {
          // Vérifier si la recette contient des viandes/poissons
          const nonVeg = ['poulet', 'boeuf', 'porc', 'saumon', 'thon', 'viande', 'poisson', 'jambon', 'bacon', 'lardons']
          return !nonVeg.some(ing => title.includes(ing) || allIngredients.some(a => a.includes(ing)))
        }
        
        if (dietFilter === 'vegan') {
          // Vérifier si la recette contient des viandes/poissons ou produits laitiers/œufs
          const nonVegan = ['poulet', 'boeuf', 'porc', 'saumon', 'thon', 'viande', 'poisson', 'jambon', 'bacon', 'lardons', 'fromage', 'lait', 'beurre', 'crème', 'œuf', 'oeuf']
          return !nonVegan.some(ing => title.includes(ing) || allIngredients.some(a => a.includes(ing)))
        }
        
        if (dietFilter === 'gluten-free') {
          // Vérifier si la recette contient du gluten
          const gluten = ['pâtes', 'pates', 'spaghetti', 'pain', 'farine', 'blé', 'froment']
          return !gluten.some(ing => title.includes(ing) || allIngredients.some(a => a.includes(ing)))
        }
        
        return true
      })
    }
    
    setRecipes(filtered)
  }, [timeFilter, difficultyFilter, dietFilter, allRecipes, ingredients])

  // Réappliquer les filtres quand ils changent
  useEffect(() => {
    if (allRecipes.length > 0 && hasSearched) {
      applyFilters()
    }
  }, [timeFilter, difficultyFilter, dietFilter, applyFilters, allRecipes.length, hasSearched])

  useEffect(() => {
    if (ingredients.length === 0) {
      setRecipes([])
      setAllRecipes([])
      setHasSearched(false)
      setShowSearch(false)
      return
    }
    // Ne plus déclencher automatiquement la recherche pour permettre d'ajouter plusieurs filtres
  }, [ingredients])

  return (
    <div className="min-h-full bg-background">
      <StickyFilters 
        ingredients={ingredients}
        onRemoveIngredient={(index) => setIngredients(ingredients.filter((_, i) => i !== index))}
        searchSectionRef={searchSectionRef}
      />
      
      {/* Hero Section - Landing Page */}
      {!showSearch && (
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/5" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 max-w-6xl relative z-10 w-full">
            <div className="text-center space-y-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 mb-6 animate-fade-in-up relative z-0">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight animate-fade-in-up-delay-150 relative z-0">
                <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                  EatThis
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl md:text-3xl text-muted-foreground max-w-3xl mx-auto font-light animate-fade-in-up-delay-300 relative z-0">
                Transformez vos ingrédients en recettes délicieuses
              </p>
              
              <p className="text-base sm:text-lg text-muted-foreground/80 max-w-2xl mx-auto animate-fade-in-up-delay-450 relative z-0">
                Dites-nous ce que vous avez, nous vous proposons des recettes réalisables en un instant
              </p>

              <div ref={searchSectionRef} className="max-w-2xl mx-auto mt-12 animate-fade-in-up-delay-600 relative z-10 space-y-6">
                <IngredientInput
                  ingredients={ingredients}
                  onIngredientsChange={(newIngredients) => {
                    setIngredients(newIngredients)
                  }}
                  onSearch={handleSearch}
                />
                <QuickSuggestions
                  selectedIngredients={ingredients}
                  onSelectIngredient={(ingredient) => {
                    const normalized = normalizeIngredientName(ingredient)
                    if (normalized && !ingredients.includes(normalized)) {
                      setIngredients([...ingredients, normalized])
                    }
                  }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-sm text-muted-foreground animate-fade-in-up-delay-750 relative z-0">
                <div className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5 text-primary" />
                  <span>100+ recettes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>Temps réel</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span>Suggestions intelligentes</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search Results Section */}
      {showSearch && (
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-7xl">
          {/* Barre de recherche pour ajouter d'autres filtres */}
          <div className="max-w-2xl mx-auto mb-8">
            <IngredientInput
              ingredients={ingredients}
              onIngredientsChange={(newIngredients) => {
                setIngredients(newIngredients)
                if (newIngredients.length === 0) {
                  setShowSearch(false)
                  setRecipes([])
                  setHasSearched(false)
                }
              }}
              onSearch={handleSearch}
            />
          </div>

          {error && (
            <div className="max-w-2xl mx-auto mb-8 p-5 bg-destructive/10 text-destructive rounded-2xl border border-destructive/20 text-sm sm:text-base">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="space-y-6">
              <div className="text-center py-8">
                <div className="inline-flex flex-col items-center gap-4 text-muted-foreground">
                  <div className="h-8 w-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-base font-medium">Recherche en cours...</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <RecipeCardSkeleton key={i} />
                ))}
              </div>
            </div>
          )}

          {!isLoading && recipes.length > 0 && (
            <div className="space-y-6 animate-fade-in-up-fast">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {recipes.length} recette{recipes.length > 1 ? 's' : ''} trouvée{recipes.length > 1 ? 's' : ''}
                  </h2>
                  {hasSearched && (timeFilter !== 'all' || difficultyFilter !== 'all' || dietFilter !== 'all') && (
                    <p className="text-sm text-muted-foreground">
                      Filtres actifs : {timeFilter !== 'all' && 'Temps'} {timeFilter !== 'all' && (difficultyFilter !== 'all' || dietFilter !== 'all') && '•'} {difficultyFilter !== 'all' && 'Difficulté'} {difficultyFilter !== 'all' && dietFilter !== 'all' && '•'} {dietFilter !== 'all' && 'Régime'}
                    </p>
                  )}
                </div>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSearch(false)
                    setIngredients([])
                    setRecipes([])
                    setHasSearched(false)
                    setTimeFilter('all')
                    setDifficultyFilter('all')
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="h-4 w-4 rotate-180" />
                  Retour à l&apos;accueil
                </Button>
              </div>
              
                    {hasSearched && allRecipes.length > 0 && (
                      <RecipeFilters
                        timeFilter={timeFilter}
                        difficultyFilter={difficultyFilter}
                        dietFilter={dietFilter}
                        onTimeFilterChange={setTimeFilter}
                        onDifficultyFilterChange={setDifficultyFilter}
                        onDietFilterChange={setDietFilter}
                      />
                    )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 lg:gap-6">
                {recipes.map((recipe, index) => (
                  <div
                    key={recipe.id}
                    className="animate-fade-in-up-fast"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <RecipeCard recipe={recipe} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoading && recipes.length === 0 && ingredients.length > 0 && !error && hasSearched && (
            <EmptyState
              type="no-results"
              onReset={() => {
                setIngredients([])
                setRecipes([])
                setHasSearched(false)
                setTimeFilter('all')
                setDifficultyFilter('all')
              }}
              onBackHome={() => {
                setShowSearch(false)
                setIngredients([])
                setRecipes([])
                setHasSearched(false)
                setTimeFilter('all')
                setDifficultyFilter('all')
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          )}

          {!isLoading && recipes.length === 0 && ingredients.length > 0 && !error && !hasSearched && (
            <EmptyState type="ready-to-search" />
          )}
        </section>
      )}
    </div>
  )
}

