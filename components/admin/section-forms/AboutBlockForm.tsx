"use client";

import { useState, useTransition } from "react";
import { updateSectionContent } from "@/lib/actions/sections";
import type { AboutBlockContent } from "@/lib/sections/types/about-block";
import { Field, inputClass, buttonClass } from "@/components/admin/ui";
import FileUploadField from "@/components/admin/FileUploadField";

export default function AboutBlockForm({
  sectionId,
  pageSlug,
  initialContent,
  siteSlug,
}: {
  sectionId: string;
  pageSlug: string;
  initialContent: AboutBlockContent;
  siteSlug: string;
}) {
  const [content, setContent] = useState(initialContent);
  const [pending, startTransition] = useTransition();

  function set<K extends keyof AboutBlockContent>(key: K, value: AboutBlockContent[K]) {
    setContent((c) => ({ ...c, [key]: value }));
  }

  return (
    <form
      className="grid gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        startTransition(() => updateSectionContent(sectionId, pageSlug, "about_block", content));
      }}
    >
      <Field label="Heading" htmlFor={`heading-${sectionId}`}>
        <input
          id={`heading-${sectionId}`}
          value={content.heading}
          onChange={(e) => set("heading", e.target.value)}
          className={inputClass}
        />
      </Field>
      <Field label="Body" htmlFor={`body-${sectionId}`}>
        <textarea
          id={`body-${sectionId}`}
          rows={5}
          value={content.body}
          onChange={(e) => set("body", e.target.value)}
          className={inputClass}
        />
      </Field>
      <FileUploadField
        name={`image-${sectionId}`}
        label="Image (optional)"
        bucket="public-assets"
        pathPrefix={`${siteSlug}/pages`}
        initialUrl={content.image_url}
        accept="image/*"
        onUrlChange={(url) => set("image_url", url)}
      />
      <div>
        <button type="submit" disabled={pending} className={buttonClass}>
          {pending ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}
