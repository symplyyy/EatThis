/**
 * Script pour nettoyer les ingrédients existants dans la base de données
 * 
 * Ce script normalise tous les ingrédients pour extraire uniquement le nom de base
 * (ex: "mozzarella slice" -> "mozzarella", "or ham hock" -> "ham")
 * 
 * Usage:
 *   npm install --save-dev dotenv ts-node
 *   ts-node scripts/clean-ingredients.ts
 * 
 * Variables d'environnement requises:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Charger les variables d'environnement depuis .env.local
config({ path: '.env.local' })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Variables Supabase requises')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Fonction pour normaliser les noms d'ingrédients (même logique que lib/utils.ts)
// Extrait uniquement le nom de base de l'ingrédient (ex: "mozzarella slice" -> "mozzarella")
function normalizeIngredientName(name: string): string {
  let normalized = name.trim().toLowerCase()
  
  // Convertir les ligatures en caractères simples pour éviter les problèmes d'encodage
  normalized = normalized
    .replace(/œ/g, 'oe')  // œ -> oe
    .replace(/Œ/g, 'oe')  // Œ -> oe
    .replace(/æ/g, 'ae')  // æ -> ae
    .replace(/Æ/g, 'ae')  // Æ -> ae
  
  // Enlever les quantités et unités au début (ex: "2 cups", "1/2 cup", "3 tbsp")
  normalized = normalized
    .replace(/^[\d\s\/\-]+\s*(ml|cl|l|g|kg|mg|oz|lb|cup|cups|tbsp|tsp|tablespoon|teaspoon|pound|ounce|pound|pounds|ounces?|grams?|kilograms?|milliliters?|liters?|pieces?|slices?|cloves?|heads?|bunches?|stalks?|sprigs?|leaves?|strips?|dashes?|pinches?|drops?)\s*/i, '')
    .replace(/^[\d\s\/\-\.]+\s*/, '') // Enlever les nombres restants
  
  // Enlever les mots de liaison et descriptions courantes (or, and, slice, blend, etc.)
  const stopWords = [
    /\s+or\s+/gi,
    /\s+and\s+/gi,
    /\s+slice\s*/gi,
    /\s+sliced\s*/gi,
    /\s+blend\s*/gi,
    /\s+blended\s*/gi,
    /\s+hock\s*/gi,
    /\s+whole\s+/gi,
    /\s+chopped\s*/gi,
    /\s+diced\s*/gi,
    /\s+minced\s*/gi,
    /\s+crushed\s*/gi,
    /\s+ground\s+/gi,
    /\s+fresh\s+/gi,
    /\s+dried\s+/gi,
    /\s+frozen\s+/gi,
    /\s+canned\s+/gi,
    /\s+optional\s*/gi,
    /\s+to\s+taste\s*/gi,
    /\s+more\s+to\s+taste\s*/gi,
    /\s+as\s+needed\s*/gi,
    /\s+for\s+serving\s*/gi,
    /\s+for\s+garnish\s*/gi,
  ]
  
  for (const stopWord of stopWords) {
    normalized = normalized.replace(stopWord, ' ')
  }
  
  // Extraire le premier mot significatif (le nom de l'ingrédient)
  const words = normalized.split(/\s+/).filter(word => word.length > 1)
  
  // Si on a des mots, prendre le premier (ou les deux premiers si c'est un nom composé commun)
  if (words.length === 0) {
    return normalized.trim()
  }
  
  // Noms composés communs à garder ensemble
  const compoundNames = [
    'green onion', 'red onion', 'yellow onion', 'white onion',
    'olive oil', 'vegetable oil', 'canola oil', 'peanut oil',
    'black pepper', 'white pepper', 'red pepper', 'cayenne pepper',
    'sea salt', 'kosher salt', 'table salt',
    'brown sugar', 'white sugar', 'powdered sugar', 'granulated sugar',
    'cream cheese', 'goat cheese', 'blue cheese', 'parmesan cheese',
    'chicken broth', 'beef broth', 'vegetable broth',
    'tomato paste', 'tomato sauce', 'tomato puree',
    'bell pepper', 'red bell pepper', 'green bell pepper',
    'fresh parsley', 'fresh basil', 'fresh cilantro',
    'ground beef', 'ground turkey', 'ground pork',
    'whole milk', 'skim milk', 'almond milk',
    'heavy cream', 'sour cream', 'whipping cream',
  ]
  
  // Vérifier si c'est un nom composé
  for (const compound of compoundNames) {
    if (normalized.includes(compound)) {
      return compound
    }
  }
  
  // Sinon, retourner le premier mot significatif
  return words[0] || normalized.trim()
}

