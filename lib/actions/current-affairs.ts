"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getCurrentSite } from "@/lib/config/site";

const schema = z.object({
  title: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  body_markdown: z.string().min(1),
  youtube_url: z.string().optional().default(""),
  thumbnail_url: z.string().optional().default(""),
  post_date: z.string().min(1),
  is_published: z.coerce.boolean().default(true),
});

function parseForm(formData: FormData) {
  return schema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    body_markdown: formData.get("body_markdown"),
    youtube_url: formData.get("youtube_url"),
    thumbnail_url: formData.get("thumbnail_url"),
    post_date: formData.get("post_date"),
    is_published: formData.get("is_published") === "on",
  });
}

function revalidate() {
  revalidatePath("/current-affairs");
  revalidatePath("/current-affairs/[slug]", "page");
  revalidatePath("/");
}

export async function createCurrentAffairsPost(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { site } = await getCurrentSite();
  const data = parseForm(formData);

  await supabase.from("current_affairs_posts").insert({
    site_id: site.id,
    title: data.title,
    slug: data.slug,
    body_markdown: data.body_markdown,
    youtube_url: data.youtube_url || null,
    thumbnail_url: data.thumbnail_url || null,
    post_date: data.post_date,
    is_published: data.is_published,
  });

  revalidate();
  redirect("/admin/current-affairs");
}

export async function updateCurrentAffairsPost(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const data = parseForm(formData);

  await supabase
    .from("current_affairs_posts")
    .update({
      title: data.title,
      slug: data.slug,
      body_markdown: data.body_markdown,
      youtube_url: data.youtube_url || null,
      thumbnail_url: data.thumbnail_url || null,
      post_date: data.post_date,
      is_published: data.is_published,
    })
    .eq("id", id);

  revalidate();
  redirect("/admin/current-affairs");
}

export async function deleteCurrentAffairsPost(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("current_affairs_posts").delete().eq("id", id);
  revalidate();
}
