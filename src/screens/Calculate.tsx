import { useEffect, useRef, useState } from "react";
import { History, RotateCw, Search, SearchX, WifiOff } from "lucide-react";
import {
  Button,
  EmptyState,
  LoadMoreButton,
  ResultRow,
  SearchInput,
  TopAppBar,
} from "../../design/components";
import { useApp } from "../store/useApp";
import { dataSource, FOODS_PAGE_SIZE } from "../data/source";
import { PortionPicker } from "../components/PortionPicker";
import { DishCard } from "../components/DishCard";
import { FoodThumb } from "../components/FoodThumb";
import type { Food, MealUnit } from "../data/types";

interface PickerState {
  food: Food;
  /** Set when this picker is editing an existing meal item rather than adding a new one. */
  editing?: { itemId: string; qty: number; unit: MealUnit };
}

export function CalculateSearchScreen() {
  const query = useApp((s) => s.calcQuery);
  const results = useApp((s) => s.calcResults);
  const setQuery = useApp((s) => s.setCalcQuery);
  const setResults = useApp((s) => s.setCalcResults);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryNonce, setRetryNonce] = useState(0);
  const recents = useApp((s) => s.recentSearches);
  const addRecent = useApp((s) => s.addRecentSearch);
  const push = useApp((s) => s.push);
  const addToMeal = useApp((s) => s.addToMeal);
  const updateMealItem = useApp((s) => s.updateMealItem);
  const removeMealItem = useApp((s) => s.removeMealItem);
  const showToast = useApp((s) => s.showToast);
  const savedDishes = useApp((s) => s.savedDishes);
  const draftMeal = useApp((s) => s.draftMeal);
  const [picker, setPicker] = useState<PickerState | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    if (!query.trim()) {
      setResults([]);
      setHasMore(false);
      setHasError(false);
      setPage(1);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setPage(1);
    const t = setTimeout(async () => {
      const r = await dataSource.searchFoods(query, ctrl.signal, 1);
      if (!ctrl.signal.aborted) {
        setResults(r.items);
        setHasError(r.hasError);
        setHasMore(r.items.length >= FOODS_PAGE_SIZE);
        setLoading(false);
      }
    }, 350);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query, retryNonce, setResults]);

  const loadMore = async () => {
    if (loadingMore || !query.trim()) return;
    const next = page + 1;
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoadingMore(true);
    try {
      const r = await dataSource.searchFoods(query, ctrl.signal, next);
      if (ctrl.signal.aborted) return;
      const seen = new Set(results.map((f) => f.id));
      const merged = [...results, ...r.items.filter((f) => !seen.has(f.id))];
      setResults(merged);
      setPage(next);
      setHasError(r.hasError);
      // OFF returns full pages until the last; <pageSize means we're done.
      setHasMore(!r.hasError && r.items.length >= FOODS_PAGE_SIZE);
    } finally {
      setLoadingMore(false);
    }
  };

  const retry = () => setRetryNonce((n) => n + 1);

  const openFood = (food: Food) => {
    addRecent(query || food.name);
    const existing = draftMeal.find((it) => it.food.id === food.id);
    setPicker({
      food,
      editing: existing
        ? { itemId: existing.id, qty: existing.qty, unit: existing.unit }
        : undefined,
    });
  };

  const reuseRecent = (q: string) => setQuery(q);

  return (
    <>
      <TopAppBar title="Calculate" asTabRoot />
      <div className="screen">
        <SearchInput
          value={query}
          onChange={setQuery}
          onClear={() => setQuery("")}
          placeholder="Search foods or products"
        />

        {!query && recents.length > 0 && (
          <>
            <div className="section-label">Recent searches</div>
            <div className="list-stack">
              {recents.map((q) => (
                <button
                  key={q}
                  type="button"
                  className="c-result-row"
                  onClick={() => reuseRecent(q)}
                >
                  <span className="c-result-row__thumb" aria-hidden>
                    <History size={20} strokeWidth={2} />
                  </span>
                  <span className="c-result-row__main">
                    <span className="c-result-row__title">{q}</span>
                    <span className="c-result-row__meta">Tap to search again</span>
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {!query && savedDishes.length > 0 && (
          <>
            <div className="section-label">My dishes</div>
            <div className="list-stack">
              {savedDishes.map((d) => (
                <DishCard
                  key={d.id}
                  dish={d}
                  onClick={() =>
                    push("calculate", {
                      key: "saved-dish-detail",
                      props: { dishId: d.id },
                    })
                  }
                />
              ))}
            </div>
          </>
        )}

        {!query && recents.length === 0 && savedDishes.length === 0 && (
          <EmptyState
            art={<Search size={36} strokeWidth={2} />}
            title="What did you eat?"
            desc="Search any food or product to see its calories and macros."
          />
        )}

        {query && loading && (
          <div className="muted center" style={{ paddingTop: "var(--space-3xl)" }}>
            Searching…
          </div>
        )}

        {query && !loading && results.length === 0 && hasError && (
          <EmptyState
            art={<WifiOff size={36} strokeWidth={2} />}
            title="Couldn't load results"
            desc="Check your connection and try again."
            action={
              <Button variant="primary" onClick={retry}>
                <RotateCw size={18} strokeWidth={2.5} />
                Retry
              </Button>
            }
          />
        )}

        {query && !loading && results.length === 0 && !hasError && (
          <EmptyState
            art={<SearchX size={36} strokeWidth={2} />}
            title="No matches"
            desc={`Nothing found for "${query}". Try a simpler word or different brand.`}
          />
        )}

        {query && !loading && results.length > 0 && (
          <>
            <div className="list-stack">
              {results.map((food) => {
                const inMeal = draftMeal.some(
                  (it) => it.food.id === food.id
                );
                return (
                  <ResultRow
                    key={food.id}
                    thumb={<FoodThumb imageUrl={food.imageUrl} />}
                    title={food.name}
                    meta={[food.brand, food.category].filter(Boolean).join(" · ")}
                    kcal={food.kcalPerBase}
                    kcalLabel="kcal / 100 g"
                    added={inMeal}
                    onClick={() => openFood(food)}
                    onAdd={() => openFood(food)}
                  />
                );
              })}
            </div>
            {hasError && (
              <div
                className="muted center t-body-sm"
                style={{ padding: "var(--space-md) 0" }}
                role="status"
              >
                Showing offline matches only — couldn't reach Open Food Facts.{" "}
                <button
                  type="button"
                  className="c-button c-button--link"
                  style={{ display: "inline-flex" }}
                  onClick={retry}
                >
                  Retry
                </button>
              </div>
            )}
            {hasMore && (
              <LoadMoreButton
                onClick={loadMore}
                loading={loadingMore}
                label="Load more results"
              />
            )}
          </>
        )}
      </div>
      {picker && (
        <PortionPicker
          food={picker.food}
          initialQty={picker.editing?.qty}
          initialUnit={picker.editing?.unit}
          confirmLabel={picker.editing ? "Save changes" : "Add to meal"}
          onCancel={() => setPicker(null)}
          onConfirm={(qty, unit) => {
            if (picker.editing) {
              updateMealItem(picker.editing.itemId, qty, unit);
              showToast(`Updated ${picker.food.name}`);
            } else {
              addToMeal(picker.food, qty, unit);
              showToast(`Added ${picker.food.name} to meal`);
            }
            setPicker(null);
          }}
          onRemove={
            picker.editing
              ? () => {
                  removeMealItem(picker.editing!.itemId);
                  showToast(`Removed ${picker.food.name}`);
                  setPicker(null);
                }
              : undefined
          }
        />
      )}
    </>
  );
}
