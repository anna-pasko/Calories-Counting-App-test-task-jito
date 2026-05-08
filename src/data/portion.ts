/**
 * Pure portion / nutrition math, shared across:
 *   - CalculateDetail (single-item screen)
 *   - PortionPicker (quick-add bottom sheet)
 *   - Meal review screen (per-item totals)
 *   - Saved dish cards / detail (full-dish totals)
 *
 * Keep this file dependency-free and side-effect-free.
 */
import type { Food, Macros, MealItem, MealUnit } from "./types";

/** Rough conversion factors → grams. "serving" uses food.basePortionGrams. */
const UNIT_TO_G: Record<Exclude<MealUnit, "serving">, number> = {
  g: 1,
  pieces: 80,
  cups: 240,
  tbsp: 15,
};

export function computeGrams(food: Food, qty: number, unit: MealUnit): number {
  return unit === "serving"
    ? qty * food.basePortionGrams
    : qty * UNIT_TO_G[unit];
}

export interface PortionNutrition extends Macros {
  grams: number;
  kcal: number;
}

export function computeNutrition(
  food: Food,
  qty: number,
  unit: MealUnit
): PortionNutrition {
  const grams = computeGrams(food, qty, unit);
  const factor = grams / food.basePortionGrams;
  return {
    grams,
    kcal: Math.round(food.kcalPerBase * factor),
    protein: round1(food.macrosPerBase.protein * factor),
    carbs: round1(food.macrosPerBase.carbs * factor),
    fat: round1(food.macrosPerBase.fat * factor),
  };
}

export interface MealTotals extends Macros {
  kcal: number;
}

export function sumMealNutrition(items: MealItem[]): MealTotals {
  let kcal = 0;
  let protein = 0;
  let carbs = 0;
  let fat = 0;
  for (const it of items) {
    const n = computeNutrition(it.food, it.qty, it.unit);
    kcal += n.kcal;
    protein += n.protein;
    carbs += n.carbs;
    fat += n.fat;
  }
  return {
    kcal: Math.round(kcal),
    protein: round1(protein),
    carbs: round1(carbs),
    fat: round1(fat),
  };
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
