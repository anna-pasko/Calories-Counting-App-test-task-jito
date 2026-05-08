import { useState } from "react";
import {
  Button,
  EmptyState,
  NutritionStrip,
  ResultRow,
  TopAppBar,
} from "../../design/components";
import { useApp, useMealTotals } from "../store/useApp";
import { computeNutrition } from "../data/portion";
import { PortionPicker } from "../components/PortionPicker";
import { NameDishSheet } from "../components/NameDishSheet";
import type { MealItem } from "../data/types";

export function MealReviewScreen() {
  const pop = useApp((s) => s.pop);
  const items = useApp((s) => s.draftMeal);
  const totals = useMealTotals();
  const updateMealItem = useApp((s) => s.updateMealItem);
  const removeMealItem = useApp((s) => s.removeMealItem);
  const clearMeal = useApp((s) => s.clearMeal);
  const saveMealAsDish = useApp((s) => s.saveMealAsDish);
  const showToast = useApp((s) => s.showToast);
  const showConfirm = useApp((s) => s.showConfirm);
  const editingDishId = useApp((s) => s.editingDishId);
  const savedDishes = useApp((s) => s.savedDishes);

  const editingDish = editingDishId
    ? savedDishes.find((d) => d.id === editingDishId)
    : undefined;

  const [editingItem, setEditingItem] = useState<MealItem | null>(null);
  const [namingOpen, setNamingOpen] = useState(false);

  const isEditingExisting = !!editingDish;
  const isEmpty = items.length === 0;

  const onDiscard = () => {
    showConfirm({
      title: isEditingExisting ? "Discard changes?" : "Discard meal?",
      message: isEditingExisting
        ? "Your edits to this dish will be lost. The saved dish itself stays untouched."
        : "All items in this meal will be cleared.",
      confirmLabel: "Discard",
      destructive: true,
      onConfirm: () => {
        clearMeal();
        pop();
      },
    });
  };

  const onSaveSubmit = (name: string) => {
    saveMealAsDish(name);
    setNamingOpen(false);
    pop();
    showToast(isEditingExisting ? `Updated ${name}` : `Saved ${name}`);
  };

  return (
    <>
      <TopAppBar
        title={isEditingExisting ? editingDish.name : "Your meal"}
        onBack={() => pop()}
      />
      <div className="screen">
        {isEmpty ? (
          <EmptyState
            art="🥣"
            title="No items yet"
            desc="Search and add foods to start building a meal."
          />
        ) : (
          <>
            <NutritionStrip
              kcal={totals.kcal}
              protein={totals.protein}
              carbs={totals.carbs}
              fat={totals.fat}
              perLabel={`${items.length} item${items.length === 1 ? "" : "s"}`}
            />

            <div className="section-label">Ingredients</div>
            <div className="list-stack">
              {items.map((it) => {
                const n = computeNutrition(it.food, it.qty, it.unit);
                return (
                  <ResultRow
                    key={it.id}
                    thumb={
                      it.food.imageUrl ? (
                        <img
                          src={it.food.imageUrl}
                          alt=""
                          loading="lazy"
                          decoding="async"
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        "🥫"
                      )
                    }
                    title={it.food.name}
                    meta={`${it.qty} ${it.unit} · ${n.grams.toFixed(0)} g`}
                    kcal={n.kcal}
                    kcalLabel="kcal"
                    onClick={() => setEditingItem(it)}
                  />
                );
              })}
            </div>

            <div className="meal-review__actions">
              <Button variant="secondary" onClick={onDiscard}>
                Discard
              </Button>
              <Button variant="primary" onClick={() => setNamingOpen(true)}>
                {isEditingExisting ? "Update dish" : "Save dish"}
              </Button>
            </div>
          </>
        )}
      </div>

      {editingItem && (
        <PortionPicker
          food={editingItem.food}
          initialQty={editingItem.qty}
          initialUnit={editingItem.unit}
          confirmLabel="Save changes"
          onConfirm={(qty, unit) => {
            updateMealItem(editingItem.id, qty, unit);
            setEditingItem(null);
          }}
          onCancel={() => setEditingItem(null)}
          onRemove={() => {
            removeMealItem(editingItem.id);
            setEditingItem(null);
          }}
        />
      )}

      {namingOpen && (
        <NameDishSheet
          defaultValue={editingDish?.name}
          submitLabel={isEditingExisting ? "Update dish" : "Save dish"}
          onSubmit={onSaveSubmit}
          onCancel={() => setNamingOpen(false)}
        />
      )}
    </>
  );
}
