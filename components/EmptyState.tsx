'use client'

import { ChefHat, Search, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  type: 'no-results' | 'ready-to-search' | 'no-ingredients'
  onReset?: () => void
  onBackHome?: () => void
}

export function EmptyState({ type, onReset, onBackHome }: EmptyStateProps) {
  const configs = {
    'no-results': {
      icon: Search,
      title: 'Aucune recette trouvée',
      description: 'Essayez d\'ajouter ou de modifier vos ingrédients pour découvrir plus de recettes.',
      showActions: true
    },
    'ready-to-search': {
      icon: Sparkles,
      title: 'Prêt à rechercher',
      description: 'Ajoutez des ingrédients et cliquez sur "Trouver des recettes" pour lancer la recherche.',
      showActions: false
    },
    'no-ingredients': {
      icon: ChefHat,
      title: 'Commencez votre recherche',
      description: 'Ajoutez des ingrédients pour découvrir des recettes délicieuses.',
      showActions: false
    }
  }

  const config = configs[type]
  const Icon = config.icon

  return (
    <div className="text-center py-20 px-4">
      <div className="max-w-md mx-auto space-y-6">
        <div className="relative inline-flex">
          <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />
          <div className="relative w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto border-2 border-primary/20">
            <Icon className="h-10 w-10 text-primary" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-bold tracking-tight">{config.title}</h3>
          <p className="text-muted-foreground text-base leading-relaxed">
            {config.description}
          </p>
        </div>
        {config.showActions && (
          <div className="flex gap-3 justify-center pt-2">
            {onReset && (
              <Button
                variant="outline"
                onClick={onReset}
                className="min-w-[120px]"
              >
                Réinitialiser
              </Button>
            )}
            {onBackHome && (
              <Button
                variant="default"
                onClick={onBackHome}
                className="min-w-[120px]"
              >
                Retour à l'accueil
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

