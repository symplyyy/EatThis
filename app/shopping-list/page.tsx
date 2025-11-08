'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, ShoppingCart, CheckCircle2, Trash2, X } from 'lucide-react'
import { useShoppingList } from '@/hooks/useShoppingList'
import { Checkbox } from '@/components/ui/checkbox'

export default function ShoppingListPage() {
  const { list, count, toggleItem, removeItem, clear } = useShoppingList()
  const [groupedList, setGroupedList] = useState<Record<string, typeof list>>({})

  // Grouper par catégorie (simple pour l'instant)
  useState(() => {
    const grouped: Record<string, typeof list> = {
      'Autres': []
    }

    list.forEach(item => {
      // Catégorisation simple basée sur le nom
      const name = item.name.toLowerCase()
      let category = 'Autres'

      if (name.includes('tomate') || name.includes('carotte') || name.includes('oignon') || name.includes('ail') || name.includes('poivron') || name.includes('courgette') || name.includes('épinard') || name.includes('légume')) {
        category = 'Légumes'
      } else if (name.includes('poulet') || name.includes('boeuf') || name.includes('porc') || name.includes('saumon') || name.includes('thon') || name.includes('viande') || name.includes('poisson')) {
        category = 'Viandes & Poissons'
      } else if (name.includes('fromage') || name.includes('lait') || name.includes('crème') || name.includes('beurre') || name.includes('yaourt')) {
        category = 'Produits laitiers'
      } else if (name.includes('pâtes') || name.includes('riz') || name.includes('pain') || name.includes('farine') || name.includes('pomme de terre')) {
        category = 'Féculents'
      } else if (name.includes('huile') || name.includes('vinaigre') || name.includes('sel') || name.includes('poivre') || name.includes('épice')) {
        category = 'Condiments'
      } else if (name.includes('œuf') || name.includes('oeuf')) {
        category = 'Œufs'
      }

      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(item)
    })

    setGroupedList(grouped)
  })

  const uncheckedItems = list.filter(item => !item.checked)
  const checkedItems = list.filter(item => item.checked)

  return (
    <div className="min-h-full bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-4xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="icon" className="h-10 w-10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Ma liste de courses</h1>
                <p className="text-sm text-muted-foreground">
                  {count} article{count > 1 ? 's' : ''} à acheter
                </p>
              </div>
            </div>
          </div>
          {list.length > 0 && (
            <Button variant="outline" onClick={clear} className="gap-2">
              <Trash2 className="h-4 w-4" />
              Tout effacer
            </Button>
          )}
        </div>

        {list.length === 0 && (
          <Card className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl mb-2">Liste de courses vide</CardTitle>
            <CardContent className="mt-4">
              <p className="text-muted-foreground mb-6">
                Ajoutez des ingrédients manquants à votre liste de courses depuis les cartes de recettes.
              </p>
              <Link href="/">
                <Button variant="default">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Découvrir des recettes
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {uncheckedItems.length > 0 && (
          <div className="space-y-6 mb-8">
            <h2 className="text-lg font-semibold">À acheter ({uncheckedItems.length})</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {uncheckedItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors duration-200">
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(item.id)}
                        className="h-5 w-5"
                      />
                      <span className="flex-1 text-base font-medium">{item.name}</span>
                      {item.recipeTitle && (
                        <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                          {item.recipeTitle}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}

        {checkedItems.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold text-muted-foreground">Acheté ({checkedItems.length})</h2>
            <Card className="opacity-60">
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {checkedItems.map((item) => (
                    <li key={item.id} className="flex items-center gap-3 p-3 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="flex-1 text-base font-medium line-through text-muted-foreground">{item.name}</span>
                      {item.recipeTitle && (
                        <span className="text-xs text-muted-foreground px-2 py-1 rounded-full bg-muted">
                          {item.recipeTitle}
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

