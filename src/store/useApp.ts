import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AllergenTag,
  DietTag,
  Food,
  UserPrefs,
} from "../data/types";

/* ------------------------------------------------------------------ */
/*  Navigation                                                          */
/* ------------------------------------------------------------------ */

export type TabKey = "calculate" | "recipes" | "profile";

export type ScreenKey =
  | "calculate-search"
  | "calculate-detail"
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

  // toast (transient)
  toast: { message: string; tone: "success" | "warning" | "danger" } | null;
  showToast: (message: string, tone?: "success" | "warning" | "danger") => void;
  dismissToast: () => void;
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

      // toast
      toast: null,
      showToast: (message, tone = "success") => {
        set({ toast: { message, tone } });
        setTimeout(() => {
          if (get().toast?.message === message) set({ toast: null });
        }, 2400);
      },
      dismissToast: () => set({ toast: null }),
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
