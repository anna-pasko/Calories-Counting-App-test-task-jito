import { ChevronRight } from "lucide-react";
import { useApp, useMealTotals } from "../store/useApp";

interface MealBarProps {
  onClick: () => void;
  /** True when no tab bar follows; the bar then handles iOS safe-area itself. */
  atBottom?: boolean;
}

export function MealBar({ onClick, atBottom }: MealBarProps) {
  const items = useApp((s) => s.draftMeal);
  const totals = useMealTotals();
  if (items.length === 0) return null;

  const cls = atBottom ? "meal-bar meal-bar--at-bottom" : "meal-bar";
  return (
    <button type="button" className={cls} onClick={onClick}>
      <div className="meal-bar__left">
        <div className="meal-bar__count">
          {items.length} item{items.length === 1 ? "" : "s"}
        </div>
        <div className="meal-bar__kcal">{totals.kcal} kcal</div>
      </div>
      <div className="meal-bar__cta">
        View meal
        <ChevronRight size={18} strokeWidth={2.5} />
      </div>
    </button>
  );
}
