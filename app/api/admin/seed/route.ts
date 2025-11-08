import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabaseServer'
import { getRecipeImageUrl } from '@/lib/recipeImages'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'autorisation via service role key
    const authHeader = request.headers.get('authorization')
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    if (token !== serviceRoleKey) {
      return NextResponse.json(
        { error: 'Invalid authorization token' },
        { status: 403 }
      )
    }

    // Données de démo - Plus de recettes pour tester l'application
    const demoRecipes = [
      {
        title: 'Omelette aux champignons',
        description: 'Une omelette simple et savoureuse',
        steps: [
          'Casser les œufs dans un bol',
          'Battre les œufs',
          'Faire chauffer une poêle avec un peu de beurre',
          'Verser les œufs battus',
          'Ajouter les champignons',
          'Cuire 3-4 minutes de chaque côté'
        ],
        time_min: 10,
        difficulty: 1,
        ingredients: ['œufs', 'champignons', 'beurre', 'sel', 'poivre']
      },
      {
        title: 'Pâtes au saumon fumé',
        description: 'Un plat rapide et délicieux',
        steps: [
          'Faire cuire les pâtes dans l\'eau bouillante salée',
          'Pendant ce temps, couper le saumon en morceaux',
          'Égoutter les pâtes',
          'Mélanger avec le saumon et la crème',
          'Servir chaud'
        ],
        time_min: 15,
        difficulty: 1,
        ingredients: ['pâtes', 'saumon fumé', 'crème fraîche', 'sel', 'poivre']
      },
      {
        title: 'Salade César',
        description: 'Une salade classique et rafraîchissante',
        steps: [
          'Laver et couper la laitue',
          'Préparer la sauce César',
          'Mélanger la laitue avec la sauce',
          'Ajouter les croûtons et le parmesan',
          'Servir immédiatement'
        ],
        time_min: 20,
        difficulty: 1,
        ingredients: ['laitue', 'parmesan', 'croûtons', 'sauce césar']
      },
      {
        title: 'Omelette au fromage',
        description: 'Omelette classique avec du fromage',
        steps: [
          'Casser 3 œufs dans un bol',
          'Battre les œufs avec du sel et du poivre',
          'Faire chauffer une poêle avec du beurre',
          'Verser les œufs battus',
          'Ajouter le fromage râpé',
          'Plier l\'omelette en deux et cuire 2 minutes de plus'
        ],
        time_min: 8,
        difficulty: 1,
        ingredients: ['œufs', 'fromage', 'beurre', 'sel', 'poivre']
      },
      {
        title: 'Spaghetti à la carbonara',
        description: 'Plat italien traditionnel',
        steps: [
          'Faire cuire les spaghetti dans l\'eau bouillante salée',
          'Pendant ce temps, battre les œufs avec le parmesan',
          'Faire revenir les lardons dans une poêle',
          'Égoutter les pâtes et les mélanger avec les lardons',
          'Ajouter le mélange œufs-parmesan hors du feu',
          'Servir immédiatement'
        ],
        time_min: 20,
        difficulty: 2,
        ingredients: ['spaghetti', 'œufs', 'lardons', 'parmesan', 'poivre']
      },
      {
        title: 'Risotto aux champignons',
        description: 'Risotto crémeux aux champignons',
        steps: [
          'Faire revenir les champignons dans une poêle',
          'Dans une casserole, faire revenir l\'oignon',
          'Ajouter le riz et faire nacrer',
          'Ajouter le vin blanc et laisser évaporer',
          'Ajouter le bouillon progressivement en remuant',
          'Ajouter les champignons et le parmesan en fin de cuisson'
        ],
        time_min: 30,
        difficulty: 2,
        ingredients: ['riz arborio', 'champignons', 'oignon', 'vin blanc', 'bouillon', 'parmesan']
      },
      {
        title: 'Salade de tomates et mozzarella',
        description: 'Salade fraîche et simple',
        steps: [
          'Couper les tomates en rondelles',
          'Couper la mozzarella en rondelles',
          'Disposer en alternance sur une assiette',
          'Arroser d\'huile d\'olive et de vinaigre balsamique',
          'Ajouter du basilic frais',
          'Saler et poivrer'
        ],
        time_min: 10,
        difficulty: 1,
        ingredients: ['tomates', 'mozzarella', 'huile d\'olive', 'vinaigre balsamique', 'basilic', 'sel', 'poivre']
      },
      {
        title: 'Poulet rôti aux herbes',
        description: 'Poulet rôti savoureux',
        steps: [
          'Préchauffer le four à 200°C',
          'Mélanger les herbes avec de l\'huile d\'olive',
          'Badigeonner le poulet avec le mélange',
          'Enfourner pour 45 minutes',
          'Vérifier la cuisson',
          'Laisser reposer 10 minutes avant de servir'
        ],
        time_min: 60,
        difficulty: 2,
        ingredients: ['poulet', 'herbes de provence', 'huile d\'olive', 'sel', 'poivre']
      }
    ]

    const insertedRecipes = []

    for (const recipeData of demoRecipes) {
      // Générer l'URL de l'image pour cette recette
      const imageUrl = getRecipeImageUrl(recipeData.title)
      
      // Insérer la recette
      const { data: recipe, error: recipeError } = await supabaseServer
        .from('recipes')
        .insert({
          title: recipeData.title,
          description: recipeData.description,
          steps: recipeData.steps,
          time_min: recipeData.time_min,
          difficulty: recipeData.difficulty,
          image_url: imageUrl
        })
        .select()
        .single()

      if (recipeError) {
        console.error('Error inserting recipe:', recipeError)
        continue
      }

      // Insérer les ingrédients et les relations
      for (const ingredientName of recipeData.ingredients) {
        // Vérifier si l'ingrédient existe déjà
        let { data: ingredient } = await supabaseServer
          .from('ingredients')
          .select('id')
          .eq('name', ingredientName)
          .single()

        // Créer l'ingrédient s'il n'existe pas
        if (!ingredient) {
          const { data: newIngredient, error: ingError } = await supabaseServer
            .from('ingredients')
            .insert({ name: ingredientName })
            .select()
            .single()

          if (ingError || !newIngredient) {
            console.error('Error inserting ingredient:', ingError)
            continue
          }
          ingredient = newIngredient
        }

        // Créer la relation recipe_ingredients (ingredient ne peut plus être null ici)
        if (ingredient && ingredient.id) {
          await supabaseServer
            .from('recipe_ingredients')
            .insert({
              recipe_id: recipe.id,
              ingredient_id: ingredient.id
            })
        }
      }

      insertedRecipes.push(recipe.id)
    }

    return NextResponse.json({
      success: true,
      inserted: insertedRecipes.length,
      recipeIds: insertedRecipes
    })
  } catch (error) {
    console.error('Seed API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

