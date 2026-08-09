"use client";

import { useState, useTransition } from "react";
import { updateSectionContent } from "@/lib/actions/sections";
import type { PromoStripContent } from "@/lib/sections/types/promo-strip";
import { Field, inputClass, buttonClass } from "@/components/admin/ui";

export default function PromoStripForm({
  sectionId,
  pageSlug,
  initialContent,
}: {
  sectionId: string;
  pageSlug: string;
  initialContent: PromoStripContent;
}) {
  const [content, setContent] = useState(initialContent);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof PromoStripContent>(key: K, value: PromoStripContent[K]) {
    setContent((c) => ({ ...c, [key]: value }));
  }

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => updateSectionContent(sectionId, pageSlug, "promo_strip", content));
      }}
    >
      <Field label="Badge Label (optional)" htmlFor={`badge-${sectionId}`}>
        <input
          id={`badge-${sectionId}`}
          value={content.badge_label}
          onChange={(e) => set("badge_label", e.target.value)}
          placeholder="e.g. 50% OFF"
          className={inputClass}
        />
      </Field>
      <Field label="Link" htmlFor={`href-${sectionId}`}>
        <input
          id={`href-${sectionId}`}
          value={content.href}
          onChange={(e) => set("href", e.target.value)}
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <Field label="Text" htmlFor={`text-${sectionId}`}>
          <input
            id={`text-${sectionId}`}
            value={content.text}
            onChange={(e) => set("text", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={content.enabled}
          onChange={(e) => set("enabled", e.target.checked)}
        />
        Enabled
      </label>
      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
