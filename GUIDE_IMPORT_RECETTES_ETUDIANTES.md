# 🎓 Guide d'import des recettes étudiantes

Ce guide vous explique comment importer 100 recettes étudiantes avec des ingrédients de base dans votre base de données Supabase.

## 📋 Prérequis

1. ✅ Votre fichier `.env.local` est configuré avec vos clés Supabase
2. ✅ Votre base de données Supabase contient les tables nécessaires (recipes, ingredients, recipe_ingredients)
3. ✅ Les dépendances sont installées (`npm install`)

## 🚀 Utilisation

### Exécuter le script d'import

```bash
npx ts-node scripts/import-recettes-etudiantes.ts
```

Le script va :
1. ✅ Importer 100 recettes étudiantes
2. ✅ Créer automatiquement les ingrédients correspondants
3. ✅ Créer les relations entre recettes et ingrédients
4. ✅ Générer automatiquement les images pour chaque recette

## 📊 Contenu des recettes

Les 100 recettes incluent :

### Pâtes (5 recettes)
- Pâtes à l'ail et à l'huile
- Pâtes à la tomate
- Pâtes au beurre et parmesan
- Pâtes carbonara
- Pâtes aux champignons

### Riz (3 recettes)
- Riz à la tomate
- Riz au beurre
- Riz aux œufs
- Riz aux légumes
- Riz au poulet

### Œufs (10 recettes)
- Œufs au plat
- Œufs brouillés
- Omelette nature
- Omelette aux champignons
- Omelette au fromage
- Œufs durs
- Et plus...

### Pommes de terre (3 recettes)
- Pommes de terre sautées
- Pommes de terre à l'eau
- Purée de pommes de terre

### Salades (3 recettes)
- Salade verte
- Salade de tomates
- Salade de carottes râpées

### Sandwichs (3 recettes)
- Sandwich jambon-beurre
- Sandwich au fromage
- Sandwich thon-mayonnaise

### Soupes (2 recettes)
- Soupe de légumes
- Soupe à la tomate

### Gratins (2 recettes)
- Gratin de pommes de terre
- Gratin de pâtes

### Plats simples (3 recettes)
- Steak haché et frites
- Saucisses et purée
- Poulet rôti et légumes

### Et bien plus encore !
- Quiches, tartes, pizzas
- Lasagnes, risotto, ratatouille
- Currys, chili, bolognaise
- Tacos, burritos, quesadillas
- Plats asiatiques (pad thaï, ramen, sushi, etc.)
- Plats du Moyen-Orient (hummus, falafels, etc.)
- Et bien d'autres !

## 🛒 Ingrédients de base utilisés

Les recettes utilisent uniquement des ingrédients de base et abordables :

- **Féculents** : pâtes, riz, pommes de terre, pain
- **Protéines** : œufs, poulet, viande hachée, fromage, jambon
- **Légumes** : tomates, oignons, carottes, champignons, poivrons
- **Produits laitiers** : beurre, crème fraîche, lait, fromage
- **Épices de base** : sel, poivre, ail, huile d'olive

## 📝 Structure des recettes

Chaque recette contient :
- ✅ **Titre** : Nom de la recette
- ✅ **Description** : Description courte
- ✅ **Étapes** : Liste détaillée des étapes de préparation
- ✅ **Temps** : Temps de préparation en minutes
- ✅ **Difficulté** : 1 (facile), 2 (moyen), 3 (difficile)
- ✅ **Ingrédients** : Liste des ingrédients nécessaires
- ✅ **Image** : Image générée automatiquement via Unsplash

## 🔍 Vérification après import

Après l'import, vous pouvez vérifier les données :

```sql
-- Compter les recettes
SELECT COUNT(*) FROM recipes;

-- Compter les ingrédients
SELECT COUNT(*) FROM ingredients;

-- Voir quelques recettes
SELECT id, title, time_min, difficulty 
FROM recipes 
ORDER BY created_at DESC 
LIMIT 10;

-- Voir quelques ingrédients
SELECT id, name 
FROM ingredients 
ORDER BY id 
LIMIT 20;
```

## 🎯 Utilisation dans l'application

Une fois les recettes importées, vous pouvez :

1. **Rechercher des recettes** par ingrédients sur la page d'accueil
2. **Voir les détails** d'une recette en cliquant dessus
3. **Utiliser l'autocomplete** pour trouver des ingrédients

## 🐛 Problèmes possibles

### Erreur : "Variables Supabase requises"
- Vérifiez que `.env.local` contient `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`

### Erreur : "Cannot find module"
- Installez les dépendances : `npm install`
- Vérifiez que `ts-node` est installé : `npm install --save-dev ts-node`

### Erreur : "Duplicate key"
- Les recettes en double sont ignorées automatiquement
- C'est normal si vous réimportez

### Certaines recettes ne s'importent pas
- Vérifiez les logs pour voir quelles recettes ont échoué
- Vérifiez que les tables existent dans Supabase
- Vérifiez que les contraintes sont correctes

## 📊 Statistiques attendues

Après l'import réussi, vous devriez avoir :
- ✅ **100 recettes** dans la table `recipes`
- ✅ **~50-70 ingrédients uniques** dans la table `ingredients`
- ✅ **~400-500 relations** dans la table `recipe_ingredients`

## 💡 Conseils

1. **Commencez petit** : Testez avec quelques recettes d'abord si vous voulez
2. **Vérifiez les données** : Utilisez les requêtes SQL ci-dessus pour vérifier
3. **Ajoutez vos propres recettes** : Vous pouvez ensuite ajouter vos propres recettes manuellement
4. **Modifiez les recettes** : N'hésitez pas à modifier les recettes selon vos goûts

## 🎉 Résultat

Après l'import, vous aurez une base de données complète avec 100 recettes étudiantes prêtes à être utilisées dans votre application EatThis !

