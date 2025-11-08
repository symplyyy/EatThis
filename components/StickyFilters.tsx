'use client'

import { useState, useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { IngredientIcon } from '@/lib/ingredientIcons'

interface StickyFiltersProps {
  ingredients: string[]
  onRemoveIngredient: (index: number) => void
  searchSectionRef?: React.RefObject<HTMLDivElement>
}

export function StickyFilters({ ingredients, onRemoveIngredient, searchSectionRef }: StickyFiltersProps) {
  const [isVisible, setIsVisible] = useState(false)
  const stickyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ingredients.length === 0) {
      setIsVisible(false)
      return
    }

    const handleScroll = () => {
      if (!searchSectionRef?.current) {
        // Si pas de ref, afficher toujours en mobile
        setIsVisible(true)
        return
      }

      const searchSection = searchSectionRef.current
      const rect = searchSection.getBoundingClientRect()
      
      // Si la section de recherche est hors de la vue (en haut), afficher le sticky
      // On vérifie si le bas de la section est au-dessus du haut de l'écran
      const isSectionAboveViewport = rect.bottom < 0
      
      setIsVisible(isSectionAboveViewport)
    }

    // Vérifier immédiatement
    handleScroll()

    // Écouter le scroll
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [ingredients.length, searchSectionRef])

  if (ingredients.length === 0) {
    return null
  }

  return (
    <div
      ref={stickyRef}
      className={`sticky top-0 z-40 md:hidden bg-background/95 backdrop-blur-sm border-b border-border shadow-sm transition-all duration-300 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-full pointer-events-none'
      }`}
      style={{ display: isVisible ? 'block' : 'none' }}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20 flex-shrink-0 touch-manipulation"
            >
              <IngredientIcon name={ingredient} size="text-base" />
              <span className="whitespace-nowrap">{ingredient}</span>
              <button
                type="button"
                onClick={() => onRemoveIngredient(index)}
                className="hover:text-destructive active:text-destructive/80 transition-colors ml-0.5 rounded-full p-0.5 hover:bg-destructive/10 active:bg-destructive/20 touch-manipulation min-w-[24px] min-h-[24px] flex items-center justify-center"
                aria-label={`Retirer ${ingredient}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

