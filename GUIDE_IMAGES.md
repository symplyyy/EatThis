# Guide de gestion des images de recettes

## Problème actuel

Beaucoup d'images ne correspondent pas aux recettes car le système de matching est basé sur des mots-clés simples et des correspondances partielles.

## Solutions disponibles

### 1. Analyser les recettes et leurs images

Exécutez le script d'analyse pour identifier les recettes avec des images non pertinentes :

```bash
npx ts-node scripts/analyze-recipe-images.ts
```

Ce script génère un rapport `recipe-images-report.json` avec :
- Les statistiques (total, avec/sans image, images incorrectes)
- La liste des recettes avec images potentiellement incorrectes
- Les images suggérées pour chaque recette

### 2. Mettre à jour toutes les images

Utilisez l'API pour réassigner toutes les images basées sur les titres :

```bash
curl -X POST http://localhost:3000/api/admin/update-all-images \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"force": false}'
```

**Paramètres :**
- `force: false` : Ne met à jour que les recettes sans image ou avec une image différente de la suggestion
- `force: true` : Force la mise à jour de toutes les images

### 3. Mettre à jour une recette spécifique

Pour mettre à jour l'image d'une recette spécifique :

```bash
curl -X POST http://localhost:3000/api/admin/update-recipe-image \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "recipeId": 123,
    "imageUrl": "https://images.unsplash.com/...",
    "useSuggestion": false
  }'
```

**Paramètres :**
- `recipeId` : ID de la recette (requis)
- `imageUrl` : URL de l'image (requis si `useSuggestion` est false)
- `useSuggestion` : Si true, utilise la suggestion basée sur le titre

### 4. Améliorer le mapping des images

Pour améliorer la correspondance, modifiez le fichier `lib/recipeImages.ts` :

1. **Ajouter des correspondances exactes** dans `recipeImageMap` :
```typescript
const recipeImageMap: Record<string, string> = {
  'nom exact de la recette': 'https://images.unsplash.com/photo-...',
  // ...
}
```

2. **Ajouter des mots-clés** dans `keywordImageMap` :
```typescript
const keywordImageMap: Record<string, string> = {
  'mot-clé': 'https://images.unsplash.com/photo-...',
  // ...
}
```

## Workflow recommandé

1. **Analyser** : Exécutez le script d'analyse pour identifier les problèmes
2. **Examiner** : Consultez le rapport JSON généré
3. **Améliorer** : Ajoutez des correspondances spécifiques dans `recipeImages.ts`
4. **Mettre à jour** : Utilisez l'API pour réassigner les images
5. **Vérifier** : Vérifiez visuellement que les images correspondent bien

## Trouver de meilleures images Unsplash

1. Allez sur [Unsplash](https://unsplash.com)
2. Recherchez le nom de la recette (ex: "pasta carbonara")
3. Choisissez une image de qualité
4. Copiez l'URL de l'image (format : `https://images.unsplash.com/photo-...`)
5. Ajoutez les paramètres de taille : `?w=800&h=600&fit=crop&q=80`

## Exemple de mapping amélioré

```typescript
const recipeImageMap: Record<string, string> = {
  // Correspondances exactes
  'pâtes carbonara': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
  'pizza margherita': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
  
  // Correspondances partielles (plus spécifiques en premier)
  'carbonara': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
  'pâtes': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
}
```

