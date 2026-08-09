"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getCurrentSite } from "@/lib/config/site";

const schema = z.object({
  name: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  summary: z.string().optional().default(""),
  details_markdown: z.string().optional().default(""),
  position: z.coerce.number().default(0),
});

function parseForm(formData: FormData) {
  return schema.parse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    details_markdown: formData.get("details_markdown"),
    position: formData.get("position") || 0,
  });
}

function revalidateTestSeriesPages() {
  revalidatePath("/test-series");
  revalidatePath("/test-series/[slug]", "page");
}

export async function createTestSeriesCategory(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { site } = await getCurrentSite();
  const data = parseForm(formData);

  await supabase.from("test_series_categories").insert({
    site_id: site.id,
    name: data.name,
    slug: data.slug,
    summary: data.summary || null,
    details_markdown: data.details_markdown || null,
    position: data.position,
  });

  revalidateTestSeriesPages();
  redirect("/admin/test-series");
}

export async function updateTestSeriesCategory(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const data = parseForm(formData);

  await supabase
    .from("test_series_categories")
    .update({
      name: data.name,
      slug: data.slug,
      summary: data.summary || null,
      details_markdown: data.details_markdown || null,
      position: data.position,
    })
    .eq("id", id);

  revalidateTestSeriesPages();
  redirect("/admin/test-series");
}

export async function deleteTestSeriesCategory(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("test_series_categories").delete().eq("id", id);
  revalidateTestSeriesPages();
}
