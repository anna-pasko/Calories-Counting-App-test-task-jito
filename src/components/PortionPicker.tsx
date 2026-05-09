import * as React from "react";
import {
  Button,
  NumberStepper,
  NutritionStrip,
  SaveButton,
  UnitSelector,
} from "../../design/components";
import { BottomSheet } from "./BottomSheet";
import { FoodThumb } from "./FoodThumb";
import { useApp } from "../store/useApp";
import { computeNutrition } from "../data/portion";
import { MEAL_UNITS, type Food, type MealUnit } from "../data/types";

export interface PortionPickerProps {
  food: Food;
  initialQty?: number;
  initialUnit?: MealUnit;
  confirmLabel?: string;
  onConfirm: (qty: number, unit: MealUnit) => void;
  onCancel: () => void;
  /** When provided, renders a destructive "Remove from meal" action below the primary buttons. */
  onRemove?: () => void;
}

export function PortionPicker({
  food,
  initialQty,
  initialUnit = "g",
  confirmLabel = "Add to meal",
  onConfirm,
  onCancel,
  onRemove,
}: PortionPickerProps) {
  const [unit, setUnit] = React.useState<MealUnit>(initialUnit);
  const [qty, setQty] = React.useState(
    initialQty ?? (initialUnit === "g" ? 100 : 1)
  );
  const isFav = useApp((s) => s.favoriteFoodIds.includes(food.id));
  const toggleFavoriteFood = useApp((s) => s.toggleFavoriteFood);
  const showToast = useApp((s) => s.showToast);

  const { kcal, protein, carbs, fat } = computeNutrition(food, qty, unit);

  const onToggleSave = () => {
    toggleFavoriteFood(food.id);
    showToast(isFav ? "Removed from favorites" : "Saved to favorites");
  };

  const description = [food.brand, food.category].filter(Boolean).join(" · ");

  return (
    <BottomSheet ariaLabel={`Portion for ${food.name}`} onCancel={onCancel}>
      <div className="c-sheet__header">
        <span className="c-sheet__thumb" aria-hidden>
          <FoodThumb imageUrl={food.imageUrl} />
        </span>
        <div className="c-sheet__title-block">
          <h2 className="c-sheet__title">{food.name}</h2>
          {description && (
            <div className="c-sheet__subtitle">{description}</div>
          )}
        </div>
        <SaveButton
          className="c-sheet__save"
          saved={isFav}
          onClick={onToggleSave}
        />
      </div>

      <NutritionStrip
        kcal={kcal}
        protein={protein}
        carbs={carbs}
        fat={fat}
      />

      <div className="c-sheet__row">
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

      <div className="c-sheet__actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => onConfirm(qty, unit)}>
          {confirmLabel}
        </Button>
      </div>

      {onRemove && (
        <button
          type="button"
          className="c-sheet__destructive"
          onClick={onRemove}
        >
          Remove from meal
        </button>
      )}
    </BottomSheet>
  );
}
