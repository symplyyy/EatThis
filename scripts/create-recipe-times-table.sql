-- Table pour stocker les temps de réalisation des recettes
CREATE TABLE IF NOT EXISTS recipe_times (
  id BIGSERIAL PRIMARY KEY,
  recipe_id BIGINT NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  time_seconds INTEGER NOT NULL CHECK (time_seconds > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances des requêtes
CREATE INDEX IF NOT EXISTS idx_recipe_times_recipe_id ON recipe_times(recipe_id);
CREATE INDEX IF NOT EXISTS idx_recipe_times_created_at ON recipe_times(created_at);

-- Fonction pour calculer le temps moyen d'une recette
CREATE OR REPLACE FUNCTION get_average_recipe_time(p_recipe_id BIGINT)
RETURNS INTEGER AS $$
  SELECT ROUND(AVG(time_seconds))::INTEGER
  FROM recipe_times
  WHERE recipe_id = p_recipe_id;
$$ LANGUAGE SQL STABLE;

