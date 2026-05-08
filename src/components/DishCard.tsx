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
  const itemCount = dish.items.length;

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
      <div className="dish-card__row">
        <h3 className="dish-card__title">{dish.name}</h3>
        <div className="dish-card__kcal">
          {totals.kcal}
          <small>kcal</small>
        </div>
      </div>
      {ingredients && (
        <div className="dish-card__ingredients">{ingredients}</div>
      )}
      <div className="dish-card__meta">
        {itemCount} item{itemCount === 1 ? "" : "s"}
      </div>
    </div>
  );
}
