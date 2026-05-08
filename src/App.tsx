import type { ReactNode } from "react";
import { BottomTabBar, ConfirmDialog, Toast } from "../design/components";
import { Calculator, Salad, User } from "lucide-react";
import { useApp, useCurrentScreen, useIsAtTabRoot } from "./store/useApp";
import type { TabKey } from "./store/useApp";
import { OnboardingScreen } from "./screens/Onboarding";
import { CalculateSearchScreen } from "./screens/Calculate";
import { CalculateDetailScreen } from "./screens/CalculateDetail";
import { RecipesSearchScreen } from "./screens/Recipes";
import { RecipeDetailScreen } from "./screens/RecipeDetail";
import { ProfileOverviewScreen } from "./screens/Profile";
import { ProfileEditScreen } from "./screens/ProfileEdit";
import { ProfileFavoritesScreen } from "./screens/ProfileFavorites";

const ICON_PROPS = { size: 22, strokeWidth: 2 } as const;
const TABS: { key: TabKey; label: string; icon: ReactNode }[] = [
  { key: "calculate", label: "Calculate", icon: <Calculator {...ICON_PROPS} /> },
  { key: "recipes", label: "Recipes", icon: <Salad {...ICON_PROPS} /> },
  { key: "profile", label: "Profile", icon: <User {...ICON_PROPS} /> },
];

export function App() {
  const onboarded = useApp((s) => s.onboarded);
  const activeTab = useApp((s) => s.activeTab);
  const setActiveTab = useApp((s) => s.setActiveTab);
  const screen = useCurrentScreen();
  const atRoot = useIsAtTabRoot();
  const toast = useApp((s) => s.toast);
  const confirm = useApp((s) => s.confirm);
  const dismissConfirm = useApp((s) => s.dismissConfirm);

  if (!onboarded) {
    return (
      <div className="app-frame">
        <OnboardingScreen />
      </div>
    );
  }

  return (
    <div className="app-frame">
      <a href="#main" className="skip-link">Skip to main content</a>
      <main id="main" className="app-main">
        <ScreenView screenKey={screen.key} props={screen.props} />
      </main>
      {atRoot && (
        <BottomTabBar items={TABS} active={activeTab} onChange={setActiveTab} />
      )}
      {toast && (
        <div className="toast-anchor">
          <Toast tone={toast.tone}>{toast.message}</Toast>
        </div>
      )}
      {confirm && (
        <ConfirmDialog
          title={confirm.title}
          message={confirm.message}
          confirmLabel={confirm.confirmLabel}
          cancelLabel={confirm.cancelLabel}
          destructive={confirm.destructive}
          onConfirm={() => {
            confirm.onConfirm();
            dismissConfirm();
          }}
          onCancel={dismissConfirm}
        />
      )}
    </div>
  );
}

function ScreenView({
  screenKey,
  props,
}: {
  screenKey: ReturnType<typeof useCurrentScreen>["key"];
  props?: Record<string, unknown>;
}) {
  switch (screenKey) {
    case "calculate-search":
      return <CalculateSearchScreen />;
    case "calculate-detail":
      return <CalculateDetailScreen foodId={props?.foodId as string} />;
    case "recipes-search":
      return <RecipesSearchScreen />;
    case "recipe-detail":
      return (
        <RecipeDetailScreen recipeId={props?.recipeId as string} fromTab={props?.fromTab as TabKey | undefined} />
      );
    case "profile-overview":
      return <ProfileOverviewScreen />;
    case "profile-edit":
      return <ProfileEditScreen />;
    case "profile-favorites":
      return <ProfileFavoritesScreen />;
  }
}
