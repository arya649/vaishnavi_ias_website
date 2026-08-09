"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { getCurrentSite } from "@/lib/config/site";

const schema = z.object({
  tagline: z.string().optional().default(""),
  logo_url: z.string().optional().default(""),
  favicon_url: z.string().optional().default(""),
  primary_color: z.string().min(1),
  accent_color: z.string().min(1),
  contact_phone: z.string().optional().default(""),
  contact_email: z.string().optional().default(""),
  contact_address: z.string().optional().default(""),
  seo_default_title: z.string().optional().default(""),
  seo_default_desc: z.string().optional().default(""),
});

export async function updateBranding(formData: FormData) {
  const { supabase } = await requireAdmin();
  const { site } = await getCurrentSite();

  const data = schema.parse({
    tagline: formData.get("tagline"),
    logo_url: formData.get("logo_url"),
    favicon_url: formData.get("favicon_url"),
    primary_color: formData.get("primary_color"),
    accent_color: formData.get("accent_color"),
    contact_phone: formData.get("contact_phone"),
    contact_email: formData.get("contact_email"),
    contact_address: formData.get("contact_address"),
    seo_default_title: formData.get("seo_default_title"),
    seo_default_desc: formData.get("seo_default_desc"),
  });

  await supabase
    .from("site_branding")
    .update({
      tagline: data.tagline || null,
      logo_url: data.logo_url || null,
      favicon_url: data.favicon_url || null,
      primary_color: data.primary_color,
      accent_color: data.accent_color,
      contact_phone: data.contact_phone || null,
      contact_email: data.contact_email || null,
      contact_address: data.contact_address || null,
      seo_default_title: data.seo_default_title || null,
      seo_default_desc: data.seo_default_desc || null,
      updated_at: new Date().toISOString(),
    })
    .eq("site_id", site.id);

  revalidatePath("/", "layout");
}
