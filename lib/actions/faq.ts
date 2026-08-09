"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getCurrentSite } from "@/lib/config/site";

const schema = z.object({
  question: z.string().min(1),
  answer_markdown: z.string().min(1),
  category: z.string().optional().default(""),
  position: z.coerce.number().default(0),
  is_published: z.coerce.boolean().default(true),
});

function parseForm(formData: FormData) {
  return schema.parse({
    question: formData.get("question"),
    answer_markdown: formData.get("answer_markdown"),
    category: formData.get("category"),
    position: formData.get("position") || 0,
    is_published: formData.get("is_published") === "on",
  });
}

export async function createFaqItem(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { site } = await getCurrentSite();
  const data = parseForm(formData);

  await supabase.from("faq_items").insert({
    site_id: site.id,
    question: data.question,
    answer_markdown: data.answer_markdown,
    category: data.category || null,
    position: data.position,
    is_published: data.is_published,
  });

  revalidatePath("/faq");
  redirect("/admin/faq");
}

export async function updateFaqItem(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const data = parseForm(formData);

  await supabase
    .from("faq_items")
    .update({
      question: data.question,
      answer_markdown: data.answer_markdown,
      category: data.category || null,
      position: data.position,
      is_published: data.is_published,
    })
    .eq("id", id);

  revalidatePath("/faq");
  redirect("/admin/faq");
}

export async function deleteFaqItem(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("faq_items").delete().eq("id", id);
  revalidatePath("/faq");
}
