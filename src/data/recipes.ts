import recipesJson from "./recipes.json";
import type { Recipe, RecipeFilters } from "./types";

export const ALL_RECIPES: Recipe[] = recipesJson as Recipe[];

export function getRecipe(id: string): Recipe | null {
  return ALL_RECIPES.find((r) => r.id === id) ?? null;
}

export function searchRecipes(query: string, filters?: RecipeFilters): Recipe[] {
  const q = query.trim().toLowerCase();
  return ALL_RECIPES.filter((r) => {
    // text query: match against title, description, ingredients
    if (q) {
      const haystack = [
        r.title,
        r.description,
        ...r.ingredients.map((i) => i.name),
      ]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(q)) return false;
    }

    if (filters?.diet?.length) {
      // recipe must include ALL requested diet tags
      const hasAll = filters.diet.every((d) => r.dietTags.includes(d));
      if (!hasAll) return false;
    }

    if (filters?.excludeAllergens?.length) {
      // recipe must include NONE of the excluded allergens
      const hasAny = filters.excludeAllergens.some((a) =>
        r.allergenTags.includes(a)
      );
      if (hasAny) return false;
    }

    if (typeof filters?.maxKcal === "number" && r.kcalPerServing > filters.maxKcal) {
      return false;
    }

    if (filters?.ingredient?.trim()) {
      const want = filters.ingredient.trim().toLowerCase();
      const has = r.ingredients.some((i) => i.name.toLowerCase().includes(want));
      if (!has) return false;
    }

    return true;
  });
}
