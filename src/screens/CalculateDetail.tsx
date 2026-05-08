import { useEffect, useState } from "react";
import { ArrowLeft, Plus } from "lucide-react";
import {
  Button,
  NumberStepper,
  NutritionStrip,
  SaveButton,
  UnitSelector,
} from "../../design/components";
import { useApp } from "../store/useApp";
import { dataSource } from "../data/source";
import { computeNutrition } from "../data/portion";
import { MEAL_UNITS, type Food, type MealUnit } from "../data/types";

export function CalculateDetailScreen({ foodId }: { foodId?: string }) {
  const pop = useApp((s) => s.pop);
  const showToast = useApp((s) => s.showToast);
  const isFav = useApp((s) => (foodId ? s.favoriteFoodIds.includes(foodId) : false));
  const toggleFav = useApp((s) => s.toggleFavoriteFood);
  const addToMeal = useApp((s) => s.addToMeal);

  const [food, setFood] = useState<Food | null>(null);
  const [unit, setUnit] = useState<MealUnit>("g");
  const [qty, setQty] = useState(100);
  const [heroErrored, setHeroErrored] = useState(false);

  useEffect(() => {
    if (!foodId) return;
    let active = true;
    setHeroErrored(false);
    dataSource.getFood(foodId).then((f) => {
      if (active) setFood(f);
    });
    return () => {
      active = false;
    };
  }, [foodId]);

  if (!food) {
    return (
      <div className="screen muted center" style={{ paddingTop: "var(--space-3xl)" }}>
        Fetching nutrition…
      </div>
    );
  }

  const { grams, kcal, protein, carbs, fat } = computeNutrition(food, qty, unit);
  const macros = { protein, carbs, fat };

  const toggleSave = () => {
    toggleFav(food.id);
    showToast(isFav ? "Removed from favorites" : "Saved to favorites");
  };

  const handleAddToMeal = () => {
    addToMeal(food, qty, unit);
    showToast(`Added ${food.name} to meal`);
    pop();
  };

  return (
    <div className="screen screen--no-pad">
      <div className="cd-hero">
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
        {food.imageUrl && !heroErrored ? (
          <img
            src={food.imageUrl}
            alt={food.name}
            className="cd-hero__img"
            onError={() => setHeroErrored(true)}
          />
        ) : (
          <div className="cd-hero__placeholder" aria-hidden>🥫</div>
        )}
      </div>

      <div className="cd-body">
        <div className="cd-title-block">
          <h1 className="cd-title">{food.name}</h1>
          {food.brand && <div className="cd-vendor">{food.brand}</div>}
        </div>

        <div className="section-label">Nutrition · {grams.toFixed(0)} g</div>
        <NutritionStrip
          kcal={kcal}
          protein={macros.protein}
          carbs={macros.carbs}
          fat={macros.fat}
          perLabel={`for ${grams.toFixed(0)} g`}
        />

        <div className="section-label">Portion</div>
        <div className="cd-portion-row">
          <NumberStepper
            value={qty}
            unit={unit}
            step={unit === "g" ? 10 : 1}
            min={unit === "g" ? 10 : 1}
            max={unit === "g" ? 2000 : 50}
            onChange={setQty}
            ariaLabel="Portion size"
          />
          <UnitSelector
            options={MEAL_UNITS}
            value={unit}
            onChange={(u: MealUnit) => {
              setUnit(u);
              setQty(u === "g" ? 100 : 1);
            }}
          />
        </div>

        <Button
          variant="primary"
          size="lg"
          className="cd-add-to-meal"
          onClick={handleAddToMeal}
        >
          <Plus size={20} strokeWidth={2.75} />
          Add to meal
        </Button>
      </div>
    </div>
  );
}
