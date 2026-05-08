import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AllergenTag,
  DietTag,
  Food,
  MealItem,
  MealUnit,
  SavedDish,
  UserPrefs,
} from "../data/types";
import { sumMealNutrition, type MealTotals } from "../data/portion";

/* ------------------------------------------------------------------ */
/*  Navigation                                                          */
/* ------------------------------------------------------------------ */

export type TabKey = "calculate" | "recipes" | "profile";

export type ScreenKey =
  | "calculate-search"
  | "calculate-detail"
  | "meal-review"
  | "saved-dish-detail"
  | "recipes-search"
  | "recipe-detail"
  | "profile-overview"
  | "profile-edit"
  | "profile-favorites";

export interface Screen {
  key: ScreenKey;
  /** payload — e.g. foodId, recipeId, prefilled state */
  props?: Record<string, unknown>;
}

const ROOTS: Record<TabKey, Screen> = {
  calculate: { key: "calculate-search" },
  recipes: { key: "recipes-search" },
  profile: { key: "profile-overview" },
};

function makeId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

/* ------------------------------------------------------------------ */
/*  State                                                               */
/* ------------------------------------------------------------------ */

const DEFAULT_PREFS: UserPrefs = {
  dietTags: [],
  allergenTags: [],
  calorieGoal: 2000,
};

interface AppState {
  // onboarding
  onboarded: boolean;
  completeOnboarding: (prefs: UserPrefs) => void;
  resetOnboarding: () => void;

  // navigation
  activeTab: TabKey;
  stacks: Record<TabKey, Screen[]>;
  setActiveTab: (tab: TabKey) => void;
  push: (tab: TabKey, screen: Screen) => void;
  pop: (tab?: TabKey) => void;
  resetTab: (tab: TabKey) => void;

  // user prefs
  prefs: UserPrefs;
  setPrefs: (prefs: UserPrefs) => void;
  toggleDiet: (tag: DietTag) => void;
  toggleAllergen: (tag: AllergenTag) => void;
  setCalorieGoal: (kcal: number) => void;

  // favorites
  favoriteFoodIds: string[];
  favoriteRecipeIds: string[];
  toggleFavoriteFood: (id: string) => void;
  toggleFavoriteRecipe: (id: string) => void;

  // recent searches (foods)
  recentSearches: string[];
  addRecentSearch: (query: string) => void;
  clearRecentSearches: () => void;

  // search state (preserved across navigation)
  calcQuery: string;
  calcResults: Food[];
  setCalcQuery: (q: string) => void;
  setCalcResults: (r: Food[]) => void;

  recipeQuery: string;
  recipeDiet: DietTag[];
  recipeMaxKcal: number | undefined;
  setRecipeQuery: (q: string) => void;
  setRecipeDiet: (d: DietTag[]) => void;
  setRecipeMaxKcal: (k: number | undefined) => void;

  // meal builder (draft + saved dishes)
  draftMeal: MealItem[];
  addToMeal: (food: Food, qty: number, unit: MealUnit) => void;
  removeMealItem: (itemId: string) => void;
  updateMealItem: (itemId: string, qty: number, unit: MealUnit) => void;
  clearMeal: () => void;

  savedDishes: SavedDish[];
  /** When non-null, saveMealAsDish updates this dish in place instead of creating a new one. */
  editingDishId: string | null;
  /** Returns the id of the saved (or updated) dish. */
  saveMealAsDish: (name: string) => string;
  loadDishIntoMeal: (dishId: string) => void;
  deleteSavedDish: (id: string) => void;

  // toast (transient)
  toast: { message: string; tone: "success" | "warning" | "danger" } | null;
  showToast: (message: string, tone?: "success" | "warning" | "danger") => void;
  dismissToast: () => void;

  // confirm dialog
  confirm: {
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    onConfirm: () => void;
  } | null;
  showConfirm: (params: NonNullable<AppState["confirm"]>) => void;
  dismissConfirm: () => void;
}

