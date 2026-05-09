import * as React from "react";
import { sumMealNutrition } from "../data/portion";
import type { SavedDish } from "../data/types";

interface DishCardProps {
  dish: SavedDish;
  onClick?: () => void;
}

export function DishCard({ dish, onClick }: DishCardProps) {
  const totals = sumMealNutrition(dish.items);
  const ingredients = dish.items.map((it) => it.food.name).join(" · ");
  const count = dish.items.length;

  // When the joined ingredient names overflow the 2-line clamp, fall back to
  // a count ("8 ingredients") instead of showing a half-cut name.
  const ref = React.useRef<HTMLDivElement>(null);
  const [overflowed, setOverflowed] = React.useState(false);
  // Reset the decision whenever the ingredient list changes — a different
  // dish may fit (or not) under the same clamp.
  React.useLayoutEffect(() => {
    setOverflowed(false);
  }, [ingredients]);
  React.useLayoutEffect(() => {
    if (overflowed) return;
    const el = ref.current;
    if (el && el.scrollHeight > el.clientHeight + 1) {
      setOverflowed(true);
    }
  });

  const subtitle = overflowed
    ? `${count} ingredient${count === 1 ? "" : "s"}`
    : ingredients;

  const handleKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className="dish-card"
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKey}
      aria-label={`Open dish: ${dish.name}`}
    >
      <div className="dish-card__main">
        <h3 className="dish-card__title">{dish.name}</h3>
        {ingredients && (
          <div className="dish-card__ingredients" ref={ref}>{subtitle}</div>
        )}
      </div>
      <div className="dish-card__kcal">
        {totals.kcal}
        <small>kcal</small>
      </div>
    </div>
  );
}
