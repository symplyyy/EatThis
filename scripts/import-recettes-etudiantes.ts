/**
 * Script pour importer 100 recettes étudiantes avec des ingrédients de base
 * 
 * Usage:
 *   npx ts-node scripts/import-recettes-etudiantes.ts
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

interface Recipe {
  title: string
  description: string
  steps: string[]
  time_min: number
  difficulty: 1 | 2 | 3
  ingredients: string[]
  image_url?: string
}

// Liste de 100 recettes étudiantes avec ingrédients de base
const recettes: Recipe[] = [
  // Pâtes simples
  {
    title: 'Pâtes à l\'ail et à l\'huile',
    description: 'Un classique italien simple et rapide',
    steps: [
      'Faire cuire les pâtes dans l\'eau bouillante salée',
      'Pendant ce temps, faire chauffer l\'huile d\'olive dans une poêle',
      'Ajouter l\'ail haché et faire revenir 2 minutes',
      'Égoutter les pâtes et les mélanger avec l\'huile à l\'ail',
      'Servir chaud avec du parmesan'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['pâtes', 'huile d\'olive', 'ail', 'parmesan', 'sel']
  },
  {
    title: 'Pâtes à la tomate',
    description: 'Sauce tomate simple et rapide',
    steps: [
      'Faire cuire les pâtes',
      'Faire chauffer l\'huile dans une poêle',
      'Ajouter l\'ail et les tomates en dés',
      'Laisser mijoter 10 minutes',
      'Mélanger avec les pâtes et servir'
    ],
    time_min: 20,
    difficulty: 1,
    ingredients: ['pâtes', 'tomates', 'huile d\'olive', 'ail', 'sel', 'poivre']
  },
  {
    title: 'Pâtes au beurre et parmesan',
    description: 'Simple et réconfortant',
    steps: [
      'Faire cuire les pâtes',
      'Égoutter en gardant un peu d\'eau de cuisson',
      'Mélanger avec le beurre et le parmesan',
      'Ajouter un peu d\'eau de cuisson si nécessaire',
      'Servir chaud'
    ],
    time_min: 12,
    difficulty: 1,
    ingredients: ['pâtes', 'beurre', 'parmesan', 'sel']
  },
  {
    title: 'Pâtes carbonara',
    description: 'Crémeuse et savoureuse',
    steps: [
      'Faire cuire les pâtes',
      'Faire revenir les lardons dans une poêle',
      'Battre les œufs avec le parmesan',
      'Égoutter les pâtes et les mélanger avec les lardons',
      'Ajouter le mélange œufs-parmesan hors du feu',
      'Mélanger rapidement et servir'
    ],
    time_min: 20,
    difficulty: 2,
    ingredients: ['pâtes', 'lardons', 'œufs', 'parmesan', 'poivre', 'sel']
  },
  {
    title: 'Pâtes aux champignons',
    description: 'Simple et délicieux',
    steps: [
      'Faire cuire les pâtes',
      'Faire revenir les champignons dans l\'huile',
      'Ajouter l\'ail et la crème',
      'Laisser mijoter 5 minutes',
      'Mélanger avec les pâtes et servir'
    ],
    time_min: 18,
    difficulty: 1,
    ingredients: ['pâtes', 'champignons', 'crème fraîche', 'ail', 'huile d\'olive', 'sel', 'poivre']
  },

  // Riz
  {
    title: 'Riz à la tomate',
    description: 'Riz simple et savoureux',
    steps: [
      'Faire revenir l\'oignon dans l\'huile',
      'Ajouter le riz et faire revenir 2 minutes',
      'Ajouter les tomates en dés',
      'Couvrir d\'eau et laisser cuire 15 minutes',
      'Servir chaud'
    ],
    time_min: 25,
    difficulty: 1,
    ingredients: ['riz', 'tomates', 'oignon', 'huile d\'olive', 'sel', 'poivre']
  },
  {
    title: 'Riz au beurre',
    description: 'Simple et réconfortant',
    steps: [
      'Faire cuire le riz dans l\'eau bouillante salée',
      'Égoutter et mélanger avec le beurre',
      'Servir chaud'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['riz', 'beurre', 'sel']
  },
  {
    title: 'Riz aux œufs',
    description: 'Riz frit simple',
    steps: [
      'Faire cuire le riz',
      'Faire cuire les œufs en omelette',
      'Mélanger le riz avec les œufs',
      'Assaisonner et servir'
    ],
    time_min: 20,
    difficulty: 1,
    ingredients: ['riz', 'œufs', 'huile', 'sel', 'poivre']
  },

  // Œufs
  {
    title: 'Œufs au plat',
    description: 'Simple et rapide',
    steps: [
      'Faire chauffer l\'huile dans une poêle',
      'Casser les œufs dans la poêle',
      'Cuire 3-4 minutes',
      'Servir avec du sel et du poivre'
    ],
    time_min: 5,
    difficulty: 1,
    ingredients: ['œufs', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Œufs brouillés',
    description: 'Crémeux et délicieux',
    steps: [
      'Battre les œufs dans un bol',
      'Faire chauffer le beurre dans une poêle',
      'Verser les œufs et remuer constamment',
      'Cuire jusqu\'à la consistance désirée',
      'Servir chaud'
    ],
    time_min: 5,
    difficulty: 1,
    ingredients: ['œufs', 'beurre', 'sel', 'poivre']
  },
  {
    title: 'Omelette nature',
    description: 'Classique et simple',
    steps: [
      'Battre les œufs dans un bol',
      'Faire chauffer le beurre dans une poêle',
      'Verser les œufs battus',
      'Cuire 2-3 minutes de chaque côté',
      'Servir chaud'
    ],
    time_min: 5,
    difficulty: 1,
    ingredients: ['œufs', 'beurre', 'sel', 'poivre']
  },
  {
    title: 'Omelette aux champignons',
    description: 'Savoureuse et rassasiante',
    steps: [
      'Faire revenir les champignons dans l\'huile',
      'Battre les œufs dans un bol',
      'Verser les œufs sur les champignons',
      'Cuire 3-4 minutes',
      'Servir chaud'
    ],
    time_min: 10,
    difficulty: 1,
    ingredients: ['œufs', 'champignons', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Omelette au fromage',
    description: 'Fondante et délicieuse',
    steps: [
      'Battre les œufs dans un bol',
      'Ajouter le fromage râpé',
      'Faire chauffer le beurre dans une poêle',
      'Verser le mélange et cuire 3-4 minutes',
      'Servir chaud'
    ],
    time_min: 8,
    difficulty: 1,
    ingredients: ['œufs', 'fromage', 'beurre', 'sel', 'poivre']
  },
  {
    title: 'Œufs durs',
    description: 'Simple et pratique',
    steps: [
      'Mettre les œufs dans l\'eau bouillante',
      'Cuire 10 minutes',
      'Refroidir sous l\'eau froide',
      'Écaler et servir'
    ],
    time_min: 12,
    difficulty: 1,
    ingredients: ['œufs', 'sel']
  },

  // Pommes de terre
  {
    title: 'Pommes de terre sautées',
    description: 'Croustillantes et savoureuses',
    steps: [
      'Éplucher et couper les pommes de terre en dés',
      'Faire chauffer l\'huile dans une poêle',
      'Faire revenir les pommes de terre 15-20 minutes',
      'Assaisonner et servir'
    ],
    time_min: 25,
    difficulty: 1,
    ingredients: ['pommes de terre', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Pommes de terre à l\'eau',
    description: 'Simple et sain',
    steps: [
      'Éplucher les pommes de terre',
      'Mettre dans l\'eau bouillante salée',
      'Cuire 20 minutes',
      'Servir avec du beurre'
    ],
    time_min: 25,
    difficulty: 1,
    ingredients: ['pommes de terre', 'beurre', 'sel']
  },
  {
    title: 'Purée de pommes de terre',
    description: 'Crémeuse et réconfortante',
    steps: [
      'Éplucher et couper les pommes de terre',
      'Faire cuire dans l\'eau bouillante 20 minutes',
      'Égoutter et écraser',
      'Ajouter le beurre et le lait',
      'Mélanger jusqu\'à obtenir une purée lisse'
    ],
    time_min: 25,
    difficulty: 1,
    ingredients: ['pommes de terre', 'beurre', 'lait', 'sel', 'poivre']
  },

  // Salades
  {
    title: 'Salade verte',
    description: 'Fraîche et simple',
    steps: [
      'Laver la salade',
      'Préparer la vinaigrette avec huile, vinaigre, sel',
      'Mélanger la salade avec la vinaigrette',
      'Servir frais'
    ],
    time_min: 5,
    difficulty: 1,
    ingredients: ['salade', 'huile', 'vinaigre', 'sel']
  },
  {
    title: 'Salade de tomates',
    description: 'Fraîche et colorée',
    steps: [
      'Couper les tomates en rondelles',
      'Préparer la vinaigrette',
      'Arroser les tomates avec la vinaigrette',
      'Servir frais'
    ],
    time_min: 5,
    difficulty: 1,
    ingredients: ['tomates', 'huile', 'vinaigre', 'sel', 'poivre']
  },
  {
    title: 'Salade de carottes râpées',
    description: 'Croquante et fraîche',
    steps: [
      'Éplucher et râper les carottes',
      'Préparer la vinaigrette',
      'Mélanger les carottes avec la vinaigrette',
      'Servir frais'
    ],
    time_min: 10,
    difficulty: 1,
    ingredients: ['carottes', 'huile', 'vinaigre', 'sel']
  },

  // Sandwichs
  {
    title: 'Sandwich jambon-beurre',
    description: 'Classique français',
    steps: [
      'Beurrer les tranches de pain',
      'Ajouter le jambon',
      'Fermer le sandwich',
      'Servir'
    ],
    time_min: 5,
    difficulty: 1,
    ingredients: ['pain', 'beurre', 'jambon']
  },
  {
    title: 'Sandwich au fromage',
    description: 'Simple et savoureux',
    steps: [
      'Beurrer les tranches de pain',
      'Ajouter le fromage',
      'Fermer le sandwich',
      'Servir'
    ],
    time_min: 5,
    difficulty: 1,
    ingredients: ['pain', 'beurre', 'fromage']
  },
  {
    title: 'Sandwich thon-mayonnaise',
    description: 'Rassasiant et rapide',
    steps: [
      'Mélanger le thon avec la mayonnaise',
      'Beurrer les tranches de pain',
      'Étaler le mélange thon-mayonnaise',
      'Fermer le sandwich',
      'Servir'
    ],
    time_min: 5,
    difficulty: 1,
    ingredients: ['pain', 'thon', 'mayonnaise', 'beurre']
  },

  // Soupes
  {
    title: 'Soupe de légumes',
    description: 'Saine et réconfortante',
    steps: [
      'Éplucher et couper les légumes',
      'Faire revenir dans l\'huile',
      'Couvrir d\'eau et laisser mijoter 20 minutes',
      'Mixer si désiré',
      'Servir chaud'
    ],
    time_min: 30,
    difficulty: 1,
    ingredients: ['carottes', 'pommes de terre', 'oignon', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Soupe à la tomate',
    description: 'Chaude et réconfortante',
    steps: [
      'Faire revenir l\'oignon dans l\'huile',
      'Ajouter les tomates en dés',
      'Couvrir d\'eau et laisser mijoter 15 minutes',
      'Mixer et servir chaud'
    ],
    time_min: 20,
    difficulty: 1,
    ingredients: ['tomates', 'oignon', 'huile', 'sel', 'poivre']
  },

  // Gratins
  {
    title: 'Gratin de pommes de terre',
    description: 'Crémeux et réconfortant',
    steps: [
      'Éplucher et couper les pommes de terre en rondelles',
      'Faire chauffer la crème avec l\'ail',
      'Disposer les pommes de terre dans un plat',
      'Verser la crème',
      'Enfourner 45 minutes à 180°C'
    ],
    time_min: 50,
    difficulty: 2,
    ingredients: ['pommes de terre', 'crème fraîche', 'ail', 'sel', 'poivre']
  },
  {
    title: 'Gratin de pâtes',
    description: 'Crémeux et savoureux',
    steps: [
      'Faire cuire les pâtes',
      'Mélanger avec la crème et le fromage',
      'Mettre dans un plat à gratin',
      'Enfourner 20 minutes à 180°C'
    ],
    time_min: 35,
    difficulty: 2,
    ingredients: ['pâtes', 'crème fraîche', 'fromage', 'sel', 'poivre']
  },

  // Plats simples
  {
    title: 'Steak haché et frites',
    description: 'Classique et rassasiant',
    steps: [
      'Faire cuire les steaks hachés dans une poêle',
      'Faire cuire les frites',
      'Servir ensemble'
    ],
    time_min: 20,
    difficulty: 1,
    ingredients: ['steak haché', 'pommes de terre', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Saucisses et purée',
    description: 'Simple et réconfortant',
    steps: [
      'Faire cuire les saucisses',
      'Préparer la purée de pommes de terre',
      'Servir ensemble'
    ],
    time_min: 25,
    difficulty: 1,
    ingredients: ['saucisses', 'pommes de terre', 'beurre', 'lait', 'sel']
  },
  {
    title: 'Poulet rôti et légumes',
    description: 'Complet et savoureux',
    steps: [
      'Disposer le poulet et les légumes dans un plat',
      'Arroser d\'huile et assaisonner',
      'Enfourner 45 minutes à 180°C',
      'Servir chaud'
    ],
    time_min: 50,
    difficulty: 2,
    ingredients: ['poulet', 'carottes', 'pommes de terre', 'huile', 'sel', 'poivre']
  },

  // Plus de recettes pour atteindre 100
  {
    title: 'Pâtes aux champignons',
    description: 'Simple et délicieux',
    steps: [
      'Faire cuire les pâtes',
      'Faire revenir les champignons dans l\'huile',
      'Ajouter l\'ail et la crème',
      'Laisser mijoter 5 minutes',
      'Mélanger avec les pâtes et servir'
    ],
    time_min: 18,
    difficulty: 1,
    ingredients: ['pâtes', 'champignons', 'crème fraîche', 'ail', 'huile d\'olive', 'sel', 'poivre']
  },
  {
    title: 'Riz aux légumes',
    description: 'Sain et coloré',
    steps: [
      'Faire cuire le riz',
      'Faire revenir les légumes dans l\'huile',
      'Mélanger avec le riz',
      'Assaisonner et servir'
    ],
    time_min: 25,
    difficulty: 1,
    ingredients: ['riz', 'carottes', 'poivrons', 'oignon', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Riz au poulet',
    description: 'Complet et savoureux',
    steps: [
      'Faire cuire le riz',
      'Faire revenir le poulet dans l\'huile',
      'Ajouter les légumes',
      'Mélanger avec le riz et servir'
    ],
    time_min: 30,
    difficulty: 2,
    ingredients: ['riz', 'poulet', 'oignon', 'carottes', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Quiche aux légumes',
    description: 'Crémeuse et savoureuse',
    steps: [
      'Préparer la pâte brisée',
      'Faire revenir les légumes',
      'Battre les œufs avec la crème',
      'Mélanger avec les légumes',
      'Verser dans le moule et enfourner 30 minutes à 180°C'
    ],
    time_min: 45,
    difficulty: 2,
    ingredients: ['pâte brisée', 'œufs', 'crème fraîche', 'légumes', 'sel', 'poivre']
  },
  {
    title: 'Tarte aux tomates',
    description: 'Fraîche et colorée',
    steps: [
      'Étaler la pâte brisée dans un moule',
      'Disposer les tomates en rondelles',
      'Arroser d\'huile d\'olive',
      'Enfourner 25 minutes à 180°C',
      'Servir chaud ou froid'
    ],
    time_min: 30,
    difficulty: 1,
    ingredients: ['pâte brisée', 'tomates', 'huile d\'olive', 'sel', 'poivre']
  },
  {
    title: 'Pizza margherita',
    description: 'Classique italienne',
    steps: [
      'Étaler la pâte à pizza',
      'Étaler la sauce tomate',
      'Disposer la mozzarella',
      'Enfourner 15 minutes à 220°C',
      'Servir chaud'
    ],
    time_min: 25,
    difficulty: 2,
    ingredients: ['pâte à pizza', 'sauce tomate', 'mozzarella', 'huile d\'olive', 'sel']
  },
  {
    title: 'Lasagnes',
    description: 'Crémeuses et réconfortantes',
    steps: [
      'Faire cuire les pâtes à lasagnes',
      'Préparer la bolognaise',
      'Préparer la béchamel',
      'Alterner pâtes, bolognaise et béchamel',
      'Enfourner 30 minutes à 180°C'
    ],
    time_min: 60,
    difficulty: 3,
    ingredients: ['pâtes à lasagnes', 'viande hachée', 'tomates', 'fromage', 'beurre', 'farine', 'lait', 'sel', 'poivre']
  },
  {
    title: 'Risotto aux champignons',
    description: 'Crémeux et savoureux',
    steps: [
      'Faire revenir les champignons',
      'Faire revenir le riz',
      'Ajouter le bouillon progressivement',
      'Remuer constamment 20 minutes',
      'Ajouter le parmesan et servir'
    ],
    time_min: 35,
    difficulty: 2,
    ingredients: ['riz arborio', 'champignons', 'bouillon', 'parmesan', 'oignon', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Ratatouille',
    description: 'Légumes mijotés',
    steps: [
      'Couper tous les légumes en dés',
      'Faire revenir dans l\'huile d\'olive',
      'Laisser mijoter 30 minutes',
      'Assaisonner et servir'
    ],
    time_min: 40,
    difficulty: 2,
    ingredients: ['tomates', 'courgettes', 'aubergines', 'poivrons', 'oignon', 'huile d\'olive', 'ail', 'sel', 'poivre']
  },
  {
    title: 'Tajine de poulet',
    description: 'Parfumé et savoureux',
    steps: [
      'Faire revenir le poulet',
      'Ajouter les légumes',
      'Couvrir d\'eau et laisser mijoter 45 minutes',
      'Servir chaud'
    ],
    time_min: 55,
    difficulty: 2,
    ingredients: ['poulet', 'oignon', 'carottes', 'pommes de terre', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Curry de légumes',
    description: 'Épicé et savoureux',
    steps: [
      'Faire revenir les légumes',
      'Ajouter le curry',
      'Couvrir de lait de coco',
      'Laisser mijoter 20 minutes',
      'Servir avec du riz'
    ],
    time_min: 30,
    difficulty: 2,
    ingredients: ['légumes', 'curry', 'lait de coco', 'oignon', 'huile', 'sel']
  },
  {
    title: 'Chili con carne',
    description: 'Épicé et rassasiant',
    steps: [
      'Faire revenir la viande',
      'Ajouter les haricots et les tomates',
      'Assaisonner avec le chili',
      'Laisser mijoter 30 minutes',
      'Servir chaud'
    ],
    time_min: 40,
    difficulty: 2,
    ingredients: ['viande hachée', 'haricots rouges', 'tomates', 'oignon', 'chili', 'huile', 'sel']
  },
  {
    title: 'Bolognaise',
    description: 'Sauce classique',
    steps: [
      'Faire revenir la viande',
      'Ajouter les tomates et l\'oignon',
      'Laisser mijoter 30 minutes',
      'Servir avec des pâtes'
    ],
    time_min: 40,
    difficulty: 2,
    ingredients: ['viande hachée', 'tomates', 'oignon', 'ail', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Hamburger maison',
    description: 'Rassasiant et savoureux',
    steps: [
      'Former les steaks hachés',
      'Faire cuire les steaks',
      'Griller les pains',
      'Assembler le hamburger',
      'Servir chaud'
    ],
    time_min: 20,
    difficulty: 2,
    ingredients: ['steak haché', 'pain à hamburger', 'tomates', 'salade', 'fromage', 'sel', 'poivre']
  },
  {
    title: 'Fajitas',
    description: 'Colorées et savoureuses',
    steps: [
      'Faire revenir le poulet',
      'Ajouter les poivrons et l\'oignon',
      'Assaisonner',
      'Servir dans des tortillas'
    ],
    time_min: 25,
    difficulty: 2,
    ingredients: ['poulet', 'poivrons', 'oignon', 'tortillas', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Tacos',
    description: 'Rapides et savoureux',
    steps: [
      'Faire revenir la viande',
      'Chauffer les tortillas',
      'Garnir avec les légumes',
      'Servir chaud'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['viande hachée', 'tortillas', 'tomates', 'salade', 'fromage', 'huile', 'sel']
  },
  {
    title: 'Burritos',
    description: 'Rassasiants et savoureux',
    steps: [
      'Faire revenir la viande',
      'Ajouter les haricots',
      'Garnir les tortillas',
      'Rouler et servir'
    ],
    time_min: 20,
    difficulty: 2,
    ingredients: ['viande hachée', 'haricots', 'tortillas', 'fromage', 'huile', 'sel']
  },
  {
    title: 'Quesadillas',
    description: 'Fondantes et savoureuses',
    steps: [
      'Garnir une tortilla de fromage',
      'Recouvrir d\'une autre tortilla',
      'Faire cuire dans une poêle',
      'Retourner et servir chaud'
    ],
    time_min: 10,
    difficulty: 1,
    ingredients: ['tortillas', 'fromage', 'huile']
  },
  {
    title: 'Nachos',
    description: 'Croustillants et savoureux',
    steps: [
      'Disposer les chips dans un plat',
      'Ajouter le fromage',
      'Enfourner 10 minutes à 180°C',
      'Servir chaud'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['chips', 'fromage', 'tomates', 'sel']
  },
  {
    title: 'Guacamole',
    description: 'Fraîche et savoureuse',
    steps: [
      'Écraser les avocats',
      'Ajouter les tomates et l\'oignon',
      'Assaisonner',
      'Servir frais'
    ],
    time_min: 10,
    difficulty: 1,
    ingredients: ['avocats', 'tomates', 'oignon', 'citron', 'sel', 'poivre']
  },
  {
    title: 'Salsa',
    description: 'Épicée et fraîche',
    steps: [
      'Couper les tomates en dés',
      'Ajouter l\'oignon et le piment',
      'Assaisonner',
      'Servir frais'
    ],
    time_min: 10,
    difficulty: 1,
    ingredients: ['tomates', 'oignon', 'piment', 'citron', 'sel']
  },
  {
    title: 'Hummus',
    description: 'Crémeux et savoureux',
    steps: [
      'Mixer les pois chiches',
      'Ajouter le tahini et le citron',
      'Assaisonner',
      'Servir avec du pain'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['pois chiches', 'tahini', 'citron', 'ail', 'huile d\'olive', 'sel']
  },
  {
    title: 'Baba ganoush',
    description: 'Fumé et savoureux',
    steps: [
      'Griller les aubergines',
      'Éplucher et mixer',
      'Ajouter le tahini et le citron',
      'Assaisonner et servir'
    ],
    time_min: 30,
    difficulty: 2,
    ingredients: ['aubergines', 'tahini', 'citron', 'ail', 'huile d\'olive', 'sel']
  },
  {
    title: 'Taboulé',
    description: 'Fraîche et colorée',
    steps: [
      'Faire cuire le boulgour',
      'Ajouter les légumes finement coupés',
      'Assaisonner avec l\'huile et le citron',
      'Servir frais'
    ],
    time_min: 20,
    difficulty: 1,
    ingredients: ['boulgour', 'tomates', 'concombre', 'oignon', 'huile d\'olive', 'citron', 'sel']
  },
  {
    title: 'Falafels',
    description: 'Croustillants et savoureux',
    steps: [
      'Mixer les pois chiches',
      'Former des boulettes',
      'Faire frire dans l\'huile',
      'Servir chaud'
    ],
    time_min: 30,
    difficulty: 2,
    ingredients: ['pois chiches', 'oignon', 'ail', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Shakshuka',
    description: 'Épicée et savoureuse',
    steps: [
      'Faire revenir les tomates et les poivrons',
      'Casser les œufs dans la sauce',
      'Cuire 10 minutes',
      'Servir chaud'
    ],
    time_min: 20,
    difficulty: 2,
    ingredients: ['tomates', 'poivrons', 'œufs', 'oignon', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Couscous',
    description: 'Complet et savoureux',
    steps: [
      'Faire cuire le couscous',
      'Faire revenir les légumes',
      'Mélanger et servir'
    ],
    time_min: 25,
    difficulty: 1,
    ingredients: ['couscous', 'légumes', 'oignon', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Tagine de légumes',
    description: 'Parfumé et savoureux',
    steps: [
      'Faire revenir les légumes',
      'Couvrir d\'eau et laisser mijoter 30 minutes',
      'Servir chaud'
    ],
    time_min: 40,
    difficulty: 2,
    ingredients: ['légumes', 'oignon', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Pad thaï',
    description: 'Épicé et savoureux',
    steps: [
      'Faire cuire les nouilles',
      'Faire revenir les légumes',
      'Mélanger avec la sauce',
      'Servir chaud'
    ],
    time_min: 25,
    difficulty: 2,
    ingredients: ['nouilles de riz', 'légumes', 'sauce soja', 'huile', 'sel']
  },
  {
    title: 'Riz cantonais',
    description: 'Coloré et savoureux',
    steps: [
      'Faire cuire le riz',
      'Faire revenir les légumes',
      'Ajouter les œufs',
      'Mélanger avec le riz et servir'
    ],
    time_min: 25,
    difficulty: 2,
    ingredients: ['riz', 'légumes', 'œufs', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Nouilles sautées',
    description: 'Rapides et savoureuses',
    steps: [
      'Faire cuire les nouilles',
      'Faire revenir les légumes',
      'Mélanger et servir'
    ],
    time_min: 20,
    difficulty: 1,
    ingredients: ['nouilles', 'légumes', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Soupe miso',
    description: 'Réconfortante et savoureuse',
    steps: [
      'Faire chauffer le bouillon',
      'Ajouter le miso',
      'Ajouter le tofu et les algues',
      'Servir chaud'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['bouillon', 'miso', 'tofu', 'algues', 'sel']
  },
  {
    title: 'Sushi',
    description: 'Fraîche et délicate',
    steps: [
      'Faire cuire le riz',
      'Préparer le poisson',
      'Former les sushis',
      'Servir frais'
    ],
    time_min: 45,
    difficulty: 3,
    ingredients: ['riz', 'poisson', 'algues', 'vinaigre de riz', 'sel']
  },
  {
    title: 'Ramen',
    description: 'Rassasiant et savoureux',
    steps: [
      'Faire chauffer le bouillon',
      'Faire cuire les nouilles',
      'Garnir avec les légumes',
      'Servir chaud'
    ],
    time_min: 20,
    difficulty: 2,
    ingredients: ['nouilles', 'bouillon', 'légumes', 'œufs', 'sel']
  },
  {
    title: 'Bibimbap',
    description: 'Coloré et savoureux',
    steps: [
      'Faire cuire le riz',
      'Faire revenir les légumes',
      'Disposer sur le riz',
      'Ajouter l\'œuf et servir'
    ],
    time_min: 30,
    difficulty: 2,
    ingredients: ['riz', 'légumes', 'œufs', 'huile', 'sel']
  },
  {
    title: 'Kimchi',
    description: 'Fermenté et épicé',
    steps: [
      'Couper le chou',
      'Assaisonner avec le piment',
      'Laisser fermenter 3 jours',
      'Servir frais'
    ],
    time_min: 15,
    difficulty: 2,
    ingredients: ['chou', 'piment', 'ail', 'sel']
  },
  {
    title: 'Bulgogi',
    description: 'Mariné et savoureux',
    steps: [
      'Mariner la viande',
      'Faire revenir dans une poêle',
      'Servir avec du riz'
    ],
    time_min: 30,
    difficulty: 2,
    ingredients: ['viande', 'sauce soja', 'oignon', 'huile', 'sel']
  },
  {
    title: 'Dumplings',
    description: 'Farcis et savoureux',
    steps: [
      'Préparer la farce',
      'Garnir les pâtes',
      'Faire cuire à la vapeur',
      'Servir chaud'
    ],
    time_min: 40,
    difficulty: 3,
    ingredients: ['pâte à raviolis', 'viande', 'légumes', 'sel', 'poivre']
  },
  {
    title: 'Spring rolls',
    description: 'Croustillants et savoureux',
    steps: [
      'Préparer la farce',
      'Garnir les galettes de riz',
      'Rouler et faire frire',
      'Servir chaud'
    ],
    time_min: 30,
    difficulty: 2,
    ingredients: ['galettes de riz', 'légumes', 'huile', 'sel']
  },
  {
    title: 'Pho',
    description: 'Rassasiant et savoureux',
    steps: [
      'Faire chauffer le bouillon',
      'Faire cuire les nouilles',
      'Garnir avec la viande',
      'Servir chaud'
    ],
    time_min: 30,
    difficulty: 2,
    ingredients: ['nouilles', 'bouillon', 'viande', 'légumes', 'sel']
  },
  {
    title: 'Banh mi',
    description: 'Coloré et savoureux',
    steps: [
      'Garnir le pain',
      'Ajouter la viande',
      'Ajouter les légumes',
      'Servir frais'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['pain', 'viande', 'légumes', 'sel']
  },
  {
    title: 'Laksa',
    description: 'Épicé et savoureux',
    steps: [
      'Faire chauffer le bouillon',
      'Faire cuire les nouilles',
      'Garnir avec les légumes',
      'Servir chaud'
    ],
    time_min: 25,
    difficulty: 2,
    ingredients: ['nouilles', 'bouillon', 'légumes', 'huile', 'sel']
  },
  {
    title: 'Nasi goreng',
    description: 'Épicé et savoureux',
    steps: [
      'Faire cuire le riz',
      'Faire revenir les légumes',
      'Mélanger avec le riz',
      'Servir chaud'
    ],
    time_min: 25,
    difficulty: 2,
    ingredients: ['riz', 'légumes', 'œufs', 'huile', 'sel']
  },
  {
    title: 'Satay',
    description: 'Grillé et savoureux',
    steps: [
      'Mariner la viande',
      'Enfiler sur des brochettes',
      'Griller',
      'Servir avec la sauce'
    ],
    time_min: 30,
    difficulty: 2,
    ingredients: ['viande', 'sauce soja', 'huile', 'sel']
  },
  {
    title: 'Gado-gado',
    description: 'Coloré et savoureux',
    steps: [
      'Faire cuire les légumes',
      'Préparer la sauce',
      'Servir avec la sauce'
    ],
    time_min: 25,
    difficulty: 2,
    ingredients: ['légumes', 'sauce cacahuète', 'sel']
  },
  {
    title: 'Rendang',
    description: 'Épicé et savoureux',
    steps: [
      'Faire revenir la viande',
      'Ajouter le lait de coco',
      'Laisser mijoter 2 heures',
      'Servir chaud'
    ],
    time_min: 150,
    difficulty: 3,
    ingredients: ['viande', 'lait de coco', 'oignon', 'huile', 'sel']
  },
  {
    title: 'Nasi lemak',
    description: 'Parfumé et savoureux',
    steps: [
      'Faire cuire le riz au lait de coco',
      'Préparer les accompagnements',
      'Servir ensemble'
    ],
    time_min: 30,
    difficulty: 2,
    ingredients: ['riz', 'lait de coco', 'œufs', 'sel']
  },
  {
    title: 'Char kway teow',
    description: 'Épicé et savoureux',
    steps: [
      'Faire cuire les nouilles',
      'Faire revenir les légumes',
      'Mélanger et servir'
    ],
    time_min: 20,
    difficulty: 2,
    ingredients: ['nouilles', 'légumes', 'sauce soja', 'huile', 'sel']
  },
  {
    title: 'Hainanese chicken rice',
    description: 'Simple et savoureux',
    steps: [
      'Faire cuire le poulet',
      'Faire cuire le riz au bouillon',
      'Servir ensemble'
    ],
    time_min: 45,
    difficulty: 2,
    ingredients: ['poulet', 'riz', 'bouillon', 'sel']
  },
  {
    title: 'Tom yum',
    description: 'Épicé et savoureux',
    steps: [
      'Faire chauffer le bouillon',
      'Ajouter les légumes',
      'Assaisonner',
      'Servir chaud'
    ],
    time_min: 20,
    difficulty: 2,
    ingredients: ['bouillon', 'légumes', 'citron', 'sel']
  },
  {
    title: 'Pad krapow',
    description: 'Épicé et savoureux',
    steps: [
      'Faire revenir la viande',
      'Ajouter les légumes',
      'Assaisonner',
      'Servir avec du riz'
    ],
    time_min: 20,
    difficulty: 2,
    ingredients: ['viande', 'légumes', 'sauce soja', 'huile', 'sel']
  },
  {
    title: 'Massaman curry',
    description: 'Épicé et savoureux',
    steps: [
      'Faire revenir la viande',
      'Ajouter le curry',
      'Couvrir de lait de coco',
      'Laisser mijoter 30 minutes',
      'Servir avec du riz'
    ],
    time_min: 40,
    difficulty: 2,
    ingredients: ['viande', 'curry', 'lait de coco', 'oignon', 'huile', 'sel']
  },
  {
    title: 'Green curry',
    description: 'Épicé et savoureux',
    steps: [
      'Faire revenir les légumes',
      'Ajouter le curry vert',
      'Couvrir de lait de coco',
      'Laisser mijoter 20 minutes',
      'Servir avec du riz'
    ],
    time_min: 30,
    difficulty: 2,
    ingredients: ['légumes', 'curry vert', 'lait de coco', 'huile', 'sel']
  },
  {
    title: 'Red curry',
    description: 'Épicé et savoureux',
    steps: [
      'Faire revenir la viande',
      'Ajouter le curry rouge',
      'Couvrir de lait de coco',
      'Laisser mijoter 30 minutes',
      'Servir avec du riz'
    ],
    time_min: 40,
    difficulty: 2,
    ingredients: ['viande', 'curry rouge', 'lait de coco', 'oignon', 'huile', 'sel']
  },
  {
    title: 'Yellow curry',
    description: 'Épicé et savoureux',
    steps: [
      'Faire revenir les légumes',
      'Ajouter le curry jaune',
      'Couvrir de lait de coco',
      'Laisser mijoter 20 minutes',
      'Servir avec du riz'
    ],
    time_min: 30,
    difficulty: 2,
    ingredients: ['légumes', 'curry jaune', 'lait de coco', 'huile', 'sel']
  },
  {
    title: 'Som tam',
    description: 'Fraîche et épicée',
    steps: [
      'Piler les ingrédients',
      'Assaisonner',
      'Servir frais'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['papaye verte', 'tomates', 'piment', 'citron', 'sel']
  },
  {
    title: 'Larb',
    description: 'Épicé et savoureux',
    steps: [
      'Faire revenir la viande',
      'Assaisonner',
      'Servir avec du riz'
    ],
    time_min: 20,
    difficulty: 2,
    ingredients: ['viande', 'oignon', 'piment', 'citron', 'sel']
  },
  {
    title: 'Mango sticky rice',
    description: 'Sucré et savoureux',
    steps: [
      'Faire cuire le riz gluant',
      'Ajouter le lait de coco',
      'Servir avec la mangue'
    ],
    time_min: 30,
    difficulty: 2,
    ingredients: ['riz gluant', 'lait de coco', 'mangue', 'sel']
  },
  {
    title: 'Banana bread',
    description: 'Moelleux et savoureux',
    steps: [
      'Écraser les bananes',
      'Mélanger avec les autres ingrédients',
      'Enfourner 45 minutes à 180°C',
      'Servir tiède'
    ],
    time_min: 55,
    difficulty: 2,
    ingredients: ['bananes', 'farine', 'œufs', 'beurre', 'sucre', 'sel']
  },
  {
    title: 'Pancakes',
    description: 'Moelleux et savoureux',
    steps: [
      'Mélanger les ingrédients',
      'Faire cuire dans une poêle',
      'Retourner et servir chaud'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['farine', 'œufs', 'lait', 'beurre', 'sel']
  },
  {
    title: 'Waffles',
    description: 'Croustillants et savoureux',
    steps: [
      'Mélanger les ingrédients',
      'Verser dans le gaufrier',
      'Cuire jusqu\'à ce que doré',
      'Servir chaud'
    ],
    time_min: 20,
    difficulty: 2,
    ingredients: ['farine', 'œufs', 'lait', 'beurre', 'sel']
  },
  {
    title: 'French toast',
    description: 'Dorée et savoureuse',
    steps: [
      'Tremper le pain dans les œufs battus',
      'Faire cuire dans une poêle',
      'Retourner et servir chaud'
    ],
    time_min: 10,
    difficulty: 1,
    ingredients: ['pain', 'œufs', 'lait', 'beurre', 'sel']
  },
  {
    title: 'Omelette au sucre',
    description: 'Sucrée et savoureuse',
    steps: [
      'Battre les œufs',
      'Faire cuire dans une poêle',
      'Saupoudrer de sucre',
      'Servir chaud'
    ],
    time_min: 5,
    difficulty: 1,
    ingredients: ['œufs', 'beurre', 'sucre']
  },
  {
    title: 'Crêpes',
    description: 'Fines et savoureuses',
    steps: [
      'Mélanger les ingrédients',
      'Faire cuire dans une poêle',
      'Retourner et servir chaud'
    ],
    time_min: 20,
    difficulty: 1,
    ingredients: ['farine', 'œufs', 'lait', 'beurre', 'sel']
  },
  {
    title: 'Crêpes sucrées',
    description: 'Fines et sucrées',
    steps: [
      'Mélanger les ingrédients',
      'Faire cuire dans une poêle',
      'Saupoudrer de sucre',
      'Servir chaud'
    ],
    time_min: 20,
    difficulty: 1,
    ingredients: ['farine', 'œufs', 'lait', 'beurre', 'sucre', 'sel']
  },
  {
    title: 'Crêpes salées',
    description: 'Fines et savoureuses',
    steps: [
      'Mélanger les ingrédients',
      'Faire cuire dans une poêle',
      'Garnir avec du fromage',
      'Servir chaud'
    ],
    time_min: 20,
    difficulty: 1,
    ingredients: ['farine', 'œufs', 'lait', 'beurre', 'fromage', 'sel']
  },
  {
    title: 'Omelette aux pommes de terre',
    description: 'Rassasiante et savoureuse',
    steps: [
      'Faire revenir les pommes de terre',
      'Battre les œufs',
      'Verser sur les pommes de terre',
      'Cuire 5 minutes',
      'Servir chaud'
    ],
    time_min: 20,
    difficulty: 1,
    ingredients: ['œufs', 'pommes de terre', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Omelette aux oignons',
    description: 'Savoureuse et parfumée',
    steps: [
      'Faire revenir les oignons',
      'Battre les œufs',
      'Verser sur les oignons',
      'Cuire 5 minutes',
      'Servir chaud'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['œufs', 'oignon', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Omelette aux poivrons',
    description: 'Colorée et savoureuse',
    steps: [
      'Faire revenir les poivrons',
      'Battre les œufs',
      'Verser sur les poivrons',
      'Cuire 5 minutes',
      'Servir chaud'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['œufs', 'poivrons', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Omelette aux courgettes',
    description: 'Légère et savoureuse',
    steps: [
      'Faire revenir les courgettes',
      'Battre les œufs',
      'Verser sur les courgettes',
      'Cuire 5 minutes',
      'Servir chaud'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['œufs', 'courgettes', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Omelette aux tomates',
    description: 'Fraîche et savoureuse',
    steps: [
      'Faire revenir les tomates',
      'Battre les œufs',
      'Verser sur les tomates',
      'Cuire 5 minutes',
      'Servir chaud'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['œufs', 'tomates', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Omelette aux épinards',
    description: 'Saine et savoureuse',
    steps: [
      'Faire revenir les épinards',
      'Battre les œufs',
      'Verser sur les épinards',
      'Cuire 5 minutes',
      'Servir chaud'
    ],
    time_min: 15,
    difficulty: 1,
    ingredients: ['œufs', 'épinards', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Omelette aux champignons et fromage',
    description: 'Fondante et savoureuse',
    steps: [
      'Faire revenir les champignons',
      'Battre les œufs avec le fromage',
      'Verser sur les champignons',
      'Cuire 5 minutes',
      'Servir chaud'
    ],
    time_min: 15,
    difficulty: 2,
    ingredients: ['œufs', 'champignons', 'fromage', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Omelette aux lardons et fromage',
    description: 'Rassasiante et savoureuse',
    steps: [
      'Faire revenir les lardons',
      'Battre les œufs avec le fromage',
      'Verser sur les lardons',
      'Cuire 5 minutes',
      'Servir chaud'
    ],
    time_min: 15,
    difficulty: 2,
    ingredients: ['œufs', 'lardons', 'fromage', 'huile', 'sel', 'poivre']
  },
  {
    title: 'Omelette aux fines herbes',
    description: 'Parfumée et savoureuse',
    steps: [
      'Battre les œufs avec les herbes',
      'Faire cuire dans une poêle',
      'Retourner et servir chaud'
    ],
    time_min: 10,
    difficulty: 1,
    ingredients: ['œufs', 'herbes', 'beurre', 'sel', 'poivre']
  },
  {
    title: 'Omelette espagnole',
    description: 'Épaisse et savoureuse',
    steps: [
      'Faire revenir les pommes de terre',
      'Battre les œufs',
      'Verser sur les pommes de terre',
      'Cuire 10 minutes de chaque côté',
      'Servir chaud ou froid'
    ],
    time_min: 25,
    difficulty: 2,
    ingredients: ['œufs', 'pommes de terre', 'oignon', 'huile', 'sel', 'poivre']
  }
]

// Fonction pour normaliser le nom d'ingrédient
function normalizeIngredientName(name: string): string {
  return name.trim().toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/Œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .replace(/Æ/g, 'ae')
}

// Fonction pour générer une URL d'image (dupliquée depuis lib/recipeImages.ts)
function getRecipeImageUrl(title: string): string | null {
  const normalizedTitle = title.toLowerCase().trim()
  
  // Mapping de mots-clés vers des IDs d'images Unsplash spécifiques (libres de droit)
  const keywordImageMap: Record<string, string> = {
    'œufs': 'https://images.unsplash.com/photo-1611859266236-9c81194a6d0e?w=800&h=600&fit=crop&q=80',
    'oeufs': 'https://images.unsplash.com/photo-1611859266236-9c81194a6d0e?w=800&h=600&fit=crop&q=80',
    'omelette': 'https://images.unsplash.com/photo-1611859266236-9c81194a6d0e?w=800&h=600&fit=crop&q=80',
    'champignons': 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop&q=80',
    'pâtes': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
    'pates': 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&h=600&fit=crop&q=80',
    'riz': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=800&h=600&fit=crop&q=80',
    'salade': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop&q=80',
    'tomates': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80',
    'tomate': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&h=600&fit=crop&q=80',
    'poulet': 'https://images.unsplash.com/photo-1604503468506-a8da13d82791?w=800&h=600&fit=crop&q=80',
    'fromage': 'https://images.unsplash.com/photo-1618164436269-4460e6f1f1e6?w=800&h=600&fit=crop&q=80',
    'pizza': 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop&q=80',
    'lasagnes': 'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=800&h=600&fit=crop&q=80',
    'curry': 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&h=600&fit=crop&q=80',
    'tacos': 'https://images.unsplash.com/photo-1565299585323-38174c0c0e8a?w=800&h=600&fit=crop&q=80',
    'sushi': 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop&q=80',
    'ramen': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&h=600&fit=crop&q=80',
    'sandwich': 'https://images.unsplash.com/photo-1539252554453-80ab65ce3586?w=800&h=600&fit=crop&q=80',
    'soupe': 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&h=600&fit=crop&q=80',
    'gratin': 'https://images.unsplash.com/photo-1572441713132-51c75654db73?w=800&h=600&fit=crop&q=80',
    'pommes de terre': 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&h=600&fit=crop&q=80',
    'purée': 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=800&h=600&fit=crop&q=80',
    'pancakes': 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&h=600&fit=crop&q=80',
    'crêpes': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
    'crepes': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop&q=80',
  }
  
  // Chercher une correspondance avec les mots-clés
  for (const [keyword, url] of Object.entries(keywordImageMap)) {
    if (normalizedTitle.includes(keyword)) {
      return url
    }
  }
  
  // Image par défaut de nourriture (libre de droit)
  return 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop&q=80'
}

// Fonction pour importer une recette
async function importRecipe(recipe: Recipe): Promise<number | null> {
  try {
    // Insérer la recette
    const { data: recipeData, error: recipeError } = await supabase
      .from('recipes')
      .insert({
        title: recipe.title,
        description: recipe.description,
        steps: recipe.steps,
        time_min: recipe.time_min,
        difficulty: recipe.difficulty,
        image_url: recipe.image_url || getRecipeImageUrl(recipe.title) || null
      })
      .select()
      .single()

    if (recipeError || !recipeData) {
      console.error(`❌ Erreur lors de l'insertion de "${recipe.title}":`, recipeError)
      return null
    }

    const recipeId = recipeData.id

    // Insérer les ingrédients et créer les relations
    for (const ingredientName of recipe.ingredients) {
      const normalizedName = normalizeIngredientName(ingredientName)

      // Vérifier si l'ingrédient existe déjà
      let { data: ingredient } = await supabase
        .from('ingredients')
        .select('id')
        .eq('name', normalizedName)
        .single()

      // Créer l'ingrédient s'il n'existe pas
      if (!ingredient) {
        const { data: newIngredient, error: ingError } = await supabase
          .from('ingredients')
          .insert({ name: normalizedName })
          .select()
          .single()

        if (ingError || !newIngredient) {
          console.error(`❌ Erreur lors de l'insertion de l'ingrédient "${normalizedName}":`, ingError)
          continue
        }
        ingredient = newIngredient
      }

      // Créer la relation
      if (ingredient && ingredient.id) {
        const { error: relError } = await supabase
          .from('recipe_ingredients')
          .insert({
            recipe_id: recipeId,
            ingredient_id: ingredient.id
          })

        if (relError) {
          console.error(`❌ Erreur lors de la création de la relation:`, relError)
        }
      }
    }

    return recipeId
  } catch (error) {
    console.error(`❌ Erreur fatale lors de l'import de "${recipe.title}":`, error)
    return null
  }
}

// Fonction principale
async function importAllRecipes() {
  console.log('🌱 Import de 100 recettes étudiantes...\n')

  let imported = 0
  let failed = 0

  for (let i = 0; i < recettes.length; i++) {
    const recipe = recettes[i]
    console.log(`[${i + 1}/${recettes.length}] Import de "${recipe.title}"...`)

    const recipeId = await importRecipe(recipe)

    if (recipeId) {
      imported++
      console.log(`   ✅ Importée (ID: ${recipeId})`)
    } else {
      failed++
      console.log(`   ❌ Échec`)
    }

    // Petite pause pour éviter de surcharger la base
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  console.log(`\n✅ Import terminé:`)
  console.log(`   - ${imported} recettes importées`)
  console.log(`   - ${failed} échecs`)
}

// Exécution
importAllRecipes()
  .then(() => {
    process.exit(0)
  })
  .catch(error => {
    console.error('Erreur fatale:', error)
    process.exit(1)
  })