// Fonction principale pour nettoyer les ingrédients
async function cleanIngredients() {
  console.log('🔍 Récupération de tous les ingrédients...')
  
  // Récupérer tous les ingrédients
  const { data: ingredients, error } = await supabase
    .from('ingredients')
    .select('id, name')
    .order('id')
  
  if (error) {
    console.error('Erreur lors de la récupération des ingrédients:', error)
    process.exit(1)
  }
  
  if (!ingredients || ingredients.length === 0) {
    console.log('Aucun ingrédient trouvé')
    return
  }
  
  console.log(`📦 ${ingredients.length} ingrédients trouvés`)
  console.log('🧹 Nettoyage des ingrédients...\n')
  
  const cleanedMap = new Map<number, string>() // id -> nom nettoyé
  const nameToId = new Map<string, number[]>() // nom nettoyé -> [ids]
  
  // Nettoyer tous les ingrédients
  for (const ing of ingredients) {
    const cleaned = normalizeIngredientName(ing.name)
    cleanedMap.set(ing.id, cleaned)
    
    if (!nameToId.has(cleaned)) {
      nameToId.set(cleaned, [])
    }
    nameToId.get(cleaned)!.push(ing.id)
  }
  
  console.log(`✅ ${cleanedMap.size} ingrédients nettoyés`)
  console.log(`📊 ${nameToId.size} noms uniques après nettoyage\n`)
  
  // Trouver les doublons (plusieurs IDs pour le même nom nettoyé)
  const duplicates: Array<{ name: string; ids: number[] }> = []
  for (const [name, ids] of nameToId.entries()) {
    if (ids.length > 1) {
      duplicates.push({ name, ids })
    }
  }
  
  console.log(`🔍 ${duplicates.length} groupes de doublons trouvés\n`)
  
  // Traiter chaque groupe de doublons
  let merged = 0
  let updated = 0
  let deleted = 0
  
  for (const { name, ids } of duplicates) {
    // Garder le premier ID, fusionner les autres
    const keepId = ids[0]
    const mergeIds = ids.slice(1)
    
    console.log(`🔄 Fusion de "${name}" (${ids.length} occurrences)`)
    console.log(`   Garde: ID ${keepId}, Fusionne: ${mergeIds.join(', ')}`)
    
    // Mettre à jour le nom de l'ingrédient à garder
    const { error: updateError } = await supabase
      .from('ingredients')
      .update({ name })
      .eq('id', keepId)
    
    if (updateError) {
      console.error(`   ❌ Erreur mise à jour ID ${keepId}:`, updateError)
      continue
    }
    updated++
    
    // Mettre à jour toutes les relations recipe_ingredients pour pointer vers keepId
    for (const mergeId of mergeIds) {
      const { data: relations, error: relError } = await supabase
        .from('recipe_ingredients')
        .select('recipe_id')
        .eq('ingredient_id', mergeId)
      
      if (relError) {
        console.error(`   ❌ Erreur récupération relations ID ${mergeId}:`, relError)
        continue
      }
      
      // Mettre à jour ou créer les relations
      for (const rel of relations || []) {
        // Vérifier si la relation existe déjà
        const { data: existing } = await supabase
          .from('recipe_ingredients')
          .select('recipe_id')
          .eq('recipe_id', rel.recipe_id)
          .eq('ingredient_id', keepId)
          .single()
        
        if (!existing) {
          // Créer la nouvelle relation
          await supabase
            .from('recipe_ingredients')
            .insert({
              recipe_id: rel.recipe_id,
              ingredient_id: keepId
            })
        }
        
        // Supprimer l'ancienne relation
        await supabase
          .from('recipe_ingredients')
          .delete()
          .eq('recipe_id', rel.recipe_id)
          .eq('ingredient_id', mergeId)
      }
      
      // Supprimer l'ingrédient dupliqué
      const { error: deleteError } = await supabase
        .from('ingredients')
        .delete()
        .eq('id', mergeId)
      
      if (deleteError) {
        console.error(`   ❌ Erreur suppression ID ${mergeId}:`, deleteError)
        continue
      }
      
      deleted++
      merged++
    }
    
    console.log(`   ✅ Fusion terminée\n`)
  }
  
  // Mettre à jour les ingrédients qui ont changé de nom mais ne sont pas des doublons
  for (const [id, cleanedName] of cleanedMap.entries()) {
    const original = ingredients.find(ing => ing.id === id)
    if (original && original.name !== cleanedName) {
      // Vérifier qu'il n'y a pas déjà un ingrédient avec ce nom
      const { data: existing } = await supabase
        .from('ingredients')
        .select('id')
        .eq('name', cleanedName)
        .single()
      
      if (!existing || existing.id === id) {
        // Mettre à jour le nom
        const { error: updateError } = await supabase
          .from('ingredients')
          .update({ name: cleanedName })
          .eq('id', id)
        
        if (!updateError) {
          updated++
        }
      }
    }
  }
  
  console.log(`\n✅ Nettoyage terminé:`)
  console.log(`   - ${updated} ingrédients mis à jour`)
  console.log(`   - ${merged} groupes fusionnés`)
  console.log(`   - ${deleted} ingrédients dupliqués supprimés`)
}

// Exécution
cleanIngredients()
  .then(() => {
    console.log('\n✅ Script terminé avec succès')
    process.exit(0)
  })
  .catch(error => {
    console.error('Erreur fatale:', error)
    process.exit(1)
  })

