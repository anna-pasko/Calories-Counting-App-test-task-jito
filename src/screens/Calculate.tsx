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
import { dataSource } from "../data/source";
import type { Food } from "../data/types";

const FOODS_PAGE_SIZE = 20;

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
    push("calculate", { key: "calculate-detail", props: { foodId: food.id, food } });
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

        {!query && recents.length === 0 && (
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
              {results.map((food) => (
                <ResultRow
                  key={food.id}
                  thumb={
                    food.imageUrl ? (
                      <img
                        src={food.imageUrl}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      "🥫"
                    )
                  }
                  title={food.name}
                  meta={[food.brand, food.category].filter(Boolean).join(" · ")}
                  kcal={food.kcalPerBase}
                  kcalLabel="kcal / 100 g"
                  onClick={() => openFood(food)}
                />
              ))}
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
    </>
  );
}
