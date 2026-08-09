"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { sectionRegistry, type SectionType } from "@/lib/sections/registry";

// Generic mutation for any section's JSONB content — this is what lets the
// registry (lib/sections/registry.ts) stay the single place new section
// types are wired up, instead of one server action per type.
export async function updateSectionContent(
  sectionId: string,
  pageSlug: string,
  type: SectionType,
  content: unknown
) {
  const { supabase } = await requireAdmin();

  const definition = sectionRegistry[type];
  const parsed = definition.schema.parse(content);

  await supabase
    .from("sections")
    .update({ content: parsed, updated_at: new Date().toISOString() })
    .eq("id", sectionId);

  revalidatePath(pageSlug === "home" ? "/" : `/${pageSlug}`);
}

export async function addSection(pageId: string, pageSlug: string, type: SectionType, position: number) {
  const { supabase } = await requireAdmin();
  const definition = sectionRegistry[type];
  const defaultContent = definition.schema.parse({});

  await supabase.from("sections").insert({
    page_id: pageId,
    type,
    position,
    content: defaultContent,
  });

  revalidatePath(pageSlug === "home" ? "/" : `/${pageSlug}`);
}

export async function deleteSection(sectionId: string, pageSlug: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("sections").delete().eq("id", sectionId);
  revalidatePath(pageSlug === "home" ? "/" : `/${pageSlug}`);
}

export async function toggleSectionVisibility(sectionId: string, pageSlug: string, isVisible: boolean) {
  const { supabase } = await requireAdmin();
  await supabase.from("sections").update({ is_visible: isVisible }).eq("id", sectionId);
  revalidatePath(pageSlug === "home" ? "/" : `/${pageSlug}`);
}
