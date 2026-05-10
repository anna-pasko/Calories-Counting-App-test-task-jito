import { useState } from "react";
import { Plus, X } from "lucide-react";
import {
  Button,
  EmptyState,
  NutritionStrip,
  ResultRow,
  TopAppBar,
} from "../../design/components";
import { useApp, useMealTotals } from "../store/useApp";
import { computeNutrition } from "../data/portion";
import { NameDishSheet } from "../components/NameDishSheet";
import { PortionPicker } from "../components/PortionPicker";
import { FoodThumb } from "../components/FoodThumb";
import type { MealItem } from "../data/types";

export function MealReviewScreen() {
  const pop = useApp((s) => s.pop);
  const resetTab = useApp((s) => s.resetTab);
  const items = useApp((s) => s.draftMeal);
  const totals = useMealTotals();
  const clearMeal = useApp((s) => s.clearMeal);
  const saveMealAsDish = useApp((s) => s.saveMealAsDish);
  const updateMealItem = useApp((s) => s.updateMealItem);
  const removeMealItem = useApp((s) => s.removeMealItem);
  const showToast = useApp((s) => s.showToast);
  const showConfirm = useApp((s) => s.showConfirm);
  const editingDishId = useApp((s) => s.editingDishId);
  const savedDishes = useApp((s) => s.savedDishes);
  const dishNameDraft = useApp((s) => s.dishNameDraft);
  const setDishNameDraft = useApp((s) => s.setDishNameDraft);

  const editingDish = editingDishId
    ? savedDishes.find((d) => d.id === editingDishId)
    : undefined;

  const [namingOpen, setNamingOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MealItem | null>(null);

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

  const onSavePress = () => {
    if (isEditingExisting) {
      // Inline name is the source of truth — skip the naming sheet.
      const finalName = (dishNameDraft ?? editingDish.name).trim() || "Untitled dish";
      saveMealAsDish(finalName);
      pop();
      showToast(`Updated ${finalName}`);
    } else {
      // New draft — collect a name via the sheet.
      setNamingOpen(true);
    }
  };

  const onNewSubmit = (name: string) => {
    saveMealAsDish(name);
    setNamingOpen(false);
    pop();
    showToast(`Saved ${name}`);
  };

  const onAddIngredient = () => {
    // Reset the calculate stack to its root so the user lands cleanly on
    // search with their loaded draft visible in the meal bar. They tap the
    // bar to come back here once they've added items.
    resetTab("calculate");
  };

  // In edit-existing mode, popping silently leaves the dish in "editing"
  // state with stale draft items — confusing on the next visit. Reuse the
  // discard confirm so the user explicitly chooses to drop their edits.
  const handleBack = () => {
    if (isEditingExisting) {
      onDiscard();
    } else {
      pop();
    }
  };

  return (
    <>
      <TopAppBar
        title={isEditingExisting ? "Edit dish" : "Your meal"}
        onBack={handleBack}
      />
      <div className={`screen${isEmpty ? "" : " screen--with-bottom-bar"}`}>
        {isEditingExisting && (
          <div className="rename-input">
            <input
              className="rename-input__field"
              type="text"
              value={dishNameDraft ?? editingDish.name}
              onChange={(e) => setDishNameDraft(e.target.value)}
              placeholder="Dish name"
              aria-label="Dish name"
              maxLength={60}
            />
            {(dishNameDraft ?? editingDish.name) && (
              <button
                type="button"
                className="rename-input__clear"
                aria-label="Clear dish name"
                onClick={() => setDishNameDraft("")}
              >
                <X size={14} strokeWidth={2.5} />
              </button>
            )}
          </div>
        )}

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
                    onClick={() => setEditingItem(it)}
                  />
                );
              })}
            </div>

            <button
              type="button"
              className="meal-review__add"
              onClick={onAddIngredient}
            >
              <Plus size={18} strokeWidth={2.5} />
              Add an ingredient
            </button>

            <div className="meal-review__actions">
              <Button variant="secondary" onClick={onDiscard}>
                Discard
              </Button>
              <Button variant="primary" onClick={onSavePress}>
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
          submitLabel="Save dish"
          onSubmit={onNewSubmit}
          onCancel={() => setNamingOpen(false)}
        />
      )}
    </>
  );
}
