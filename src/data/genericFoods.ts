/**
 * Curated generic foods. Per-100g kcal & macros from public nutrition data
 * (USDA/FoodData Central averages). Searched alongside Open Food Facts so
 * basic queries like "banana" or "chicken breast" return clean generic
 * results instead of only branded products.
 */

import type { Food } from "./types";

interface GenericSeed {
  id: string;
  name: string;
  category: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  basePortionGrams?: number; // default 100
  dietTags?: Food["dietTags"];
  allergenTags?: Food["allergenTags"];
}

const SEEDS: GenericSeed[] = [
  // Fruits
  { id: "g-banana", name: "Banana", category: "fruit", kcal: 89, protein: 1.1, carbs: 23, fat: 0.3, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-apple", name: "Apple", category: "fruit", kcal: 52, protein: 0.3, carbs: 14, fat: 0.2, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-orange", name: "Orange", category: "fruit", kcal: 47, protein: 0.9, carbs: 12, fat: 0.1, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-strawberry", name: "Strawberries", category: "fruit", kcal: 32, protein: 0.7, carbs: 7.7, fat: 0.3, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-blueberry", name: "Blueberries", category: "fruit", kcal: 57, protein: 0.7, carbs: 14, fat: 0.3, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-raspberry", name: "Raspberries", category: "fruit", kcal: 52, protein: 1.2, carbs: 12, fat: 0.7, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-grapes", name: "Grapes", category: "fruit", kcal: 69, protein: 0.7, carbs: 18, fat: 0.2, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-pear", name: "Pear", category: "fruit", kcal: 57, protein: 0.4, carbs: 15, fat: 0.1, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-pineapple", name: "Pineapple", category: "fruit", kcal: 50, protein: 0.5, carbs: 13, fat: 0.1, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-mango", name: "Mango", category: "fruit", kcal: 60, protein: 0.8, carbs: 15, fat: 0.4, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-watermelon", name: "Watermelon", category: "fruit", kcal: 30, protein: 0.6, carbs: 7.6, fat: 0.2, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-peach", name: "Peach", category: "fruit", kcal: 39, protein: 0.9, carbs: 9.5, fat: 0.3, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-avocado", name: "Avocado", category: "fruit", kcal: 160, protein: 2, carbs: 9, fat: 15, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-lemon", name: "Lemon", category: "fruit", kcal: 29, protein: 1.1, carbs: 9, fat: 0.3, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-kiwi", name: "Kiwi", category: "fruit", kcal: 61, protein: 1.1, carbs: 15, fat: 0.5, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Vegetables
  { id: "g-broccoli", name: "Broccoli", category: "vegetable", kcal: 34, protein: 2.8, carbs: 7, fat: 0.4, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-spinach", name: "Spinach", category: "vegetable", kcal: 23, protein: 2.9, carbs: 3.6, fat: 0.4, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-carrot", name: "Carrot", category: "vegetable", kcal: 41, protein: 0.9, carbs: 10, fat: 0.2, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-potato", name: "Potato", category: "vegetable", kcal: 77, protein: 2, carbs: 17, fat: 0.1, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-sweet-potato", name: "Sweet potato", category: "vegetable", kcal: 86, protein: 1.6, carbs: 20, fat: 0.1, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-tomato", name: "Tomato", category: "vegetable", kcal: 18, protein: 0.9, carbs: 3.9, fat: 0.2, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-cucumber", name: "Cucumber", category: "vegetable", kcal: 16, protein: 0.7, carbs: 3.6, fat: 0.1, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-bell-pepper", name: "Bell pepper", category: "vegetable", kcal: 31, protein: 1, carbs: 6, fat: 0.3, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-lettuce", name: "Lettuce", category: "vegetable", kcal: 15, protein: 1.4, carbs: 2.9, fat: 0.2, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-onion", name: "Onion", category: "vegetable", kcal: 40, protein: 1.1, carbs: 9.3, fat: 0.1, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-garlic", name: "Garlic", category: "vegetable", kcal: 149, protein: 6.4, carbs: 33, fat: 0.5, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-zucchini", name: "Zucchini", category: "vegetable", kcal: 17, protein: 1.2, carbs: 3.1, fat: 0.3, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-cauliflower", name: "Cauliflower", category: "vegetable", kcal: 25, protein: 1.9, carbs: 5, fat: 0.3, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-corn", name: "Corn", category: "vegetable", kcal: 86, protein: 3.3, carbs: 19, fat: 1.4, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-mushroom", name: "Mushroom", category: "vegetable", kcal: 22, protein: 3.1, carbs: 3.3, fat: 0.3, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Proteins — meat & poultry
  { id: "g-chicken-breast", name: "Chicken breast", category: "poultry", kcal: 165, protein: 31, carbs: 0, fat: 3.6, dietTags: ["gluten-free", "dairy-free"] },
  { id: "g-chicken-thigh", name: "Chicken thigh", category: "poultry", kcal: 209, protein: 26, carbs: 0, fat: 11, dietTags: ["gluten-free", "dairy-free"] },
  { id: "g-beef-ground", name: "Ground beef (lean)", category: "meat", kcal: 250, protein: 26, carbs: 0, fat: 15, dietTags: ["gluten-free", "dairy-free"] },
  { id: "g-beef-steak", name: "Beef steak", category: "meat", kcal: 271, protein: 25, carbs: 0, fat: 19, dietTags: ["gluten-free", "dairy-free"] },
  { id: "g-pork-chop", name: "Pork chop", category: "meat", kcal: 231, protein: 26, carbs: 0, fat: 14, dietTags: ["gluten-free", "dairy-free"] },
  { id: "g-bacon", name: "Bacon", category: "meat", kcal: 541, protein: 37, carbs: 1.4, fat: 42, dietTags: ["gluten-free", "dairy-free"] },
  { id: "g-turkey-breast", name: "Turkey breast", category: "poultry", kcal: 135, protein: 30, carbs: 0, fat: 1, dietTags: ["gluten-free", "dairy-free"] },

  // Proteins — fish & seafood
  { id: "g-salmon", name: "Salmon", category: "fish", kcal: 208, protein: 20, carbs: 0, fat: 13, dietTags: ["pescatarian", "gluten-free", "dairy-free"], allergenTags: ["fish"] },
  { id: "g-tuna", name: "Tuna", category: "fish", kcal: 132, protein: 28, carbs: 0, fat: 1, dietTags: ["pescatarian", "gluten-free", "dairy-free"], allergenTags: ["fish"] },
  { id: "g-shrimp", name: "Shrimp", category: "seafood", kcal: 99, protein: 24, carbs: 0.2, fat: 0.3, dietTags: ["pescatarian", "gluten-free", "dairy-free"], allergenTags: ["shellfish"] },
  { id: "g-cod", name: "Cod", category: "fish", kcal: 82, protein: 18, carbs: 0, fat: 0.7, dietTags: ["pescatarian", "gluten-free", "dairy-free"], allergenTags: ["fish"] },

  // Proteins — eggs & plant
  { id: "g-egg", name: "Egg (whole)", category: "egg", kcal: 155, protein: 13, carbs: 1.1, fat: 11, dietTags: ["vegetarian", "gluten-free", "dairy-free"], allergenTags: ["eggs"] },
  { id: "g-tofu", name: "Tofu (firm)", category: "plant protein", kcal: 144, protein: 17, carbs: 2.8, fat: 8.7, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"], allergenTags: ["soy"] },
  { id: "g-tempeh", name: "Tempeh", category: "plant protein", kcal: 192, protein: 20, carbs: 7.6, fat: 11, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"], allergenTags: ["soy"] },
  { id: "g-lentils", name: "Lentils, cooked", category: "legume", kcal: 116, protein: 9, carbs: 20, fat: 0.4, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-chickpeas", name: "Chickpeas, cooked", category: "legume", kcal: 164, protein: 8.9, carbs: 27, fat: 2.6, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-black-beans", name: "Black beans, cooked", category: "legume", kcal: 132, protein: 8.9, carbs: 24, fat: 0.5, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-kidney-beans", name: "Kidney beans, cooked", category: "legume", kcal: 127, protein: 8.7, carbs: 23, fat: 0.5, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-edamame", name: "Edamame", category: "legume", kcal: 121, protein: 11, carbs: 9, fat: 5, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"], allergenTags: ["soy"] },

  // Grains & carbs
  { id: "g-rice-white", name: "White rice, cooked", category: "grain", kcal: 130, protein: 2.7, carbs: 28, fat: 0.3, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-rice-brown", name: "Brown rice, cooked", category: "grain", kcal: 123, protein: 2.7, carbs: 26, fat: 1, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-quinoa", name: "Quinoa, cooked", category: "grain", kcal: 120, protein: 4.4, carbs: 21, fat: 1.9, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-oats", name: "Oats (rolled, dry)", category: "grain", kcal: 389, protein: 17, carbs: 66, fat: 7, dietTags: ["vegan", "vegetarian", "dairy-free"] },
  { id: "g-pasta", name: "Pasta, cooked", category: "grain", kcal: 158, protein: 5.8, carbs: 31, fat: 0.9, dietTags: ["vegetarian", "dairy-free"], allergenTags: ["gluten"] },
  { id: "g-bread-white", name: "White bread", category: "grain", kcal: 265, protein: 9, carbs: 49, fat: 3.2, dietTags: ["vegetarian", "dairy-free"], allergenTags: ["gluten"] },
  { id: "g-bread-whole", name: "Whole wheat bread", category: "grain", kcal: 247, protein: 13, carbs: 41, fat: 3.4, dietTags: ["vegetarian", "dairy-free"], allergenTags: ["gluten"] },
  { id: "g-tortilla", name: "Tortilla (flour)", category: "grain", kcal: 304, protein: 8, carbs: 50, fat: 7, dietTags: ["vegetarian", "dairy-free"], allergenTags: ["gluten"] },
  { id: "g-couscous", name: "Couscous, cooked", category: "grain", kcal: 112, protein: 3.8, carbs: 23, fat: 0.2, dietTags: ["vegetarian", "dairy-free"], allergenTags: ["gluten"] },

  // Dairy & alternatives
  { id: "g-milk-whole", name: "Milk (whole)", category: "dairy", kcal: 61, protein: 3.2, carbs: 4.8, fat: 3.3, dietTags: ["vegetarian", "gluten-free"], allergenTags: ["dairy"] },
  { id: "g-milk-skim", name: "Milk (skim)", category: "dairy", kcal: 34, protein: 3.4, carbs: 5, fat: 0.1, dietTags: ["vegetarian", "gluten-free"], allergenTags: ["dairy"] },
  { id: "g-yogurt-greek", name: "Greek yogurt, plain", category: "dairy", kcal: 59, protein: 10, carbs: 3.6, fat: 0.4, dietTags: ["vegetarian", "gluten-free"], allergenTags: ["dairy"] },
  { id: "g-cheese-cheddar", name: "Cheddar cheese", category: "dairy", kcal: 403, protein: 25, carbs: 1.3, fat: 33, dietTags: ["vegetarian", "gluten-free"], allergenTags: ["dairy"] },
  { id: "g-cheese-mozzarella", name: "Mozzarella cheese", category: "dairy", kcal: 280, protein: 28, carbs: 3.1, fat: 17, dietTags: ["vegetarian", "gluten-free"], allergenTags: ["dairy"] },
  { id: "g-butter", name: "Butter", category: "dairy", kcal: 717, protein: 0.9, carbs: 0.1, fat: 81, dietTags: ["vegetarian", "gluten-free"], allergenTags: ["dairy"] },
  { id: "g-almond-milk", name: "Almond milk, unsweetened", category: "dairy alternative", kcal: 17, protein: 0.6, carbs: 0.6, fat: 1.5, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"], allergenTags: ["nuts"] },
  { id: "g-soy-milk", name: "Soy milk", category: "dairy alternative", kcal: 33, protein: 2.9, carbs: 1.7, fat: 1.8, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"], allergenTags: ["soy"] },

  // Nuts & seeds
  { id: "g-almonds", name: "Almonds", category: "nuts", kcal: 579, protein: 21, carbs: 22, fat: 50, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"], allergenTags: ["nuts"] },
  { id: "g-walnuts", name: "Walnuts", category: "nuts", kcal: 654, protein: 15, carbs: 14, fat: 65, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"], allergenTags: ["nuts"] },
  { id: "g-peanuts", name: "Peanuts", category: "nuts", kcal: 567, protein: 26, carbs: 16, fat: 49, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"], allergenTags: ["peanuts"] },
  { id: "g-peanut-butter", name: "Peanut butter", category: "nut butter", kcal: 588, protein: 25, carbs: 20, fat: 50, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"], allergenTags: ["peanuts"] },
  { id: "g-cashews", name: "Cashews", category: "nuts", kcal: 553, protein: 18, carbs: 30, fat: 44, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"], allergenTags: ["nuts"] },
  { id: "g-chia", name: "Chia seeds", category: "seeds", kcal: 486, protein: 17, carbs: 42, fat: 31, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },

  // Pantry / oils / sweeteners
  { id: "g-olive-oil", name: "Olive oil", category: "oil", kcal: 884, protein: 0, carbs: 0, fat: 100, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-honey", name: "Honey", category: "sweetener", kcal: 304, protein: 0.3, carbs: 82, fat: 0, dietTags: ["vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-sugar", name: "Sugar", category: "sweetener", kcal: 387, protein: 0, carbs: 100, fat: 0, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-dark-choc", name: "Dark chocolate (70%)", category: "sweets", kcal: 598, protein: 7.8, carbs: 46, fat: 43, dietTags: ["vegetarian", "gluten-free"] },

  // Drinks
  { id: "g-coffee", name: "Coffee, black", category: "drink", kcal: 2, protein: 0.3, carbs: 0, fat: 0, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
  { id: "g-orange-juice", name: "Orange juice", category: "drink", kcal: 45, protein: 0.7, carbs: 10, fat: 0.2, dietTags: ["vegan", "vegetarian", "gluten-free", "dairy-free"] },
];

/**
 * Photographic ingredient images, courtesy of TheMealDB
 * (https://www.themealdb.com/api.php). Free to use, no key required.
 * Names are URL-encoded inline so spaces work as expected.
 */
const ING = (name: string) =>
  `https://www.themealdb.com/images/ingredients/${encodeURIComponent(name)}.png`;

const IMAGE_BY_ID: Record<string, string> = {
  // Fruits
  "g-banana": ING("Banana"),
  "g-apple": ING("Apples"),
  "g-orange": ING("Orange"),
  "g-strawberry": ING("Strawberries"),
  "g-blueberry": ING("Blueberries"),
  "g-raspberry": ING("Raspberries"),
  "g-grapes": ING("Grapes"),
  "g-pear": ING("Pear"),
  "g-pineapple": ING("Pineapple"),
  "g-mango": ING("Mango"),
  "g-watermelon": ING("Watermelon"),
  "g-peach": ING("Peach"),
  "g-avocado": ING("Avocado"),
  "g-lemon": ING("Lemon"),
  "g-kiwi": ING("Kiwi"),

  // Vegetables
  "g-broccoli": ING("Broccoli"),
  "g-spinach": ING("Spinach"),
  "g-carrot": ING("Carrots"),
  "g-potato": ING("Potatoes"),
  "g-sweet-potato": ING("Sweet Potato"),
  "g-tomato": ING("Tomatoes"),
  "g-cucumber": ING("Cucumber"),
  "g-bell-pepper": ING("Bell Pepper"),
  "g-lettuce": ING("Lettuce"),
  "g-onion": ING("Onion"),
  "g-garlic": ING("Garlic"),
  "g-zucchini": ING("Courgettes"),
  "g-cauliflower": ING("Cauliflower"),
  "g-corn": ING("Sweetcorn"),
  "g-mushroom": ING("Mushrooms"),

  // Meat & poultry
  "g-chicken-breast": ING("Chicken Breast"),
  "g-chicken-thigh": ING("Chicken Thighs"),
  "g-beef-ground": ING("Beef Mince"),
  "g-beef-steak": ING("Beef"),
  "g-pork-chop": ING("Pork"),
  "g-bacon": ING("Bacon"),
  "g-turkey-breast": ING("Turkey"),

  // Fish & seafood
  "g-salmon": ING("Salmon"),
  "g-tuna": ING("Tuna"),
  "g-shrimp": ING("Prawns"),
  "g-cod": ING("Cod"),

  // Eggs & plant proteins
  "g-egg": ING("Eggs"),
  "g-tofu": ING("Tofu"),
  "g-tempeh": ING("Tofu"),
  "g-lentils": ING("Red Lentils"),
  "g-chickpeas": ING("Chickpeas"),
  "g-black-beans": ING("Black Beans"),
  "g-kidney-beans": ING("Kidney Beans"),
  "g-edamame": ING("Soya Beans"),

  // Grains & carbs
  "g-rice-white": ING("White Rice"),
  "g-rice-brown": ING("Brown Rice"),
  "g-quinoa": ING("Quinoa"),
  "g-oats": ING("Oats"),
  "g-pasta": ING("Pasta"),
  "g-bread-white": ING("Bread"),
  "g-bread-whole": ING("Wholewheat bread"),
  "g-tortilla": ING("Tortillas"),
  "g-couscous": ING("Couscous"),

  // Dairy & alternatives
  "g-milk-whole": ING("Whole Milk"),
  "g-milk-skim": ING("Milk"),
  "g-yogurt-greek": ING("Greek Yogurt"),
  "g-cheese-cheddar": ING("Cheddar Cheese"),
  "g-cheese-mozzarella": ING("Mozzarella"),
  "g-butter": ING("Butter"),
  "g-almond-milk": ING("Almond Milk"),
  "g-soy-milk": ING("Soy Milk"),

  // Nuts & seeds
  "g-almonds": ING("Almonds"),
  "g-walnuts": ING("Walnuts"),
  "g-peanuts": ING("Peanuts"),
  "g-peanut-butter": ING("Peanut Butter"),
  "g-cashews": ING("Cashews"),
  "g-chia": ING("Chia Seeds"),

  // Pantry
  "g-olive-oil": ING("Olive Oil"),
  "g-honey": ING("Honey"),
  "g-sugar": ING("Sugar"),
  "g-dark-choc": ING("Dark Chocolate"),

  // Drinks
  "g-coffee": ING("Coffee"),
  "g-orange-juice": ING("Orange Juice"),
};

export const GENERIC_FOODS: Food[] = SEEDS.map((s) => ({
  id: s.id,
  name: s.name,
  category: s.category,
  imageUrl: IMAGE_BY_ID[s.id],
  basePortionGrams: s.basePortionGrams ?? 100,
  kcalPerBase: s.kcal,
  macrosPerBase: { protein: s.protein, carbs: s.carbs, fat: s.fat },
  dietTags: s.dietTags ?? [],
  allergenTags: s.allergenTags ?? [],
  source: "static",
}));

export function searchGenericFoods(query: string): Food[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return GENERIC_FOODS.filter((f) => {
    const hay = `${f.name} ${f.category ?? ""}`.toLowerCase();
    return hay.includes(q);
  });
}
