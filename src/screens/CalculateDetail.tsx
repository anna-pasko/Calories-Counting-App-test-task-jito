import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import {
  NumberStepper,
  NutritionStrip,
  SaveButton,
  UnitSelector,
} from "../../design/components";
import { useApp } from "../store/useApp";
import { dataSource } from "../data/source";
import type { Food } from "../data/types";

const UNITS = ["g", "pieces", "cups", "tbsp", "serving"] as const;
type Unit = (typeof UNITS)[number];

/** rough conversion factors → grams; "serving" uses food.basePortionGrams */
const UNIT_TO_G: Record<Unit, number> = {
  g: 1,
  pieces: 80,   // generic placeholder
  cups: 240,
  tbsp: 15,
  serving: 100, // fallback; overridden by food.basePortionGrams
};

export function CalculateDetailScreen({ foodId }: { foodId?: string }) {
  const pop = useApp((s) => s.pop);
  const showToast = useApp((s) => s.showToast);
  const isFav = useApp((s) => (foodId ? s.favoriteFoodIds.includes(foodId) : false));
  const toggleFav = useApp((s) => s.toggleFavoriteFood);

  const [food, setFood] = useState<Food | null>(null);
  const [unit, setUnit] = useState<Unit>("g");
  const [qty, setQty] = useState(100);

  useEffect(() => {
    if (!foodId) return;
    let active = true;
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

  const grams =
    unit === "serving"
      ? qty * food.basePortionGrams
      : qty * UNIT_TO_G[unit];
  const factor = grams / food.basePortionGrams;
  const kcal = Math.round(food.kcalPerBase * factor);
  const macros = {
    protein: round1(food.macrosPerBase.protein * factor),
    carbs: round1(food.macrosPerBase.carbs * factor),
    fat: round1(food.macrosPerBase.fat * factor),
  };

  const toggleSave = () => {
    toggleFav(food.id);
    showToast(isFav ? "Removed from favorites" : "Saved to favorites");
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
        {food.imageUrl ? (
          <img src={food.imageUrl} alt={food.name} className="cd-hero__img" />
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
            options={UNITS}
            value={unit}
            onChange={(u: Unit) => {
              setUnit(u);
              setQty(u === "g" ? 100 : 1);
            }}
          />
        </div>
      </div>
    </div>
  );
}

function round1(n: number) {
  return Math.round(n * 10) / 10;
}
