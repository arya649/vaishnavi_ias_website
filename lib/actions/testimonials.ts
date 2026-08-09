"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getCurrentSite } from "@/lib/config/site";

const schema = z.object({
  student_name: z.string().min(1),
  rank_or_batch: z.string().optional().default(""),
  quote: z.string().min(1),
  photo_url: z.string().optional().default(""),
  video_url: z.string().optional().default(""),
  position: z.coerce.number().default(0),
  is_published: z.coerce.boolean().default(true),
});

function parseForm(formData: FormData) {
  return schema.parse({
    student_name: formData.get("student_name"),
    rank_or_batch: formData.get("rank_or_batch"),
    quote: formData.get("quote"),
    photo_url: formData.get("photo_url"),
    video_url: formData.get("video_url"),
    position: formData.get("position") || 0,
    is_published: formData.get("is_published") === "on",
  });
}

function revalidate() {
  revalidatePath("/testimonials");
  revalidatePath("/");
}

export async function createTestimonial(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { site } = await getCurrentSite();
  const data = parseForm(formData);

  await supabase.from("testimonials").insert({
    site_id: site.id,
    student_name: data.student_name,
    rank_or_batch: data.rank_or_batch || null,
    quote: data.quote,
    photo_url: data.photo_url || null,
    video_url: data.video_url || null,
    position: data.position,
    is_published: data.is_published,
  });

  revalidate();
  redirect("/admin/testimonials");
}

export async function updateTestimonial(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const data = parseForm(formData);

  await supabase
    .from("testimonials")
    .update({
      student_name: data.student_name,
      rank_or_batch: data.rank_or_batch || null,
      quote: data.quote,
      photo_url: data.photo_url || null,
      video_url: data.video_url || null,
      position: data.position,
      is_published: data.is_published,
    })
    .eq("id", id);

  revalidate();
  redirect("/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("testimonials").delete().eq("id", id);
  revalidate();
}
