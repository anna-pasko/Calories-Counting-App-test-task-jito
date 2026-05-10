import {
  Button,
  EmptyState,
  NutritionStrip,
  ResultRow,
  TopAppBar,
} from "../../design/components";
import { useApp } from "../store/useApp";
import { computeNutrition, sumMealNutrition } from "../data/portion";
import { FoodThumb } from "../components/FoodThumb";

export function SavedDishDetailScreen({ dishId }: { dishId?: string }) {
  const pop = useApp((s) => s.pop);
  const push = useApp((s) => s.push);
  const loadDishIntoMeal = useApp((s) => s.loadDishIntoMeal);
  const deleteSavedDish = useApp((s) => s.deleteSavedDish);
  const showConfirm = useApp((s) => s.showConfirm);
  const showToast = useApp((s) => s.showToast);
  const draftCount = useApp((s) => s.draftMeal.length);
  const dish = useApp((s) =>
    dishId ? s.savedDishes.find((d) => d.id === dishId) : undefined
  );

  if (!dish) {
    return (
      <>
        <TopAppBar title="Dish" onBack={() => pop()} />
        <div className="screen">
          <EmptyState
            art="🥣"
            title="Dish not found"
            desc="It may have been deleted."
          />
        </div>
      </>
    );
  }

  const totals = sumMealNutrition(dish.items);

  const goEdit = () => {
    const proceed = () => {
      loadDishIntoMeal(dish.id);
      push("calculate", { key: "meal-review" });
    };
    if (draftCount > 0) {
      showConfirm({
        title: "Replace current meal?",
        message: `You have ${draftCount} item${draftCount === 1 ? "" : "s"} in your current meal. They'll be replaced by this dish's items.`,
        confirmLabel: "Replace",
        destructive: true,
        onConfirm: proceed,
      });
    } else {
      proceed();
    }
  };

  const onDelete = () => {
    showConfirm({
      title: "Delete dish?",
      message: `"${dish.name}" will be removed permanently.`,
      confirmLabel: "Delete",
      destructive: true,
      onConfirm: () => {
        deleteSavedDish(dish.id);
        showToast(`Deleted ${dish.name}`);
        pop();
      },
    });
  };

  return (
    <>
      <TopAppBar title={dish.name} onBack={() => pop()} />
      <div className="screen screen--with-bottom-bar">
        <NutritionStrip
          kcal={totals.kcal}
          protein={totals.protein}
          carbs={totals.carbs}
          fat={totals.fat}
          perLabel={`${dish.items.length} item${dish.items.length === 1 ? "" : "s"}`}
        />

        <div className="section-label">Ingredients</div>
        <div className="list-stack">
          {dish.items.map((it) => {
            const n = computeNutrition(it.food, it.qty, it.unit);
            const meta =
              it.unit === "g"
                ? `${it.qty} g`
                : `${it.qty} ${it.unit} · ${n.grams.toFixed(0)} g`;
            return (
              <ResultRow
                key={it.id}
                thumb={<FoodThumb imageUrl={it.food.imageUrl} />}
                title={it.food.name}
                meta={meta}
                kcal={n.kcal}
                kcalLabel="kcal"
              />
            );
          })}
        </div>

        <div className="c-bottom-actions">
          <Button variant="secondary" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="primary" onClick={goEdit}>
            Edit
          </Button>
        </div>
      </div>
    </>
  );
}
