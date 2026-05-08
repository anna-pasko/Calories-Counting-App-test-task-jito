import * as React from "react";
import { Button } from "../../design/components";
import { BottomSheet } from "./BottomSheet";

interface NameDishSheetProps {
  /** Pre-fills the input — used when editing an existing dish. */
  defaultValue?: string;
  /** Submit-button label. Defaults to "Save dish". */
  submitLabel?: string;
  onSubmit: (name: string) => void;
  onCancel: () => void;
}

export function NameDishSheet({
  defaultValue = "",
  submitLabel = "Save dish",
  onSubmit,
  onCancel,
}: NameDishSheetProps) {
  const [name, setName] = React.useState(defaultValue);

  const submit = () => {
    onSubmit(name.trim() || "Untitled dish");
  };

  return (
    <BottomSheet ariaLabel="Name your dish" onCancel={onCancel}>
      <div>
        <h2 className="c-sheet__title">Save as dish</h2>
        <p className="c-sheet__subtitle">
          Give your meal a name so you can find it later.
        </p>
      </div>

      <input
        className="c-sheet__input"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="My breakfast"
        maxLength={60}
        autoFocus
        onKeyDown={(e) => {
          if (e.key === "Enter") submit();
        }}
      />

      <div className="c-sheet__actions">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={submit}>
          {submitLabel}
        </Button>
      </div>
    </BottomSheet>
  );
}
