'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Éviter le flash de contenu non stylisé
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    // Utiliser resolvedTheme pour obtenir le thème réel (même si c'est "system")
    const currentTheme = resolvedTheme || theme
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark'
    
    // Ajouter une classe pour l'animation de transition
    document.documentElement.classList.add('theme-transitioning')
    document.body.classList.add('theme-transitioning')
    
    setTheme(newTheme)
    
    // Retirer la classe après la transition
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning')
      document.body.classList.remove('theme-transitioning')
    }, 300)
  }

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        className="h-10 w-10 rounded-2xl"
        aria-label="Toggle theme"
        disabled
      >
        <Sun className="h-5 w-5" />
      </Button>
    )
  }

  // Utiliser resolvedTheme pour déterminer l'icône à afficher
  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="h-10 w-10 rounded-2xl transition-all hover:bg-accent hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-transform hover:rotate-12" />
      ) : (
        <Moon className="h-5 w-5 transition-transform hover:-rotate-12" />
      )}
    </Button>
  )
}

