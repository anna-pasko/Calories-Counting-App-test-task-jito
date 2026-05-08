import { Chip, ListItem, SummaryCard, TopAppBar } from "../../design/components";
import { useApp } from "../store/useApp";

export function ProfileOverviewScreen() {
  const prefs = useApp((s) => s.prefs);
  const push = useApp((s) => s.push);
  const resetOnboarding = useApp((s) => s.resetOnboarding);
  const showConfirm = useApp((s) => s.showConfirm);
  const favFoods = useApp((s) => s.favoriteFoodIds.length);
  const favRecipes = useApp((s) => s.favoriteRecipeIds.length);

  return (
    <>
      <TopAppBar title="Profile" asTabRoot />
      <div className="screen">
        <SummaryCard
          greeting={prefs.name ? `Hi, ${prefs.name} 👋` : "Hi 👋"}
          goalKcal={prefs.calorieGoal}
          tags={
            <>
              {prefs.dietTags.map((d) => (
                <Chip key={d} variant="badge" tone="diet">{d}</Chip>
              ))}
              {prefs.allergenTags.map((a) => (
                <Chip key={a} variant="badge" tone="allergen">No {a}</Chip>
              ))}
              {prefs.dietTags.length === 0 && prefs.allergenTags.length === 0 && (
                <span className="muted t-body-sm">No preferences set yet.</span>
              )}
            </>
          }
        />

        <div className="list-stack" style={{ marginTop: "var(--space-lg)" }}>
          <ListItem
            icon="⚙"
            title="Edit preferences"
            sub="Diet, allergies, daily goal"
            onClick={() => push("profile", { key: "profile-edit" })}
          />
          <ListItem
            icon="♥"
            title="Favorites"
            sub={`${favFoods} foods · ${favRecipes} recipes`}
            onClick={() => push("profile", { key: "profile-favorites" })}
          />
          <ListItem
            icon="↻"
            title="Reset onboarding"
            sub="Clear preferences and start over"
            onClick={() =>
              showConfirm({
                title: "Reset everything?",
                message:
                  "This will clear your preferences, favorites, and recent searches, and walk you through onboarding again.",
                confirmLabel: "Reset",
                cancelLabel: "Cancel",
                destructive: true,
                onConfirm: resetOnboarding,
              })
            }
          />
        </div>
      </div>
    </>
  );
}
