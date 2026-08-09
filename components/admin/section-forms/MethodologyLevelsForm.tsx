"use client";

import { useState, useTransition } from "react";
import { updateSectionContent } from "@/lib/actions/sections";
import type { MethodologyLevelsContent } from "@/lib/sections/types/methodology-levels";
import { Field, inputClass, buttonClass } from "@/components/admin/ui";

// Levels are edited as up to 3 fixed title/body pairs (matches the client's
// actual 3-stage methodology). The stored shape is still a generic array —
// for a client that needs more/fewer levels, extend the `slots` array below.
export default function MethodologyLevelsForm({
  sectionId,
  pageSlug,
  initialContent,
}: {
  sectionId: string;
  pageSlug: string;
  initialContent: MethodologyLevelsContent;
}) {
  const [heading, setHeading] = useState(initialContent.heading);
  const [levels, setLevels] = useState<{ title: string; body: string }[]>(() => {
    const base = [...initialContent.levels];
    while (base.length < 3) base.push({ title: "", body: "" });
    return base.slice(0, 3);
  });
  const [whyHeading, setWhyHeading] = useState(initialContent.why_heading);
  const [whyPointsText, setWhyPointsText] = useState(initialContent.why_points.join("\n"));
  const [pending, startTransition] = useTransition();

  function setLevel(i: number, field: "title" | "body", value: string) {
    setLevels((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  }

  return (
    <form
      className="grid gap-6"
      onSubmit={(e) => {
        e.preventDefault();
        const content = {
          heading,
          levels: levels.filter((l) => l.title.trim() || l.body.trim()),
          why_heading: whyHeading,
          why_points: whyPointsText.split("\n").map((s) => s.trim()).filter(Boolean),
        };
        startTransition(() => updateSectionContent(sectionId, pageSlug, "methodology_levels", content));
      }}
    >
      <Field label="Heading" htmlFor={`heading-${sectionId}`}>
        <input
          id={`heading-${sectionId}`}
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        {levels.map((level, i) => (
          <div key={i} className="rounded-md border border-slate-200 p-3">
            <Field label={`Level ${i + 1} Title`} htmlFor={`level-title-${sectionId}-${i}`}>
              <input
                id={`level-title-${sectionId}-${i}`}
                value={level.title}
                onChange={(e) => setLevel(i, "title", e.target.value)}
                className={inputClass}
              />
            </Field>
            <div className="mt-3">
              <Field label={`Level ${i + 1} Body`} htmlFor={`level-body-${sectionId}-${i}`}>
                <textarea
                  id={`level-body-${sectionId}-${i}`}
                  rows={4}
                  value={level.body}
                  onChange={(e) => setLevel(i, "body", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        ))}
      </div>

      <Field label="'Why our test series?' Heading" htmlFor={`why-heading-${sectionId}`}>
        <input
          id={`why-heading-${sectionId}`}
          value={whyHeading}
          onChange={(e) => setWhyHeading(e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Why Points (one per line)" htmlFor={`why-points-${sectionId}`}>
        <textarea
          id={`why-points-${sectionId}`}
          rows={6}
          value={whyPointsText}
          onChange={(e) => setWhyPointsText(e.target.value)}
          className={inputClass}
        />
      </Field>

      <div>
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
