import * as React from "react";
import {
  Button,
  NumberStepper,
  NutritionStrip,
  UnitSelector,
} from "../../design/components";
import { BottomSheet } from "./BottomSheet";
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

  const { kcal, protein, carbs, fat, grams } = computeNutrition(food, qty, unit);

  return (
    <BottomSheet ariaLabel={`Portion for ${food.name}`} onCancel={onCancel}>
      <div className="c-sheet__header">
        <span className="c-sheet__thumb" aria-hidden>
          {food.imageUrl ? (
            <img src={food.imageUrl} alt="" loading="lazy" decoding="async" />
          ) : (
            "🥫"
          )}
        </span>
        <div>
          <h2 className="c-sheet__title">{food.name}</h2>
          {food.brand && <div className="c-sheet__subtitle">{food.brand}</div>}
        </div>
      </div>

      <NutritionStrip
        kcal={kcal}
        protein={protein}
        carbs={carbs}
        fat={fat}
        perLabel={`for ${grams.toFixed(0)} g`}
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
