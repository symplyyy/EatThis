export type RecipeCard = {
  id: number;
  title: string;
  timeMin: number | null;
  difficulty: 1 | 2 | 3 | null;
  have: number;
  missing: number;
  score: number;
  imageUrl?: string | null;
  missingIngredients?: string[];  // Liste des ingrédients manquants
};

export type RecipeFull = {
  id: number;
  title: string;
  description: string | null;
  steps: string[];
  timeMin: number | null;
  difficulty: 1 | 2 | 3 | null;
  imageUrl: string | null;
  ingredients: string[];
};

export type IngredientSuggestion = {
  id: number;
  name: string;
};

