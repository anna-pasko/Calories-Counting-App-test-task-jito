/**
 * Calories Counting App — React + TypeScript reference components (v0)
 *
 * Each component is a thin wrapper over the CSS classes in components.css.
 * Drop into any React project: import the component, ensure tokens.css and
 * components.css are loaded once at the app root.
 *
 * The CSS is the load-bearing layer. If you migrate to Vue/Svelte/RN, port
 * the JSX (it's small) — the styling is portable.
 */

import * as React from "react";
import {
  Search,
  X,
  Heart,
  ArrowLeft,
  ChevronRight,
  Minus,
  Plus,
  Check,
  AlertTriangle,
  Calculator,
  Salad,
  User,
  RotateCw,
} from "lucide-react";

const cx = (...xs: Array<string | false | null | undefined>) =>
  xs.filter(Boolean).join(" ");

export const Icons = {
  Search,
  X,
  Heart,
  ArrowLeft,
  ChevronRight,
  Minus,
  Plus,
  Check,
  AlertTriangle,
  Calculator,
  Salad,
  User,
};

/* ========================================================================
   1. Button
   ======================================================================== */
type ButtonVariant = "primary" | "secondary" | "link" | "icon";
type ButtonSize = "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cx(
        "c-button",
        `c-button--${variant}`,
        size === "lg" && "c-button--lg",
        className
      )}
      {...rest}
    />
  );
}

/* ========================================================================
   2. SearchInput
   ======================================================================== */
export interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = "Search foods or recipes",
  ...rest
}: SearchInputProps) {
  return (
    <label className="c-search-input">
      <span className="c-search-input__icon" aria-hidden>
        <Search size={20} strokeWidth={2.25} />
      </span>
      <input
        className="c-search-input__field"
        type="search"
        enterKeyHint="search"
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        {...rest}
      />
      {value && onClear && (
        <button
          type="button"
          className="c-search-input__clear"
          aria-label="Clear search"
          onClick={onClear}
        >
          <X size={16} strokeWidth={2.5} />
        </button>
      )}
    </label>
  );
}

/* ========================================================================
   3. NumberStepper
   Used for portion size, servings, calorie goal.
   ======================================================================== */
export interface NumberStepperProps {
  value: number;
  unit?: string;
  step?: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  ariaLabel?: string;
}

