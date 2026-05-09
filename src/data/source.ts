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

export interface FoodSearchResult {
  items: Food[];
  hasError: boolean;   // true when OFF couldn't be reached at all
}

export const FOODS_PAGE_SIZE = 20;

export interface DataSource {
  searchFoods(
    query: string,
    signal?: AbortSignal,
    page?: number,
  ): Promise<FoodSearchResult>;
  getFood(id: string, signal?: AbortSignal): Promise<Food | null>;
  searchRecipes(query: string, filters?: RecipeFilters): Promise<Recipe[]>;
  getRecipe(id: string): Promise<Recipe | null>;
  allRecipes(): Promise<Recipe[]>;
}

/**
 * Merge generic foods (always first, page 1 only) with branded results
 * from Open Food Facts. Subsequent pages return only OFF results so the
 * generic list isn't repeated when paginating.
 *
 * If the OFF request fails (offline, proxy down, CORS), we still return any
 * generics we matched locally and surface `hasError: true` so the UI can
 * offer a retry.
 */
async function searchFoodsCombined(
  query: string,
  signal?: AbortSignal,
  page = 1,
): Promise<FoodSearchResult> {
  const generics = page === 1 ? searchGenericFoods(query) : [];
  let branded: Food[] = [];
  let hasError = false;
  try {
    branded = await off.searchFoods(query, signal, page);
  } catch (err) {
    if ((err as Error).name !== "AbortError") hasError = true;
  }
  const seen = new Set(generics.map((f) => f.id));
  const filtered = branded.filter((f) => !seen.has(f.id));
  // Cap each page at FOODS_PAGE_SIZE so the result list paginates by exactly 20.
  // Without this, page 1 was generics + 20 branded (often 21–25 rows).
  const items = [...generics, ...filtered].slice(0, FOODS_PAGE_SIZE);
  return { items, hasError };
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
