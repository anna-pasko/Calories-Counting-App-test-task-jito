import { useEffect, useState } from "react";
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
import type { Food, Recipe } from "../data/types";

type Tab = "foods" | "recipes";

export function ProfileFavoritesScreen() {
  const pop = useApp((s) => s.pop);
  const push = useApp((s) => s.push);
  const favFoodIds = useApp((s) => s.favoriteFoodIds);
  const favRecipeIds = useApp((s) => s.favoriteRecipeIds);
  const toggleFavoriteRecipe = useApp((s) => s.toggleFavoriteRecipe);
  const showToast = useApp((s) => s.showToast);

  const [tab, setTab] = useState<Tab>("foods");
  const [foods, setFoods] = useState<Food[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

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
                  thumb={
                    f.imageUrl ? (
                      <img
                        src={f.imageUrl}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      "🥫"
                    )
                  }
                  title={f.name}
                  meta={[f.brand, `${f.basePortionGrams} g base`].filter(Boolean).join(" · ")}
                  kcal={f.kcalPerBase}
                  onClick={() =>
                    push("profile", {
                      key: "calculate-detail",
                      props: { foodId: f.id, food: f },
                    })
                  }
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
                badges={r.dietTags
                  .slice(0, 2)
                  .map((d) => (
                    <Chip key={d} variant="badge" tone="diet">{d}</Chip>
                  ))}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
