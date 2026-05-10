import { useEffect, useMemo, useState } from "react";
import {
  Chip,
  EmptyState,
  RecipeCard,
  ResultRow,
  SegmentedControl,
  TopAppBar,
} from "../../design/components";
import { useApp } from "../store/useApp";
import { dataSource } from "../data/source";
import { FoodThumb } from "../components/FoodThumb";
import { PortionPicker } from "../components/PortionPicker";
import type { Food, Recipe } from "../data/types";

type Tab = "foods" | "recipes";

export function ProfileFavoritesScreen() {
  const pop = useApp((s) => s.pop);
  const push = useApp((s) => s.push);
  const prefs = useApp((s) => s.prefs);
  const favFoodIds = useApp((s) => s.favoriteFoodIds);
  const favRecipeIds = useApp((s) => s.favoriteRecipeIds);
  const toggleFavoriteRecipe = useApp((s) => s.toggleFavoriteRecipe);
  const addToMeal = useApp((s) => s.addToMeal);
  const showToast = useApp((s) => s.showToast);

  // Same definition as Recipes.tsx — recipe matches all user diets and avoids
  // every allergen the user picked. Lets a saved-then-conflicted favorite
  // surface a warning badge at the card level instead of only on detail.
  const fitsYou = useMemo(() => {
    const userDiets = new Set(prefs.dietTags);
    const userAllergens = new Set(prefs.allergenTags);
    return (r: Recipe) =>
      [...userDiets].every((d) => r.dietTags.includes(d)) &&
      ![...userAllergens].some((a) => r.allergenTags.includes(a));
  }, [prefs]);

  const [tab, setTab] = useState<Tab>("foods");
  const [foods, setFoods] = useState<Food[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [pickerFood, setPickerFood] = useState<Food | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all(favFoodIds.map((id) => dataSource.getFood(id))).then((rs) => {
      if (active) setFoods(rs.filter((f): f is Food => !!f));
    });
    return () => {
      active = false;
    };
  }, [favFoodIds]);

  useEffect(() => {
    let active = true;
    Promise.all(favRecipeIds.map((id) => dataSource.getRecipe(id))).then((rs) => {
      if (active) setRecipes(rs.filter((r): r is Recipe => !!r));
    });
    return () => {
      active = false;
    };
  }, [favRecipeIds]);

  return (
    <>
      <TopAppBar title="Favorites" onBack={() => pop()} />
      <div className="screen">
        <SegmentedControl
          options={[
            { value: "foods", label: "Foods" },
            { value: "recipes", label: "Recipes" },
          ]}
          value={tab}
          onChange={setTab}
        />

        {tab === "foods" ? (
          foods.length === 0 ? (
            <EmptyState
              art="🥫"
              title="No saved foods"
              desc="Tap the heart on a food to save it here."
            />
          ) : (
            <div className="list-stack">
              {foods.map((f) => (
                <ResultRow
                  key={f.id}
                  thumb={<FoodThumb imageUrl={f.imageUrl} />}
                  title={f.name}
                  meta={[f.brand, `${f.basePortionGrams} g base`].filter(Boolean).join(" · ")}
                  kcal={f.kcalPerBase}
                  onClick={() => setPickerFood(f)}
                />
              ))}
            </div>
          )
        ) : recipes.length === 0 ? (
          <EmptyState
            art="🥗"
            title="No saved recipes"
            desc="Tap the heart on a recipe to save it here."
          />
        ) : (
          <div className="list-stack" style={{ gap: "var(--space-md)" }}>
            {recipes.map((r) => (
              <RecipeCard
                key={r.id}
                title={r.title}
                imageUrl={r.imageUrl}
                imageBg={r.heroColor}
                kcal={r.kcalPerServing}
                prepMinutes={r.prepMinutes}
                saved={true}
                onToggleSave={() => {
                  toggleFavoriteRecipe(r.id);
                  showToast("Removed from favorites");
                }}
                onClick={() =>
                  push("profile", {
                    key: "recipe-detail",
                    props: { recipeId: r.id, fromTab: "profile" },
                  })
                }
                badges={
                  <>
                    {fitsYou(r) && (
                      <Chip variant="badge" tone="fits-you">Fits you</Chip>
                    )}
                    {prefs.allergenTags
                      .filter((a) => r.allergenTags.includes(a))
                      .map((a) => (
                        <Chip key={a} variant="badge" tone="warning">
                          Contains {a}
                        </Chip>
                      ))}
                    {r.dietTags.slice(0, 2).map((d) => (
                      <Chip key={d} variant="badge" tone="diet">{d}</Chip>
                    ))}
                  </>
                }
              />
            ))}
          </div>
        )}
      </div>
      {pickerFood && (
        <PortionPicker
          food={pickerFood}
          onCancel={() => setPickerFood(null)}
          onConfirm={(qty, unit) => {
            addToMeal(pickerFood, qty, unit);
            setPickerFood(null);
            showToast(`Added ${pickerFood.name} to meal`);
          }}
        />
      )}
    </>
  );
}
