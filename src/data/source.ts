/**
 * Single entry point for data reads.
 * Foods → live Open Food Facts.
 * Recipes → curated static JSON.
 *
 * Components should import from here, never directly from openFoodFacts/recipes.
 * Swapping a backend later (e.g., Spoonacular for recipes) is a one-file change.
 */

import * as off from "./openFoodFacts";
import { GENERIC_FOODS, searchGenericFoods } from "./genericFoods";
import { ALL_RECIPES, getRecipe, searchRecipes } from "./recipes";
import type { Food, Recipe, RecipeFilters } from "./types";

export interface DataSource {
  searchFoods(query: string, signal?: AbortSignal, page?: number): Promise<Food[]>;
  getFood(id: string, signal?: AbortSignal): Promise<Food | null>;
  searchRecipes(query: string, filters?: RecipeFilters): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe | null>;
  allRecipes(): Promise<Recipe[]>;
}

/**
 * Merge generic foods (always first, page 1 only) with branded results
 * from Open Food Facts. Subsequent pages return only OFF results so the
 * generic list isn't repeated when paginating.
 */
async function searchFoodsCombined(
  query: string,
  signal?: AbortSignal,
  page = 1,
): Promise<Food[]> {
  const generics = page === 1 ? searchGenericFoods(query) : [];
  const branded = await off.searchFoods(query, signal, page);
  const seen = new Set(generics.map((f) => f.id));
  const filtered = branded.filter((f) => !seen.has(f.id));
  return [...generics, ...filtered];
}

export const dataSource: DataSource = {
  searchFoods: (query, signal, page) => searchFoodsCombined(query, signal, page),
  getFood: async (id, signal) => {
    const generic = GENERIC_FOODS.find((f) => f.id === id);
    if (generic) return generic;
    return off.getFood(id, signal);
  },
  searchRecipes: async (query, filters) => searchRecipes(query, filters),
  getRecipe: async (id) => getRecipe(id),
  allRecipes: async () => ALL_RECIPES,
};
