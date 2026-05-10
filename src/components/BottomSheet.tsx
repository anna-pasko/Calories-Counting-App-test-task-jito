import * as React from "react";

interface BottomSheetProps {
  ariaLabel?: string;
  onCancel: () => void;
  children: React.ReactNode;
}

/** Shared shell for bottom sheets — handles backdrop, Esc key, body scroll lock,
 *  and the slide-up animation (driven by `c-sheet*` styles in components.css). */
export function BottomSheet({ ariaLabel, onCancel, children }: BottomSheetProps) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  React.useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <div className="c-sheet__backdrop" onClick={onCancel}>
      <div
        className="c-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="c-sheet__handle" aria-hidden />
        {children}
      </div>
    </div>
  );
}
