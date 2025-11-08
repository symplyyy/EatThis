# 🧹 Guide de nettoyage des ingrédients

## 📋 Problème

Dans votre base de données, vous avez des ingrédients avec des quantités et des descriptions comme :
- `"mozzarella slice"` → devrait être `"mozzarella"`
- `"mozzarella blend or"` → devrait être `"mozzarella"`
- `"or ham hock"` → devrait être `"ham"`
- `"2 cups flour"` → devrait être `"flour"`
- `"1/2 cup sugar"` → devrait être `"sugar"`

## ✅ Solution

Un script de nettoyage a été créé pour :
1. **Normaliser tous les ingrédients** pour extraire uniquement le nom de base
2. **Fusionner les doublons** (ex: "mozzarella" et "mozzarella slice" → un seul "mozzarella")
3. **Mettre à jour les relations** dans `recipe_ingredients` pour pointer vers les ingrédients nettoyés

## 🚀 Utilisation

### 1. Vérifier que les dépendances sont installées

```bash
npm install --save-dev dotenv ts-node
```

### 2. Exécuter le script de nettoyage

```bash
npx ts-node scripts/clean-ingredients.ts
```

Le script va :
- Récupérer tous les ingrédients de la base
- Les nettoyer (enlever quantités, descriptions, mots de liaison)
- Identifier les doublons
- Fusionner les doublons (garder le premier, supprimer les autres)
- Mettre à jour les relations `recipe_ingredients`

### 3. Vérifier les résultats

Le script affiche :
- Le nombre d'ingrédients nettoyés
- Le nombre de noms uniques après nettoyage
- Le nombre de groupes de doublons trouvés
- Le nombre d'ingrédients mis à jour
- Le nombre d'ingrédients fusionnés
- Le nombre d'ingrédients dupliqués supprimés

## 🔍 Exemples de nettoyage

| Avant | Après |
|-------|-------|
| `"mozzarella slice"` | `"mozzarella"` |
| `"mozzarella blend or"` | `"mozzarella"` |
| `"or ham hock"` | `"ham"` |
| `"2 cups flour"` | `"flour"` |
| `"1/2 cup sugar"` | `"sugar"` |
| `"fresh parsley"` | `"parsley"` |
| `"chopped onion"` | `"onion"` |
| `"olive oil"` | `"olive oil"` (nom composé gardé) |
| `"ground beef"` | `"ground beef"` (nom composé gardé) |

## ⚠️ Important

- **Sauvegarde** : Le script modifie directement la base de données. Assurez-vous d'avoir une sauvegarde avant de l'exécuter.
- **Temps d'exécution** : Le script peut prendre plusieurs minutes selon le nombre d'ingrédients.
- **Doublons** : Les doublons sont fusionnés automatiquement. Le premier ID est gardé, les autres sont supprimés après avoir mis à jour les relations.

## 🛠️ Fonctionnement technique

Le script utilise la fonction `normalizeIngredientName` de `lib/utils.ts` qui :

1. **Convertit les ligatures** : `œ` → `oe`, `æ` → `ae`
2. **Enlève les quantités** : `"2 cups"`, `"1/2 cup"`, `"3 tbsp"`, etc.
3. **Enlève les mots de liaison** : `"or"`, `"and"`, `"slice"`, `"blend"`, `"hock"`, etc.
4. **Enlève les descriptions** : `"fresh"`, `"chopped"`, `"diced"`, `"optional"`, etc.
5. **Garde les noms composés** : `"olive oil"`, `"ground beef"`, `"bell pepper"`, etc.
6. **Extrait le premier mot significatif** : `"or ham hock"` → `"ham"`

## 📊 Résultats attendus

Après le nettoyage, vous devriez avoir :
- ✅ Des ingrédients avec uniquement le nom de base
- ✅ Moins de doublons
- ✅ Des relations `recipe_ingredients` mises à jour
- ✅ Une base de données plus propre et cohérente

## 🔄 Réexécution

Vous pouvez réexécuter le script plusieurs fois si nécessaire. Il est idempotent (peut être exécuté plusieurs fois sans problème).

## 🐛 Problèmes possibles

### Erreur : "Variables Supabase requises"
- Vérifiez que `.env.local` contient `NEXT_PUBLIC_SUPABASE_URL` et `SUPABASE_SERVICE_ROLE_KEY`

### Erreur : "Cannot find module '../lib/utils'"
- Assurez-vous d'être dans le répertoire racine du projet
- Vérifiez que `lib/utils.ts` existe

### Erreur : "Permission denied"
- Vérifiez que la clé `SUPABASE_SERVICE_ROLE_KEY` a les permissions nécessaires

## 📝 Notes

- Les noms composés comme `"olive oil"` ou `"ground beef"` sont conservés car ils sont des ingrédients distincts
- Les mots de liaison (`"or"`, `"and"`) sont supprimés car ils ne font pas partie du nom de l'ingrédient
- Les descriptions (`"fresh"`, `"chopped"`, etc.) sont supprimées car elles ne sont pas nécessaires pour le matching

