import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  Chip,
  NumberStepper,
  NutritionStrip,
  SaveButton,
} from "../../design/components";
import { useApp } from "../store/useApp";
import type { TabKey } from "../store/useApp";
import { dataSource } from "../data/source";
import type { Recipe } from "../data/types";

export function RecipeDetailScreen({
  recipeId,
}: {
  recipeId?: string;
  fromTab?: TabKey;
}) {
  const pop = useApp((s) => s.pop);
  const prefs = useApp((s) => s.prefs);
  const isFav = useApp((s) =>
    recipeId ? s.favoriteRecipeIds.includes(recipeId) : false
  );
  const toggleFav = useApp((s) => s.toggleFavoriteRecipe);
  const showToast = useApp((s) => s.showToast);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [servings, setServings] = useState(1);
  const [heroErrored, setHeroErrored] = useState(false);

  useEffect(() => {
    if (!recipeId) return;
    let active = true;
    setHeroErrored(false);
    dataSource.getRecipe(recipeId).then((r) => {
      if (active && r) {
        setRecipe(r);
        setServings(r.defaultServings);
      }
    });
    return () => {
      active = false;
    };
  }, [recipeId]);

  if (!recipe) {
    return (
      <div className="screen muted center" style={{ paddingTop: "var(--space-3xl)" }}>
        Loading recipe…
      </div>
    );
  }

  const factor = servings / recipe.defaultServings;
  const kcal = Math.round(recipe.kcalPerServing);
  const macros = {
    protein: round1(recipe.macrosPerServing.protein),
    carbs: round1(recipe.macrosPerServing.carbs),
    fat: round1(recipe.macrosPerServing.fat),
  };

  const fitsYou =
    prefs.dietTags.every((d) => recipe.dietTags.includes(d)) &&
    !prefs.allergenTags.some((a) => recipe.allergenTags.includes(a));

  const toggleSave = () => {
    toggleFav(recipe.id);
    showToast(isFav ? "Removed from favorites" : "Saved to favorites");
  };

  return (
    <div className="screen screen--no-pad">
      <div className="cd-hero" style={{ background: recipe.heroColor }}>
        <button
          type="button"
          className="cd-hero__back"
          onClick={() => pop()}
          aria-label="Back"
        >
          <ArrowLeft size={20} strokeWidth={2.25} />
        </button>
        <SaveButton
          className="cd-hero__save"
          saved={isFav}
          onClick={toggleSave}
        />
        {recipe.imageUrl && !heroErrored ? (
          <img
            src={recipe.imageUrl}
            alt={recipe.title}
            className="cd-hero__img"
            onError={() => setHeroErrored(true)}
          />
        ) : (
          <div className="cd-hero__placeholder" aria-hidden>{recipe.heroEmoji}</div>
        )}
      </div>

      <div style={{ padding: "var(--space-lg)", display: "flex", flexDirection: "column", gap: "var(--space-md)" }}>
          <h1 className="t-heading-lg" style={{ margin: 0 }}>{recipe.title}</h1>
          <p className="t-body-md muted" style={{ margin: 0 }}>{recipe.description}</p>

          <div style={{ display: "flex", gap: "var(--space-xs)", flexWrap: "wrap" }}>
            {fitsYou && <Chip variant="badge" tone="fits-you">Fits you</Chip>}
            {recipe.dietTags.map((d) => (
              <Chip key={d} variant="badge" tone="diet">{d}</Chip>
            ))}
            {prefs.allergenTags
              .filter((a) => recipe.allergenTags.includes(a))
              .map((a) => (
                <Chip key={a} variant="badge" tone="warning">Contains {a}</Chip>
              ))}
          </div>

          <div className="section-label">Nutrition · {recipe.prepMinutes} min</div>
          <NutritionStrip
            kcal={kcal}
            protein={macros.protein}
            carbs={macros.carbs}
            fat={macros.fat}
            perLabel="per serving"
          />

          <div className="section-label">Servings</div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <NumberStepper
              value={servings}
              unit={servings === 1 ? "serving" : "servings"}
              min={1}
              max={12}
              onChange={setServings}
              ariaLabel="Servings"
            />
          </div>

          <div className="section-label">Ingredients</div>
          <ul className="list-stack" style={{ gap: "var(--space-xs)" }}>
            {recipe.ingredients.map((ing, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--space-md)",
                  padding: "var(--space-sm) var(--space-md)",
                  background: "var(--color-bg-card)",
                  borderRadius: "var(--radius-md)",
                }}
              >
                <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", minWidth: 80 }}>
                  {formatQty(ing.qty * factor)} {ing.unit}
                </span>
                <span>{ing.name}</span>
              </li>
            ))}
          </ul>

          <div className="section-label">Steps</div>
          <ol className="list-stack" style={{ gap: "var(--space-sm)", paddingLeft: 0 }}>
            {recipe.steps.map((s, i) => (
              <li
                key={i}
                style={{
                  display: "flex",
                  gap: "var(--space-md)",
                  padding: "var(--space-md)",
                  background: "var(--color-bg-card)",
                  borderRadius: "var(--radius-md)",
                  listStyle: "none",
                }}
              >
                <span
                  style={{
                    flex: "0 0 auto",
                    width: 28,
                    height: 28,
                    borderRadius: "var(--radius-pill)",
                    background: "var(--color-brand-primary)",
                    color: "var(--color-text-on-brand)",
                    fontWeight: 700,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                  }}
                >
                  {i + 1}
                </span>
                <span className="grow">{s}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
function formatQty(n: number) {
  if (n < 1) return n.toFixed(2);
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(1);
}
