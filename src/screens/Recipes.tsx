import { useEffect, useMemo, useState } from "react";
import {
  Button,
  Chip,
  EmptyState,
  RecipeCard,
  SearchInput,
  TopAppBar,
} from "../../design/components";
import { useApp } from "../store/useApp";
import { dataSource } from "../data/source";
import type { DietTag, Recipe } from "../data/types";

const DIET_OPTIONS: DietTag[] = [
  "vegetarian",
  "vegan",
  "pescatarian",
  "gluten-free",
  "dairy-free",
];

export function RecipesSearchScreen() {
  const prefs = useApp((s) => s.prefs);
  const push = useApp((s) => s.push);
  const favoriteRecipeIds = useApp((s) => s.favoriteRecipeIds);
  const toggleFavoriteRecipe = useApp((s) => s.toggleFavoriteRecipe);
  const showToast = useApp((s) => s.showToast);

  const query = useApp((s) => s.recipeQuery);
  const setQuery = useApp((s) => s.setRecipeQuery);
  const diet = useApp((s) => s.recipeDiet);
  const setDiet = useApp((s) => s.setRecipeDiet);
  const maxKcal = useApp((s) => s.recipeMaxKcal);
  const setMaxKcal = useApp((s) => s.setRecipeMaxKcal);
  const excludeAllergens = prefs.allergenTags;

  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    let active = true;
    dataSource
      .searchRecipes(query, { diet, excludeAllergens, maxKcal })
      .then((rs) => {
        if (active) setRecipes(rs);
      });
    return () => {
      active = false;
    };
  }, [query, diet, excludeAllergens, maxKcal]);

  const fitsYou = useMemo(() => {
    const userDiets = new Set(prefs.dietTags);
    const userAllergens = new Set(prefs.allergenTags);
    return (r: Recipe) =>
      [...userDiets].every((d) => r.dietTags.includes(d)) &&
      ![...userAllergens].some((a) => r.allergenTags.includes(a));
  }, [prefs]);

  const toggleDiet = (d: DietTag) =>
    setDiet(diet.includes(d) ? diet.filter((x) => x !== d) : [...diet, d]);

  const clearFilters = () => {
    setDiet([]);
    setMaxKcal(undefined);
    setQuery("");
  };

  return (
    <>
      <TopAppBar title="Recipes" asTabRoot />
      <div className="screen">
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          placeholder="Search recipes or ingredients"
        />

        <div className="section-label">Filters</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
          {DIET_OPTIONS.map((d) => (
            <Chip
              key={d}
              variant="filter"
              selected={diet.includes(d)}
              onClick={() => toggleDiet(d)}
            >
              {d}
            </Chip>
          ))}
          <Chip
            variant="filter"
            selected={maxKcal !== undefined}
            onClick={() => setMaxKcal(maxKcal ? undefined : 500)}
          >
            {maxKcal ? `Max ${maxKcal} kcal` : "Max kcal"}
          </Chip>
          {(diet.length > 0 || maxKcal !== undefined) && (
            <Button variant="link" onClick={clearFilters}>
              Clear all
            </Button>
          )}
        </div>

        {recipes.length === 0 ? (
          <EmptyState
            art="🥺"
            title="No recipes match"
            desc="Try fewer filters or a different word."
            action={
              <Button variant="secondary" onClick={clearFilters}>
                Loosen filters
              </Button>
            }
          />
        ) : (
          <div className="list-stack" style={{ gap: "var(--space-md)" }}>
            {recipes.map((r) => {
              const saved = favoriteRecipeIds.includes(r.id);
              return (
                <RecipeCard
                  key={r.id}
                  title={r.title}
                  imageUrl={r.imageUrl}
                  imageBg={r.heroColor}
                  kcal={r.kcalPerServing}
                  prepMinutes={r.prepMinutes}
                  saved={saved}
                  onToggleSave={() => {
                    toggleFavoriteRecipe(r.id);
                    showToast(saved ? "Removed from favorites" : "Saved to favorites");
                  }}
                  onClick={() =>
                    push("recipes", {
                      key: "recipe-detail",
                      props: { recipeId: r.id, fromTab: "recipes" },
                    })
                  }
                  badges={
                    <>
                      {fitsYou(r) && (
                        <Chip variant="badge" tone="fits-you">Fits you</Chip>
                      )}
                      {r.dietTags.slice(0, 2).map((d) => (
                        <Chip key={d} variant="badge" tone="diet">
                          {d}
                        </Chip>
                      ))}
                    </>
                  }
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
