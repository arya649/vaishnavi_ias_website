"use client";

import { useState, useTransition } from "react";
import { updateSectionContent } from "@/lib/actions/sections";
import type { BadgesStripContent } from "@/lib/sections/types/badges-strip";
import { Field, inputClass, buttonClass } from "@/components/admin/ui";

export default function BadgesStripForm({
  sectionId,
  pageSlug,
  initialContent,
}: {
  sectionId: string;
  pageSlug: string;
  initialContent: BadgesStripContent;
}) {
  const [text, setText] = useState(initialContent.badges.join("\n"));
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const badges = text.split("\n").map((s) => s.trim()).filter(Boolean);
        startTransition(() => updateSectionContent(sectionId, pageSlug, "badges_strip", { badges }));
      }}
    >
      <Field label="Badges (one per line)" htmlFor={`badges-${sectionId}`}>
        <textarea
          id={`badges-${sectionId}`}
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className={inputClass}
        />
      </Field>
      <div className="mt-4">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
