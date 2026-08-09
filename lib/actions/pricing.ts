"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getCurrentSite } from "@/lib/config/site";
import { rupeesToPaise } from "@/lib/money";

const schema = z.object({
  category: z.enum(["test_series", "classes", "mentorship"]),
  name: z.string().min(1),
  description: z.string().optional().default(""),
  unit_label: z.string().optional().default(""),
  price_rupees: z.coerce.number().optional(),
  is_price_tbd: z.coerce.boolean().default(false),
  supports_installments: z.coerce.boolean().default(false),
  position: z.coerce.number().default(0),
});

function parseForm(formData: FormData) {
  return schema.parse({
    category: formData.get("category"),
    name: formData.get("name"),
    description: formData.get("description"),
    unit_label: formData.get("unit_label"),
    price_rupees: formData.get("price_rupees") || undefined,
    is_price_tbd: formData.get("is_price_tbd") === "on",
    supports_installments: formData.get("supports_installments") === "on",
    position: formData.get("position") || 0,
  });
}

export async function createPricingPlan(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { site } = await getCurrentSite();
  const data = parseForm(formData);

  await supabase.from("pricing_plans").insert({
    site_id: site.id,
    category: data.category,
    name: data.name,
    description: data.description || null,
    unit_label: data.unit_label || null,
    price_paise: data.is_price_tbd ? null : rupeesToPaise(data.price_rupees ?? 0),
    is_price_tbd: data.is_price_tbd,
    supports_installments: data.supports_installments,
    position: data.position,
  });

  revalidatePath("/pricing");
  redirect("/admin/pricing");
}

export async function updatePricingPlan(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const data = parseForm(formData);

  await supabase
    .from("pricing_plans")
    .update({
      category: data.category,
      name: data.name,
      description: data.description || null,
      unit_label: data.unit_label || null,
      price_paise: data.is_price_tbd ? null : rupeesToPaise(data.price_rupees ?? 0),
      is_price_tbd: data.is_price_tbd,
      supports_installments: data.supports_installments,
      position: data.position,
    })
    .eq("id", id);

  revalidatePath("/pricing");
  redirect("/admin/pricing");
}

export async function deletePricingPlan(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("pricing_plans").delete().eq("id", id);
  revalidatePath("/pricing");
}
