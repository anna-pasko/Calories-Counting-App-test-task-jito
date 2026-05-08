import * as React from "react";

interface FoodThumbProps {
  imageUrl?: string;
  /** Shown when imageUrl is missing or the image fails to load. */
  fallback?: React.ReactNode;
}

/**
 * Food thumbnail with graceful fallback. Open Food Facts sometimes returns
 * an image URL that 404s (especially fresh-produce entries with stale
 * revisions), so we listen for `onError` and swap to the emoji fallback
 * instead of leaving a broken-image icon.
 */
export function FoodThumb({ imageUrl, fallback = "🥫" }: FoodThumbProps) {
  const [errored, setErrored] = React.useState(false);

  // Reset error state when the URL changes (e.g., scrolling a virtualized list
  // re-uses component instances).
  React.useEffect(() => {
    setErrored(false);
  }, [imageUrl]);

  if (!imageUrl || errored) {
    return <>{fallback}</>;
  }

  return (
    <img
      src={imageUrl}
      alt=""
      loading="lazy"
      decoding="async"
      style={{ width: "100%", height: "100%", objectFit: "cover" }}
      onError={() => setErrored(true)}
    />
  );
}