export const useApp = create<AppState>()(
  persist(
    (set, get) => ({
      // onboarding
      onboarded: false,
      completeOnboarding: (prefs) =>
        set({
          onboarded: true,
          prefs,
          recipeDiet: prefs.dietTags,
          activeTab: "calculate",
          stacks: {
            calculate: [ROOTS.calculate],
            recipes: [ROOTS.recipes],
            profile: [ROOTS.profile],
          },
        }),
      resetOnboarding: () =>
        set({
          onboarded: false,
          prefs: DEFAULT_PREFS,
          favoriteFoodIds: [],
          favoriteRecipeIds: [],
          recentSearches: [],
          calcQuery: "",
          calcResults: [],
          recipeQuery: "",
          recipeDiet: [],
          recipeMaxKcal: undefined,
          draftMeal: [],
          savedDishes: [],
          editingDishId: null,
          activeTab: "calculate",
          stacks: {
            calculate: [ROOTS.calculate],
            recipes: [ROOTS.recipes],
            profile: [ROOTS.profile],
          },
        }),

      // navigation
      activeTab: "calculate",
      stacks: {
        calculate: [ROOTS.calculate],
        recipes: [ROOTS.recipes],
        profile: [ROOTS.profile],
      },
      setActiveTab: (tab) => set({ activeTab: tab }),
      push: (tab, screen) =>
        set((s) => ({
          stacks: { ...s.stacks, [tab]: [...s.stacks[tab], screen] },
        })),
      pop: (tab) =>
        set((s) => {
          const which = tab ?? s.activeTab;
          const stack = s.stacks[which];
          if (stack.length <= 1) return s;
          return {
            stacks: {
              ...s.stacks,
              [which]: stack.slice(0, -1),
            },
          };
        }),
      resetTab: (tab) =>
        set((s) => ({
          stacks: { ...s.stacks, [tab]: [ROOTS[tab]] },
        })),

      // prefs
      prefs: DEFAULT_PREFS,
      setPrefs: (prefs) => set({ prefs }),
      toggleDiet: (tag) =>
        set((s) => ({
          prefs: {
            ...s.prefs,
            dietTags: s.prefs.dietTags.includes(tag)
              ? s.prefs.dietTags.filter((t) => t !== tag)
              : [...s.prefs.dietTags, tag],
          },
        })),
      toggleAllergen: (tag) =>
        set((s) => ({
          prefs: {
            ...s.prefs,
            allergenTags: s.prefs.allergenTags.includes(tag)
              ? s.prefs.allergenTags.filter((t) => t !== tag)
              : [...s.prefs.allergenTags, tag],
          },
        })),
      setCalorieGoal: (kcal) =>
        set((s) => ({
          prefs: { ...s.prefs, calorieGoal: Math.max(800, Math.min(6000, kcal)) },
        })),

      // favorites
      favoriteFoodIds: [],
      favoriteRecipeIds: [],
      toggleFavoriteFood: (id) =>
        set((s) => ({
          favoriteFoodIds: s.favoriteFoodIds.includes(id)
            ? s.favoriteFoodIds.filter((x) => x !== id)
            : [id, ...s.favoriteFoodIds],
        })),
      toggleFavoriteRecipe: (id) =>
        set((s) => ({
          favoriteRecipeIds: s.favoriteRecipeIds.includes(id)
            ? s.favoriteRecipeIds.filter((x) => x !== id)
            : [id, ...s.favoriteRecipeIds],
        })),

      // recents
      recentSearches: [],
      addRecentSearch: (query) => {
        const q = query.trim();
        if (!q) return;
        set((s) => ({
          recentSearches: [q, ...s.recentSearches.filter((x) => x !== q)].slice(0, 8),
        }));
      },
      clearRecentSearches: () => set({ recentSearches: [] }),

      // search state (preserved across navigation)
      calcQuery: "",
      calcResults: [],
      setCalcQuery: (q) => set({ calcQuery: q }),
      setCalcResults: (r) => set({ calcResults: r }),

      recipeQuery: "",
      recipeDiet: [],
      recipeMaxKcal: undefined,
      setRecipeQuery: (q) => set({ recipeQuery: q }),
      setRecipeDiet: (d) => set({ recipeDiet: d }),
      setRecipeMaxKcal: (k) => set({ recipeMaxKcal: k }),

      // meal builder
      draftMeal: [],
      addToMeal: (food, qty, unit) =>
        set((s) => ({
          draftMeal: [
            ...s.draftMeal,
            {
              id: makeId(),
              food,
              qty,
              unit,
              addedAt: Date.now(),
            },
          ],
        })),
      removeMealItem: (itemId) =>
        set((s) => ({
          draftMeal: s.draftMeal.filter((it) => it.id !== itemId),
        })),
      updateMealItem: (itemId, qty, unit) =>
        set((s) => ({
          draftMeal: s.draftMeal.map((it) =>
            it.id === itemId ? { ...it, qty, unit } : it
          ),
        })),
      clearMeal: () => set({ draftMeal: [], editingDishId: null }),

      savedDishes: [],
      editingDishId: null,
      saveMealAsDish: (name) => {
        const trimmed = name.trim() || "Untitled dish";
        const now = Date.now();
        const editingId = get().editingDishId;
        const draft = get().draftMeal;
        if (editingId) {
          set((s) => ({
            savedDishes: s.savedDishes.map((d) =>
              d.id === editingId
                ? { ...d, name: trimmed, items: draft, updatedAt: now }
                : d
            ),
            draftMeal: [],
            editingDishId: null,
          }));
          return editingId;
        }
        const id = makeId();
        set((s) => ({
          savedDishes: [
            { id, name: trimmed, items: draft, createdAt: now, updatedAt: now },
            ...s.savedDishes,
          ],
          draftMeal: [],
          editingDishId: null,
        }));
        return id;
      },
      loadDishIntoMeal: (dishId) => {
        const dish = get().savedDishes.find((d) => d.id === dishId);
        if (!dish) return;
        // Fresh ids so editing doesn't alias with the original.
        const items: MealItem[] = dish.items.map((it) => ({
          ...it,
          id: makeId(),
          addedAt: Date.now(),
        }));
        set({ draftMeal: items, editingDishId: dishId });
      },
      deleteSavedDish: (id) =>
        set((s) => ({
          savedDishes: s.savedDishes.filter((d) => d.id !== id),
          editingDishId: s.editingDishId === id ? null : s.editingDishId,
        })),

      // toast
      toast: null,
      showToast: (message, tone = "success") => {
        set({ toast: { message, tone } });
        setTimeout(() => {
          if (get().toast?.message === message) set({ toast: null });
        }, 2400);
      },
      dismissToast: () => set({ toast: null }),

      // confirm dialog
      confirm: null,
      showConfirm: (params) => set({ confirm: params }),
      dismissConfirm: () => set({ confirm: null }),
    }),
    {
      name: "calories-app-v0",
      partialize: (s) => ({
        onboarded: s.onboarded,
        prefs: s.prefs,
        favoriteFoodIds: s.favoriteFoodIds,
        favoriteRecipeIds: s.favoriteRecipeIds,
        recentSearches: s.recentSearches,
        recipeDiet: s.recipeDiet,
        recipeMaxKcal: s.recipeMaxKcal,
        draftMeal: s.draftMeal,
        savedDishes: s.savedDishes,
        editingDishId: s.editingDishId,
      }),
    }
  )
);

/* ------------------------------------------------------------------ */
/*  Selectors / helpers                                                 */
/* ------------------------------------------------------------------ */

export function useCurrentScreen(): Screen {
  const stack = useApp((s) => s.stacks[s.activeTab]);
  return stack[stack.length - 1];
}

export function useIsAtTabRoot(): boolean {
  return useApp((s) => s.stacks[s.activeTab].length === 1);
}

/** Live totals for the current draft meal — recomputed whenever items change. */
export function useMealTotals(): MealTotals {
  const items = useApp((s) => s.draftMeal);
  return sumMealNutrition(items);
}
