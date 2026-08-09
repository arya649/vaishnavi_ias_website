"use client";

import { useTransition } from "react";
import { addSection } from "@/lib/actions/sections";
import type { SectionType } from "@/lib/sections/registry";
import { inputClass, buttonClass } from "@/components/admin/ui";

export default function AddSectionForm({
  pageId,
  pageSlug,
  nextPosition,
  options,
}: {
  pageId: string;
  pageSlug: string;
  nextPosition: number;
  options: { type: SectionType; label: string }[];
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="flex flex-wrap items-end gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const type = (new FormData(form).get("type") as SectionType) || options[0].type;
        startTransition(() => addSection(pageId, pageSlug, type, nextPosition));
      }}
    >
      <div>
        <label className="block text-sm font-medium text-slate-700">Section Type</label>
        <select name="type" className={`${inputClass} min-w-48`}>
          {options.map((opt) => (
            <option key={opt.type} value={opt.type}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Adding..." : "+ Add Section"}
      </button>
    </form>
  );
}
