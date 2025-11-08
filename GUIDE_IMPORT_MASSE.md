# 📦 Guide pour importer une base de données massive de recettes

Ce guide vous explique comment alimenter votre base de données Supabase avec des milliers de recettes et ingrédients.

## 🎯 Options disponibles

### Option 1 : APIs publiques de recettes (Recommandé)

#### 1.1 Edamam Recipe API (Gratuit avec limite)

**Avantages** :
- API gratuite (5000 requêtes/mois)
- Plus de 2 millions de recettes
- Données structurées
- Ingrédients déjà listés

**Inscription** :
1. Allez sur [https://developer.edamam.com/](https://developer.edamam.com/)
2. Créez un compte gratuit
3. Créez une application "Recipe Search API"
4. Récupérez votre `app_id` et `app_key`

**Utilisation** :
```bash
# Exemple de requête
curl "https://api.edamam.com/api/recipes/v2?type=public&q=chicken&app_id=YOUR_APP_ID&app_key=YOUR_APP_KEY"
```

#### 1.2 Spoonacular API (Gratuit avec limite)

**Avantages** :
- 150 points gratuits/jour
- API complète avec ingrédients, recettes, nutrition
- Documentation excellente

**Inscription** :
1. Allez sur [https://spoonacular.com/food-api](https://spoonacular.com/food-api)
2. Créez un compte gratuit
3. Récupérez votre API key

### Option 2 : Datasets open source

#### 2.1 Recipe1M+ (Dataset académique)

**Source** : [http://pic2recipe.csail.mit.edu/](http://pic2recipe.csail.mit.edu/)

**Contenu** :
- Plus d'1 million de recettes
- Ingrédients et instructions
- Images associées

**Format** : JSON

#### 2.2 RecipeNLG Dataset

**Source** : [https://github.com/Glorf/RecipeNLG](https://github.com/Glorf/RecipeNLG)

**Contenu** :
- 2 millions de recettes
- Format JSON structuré
- Ingrédients, instructions, temps de cuisson


### Option 3 : Scraping de sites de recettes (Attention légalité)

⚠️ **Important** : Vérifiez toujours les conditions d'utilisation et le robots.txt avant de scraper.

**Sites avec données ouvertes** :
- Marmiton (avec respect du robots.txt)
- 750g (avec autorisation)
- AllRecipes (API disponible)

## 🛠 Implémentation : Scripts d'import

### Méthode 1 : Via API HTTP (Recommandé)

Un endpoint HTTP est disponible pour importer depuis Edamam :

```bash
# Ajoutez vos clés Edamam dans .env.local
EDAMAM_APP_ID=votre_app_id
EDAMAM_APP_KEY=votre_app_key

# Importez 50 recettes sur le thème "chicken"
curl -X POST http://localhost:3000/api/admin/import-edamam \
  -H "Authorization: Bearer VOTRE_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query": "chicken", "maxRecipes": 50}'
```

### Méthode 2 : Via script Node.js

#### Installation des dépendances

```bash
npm install --save-dev dotenv ts-node
```

#### Configuration

Ajoutez dans votre `.env.local` :

```env
EDAMAM_APP_ID=votre_app_id
EDAMAM_APP_KEY=votre_app_key
```

#### Utilisation du script Edamam

```bash
# Importer 100 recettes sur "pasta"
npx ts-node scripts/import-edamam.ts pasta 100

# Importer 50 recettes sur "chicken"
npx ts-node scripts/import-edamam.ts chicken 50
```

#### Utilisation du script RecipeNLG

1. Téléchargez le dataset depuis [https://github.com/Glorf/RecipeNLG](https://github.com/Glorf/RecipeNLG)
2. Extrayez le fichier JSON
3. Importez :

```bash
# Importer toutes les recettes du fichier
npx ts-node scripts/import-recipe-nlg.ts path/to/recipes.json

# Importer seulement les 1000 premières
npx ts-node scripts/import-recipe-nlg.ts path/to/recipes.json 1000
```


## 📊 Statistiques d'import

### Edamam API
- **Limite gratuite** : 5000 requêtes/mois
- **Par requête** : 100 recettes max
- **Total possible** : ~500 000 recettes/mois (si vous optimisez)

### RecipeNLG Dataset
- **Total** : 2+ millions de recettes
- **Format** : JSON structuré
- **Temps d'import** : ~1-2 recettes/seconde (selon votre connexion Supabase)


## ⚡ Optimisations

### Import par lots

Les scripts incluent déjà des optimisations :
- Pause entre les requêtes API (200ms)
- Import par lots de 50-100 recettes
- Gestion des erreurs et retry

### Améliorer les performances

1. **Augmenter les lots** : Modifiez `batchSize` dans les scripts
2. **Paralléliser** : Utilisez plusieurs instances du script avec des queries différentes
3. **Index Supabase** : Assurez-vous que les index sont créés sur `ingredients.name` et `recipes.title`

## 🔍 Vérifier l'import

```sql
-- Compter les recettes
SELECT COUNT(*) FROM recipes;

-- Compter les ingrédients
SELECT COUNT(*) FROM ingredients;

-- Voir les dernières recettes importées
SELECT id, title, created_at 
FROM recipes 
ORDER BY created_at DESC 
LIMIT 10;
```

## 🎯 Recommandations

1. **Commencez petit** : Testez avec 50-100 recettes d'abord
2. **Variez les queries** : Importez depuis différents thèmes (chicken, pasta, dessert, etc.)
3. **Surveillez les limites** : Respectez les limites des APIs gratuites
4. **Backup** : Faites un backup de votre base avant un gros import

## 🆘 Dépannage

### Erreur "Edamam API credentials not configured"
- Vérifiez que `EDAMAM_APP_ID` et `EDAMAM_APP_KEY` sont dans `.env.local`
- Redémarrez le serveur après modification

### Erreur "Rate limit exceeded"
- Attendez quelques minutes
- Réduisez `maxRecipes` ou augmentez les pauses

### Erreur "Duplicate key"
- Les recettes en double sont ignorées automatiquement
- C'est normal si vous réimportez

## 📚 Ressources

- [Edamam API Documentation](https://developer.edamam.com/edamam-docs-recipe-api)
- [RecipeNLG Dataset](https://github.com/Glorf/RecipeNLG)
- [Spoonacular API](https://spoonacular.com/food-api)
