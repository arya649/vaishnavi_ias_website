"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getCurrentSite } from "@/lib/config/site";

const schema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  position: z.coerce.number().default(0),
  is_visible: z.coerce.boolean().default(true),
});

function parseForm(formData: FormData) {
  return schema.parse({
    label: formData.get("label"),
    href: formData.get("href"),
    position: formData.get("position") || 0,
    is_visible: formData.get("is_visible") === "on",
  });
}

export async function createNavItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { site } = await getCurrentSite();
  const data = parseForm(formData);

  await supabase.from("nav_items").insert({ site_id: site.id, ...data });

  revalidatePath("/", "layout");
  redirect("/admin/nav");
}

export async function updateNavItem(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const data = parseForm(formData);

  await supabase.from("nav_items").update(data).eq("id", id);

  revalidatePath("/", "layout");
  redirect("/admin/nav");
}

export async function deleteNavItem(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("nav_items").delete().eq("id", id);
  revalidatePath("/", "layout");
}
