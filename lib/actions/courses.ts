"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getCurrentSite } from "@/lib/config/site";
import { rupeesToPaise } from "@/lib/money";

const courseSchema = z.object({
  track: z.enum(["classes", "mentorship"]),
  name: z.string().min(1),
  duration_label: z.string().optional().default(""),
  description: z.string().optional().default(""),
  price_rupees: z.coerce.number().optional(),
  is_price_tbd: z.coerce.boolean().default(false),
  position: z.coerce.number().default(0),
});

function parseCourseForm(formData: FormData) {
  return courseSchema.parse({
    track: formData.get("track"),
    name: formData.get("name"),
    duration_label: formData.get("duration_label"),
    description: formData.get("description"),
    price_rupees: formData.get("price_rupees") || undefined,
    is_price_tbd: formData.get("is_price_tbd") === "on",
    position: formData.get("position") || 0,
  });
}

function revalidateCoursePages() {
  revalidatePath("/courses");
  revalidatePath("/courses/[track]", "page");
}

export async function createCourse(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { site } = await getCurrentSite();
  const data = parseCourseForm(formData);

  await supabase.from("courses").insert({
    site_id: site.id,
    track: data.track,
    name: data.name,
    duration_label: data.duration_label || null,
    description: data.description || null,
    price_paise: data.is_price_tbd ? null : rupeesToPaise(data.price_rupees ?? 0),
    is_price_tbd: data.is_price_tbd,
    position: data.position,
  });

  revalidateCoursePages();
  redirect("/admin/courses");
}

export async function updateCourse(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const data = parseCourseForm(formData);

  await supabase
    .from("courses")
    .update({
      track: data.track,
      name: data.name,
      duration_label: data.duration_label || null,
      description: data.description || null,
      price_paise: data.is_price_tbd ? null : rupeesToPaise(data.price_rupees ?? 0),
      is_price_tbd: data.is_price_tbd,
      position: data.position,
    })
    .eq("id", id);

  revalidateCoursePages();
  redirect("/admin/courses");
}

export async function deleteCourse(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("courses").delete().eq("id", id);
  revalidateCoursePages();
}
