'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from './ThemeToggle'
import { Sparkles } from 'lucide-react'

export function Header() {
  const router = useRouter()

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // Émettre un événement personnalisé pour réinitialiser l'état de la page d'accueil
    window.dispatchEvent(new CustomEvent('resetHomePage'))
    // Naviguer vers la page d'accueil
    router.push('/')
    // Scroll vers le haut
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link 
          href="/" 
          onClick={handleLogoClick}
          className="flex items-center gap-3 group"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-200">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            EatThis
          </span>
        </Link>
        
        <div className="flex items-center gap-3">
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}

