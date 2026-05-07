import { useState } from "react";
import {
  Button,
  Chip,
  NumberStepper,
  TopAppBar,
} from "../../design/components";
import { useApp } from "../store/useApp";
import type { AllergenTag, DietTag } from "../data/types";

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

export function ProfileEditScreen() {
  const prefs = useApp((s) => s.prefs);
  const setPrefs = useApp((s) => s.setPrefs);
  const pop = useApp((s) => s.pop);
  const showToast = useApp((s) => s.showToast);

  const [diet, setDiet] = useState<DietTag[]>(prefs.dietTags);
  const [allergens, setAllergens] = useState<AllergenTag[]>(prefs.allergenTags);
  const [calorieGoal, setCalorieGoal] = useState(prefs.calorieGoal);

  const save = () => {
    setPrefs({ dietTags: diet, allergenTags: allergens, calorieGoal });
    showToast("Preferences saved");
    pop();
  };

  return (
    <>
      <TopAppBar title="Edit preferences" onBack={() => pop()} />
      <div className="screen">
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

        <div className="section-label">Daily calorie goal</div>
        <div className="row-center" style={{ padding: "var(--space-md) 0" }}>
          <NumberStepper
            value={calorieGoal}
            unit="kcal"
            step={50}
            min={800}
            max={6000}
            onChange={setCalorieGoal}
          />
        </div>

        <div style={{ flex: 1 }} />
        <Button variant="primary" size="lg" onClick={save}>
          Save
        </Button>
      </div>
    </>
  );
}
