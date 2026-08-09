"use client";

import { useState, useTransition } from "react";
import { updateSectionContent } from "@/lib/actions/sections";
import type { RichTextContent } from "@/lib/sections/types/rich-text";
import { Field, inputClass, buttonClass } from "@/components/admin/ui";

export default function RichTextForm({
  sectionId,
  pageSlug,
  initialContent,
}: {
  sectionId: string;
  pageSlug: string;
  initialContent: RichTextContent;
}) {
  const [content, setContent] = useState(initialContent);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof RichTextContent>(key: K, value: RichTextContent[K]) {
    setContent((c) => ({ ...c, [key]: value }));
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => updateSectionContent(sectionId, pageSlug, "rich_text", content));
      }}
    >
      <Field label="Heading (optional)" htmlFor={`heading-${sectionId}`}>
        <input
          id={`heading-${sectionId}`}
          value={content.heading}
          onChange={(e) => set("heading", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Body (Markdown)" htmlFor={`body-${sectionId}`}>
        <textarea
          id={`body-${sectionId}`}
          rows={8}
          value={content.body_markdown}
          onChange={(e) => set("body_markdown", e.target.value)}
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
