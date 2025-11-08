import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Clock, ChefHat, CheckCircle2, ListChecks } from 'lucide-react'
import { supabaseServer } from '@/lib/supabaseServer'
import { IngredientIcon } from '@/lib/ingredientIcons'
import { RecipeImage } from '@/components/RecipeImage'
import { RecipeTimer } from '@/components/RecipeTimer'
import type { RecipeFull } from '@/lib/types'

async function getRecipe(id: number): Promise<RecipeFull | null> {
  try {
    const { data, error } = await supabaseServer
      .from('v_recipe_with_ingredients')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      console.error('Supabase query error:', error)
      return null
    }

    const recipe: RecipeFull = {
      id: data.id,
      title: data.title,
      description: data.description,
      steps: data.steps || [],
      timeMin: data.time_min,
      difficulty: data.difficulty,
      imageUrl: data.image_url,
      ingredients: data.ingredients || []
    }

    recipe.ingredients = [...new Set(recipe.ingredients)].sort()

    return recipe
  } catch (error) {
    console.error('Error fetching recipe:', error)
    return null
  }
}

async function getAverageTime(recipeId: number): Promise<number | null> {
  try {
    const { data, error } = await supabaseServer
      .from('recipe_times')
      .select('time_seconds')
      .eq('recipe_id', recipeId)

    if (error || !data || data.length === 0) {
      return null
    }

    const totalSeconds = data.reduce((sum, item) => sum + item.time_seconds, 0)
    const averageSeconds = Math.round(totalSeconds / data.length)
    return Math.round(averageSeconds / 60)
  } catch (error) {
    console.error('Error fetching average time:', error)
    return null
  }
}

const difficultyLabels = {
  1: 'Facile',
  2: 'Moyen',
  3: 'Difficile'
}

const difficultyColors = {
  1: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20',
  2: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20',
  3: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20'
}

const difficultyIcons = {
  1: '🟢',
  2: '🟡',
  3: '🔴'
}

export default async function RecipePage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10)
  const recipe = await getRecipe(id)
  const averageTimeMinutes = recipe ? await getAverageTime(recipe.id) : null

  if (!recipe) {
    return (
      <div className="min-h-full bg-background">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <div className="text-center space-y-6 animate-fade-in-up">
            <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto">
              <ChefHat className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Recette introuvable</h1>
            <p className="text-muted-foreground text-lg">La recette demandée n'existe pas.</p>
            <Link href="/">
              <Button variant="default" size="lg" className="mt-4">
                <ArrowLeft className="mr-2 h-5 w-5" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full bg-background">
      {/* Hero Section avec image */}
      <div className="relative w-full h-[50vh] min-h-[400px] max-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-10" />
        <RecipeImage
          src={recipe.imageUrl}
          alt={recipe.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority
        />
        <div className="absolute inset-0 z-20 flex flex-col justify-end">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 max-w-6xl">
            <Link href="/">
              <Button 
                variant="ghost" 
                size="lg"
                className="mb-6 backdrop-blur-md bg-background/60 hover:bg-background/80 text-foreground border border-border/50 shadow-lg"
              >
                <ArrowLeft className="mr-2 h-5 w-5" />
                Retour
              </Button>
            </Link>
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground drop-shadow-lg">
                {recipe.title}
              </h1>
              
              {recipe.description && (
                <p className="text-lg sm:text-xl text-foreground/90 max-w-3xl drop-shadow-md">
                  {recipe.description}
                </p>
              )}

              {/* Badges temps et difficulté */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {recipe.timeMin && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/80 backdrop-blur-md border border-border/50 shadow-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-semibold text-foreground">{recipe.timeMin} min</span>
                  </div>
                )}
                {recipe.difficulty && (
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-md shadow-lg ${difficultyColors[recipe.difficulty]}`}>
                    <span className="text-lg">{difficultyIcons[recipe.difficulty]}</span>
                    <ChefHat className="h-5 w-5" />
                    <span className="font-semibold">{difficultyLabels[recipe.difficulty]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Colonne principale - Ingrédients et Étapes */}
          <div className="lg:col-span-2 space-y-6">
            {/* Ingrédients */}
            <Card className="animate-fade-in-up-fast">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ListChecks className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Ingrédients</CardTitle>
                </div>
                <CardDescription className="text-base mt-2">
                  {recipe.ingredients.length} ingrédient{recipe.ingredients.length > 1 ? 's' : ''} nécessaire{recipe.ingredients.length > 1 ? 's' : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-all duration-300 ease-in-out group"
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-background flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <IngredientIcon name={ingredient} size="text-2xl" />
                      </div>
                      <span className="flex-1 font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                        {ingredient}
                      </span>
                      <CheckCircle2 className="h-5 w-5 text-muted-foreground/50 group-hover:text-primary transition-colors duration-300" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Étapes de préparation */}
            <Card className="animate-fade-in-up-fast" style={{ animationDelay: '100ms' }}>
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <ChefHat className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Étapes de préparation</CardTitle>
                </div>
                <CardDescription className="text-base mt-2">
                  {recipe.steps.length} étape{recipe.steps.length > 1 ? 's' : ''} à suivre
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {recipe.steps.map((step, index) => (
                    <li
                      key={index}
                      className="flex gap-4 group"
                    >
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm group-hover:scale-110 transition-transform duration-300 ease-in-out shadow-sm">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-foreground leading-relaxed group-hover:text-primary/90 transition-colors duration-300">
                          {step}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Timer */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {recipe.timeMin && (
                <div className="animate-fade-in-up-fast" style={{ animationDelay: '200ms' }}>
                  <RecipeTimer 
                    recipeId={recipe.id}
                    timeMinutes={recipe.timeMin}
                    averageTimeMinutes={averageTimeMinutes}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
