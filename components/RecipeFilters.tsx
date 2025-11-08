'use client'

import { Button } from '@/components/ui/button'
import { Clock, ChefHat } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RecipeFiltersProps {
  timeFilter: 'all' | 'fast' | 'medium' | 'slow'
  difficultyFilter: 'all' | 1 | 2 | 3
  onTimeFilterChange: (filter: 'all' | 'fast' | 'medium' | 'slow') => void
  onDifficultyFilterChange: (filter: 'all' | 1 | 2 | 3) => void
}

export function RecipeFilters({
  timeFilter,
  difficultyFilter,
  onTimeFilterChange,
  onDifficultyFilterChange
}: RecipeFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Temps :</span>
        <div className="flex gap-2">
          {(['all', 'fast', 'medium', 'slow'] as const).map((filter) => (
            <Button
              key={filter}
              variant={timeFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => onTimeFilterChange(filter)}
                className={cn(
                "h-8 px-3 rounded-full text-xs font-medium transition-all duration-300 ease-in-out",
                timeFilter === filter && "shadow-sm"
              )}
            >
              {filter === 'all' ? 'Tous' : filter === 'fast' ? '< 15 min' : filter === 'medium' ? '15-30 min' : '> 30 min'}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <ChefHat className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">Difficulté :</span>
        <div className="flex gap-2">
          {(['all', 1, 2, 3] as const).map((filter) => (
            <Button
              key={filter}
              variant={difficultyFilter === filter ? 'default' : 'outline'}
              size="sm"
              onClick={() => onDifficultyFilterChange(filter)}
                className={cn(
                "h-8 px-3 rounded-full text-xs font-medium transition-all duration-300 ease-in-out",
                difficultyFilter === filter && "shadow-sm"
              )}
            >
              {filter === 'all' ? 'Tous' : filter === 1 ? 'Facile' : filter === 2 ? 'Moyen' : 'Difficile'}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

