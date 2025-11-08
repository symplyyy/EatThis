# 🔍 Guide de diagnostic - Base de données qui se remplit automatiquement

## 🚨 Problème

Votre base de données continue de se remplir automatiquement, même après avoir essayé de la réinitialiser.

## 🔎 Diagnostic

### Étape 1 : Exécuter le script de diagnostic

```bash
npx ts-node scripts/diagnose-database.ts
```

Ce script va :
- ✅ Afficher l'état actuel de votre base de données
- ✅ Lister les dernières recettes et ingrédients ajoutés
- ✅ Vous donner des recommandations

### Étape 2 : Vérifier les causes possibles

#### 1. **Triggers automatiques dans Supabase**

Les triggers peuvent ajouter automatiquement des données.

**Comment vérifier :**
1. Allez sur [https://app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Allez dans **Database** > **Triggers**
4. Vérifiez s'il y a des triggers actifs sur les tables `recipes`, `ingredients`, ou `recipe_ingredients`

**Comment désactiver :**
- Cliquez sur le trigger
- Désactivez-le ou supprimez-le

#### 2. **Fonctions automatiques (Cron Jobs)**

Supabase peut avoir des fonctions qui s'exécutent automatiquement.

**Comment vérifier :**
1. Allez dans **Database** > **Functions**
2. Vérifiez s'il y a des fonctions qui s'exécutent automatiquement
3. Vérifiez s'il y a des **Cron Jobs** configurés

**Comment désactiver :**
- Désactivez ou supprimez les fonctions automatiques
- Désactivez ou supprimez les cron jobs

#### 3. **Webhooks**

Des webhooks peuvent déclencher des ajouts de données.

**Comment vérifier :**
1. Allez dans **Database** > **Webhooks**
2. Vérifiez s'il y a des webhooks actifs
3. Vérifiez s'ils pointent vers des endpoints qui ajoutent des données

**Comment désactiver :**
- Désactivez ou supprimez les webhooks

#### 4. **Scripts en arrière-plan**

Des scripts peuvent tourner en arrière-plan sur votre machine.

**Comment vérifier :**
- Vérifiez les processus en cours dans votre terminal
- Vérifiez si des scripts d'import tournent encore
- Vérifiez les tâches planifiées (cron, Windows Task Scheduler)

**Comment arrêter :**
- Arrêtez les processus en cours
- Annulez les tâches planifiées

#### 5. **API `/api/admin/seed` appelée automatiquement**

L'API de seed peut être appelée automatiquement.

**Comment vérifier :**
1. Vérifiez les logs de votre serveur Next.js
2. Vérifiez si des requêtes POST arrivent sur `/api/admin/seed`
3. Vérifiez si des scripts appellent cette API

**Comment arrêter :**
- Arrêtez les scripts qui appellent cette API
- Désactivez temporairement l'endpoint si nécessaire

#### 6. **RLS (Row Level Security) mal configuré**

Si RLS est mal configuré, des utilisateurs peuvent ajouter des données.

**Comment vérifier :**
1. Allez dans **Authentication** > **Policies**
2. Vérifiez les politiques RLS sur les tables
3. Vérifiez si des politiques permettent l'insertion automatique

**Comment corriger :**
- Modifiez les politiques RLS pour restreindre les insertions
- Désactivez RLS temporairement si nécessaire (non recommandé en production)

## 🛠️ Solutions

### Solution 1 : Réinitialiser la base de données (méthode améliorée)

```bash
npx ts-node scripts/reset-database.ts
```

Le script a été amélioré pour supprimer toutes les données de manière plus fiable.

### Solution 2 : Réinitialiser via SQL direct dans Supabase

Si le script ne fonctionne pas, utilisez SQL direct :

1. Allez dans **SQL Editor** dans Supabase
2. Exécutez ces commandes :

```sql
-- Supprimer toutes les relations
DELETE FROM recipe_ingredients;

-- Supprimer toutes les recettes
DELETE FROM recipes;

-- Supprimer tous les ingrédients
DELETE FROM ingredients;
```

### Solution 3 : Désactiver temporairement les triggers

Si des triggers ajoutent automatiquement des données :

```sql
-- Désactiver tous les triggers sur la table recipes
ALTER TABLE recipes DISABLE TRIGGER ALL;

-- Désactiver tous les triggers sur la table ingredients
ALTER TABLE ingredients DISABLE TRIGGER ALL;

-- Désactiver tous les triggers sur la table recipe_ingredients
ALTER TABLE recipe_ingredients DISABLE TRIGGER ALL;
```

**⚠️ N'oubliez pas de les réactiver après :**

```sql
-- Réactiver tous les triggers
ALTER TABLE recipes ENABLE TRIGGER ALL;
ALTER TABLE ingredients ENABLE TRIGGER ALL;
ALTER TABLE recipe_ingredients ENABLE TRIGGER ALL;
```

### Solution 4 : Vérifier et arrêter les processus automatiques

1. **Vérifier les processus en cours :**
   ```bash
   # Windows PowerShell
   Get-Process | Where-Object {$_.ProcessName -like "*node*"}
   
   # Linux/Mac
   ps aux | grep node
   ```

2. **Arrêter les processus :**
   - Identifiez les processus qui importent des données
   - Arrêtez-les avec `Ctrl+C` ou `kill`

3. **Vérifier les tâches planifiées :**
   - Windows : **Task Scheduler**
   - Linux/Mac : `crontab -l`

## 📊 Vérification après correction

Après avoir appliqué les solutions :

1. **Exécutez le diagnostic :**
   ```bash
   npx ts-node scripts/diagnose-database.ts
   ```

2. **Vérifiez dans Supabase Dashboard :**
   - Allez dans **Table Editor**
   - Vérifiez que les tables sont vides

3. **Surveillez pendant quelques minutes :**
   - Vérifiez si de nouvelles données apparaissent
   - Si oui, continuez le diagnostic

## 🎯 Prévention

Pour éviter que cela se reproduise :

1. ✅ **Désactivez les triggers automatiques** si vous n'en avez pas besoin
2. ✅ **Désactivez les cron jobs** si vous n'en avez pas besoin
3. ✅ **Vérifiez les politiques RLS** pour restreindre les insertions
4. ✅ **Surveillez les logs** de votre application
5. ✅ **Utilisez le script de diagnostic** régulièrement

## 🆘 Besoin d'aide ?

Si le problème persiste :

1. Exécutez le script de diagnostic
2. Notez les résultats
3. Vérifiez manuellement dans Supabase Dashboard
4. Vérifiez les logs de votre application
5. Contactez le support si nécessaire

