# 🚀 Idées de fonctionnalités pour EatThis

## Fonctionnalités prioritaires (cohérentes et ergonomiques)

### 1. ⭐ **Favoris / Recettes sauvegardées**
**Pourquoi :** Permet aux utilisateurs de sauvegarder leurs recettes préférées pour y revenir facilement.

**Implémentation :**
- Bouton cœur sur chaque carte de recette
- Page dédiée "Mes recettes" accessible depuis le header
- Stockage local (localStorage) pour commencer, puis Supabase pour la persistance
- Badge "Favori" visible sur les cartes

**UX :**
- Animation au clic sur le cœur
- Toast de confirmation
- Filtre "Favoris uniquement" dans la recherche

---

### 2. 🛒 **Liste de courses automatique**
**Pourquoi :** Génère automatiquement une liste de courses basée sur les ingrédients manquants.

**Implémentation :**
- Bouton "Ajouter à la liste" sur chaque recette
- Page dédiée "Ma liste de courses" avec :
  - Groupement par catégorie (fruits, légumes, viande, etc.)
  - Cases à cocher pour marquer comme acheté
  - Export en texte/PDF
- Stockage local (localStorage)

**UX :**
- Animation de transition lors de l'ajout
- Compteur d'ingrédients restants
- Suggestions de recettes basées sur la liste

---

### 3. 📊 **Filtres avancés**
**Pourquoi :** Permet de filtrer par régime alimentaire et préférences.

**Implémentation :**
- Filtres : Végétarien, Vegan, Sans gluten, Sans lactose
- Tags sur les recettes (déjà dans la base de données)
- Filtres combinables avec les filtres existants (temps, difficulté)

**UX :**
- Badges visuels sur les cartes
- Filtres persistants dans l'URL
- Compteur de résultats mis à jour en temps réel

---

### 4. 🔍 **Historique de recherche**
**Pourquoi :** Permet de retrouver rapidement les recherches précédentes.

**Implémentation :**
- Sauvegarde des 10 dernières recherches (localStorage)
- Affichage dans un dropdown sous la barre de recherche
- Bouton "Effacer l'historique"

**UX :**
- Icône horloge pour les recherches récentes
- Animation au survol
- Recherche instantanée au clic

---

### 5. 📤 **Partage de recettes**
**Pourquoi :** Permet de partager facilement des recettes avec des amis.

**Implémentation :**
- Bouton "Partager" sur chaque recette
- Génération d'un lien unique (ex: `/r/123?share=true`)
- Copie dans le presse-papiers
- Partage via Web Share API (mobile)

**UX :**
- Toast de confirmation "Lien copié !"
- QR Code pour le partage mobile
- Prévisualisation de la recette dans le lien

---

### 6. 📝 **Notes personnelles sur les recettes**
**Pourquoi :** Permet d'ajouter des notes personnelles (modifications, astuces, etc.).

**Implémentation :**
- Section "Mes notes" sur la page de détail
- Éditeur de texte simple
- Sauvegarde automatique (localStorage puis Supabase)
- Affichage dans une carte dédiée

**UX :**
- Animation d'apparition
- Indicateur de sauvegarde
- Historique des modifications

---

### 7. 🎯 **Suggestions de recettes similaires**
**Pourquoi :** Aide à découvrir de nouvelles recettes basées sur les préférences.

**Implémentation :**
- Section "Recettes similaires" en bas de la page de détail
- Algorithme basé sur :
  - Ingrédients communs
  - Difficulté similaire
  - Temps de préparation proche
- Affichage en carrousel horizontal

**UX :**
- Animation de transition
- Badge "Similaire" sur les cartes
- Scroll horizontal fluide

---

### 8. 📱 **Mode hors-ligne basique**
**Pourquoi :** Permet de consulter les recettes récemment vues sans connexion.

**Implémentation :**
- Service Worker pour le cache
- Cache des 20 dernières recettes consultées
- Indicateur "Hors ligne" dans le header
- Message informatif quand hors ligne

**UX :**
- Badge "Caché" sur les recettes disponibles hors ligne
- Animation de chargement
- Message d'erreur si recette non disponible

---

### 9. 📄 **Export PDF d'une recette**
**Pourquoi :** Permet d'imprimer ou sauvegarder une recette en PDF.

**Implémentation :**
- Bouton "Exporter en PDF" sur la page de détail
- Génération côté client avec jsPDF ou html2pdf
- Mise en page optimisée pour l'impression
- Inclut : titre, image, ingrédients, étapes, temps, difficulté

**UX :**
- Animation de génération
- Prévisualisation avant téléchargement
- Options de personnalisation (avec/sans image)

---

### 10. 🏆 **Statistiques personnelles**
**Pourquoi :** Motive l'utilisateur avec des statistiques sur son utilisation.

**Implémentation :**
- Page "Mes statistiques" accessible depuis le header
- Affichage :
  - Nombre de recettes consultées
  - Temps moyen de préparation
  - Recette la plus consultée
  - Ingrédient le plus utilisé
- Graphiques simples (Chart.js ou Recharts)

**UX :**
- Animations de compteur
- Graphiques interactifs
- Badges de réussite

---

## Recommandations d'implémentation

### Priorité 1 (Impact élevé, effort moyen)
1. **Favoris** - Très demandé, facile à implémenter
2. **Liste de courses** - Fonctionnalité unique et utile
3. **Filtres avancés** - Améliore grandement la recherche

### Priorité 2 (Impact moyen, effort faible)
4. **Historique de recherche** - Simple et utile
5. **Partage de recettes** - Facile à implémenter
6. **Notes personnelles** - Ajoute de la valeur

### Priorité 3 (Impact élevé, effort élevé)
7. **Suggestions similaires** - Nécessite un algorithme
8. **Mode hors-ligne** - Nécessite Service Worker
9. **Export PDF** - Nécessite une bibliothèque externe
10. **Statistiques** - Nécessite un tracking

---

## Technologies suggérées

- **Favoris/Notes** : localStorage → Supabase (table `user_favorites`, `user_notes`)
- **Liste de courses** : localStorage → Supabase (table `shopping_lists`)
- **Partage** : Next.js API Routes + QR Code (qrcode.react)
- **Export PDF** : jsPDF ou react-pdf
- **Statistiques** : Recharts ou Chart.js
- **Mode hors-ligne** : Service Worker + Workbox

---

## Notes d'ergonomie

- Toujours afficher un feedback visuel (toast, animation)
- Utiliser des icônes cohérentes (lucide-react)
- Maintenir la cohérence avec le design actuel
- Mobile-first pour toutes les nouvelles fonctionnalités
- Transitions fluides (déjà en place)

