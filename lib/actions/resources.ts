"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getCurrentSite } from "@/lib/config/site";

const schema = z.object({
  title: z.string().min(1),
  file_url: z.string().min(1, "Please upload a file."),
  category: z.string().optional().default(""),
  position: z.coerce.number().default(0),
  is_published: z.coerce.boolean().default(true),
});

function parseForm(formData: FormData) {
  return schema.parse({
    title: formData.get("title"),
    file_url: formData.get("file_url"),
    category: formData.get("category"),
    position: formData.get("position") || 0,
    is_published: formData.get("is_published") === "on",
  });
}

export async function createResource(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { site } = await getCurrentSite();
  const data = parseForm(formData);

  await supabase.from("resources").insert({
    site_id: site.id,
    title: data.title,
    file_url: data.file_url,
    category: data.category || null,
    position: data.position,
    is_published: data.is_published,
  });

  revalidatePath("/resources");
  redirect("/admin/resources");
}

export async function updateResource(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const data = parseForm(formData);

  await supabase
    .from("resources")
    .update({
      title: data.title,
      file_url: data.file_url,
      category: data.category || null,
      position: data.position,
      is_published: data.is_published,
    })
    .eq("id", id);

  revalidatePath("/resources");
  redirect("/admin/resources");
}

export async function deleteResource(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("resources").delete().eq("id", id);
  revalidatePath("/resources");
}
