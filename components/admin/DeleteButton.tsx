"use client";

import { dangerButtonClass } from "./ui";

export default function DeleteButton({ action }: { action: () => void }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("Delete this item? This cannot be undone.")) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className={dangerButtonClass}>
        Delete
      </button>
    </form>
  );
}
