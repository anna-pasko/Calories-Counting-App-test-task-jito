/**
 * Open Food Facts API wrapper.
 * Free public API, no key required.
 * Docs: https://wiki.openfoodfacts.org/API
 */

import type { Food } from "./types";

/**
 * Routed through `/off-api` so the browser hits the same origin and avoids
 * CORS. Vite proxies it to https://world.openfoodfacts.org in dev; production
 * relies on a host rewrite (see vercel.json).
 */
const SEARCH_URL =
  "/off-api/cgi/search.pl?search_simple=1&action=process&json=1&page_size=20";

interface OFFProduct {
  code?: string;
  product_name?: string;
  product_name_en?: string;
  brands?: string;
  categories_tags?: string[];
  image_small_url?: string;
  image_thumb_url?: string;
  serving_size?: string;
  nutriments?: {
    "energy-kcal_100g"?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    fat_100g?: number;
  };
  allergens_tags?: string[]; // e.g. ["en:milk", "en:gluten"]
  labels_tags?: string[];    // e.g. ["en:vegan", "en:gluten-free"]
}

const ALLERGEN_MAP: Record<string, string> = {
  "en:milk": "dairy",
  "en:gluten": "gluten",
  "en:eggs": "eggs",
  "en:nuts": "nuts",
  "en:peanuts": "peanuts",
  "en:soybeans": "soy",
  "en:fish": "fish",
  "en:crustaceans": "shellfish",
  "en:molluscs": "shellfish",
  "en:sesame-seeds": "sesame",
};

const DIET_MAP: Record<string, string> = {
  "en:vegan": "vegan",
  "en:vegetarian": "vegetarian",
  "en:gluten-free": "gluten-free",
  "en:no-gluten": "gluten-free",
  "en:dairy-free": "dairy-free",
  "en:no-lactose": "dairy-free",
};

function mapProduct(p: OFFProduct): Food | null {
  const name = (p.product_name_en || p.product_name || "").trim();
  const kcal = p.nutriments?.["energy-kcal_100g"];
  if (!name || typeof kcal !== "number" || !p.code) return null;

  return {
    id: p.code,
    name,
    brand: p.brands?.split(",")[0]?.trim() || undefined,
    category: p.categories_tags?.[0]?.replace(/^en:/, "").replace(/-/g, " "),
    imageUrl: p.image_small_url || p.image_thumb_url,
    basePortionGrams: 100,
    kcalPerBase: Math.round(kcal),
    macrosPerBase: {
      protein: round1(p.nutriments?.proteins_100g ?? 0),
      carbs: round1(p.nutriments?.carbohydrates_100g ?? 0),
      fat: round1(p.nutriments?.fat_100g ?? 0),
    },
    allergenTags: (p.allergens_tags ?? [])
      .map((t) => ALLERGEN_MAP[t])
      .filter(Boolean) as Food["allergenTags"],
    dietTags: (p.labels_tags ?? [])
      .map((t) => DIET_MAP[t])
      .filter(Boolean) as Food["dietTags"],
    source: "open-food-facts",
  };
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

export async function searchFoods(query: string, signal?: AbortSignal): Promise<Food[]> {
  if (!query.trim()) return [];
  const url = `${SEARCH_URL}&search_terms=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return [];
    const data = (await res.json()) as { products?: OFFProduct[] };
    return (data.products ?? [])
      .map(mapProduct)
      .filter((f): f is Food => f !== null);
  } catch (err) {
    if ((err as Error).name === "AbortError") return [];
    console.error("OFF search failed:", err);
    return [];
  }
}

export async function getFood(id: string, signal?: AbortSignal): Promise<Food | null> {
  const url = `/off-api/api/v2/product/${encodeURIComponent(id)}.json`;
  try {
    const res = await fetch(url, { signal });
    if (!res.ok) return null;
    const data = (await res.json()) as { product?: OFFProduct };
    return data.product ? mapProduct(data.product) : null;
  } catch (err) {
    if ((err as Error).name === "AbortError") return null;
    console.error("OFF fetch failed:", err);
    return null;
  }
}
