"use client";

import { useState, useTransition } from "react";
import { updateSectionContent } from "@/lib/actions/sections";
import type { HeroContent } from "@/lib/sections/types/hero";
import { Field, inputClass, buttonClass } from "@/components/admin/ui";

export default function HeroForm({
  sectionId,
  pageSlug,
  initialContent,
}: {
  sectionId: string;
  pageSlug: string;
  initialContent: HeroContent;
}) {
  const [content, setContent] = useState(initialContent);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof HeroContent>(key: K, value: HeroContent[K]) {
    setContent((c) => ({ ...c, [key]: value }));
  }

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => updateSectionContent(sectionId, pageSlug, "hero", content));
      }}
    >
      <div className="sm:col-span-2">
        <Field label="Heading" htmlFor={`heading-${sectionId}`}>
          <input
            id={`heading-${sectionId}`}
            value={content.heading}
            onChange={(e) => set("heading", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Subheading" htmlFor={`sub-${sectionId}`}>
          <textarea
            id={`sub-${sectionId}`}
            rows={2}
            value={content.subheading}
            onChange={(e) => set("subheading", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <div className="sm:col-span-2">
        <Field label="Highlighted Line" htmlFor={`hl-${sectionId}`}>
          <input
            id={`hl-${sectionId}`}
            value={content.highlight_line}
            onChange={(e) => set("highlight_line", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Button Label" htmlFor={`cta-label-${sectionId}`}>
        <input
          id={`cta-label-${sectionId}`}
          value={content.cta_label}
          onChange={(e) => set("cta_label", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Button Link" htmlFor={`cta-href-${sectionId}`}>
        <input
          id={`cta-href-${sectionId}`}
          value={content.cta_href}
          onChange={(e) => set("cta_href", e.target.value)}
          className={inputClass}
        />
      </Field>
      <div className="sm:col-span-2">
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
