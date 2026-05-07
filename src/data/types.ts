/**
 * Domain types for foods and recipes.
 * Foods come from Open Food Facts (live), recipes from a curated static JSON.
 * Both pass through the DataSource interface in source.ts.
 */

export type DietTag =
  | "vegetarian"
  | "vegan"
  | "pescatarian"
  | "gluten-free"
  | "dairy-free"
  | "keto"
  | "low-carb";

export type AllergenTag =
  | "nuts"
  | "peanuts"
  | "dairy"
  | "eggs"
  | "soy"
  | "gluten"
  | "fish"
  | "shellfish"
  | "sesame";

export interface Macros {
  protein: number; // grams
  carbs: number;   // grams
  fat: number;     // grams
}

/**
 * A food item — base portion is the canonical "100g" or single-piece reference.
 * The detail screen scales kcal & macros based on the user's chosen portion.
 */
export interface Food {
  id: string;            // OFF barcode or generated id
  name: string;
  brand?: string;
  category?: string;
  imageUrl?: string;
  basePortionGrams: number; // typically 100
  kcalPerBase: number;
  macrosPerBase: Macros;
  allergenTags: AllergenTag[];
  dietTags: DietTag[];
  source: "open-food-facts" | "static";
}

export interface Ingredient {
  qty: number;
  unit: string; // "g", "ml", "tbsp", "cup", "piece"
  name: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  heroEmoji: string;     // v0 placeholder hero
  heroColor: string;     // tile bg color (any CSS color)
  imageUrl?: string;     // future: drop in real photo URL
  kcalPerServing: number;
  macrosPerServing: Macros;
  prepMinutes: number;
  defaultServings: number;
  dietTags: DietTag[];
  allergenTags: AllergenTag[];
  ingredients: Ingredient[];
  steps: string[];
}

export interface RecipeFilters {
  diet?: DietTag[];          // recipe must include all
  excludeAllergens?: AllergenTag[]; // recipe must include none
  maxKcal?: number;
  ingredient?: string;       // free-text ingredient search
}

export interface UserPrefs {
  dietTags: DietTag[];
  allergenTags: AllergenTag[]; // user's allergens to exclude from recipes
  calorieGoal: number;         // kcal/day
}
