"use client";

import { useState, useTransition } from "react";
import { updateSectionContent } from "@/lib/actions/sections";
import type { CtaBannerContent } from "@/lib/sections/types/cta-banner";
import { Field, inputClass, buttonClass } from "@/components/admin/ui";

export default function CtaBannerForm({
  sectionId,
  pageSlug,
  initialContent,
}: {
  sectionId: string;
  pageSlug: string;
  initialContent: CtaBannerContent;
}) {
  const [content, setContent] = useState(initialContent);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof CtaBannerContent>(key: K, value: CtaBannerContent[K]) {
    setContent((c) => ({ ...c, [key]: value }));
  }

  return (
    <form
      className="grid gap-4 sm:grid-cols-2"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => updateSectionContent(sectionId, pageSlug, "cta_banner", content));
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
        <Field label="Body (optional)" htmlFor={`body-${sectionId}`}>
          <textarea
            id={`body-${sectionId}`}
            rows={2}
            value={content.body}
            onChange={(e) => set("body", e.target.value)}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Button Label" htmlFor={`label-${sectionId}`}>
        <input
          id={`label-${sectionId}`}
          value={content.cta_label}
          onChange={(e) => set("cta_label", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Button Link" htmlFor={`href-${sectionId}`}>
        <input
          id={`href-${sectionId}`}
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
