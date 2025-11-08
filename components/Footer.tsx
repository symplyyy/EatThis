'use client'

import Link from 'next/link'
import { Sparkles, Github, Mail, Heart } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border/40 bg-background/95 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all duration-300 ease-in-out">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                EatThis
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Transformez vos ingrédients en recettes délicieuses. Découvrez des recettes adaptées à ce que vous avez déjà dans votre frigo.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                  Accueil
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out inline-flex items-center gap-2 group"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-primary/0 group-hover:bg-primary transition-all duration-300" />
                  Rechercher des recettes
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out inline-flex items-center gap-2 group"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              </li>
              <li>
                <a 
                  href="mailto:contact@eatthis.app" 
                  className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out inline-flex items-center gap-2 group"
                >
                  <Mail className="h-4 w-4" />
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © {currentYear} EatThis. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Fait avec</span>
            <Heart className="h-4 w-4 text-red-500 fill-red-500 animate-pulse" />
            <span>pour les food lovers</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