export function NumberStepper({
  value,
  unit,
  step = 1,
  min = 0,
  max = Number.POSITIVE_INFINITY,
  onChange,
  ariaLabel,
}: NumberStepperProps) {
  const dec = () => onChange(Math.max(min, value - step));
  const inc = () => onChange(Math.min(max, value + step));
  return (
    <div className="c-stepper" role="group" aria-label={ariaLabel}>
      <button
        type="button"
        className="c-stepper__btn"
        onClick={dec}
        disabled={value <= min}
        aria-label="Decrease"
      >
        <Minus size={18} strokeWidth={2.5} />
      </button>
      <span className="c-stepper__value">{value}</span>
      {unit && <span className="c-stepper__unit">{unit}</span>}
      <button
        type="button"
        className="c-stepper__btn"
        onClick={inc}
        disabled={value >= max}
        aria-label="Increase"
      >
        <Plus size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ========================================================================
   4. UnitSelector
   ======================================================================== */
export interface UnitSelectorProps<T extends string = string> {
  options: ReadonlyArray<T>;
  value: T;
  onChange: (value: T) => void;
  ariaLabel?: string;
}

export function UnitSelector<T extends string = string>({
  options,
  value,
  onChange,
  ariaLabel,
}: UnitSelectorProps<T>) {
  return (
    <div className="c-unit-selector" role="tablist" aria-label={ariaLabel}>
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          role="tab"
          aria-selected={opt === value}
          className={cx(
            "c-unit-selector__btn",
            opt === value && "c-unit-selector__btn--active"
          )}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

/* ========================================================================
   5. Chip
   Variants: option | filter | badge
   Badge tones (for badge variant): fits-you | diet | allergen | warning
   ======================================================================== */
type ChipVariant = "option" | "filter" | "badge";
type BadgeTone = "fits-you" | "diet" | "allergen" | "warning";

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ChipVariant;
  selected?: boolean;
  tone?: BadgeTone; // applies only when variant === "badge"
}

export function Chip({
  variant = "option",
  selected,
  tone,
  className,
  children,
  ...rest
}: ChipProps) {
  const isBadge = variant === "badge";
  const Tag = (isBadge ? "span" : "button") as "span" | "button";
  return (
    <Tag
      className={cx(
        "c-chip",
        variant === "filter" && "c-chip--filter",
        isBadge && "c-chip--badge",
        selected && !isBadge && "c-chip--selected",
        isBadge && tone && `is-${tone}`,
        className
      )}
      type={!isBadge ? "button" : undefined}
      {...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </Tag>
  );
}

/* ========================================================================
   6. SegmentedControl
   ======================================================================== */
export interface SegmentedControlProps<T extends string = string> {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div className="c-segmented" role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          role="tab"
          aria-selected={opt.value === value}
          className={cx(
            "c-segmented__btn",
            opt.value === value && "c-segmented__btn--active"
          )}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ========================================================================
   7. StepDots
   ======================================================================== */
export interface StepDotsProps {
  count: number;
  current: number; // 0-indexed
}

export function StepDots({ count, current }: StepDotsProps) {
  return (
    <div
      className="c-step-dots"
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={count}
      aria-valuenow={current + 1}
    >
      {Array.from({ length: count }).map((_, i) => (
        <span
          key={i}
          className={cx(
            "c-step-dots__dot",
            i === current && "c-step-dots__dot--active"
          )}
        />
      ))}
    </div>
  );
}

/* ========================================================================
   8. SaveButton (heart toggle)
   ======================================================================== */
export interface SaveButtonProps
  extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    "aria-pressed" | "children"
  > {
  saved: boolean;
}

export function SaveButton({ saved, className, ...rest }: SaveButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? "Remove from favorites" : "Save to favorites"}
      className={cx("c-save", saved && "c-save--saved", className)}
      {...rest}
    >
      <Heart size={20} strokeWidth={2} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}

/* ========================================================================
   9. Toast
   ======================================================================== */
type ToastTone = "success" | "warning" | "danger";

export interface ToastProps {
  tone?: ToastTone;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Toast({ tone = "success", icon, children }: ToastProps) {
  const defaultIcon =
    tone === "success" ? <Check size={14} strokeWidth={3} /> :
    tone === "warning" ? <AlertTriangle size={14} strokeWidth={2.5} /> :
    <X size={14} strokeWidth={3} />;
  return (
    <div className={cx("c-toast", tone !== "success" && `c-toast--${tone}`)} role="status">
      <span className="c-toast__icon" aria-hidden>{icon ?? defaultIcon}</span>
      <span>{children}</span>
    </div>
  );
}

/* ========================================================================
   10. ResultRow (food row)
   ======================================================================== */
export interface ResultRowProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "title"> {
  thumb?: React.ReactNode;
  title: string;
  meta?: string;
  kcal: number;
  kcalLabel?: string;
}

export function ResultRow({
  thumb,
  title,
  meta,
  kcal,
  kcalLabel = "kcal",
  className,
  ...rest
}: ResultRowProps) {
  return (
    <button className={cx("c-result-row", className)} type="button" {...rest}>
      <span className="c-result-row__thumb" aria-hidden>{thumb}</span>
      <span className="c-result-row__main">
        <span className="c-result-row__title">{title}</span>
        {meta && <span className="c-result-row__meta">{meta}</span>}
      </span>
      <span className="c-result-row__kcal">
        {kcal}
        <small>{kcalLabel}</small>
      </span>
    </button>
  );
}

/* ========================================================================
   11. RecipeCard
   ======================================================================== */
export interface RecipeCardProps {
  title: string;
  imageUrl?: string;
  imageBg?: string; // fallback color when no imageUrl
  kcal: number;
  prepMinutes: number;
  badges?: React.ReactNode;
  saved?: boolean;
  onToggleSave?: () => void;
  onClick?: () => void;
}

export function RecipeCard({
  title,
  imageUrl,
  imageBg = "var(--color-bg-subtle)",
  kcal,
  prepMinutes,
  badges,
  saved = false,
  onToggleSave,
  onClick,
}: RecipeCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (!onClick) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };
  return (
    <article
      className="c-recipe-card"
      role="button"
      tabIndex={0}
      aria-label={`Open recipe: ${title}`}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <div
        className="c-recipe-card__image"
        style={{ backgroundColor: imageBg }}
      >
        {imageUrl && (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            decoding="async"
            className="c-recipe-card__img"
          />
        )}
        {onToggleSave && (
          <SaveButton
            className="c-recipe-card__save"
            saved={saved}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave();
            }}
          />
        )}
      </div>
      <div className="c-recipe-card__body">
        <h2 className="c-recipe-card__title">{title}</h2>
        <div className="c-recipe-card__meta">
          <span><b>{kcal}</b> kcal</span>
          <span>·</span>
          <span><b>{prepMinutes}</b> min</span>
        </div>
        {badges && <div className="c-recipe-card__badges">{badges}</div>}
      </div>
    </article>
  );
}

/* ========================================================================
   12. NutritionStrip
   ======================================================================== */
export interface NutritionStripProps {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  perLabel?: string; // e.g., "per 100 g" or "per serving"
}

export function NutritionStrip({
  kcal,
  protein,
  carbs,
  fat,
  perLabel = "per serving",
}: NutritionStripProps) {
  return (
    <div className="c-nutrition" role="group" aria-label="Nutrition">
      <div className="c-nutrition__kcal">
        <div className="c-nutrition__kcal-value">{kcal}</div>
        <div className="c-nutrition__kcal-label">kcal · {perLabel}</div>
      </div>
      <div className="c-nutrition__macros">
        {[
          { key: "p", label: "Prot", value: protein },
          { key: "c", label: "Carb", value: carbs },
          { key: "f", label: "Fat", value: fat },
        ].map((m) => (
          <div key={m.key} className={`c-nutrition__macro c-nutrition__macro--${m.key}`}>
            <div className="c-nutrition__macro-value">
              {m.value}
              <span className="c-nutrition__macro-unit">g</span>
            </div>
            <div className="c-nutrition__macro-label">{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========================================================================
   13. ListItem (Profile rows)
   ======================================================================== */
export interface ListItemProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  title: string;
  sub?: string;
  showChevron?: boolean;
}

export function ListItem({
  icon,
  title,
  sub,
  showChevron = true,
  className,
  ...rest
}: ListItemProps) {
  return (
    <button type="button" className={cx("c-list-item", className)} {...rest}>
      {icon && <span className="c-list-item__icon" aria-hidden>{icon}</span>}
      <span className="c-list-item__main">
        <span className="c-list-item__title">{title}</span>
        {sub && <span className="c-list-item__sub">{sub}</span>}
      </span>
      {showChevron && (
        <span className="c-list-item__chevron" aria-hidden>
          <ChevronRight size={20} strokeWidth={2} />
        </span>
      )}
    </button>
  );
}

/* ========================================================================
   14. SummaryCard
   ======================================================================== */
export interface SummaryCardProps {
  greeting: string;
  goalKcal: number;
  goalLabel?: string;
  tags?: React.ReactNode;
}

export function SummaryCard({
  greeting,
  goalKcal,
  goalLabel = "kcal daily goal",
  tags,
}: SummaryCardProps) {
  return (
    <div className="c-summary-card">
      <div className="c-summary-card__greeting">{greeting}</div>
      <div className="c-summary-card__goal">
        <span className="c-summary-card__goal-value">{goalKcal.toLocaleString()}</span>
        <span className="c-summary-card__goal-label">{goalLabel}</span>
      </div>
      {tags && <div className="c-summary-card__tags">{tags}</div>}
    </div>
  );
}

/* ========================================================================
   15. EmptyState
   ======================================================================== */
export interface EmptyStateProps {
  art?: React.ReactNode;
  title: string;
  desc?: string;
  action?: React.ReactNode;
}

export function EmptyState({ art, title, desc, action }: EmptyStateProps) {
  return (
    <div className="c-empty">
      {art && <div className="c-empty__art" aria-hidden>{art}</div>}
      <div className="c-empty__title">{title}</div>
      {desc && <div className="c-empty__desc">{desc}</div>}
      {action}
    </div>
  );
}

/* ========================================================================
   16. TopAppBar
   ======================================================================== */
export interface TopAppBarProps {
  title: React.ReactNode;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  /** When true, title is left-aligned and back button is omitted (tab root) */
  asTabRoot?: boolean;
}

export function TopAppBar({
  title,
  onBack,
  rightAction,
  asTabRoot = false,
}: TopAppBarProps) {
  return (
    <header className="c-app-bar">
      {!asTabRoot && onBack && (
        <button className="c-app-bar__icon" aria-label="Back" onClick={onBack}>
          <ArrowLeft size={20} strokeWidth={2.25} />
        </button>
      )}
      <div
        className="c-app-bar__title"
        style={asTabRoot ? { textAlign: "left" } : undefined}
      >
        {title}
      </div>
      {rightAction ? rightAction : !asTabRoot && <div className="c-app-bar__spacer" />}
    </header>
  );
}

/* ========================================================================
   17a. ConfirmDialog (in-app modal — replaces native confirm() on mobile)
   ======================================================================== */
export interface ConfirmDialogProps {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div className="c-dialog__backdrop" onClick={onCancel}>
      <div
        className="c-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "c-dialog-title" : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 id="c-dialog-title" className="c-dialog__title">{title}</h2>
        )}
        <p className="c-dialog__message">{message}</p>
        <div className="c-dialog__actions">
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button
            variant="primary"
            onClick={onConfirm}
            style={destructive ? { background: "var(--color-feedback-danger)", color: "var(--color-text-on-brand)" } : undefined}
            autoFocus
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ========================================================================
   17. LoadMoreButton (circular reload arrow — paginated lists)
   ======================================================================== */
export interface LoadMoreButtonProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  label?: string;
  loading?: boolean;
}

export function LoadMoreButton({
  label = "Load more",
  loading,
  className,
  disabled,
  ...rest
}: LoadMoreButtonProps) {
  return (
    <div className="c-load-more__wrap">
      <button
        type="button"
        aria-label={label}
        className={cx("c-load-more", loading && "is-loading", className)}
        disabled={disabled || loading}
        {...rest}
      >
        <RotateCw size={22} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ========================================================================
   18. BottomTabBar
   ======================================================================== */
export interface TabItem<T extends string = string> {
  key: T;
  label: string;
  icon: React.ReactNode;
}

export interface BottomTabBarProps<T extends string = string> {
  items: ReadonlyArray<TabItem<T>>;
  active: T;
  onChange: (key: T) => void;
}

export function BottomTabBar<T extends string = string>({
  items,
  active,
  onChange,
}: BottomTabBarProps<T>) {
  return (
    <nav className="c-tab-bar" role="tablist">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          role="tab"
          aria-selected={item.key === active}
          className={cx(
            "c-tab-bar__btn",
            item.key === active && "c-tab-bar__btn--active"
          )}
          onClick={() => onChange(item.key)}
        >
          <span className="c-tab-bar__icon" aria-hidden>{item.icon}</span>
          <span className="c-tab-bar__label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
