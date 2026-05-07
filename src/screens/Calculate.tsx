import { useEffect, useRef, useState } from "react";
import { History, Search, SearchX } from "lucide-react";
import {
  EmptyState,
  ResultRow,
  SearchInput,
  TopAppBar,
} from "../../design/components";
import { useApp } from "../store/useApp";
import { dataSource } from "../data/source";
import type { Food } from "../data/types";

export function CalculateSearchScreen() {
  const query = useApp((s) => s.calcQuery);
  const results = useApp((s) => s.calcResults);
  const setQuery = useApp((s) => s.setCalcQuery);
  const setResults = useApp((s) => s.setCalcResults);
  const [loading, setLoading] = useState(false);
  const recents = useApp((s) => s.recentSearches);
  const addRecent = useApp((s) => s.addRecentSearch);
  const push = useApp((s) => s.push);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    abortRef.current?.abort();
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    const t = setTimeout(async () => {
      const r = await dataSource.searchFoods(query, ctrl.signal);
      if (!ctrl.signal.aborted) {
        setResults(r);
        setLoading(false);
      }
    }, 350);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query, setResults]);

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

        {query && !loading && results.length === 0 && (
          <EmptyState
            art={<SearchX size={36} strokeWidth={2} />}
            title="No matches"
            desc={`Nothing found for "${query}". Try a simpler word or different brand.`}
          />
        )}

        {query && !loading && results.length > 0 && (
          <div className="list-stack">
            {results.map((food) => (
              <ResultRow
                key={food.id}
                thumb={
                  food.imageUrl ? (
                    <img
                      src={food.imageUrl}
                      alt=""
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
        )}
      </div>
    </>
  );
}
