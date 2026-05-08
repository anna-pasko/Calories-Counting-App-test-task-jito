import { useState } from "react";
import {
  Button,
  Chip,
  NumberStepper,
  StepDots,
} from "../../design/components";
import { useApp } from "../store/useApp";
import type { AllergenTag, DietTag, UserPrefs } from "../data/types";

const DIET_OPTIONS: { value: DietTag; label: string }[] = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan", label: "Vegan" },
  { value: "pescatarian", label: "Pescatarian" },
  { value: "gluten-free", label: "Gluten-free" },
  { value: "dairy-free", label: "Dairy-free" },
  { value: "keto", label: "Keto" },
];

const ALLERGEN_OPTIONS: { value: AllergenTag; label: string }[] = [
  { value: "nuts", label: "Tree nuts" },
  { value: "peanuts", label: "Peanuts" },
  { value: "dairy", label: "Dairy" },
  { value: "eggs", label: "Eggs" },
  { value: "soy", label: "Soy" },
  { value: "gluten", label: "Gluten" },
  { value: "fish", label: "Fish" },
  { value: "shellfish", label: "Shellfish" },
  { value: "sesame", label: "Sesame" },
];

export function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [diet, setDiet] = useState<DietTag[]>([]);
  const [allergens, setAllergens] = useState<AllergenTag[]>([]);
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const completeOnboarding = useApp((s) => s.completeOnboarding);

  const finish = (prefs?: Partial<UserPrefs>) => {
    const trimmedName = (prefs?.name ?? name).trim();
    completeOnboarding({
      name: trimmedName || undefined,
      dietTags: prefs?.dietTags ?? diet,
      allergenTags: prefs?.allergenTags ?? allergens,
      calorieGoal: prefs?.calorieGoal ?? calorieGoal,
    });
  };

  const skip = () =>
    finish({
      name: undefined,
      dietTags: [],
      allergenTags: [],
      calorieGoal: 2000,
    });

  return (
    <div className="screen" style={{ paddingTop: "var(--space-3xl)" }}>
      {step === 0 && (
        <div className="col" style={{ flex: 1 }}>
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div className="center col" style={{ maxWidth: 320, alignItems: "center", gap: "var(--space-sm)" }}>
              <img
                src="/favicon.svg"
                alt=""
                width={96}
                height={96}
                style={{ display: "block" }}
              />
              <h1 className="t-display-lg" style={{ margin: 0 }}>Welcome</h1>
              <div className="t-heading-lg" style={{ margin: 0 }}>
                to{" "}
                <span style={{ color: "var(--color-accent-mint-text)" }}>
                  Calories Calculator
                </span>
              </div>
              <p className="t-body-lg muted" style={{ margin: "var(--space-md) 0 0" }}>
                Find calories for any food, and recipes that fit you. Three questions and you're in.
              </p>
            </div>
          </div>
          <div className="row-center">
            <StepDots count={4} current={step} />
          </div>
          <Button variant="primary" size="lg" onClick={() => setStep(1)}>
            Continue
          </Button>
          <Button variant="link" onClick={skip} style={{ alignSelf: "center" }}>
            Skip for now
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="col" style={{ flex: 1 }}>
          <h1 className="t-heading-lg" style={{ margin: 0 }}>What should we call you?</h1>
          <p className="t-body-md muted" style={{ margin: 0 }}>
            We'll use this to greet you on your profile.
          </p>

          <div style={{ marginTop: "var(--space-lg)" }}>
            <input
              className="c-text-input"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              aria-label="Your name"
              autoFocus
              maxLength={32}
              autoComplete="given-name"
              autoCapitalize="words"
              enterKeyHint="next"
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) setStep(2);
              }}
            />
          </div>

          <div style={{ flex: 1 }} />
          <div className="row-center">
            <StepDots count={4} current={step} />
          </div>
          <Button
            variant="primary"
            size="lg"
            onClick={() => setStep(2)}
            disabled={!name.trim()}
          >
            Continue
          </Button>
          <Button variant="link" onClick={skip} style={{ alignSelf: "center" }}>
            Skip
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="col" style={{ flex: 1 }}>
          <h1 className="t-heading-lg" style={{ margin: 0 }}>What do you eat?</h1>
          <p className="t-body-md muted" style={{ margin: 0 }}>
            Pick any that apply. We'll match recipes to your choices.
          </p>

          <div className="section-label">Diet</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
            {DIET_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                selected={diet.includes(opt.value)}
                onClick={() =>
                  setDiet((cur) =>
                    cur.includes(opt.value)
                      ? cur.filter((d) => d !== opt.value)
                      : [...cur, opt.value]
                  )
                }
              >
                {opt.label}
              </Chip>
            ))}
          </div>

          <div className="section-label">Allergies / things to avoid</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-sm)" }}>
            {ALLERGEN_OPTIONS.map((opt) => (
              <Chip
                key={opt.value}
                selected={allergens.includes(opt.value)}
                onClick={() =>
                  setAllergens((cur) =>
                    cur.includes(opt.value)
                      ? cur.filter((a) => a !== opt.value)
                      : [...cur, opt.value]
                  )
                }
              >
                {opt.label}
              </Chip>
            ))}
          </div>

          <div style={{ flex: 1 }} />
          <div className="row-center">
            <StepDots count={4} current={step} />
          </div>
          <Button variant="primary" size="lg" onClick={() => setStep(3)}>
            Continue
          </Button>
          <Button variant="link" onClick={skip} style={{ alignSelf: "center" }}>
            Skip
          </Button>
        </div>
      )}

      {step === 3 && (
        <div className="col" style={{ flex: 1 }}>
          <h1 className="t-heading-lg" style={{ margin: 0 }}>Daily calorie goal</h1>
          <p className="t-body-md muted" style={{ margin: 0 }}>
            We'll show how recipes fit into your day. Change anytime in Profile.
          </p>

          <div className="row-center" style={{ flex: 1 }}>
            <NumberStepper
              value={calorieGoal}
              unit="kcal"
              step={50}
              min={800}
              max={6000}
              onChange={setCalorieGoal}
              ariaLabel="Daily calorie goal"
            />
          </div>

          <div className="row-center">
            <StepDots count={4} current={step} />
          </div>
          <Button variant="primary" size="lg" onClick={() => finish()}>
            Done
          </Button>
          <Button variant="link" onClick={skip} style={{ alignSelf: "center" }}>
            Skip
          </Button>
        </div>
      )}
    </div>
  );
}
