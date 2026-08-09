import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

// Which tenant this deployment renders. A future client reuse of this codebase
// only needs a new `sites` row + a different NEXT_PUBLIC_SITE_SLUG env var —
// see docs/CMS-AND-REUSE-GUIDE.md, "Standing up a brand-new client site".
export const SITE_SLUG = process.env.NEXT_PUBLIC_SITE_SLUG ?? "vaishnavi-ias";

export const getCurrentSite = cache(async () => {
  const supabase = await createClient();
  const { data: site, error } = await supabase
    .from("sites")
    .select("*")
    .eq("slug", SITE_SLUG)
    .single();

  if (error || !site) {
    throw new Error(
      `Site with slug "${SITE_SLUG}" not found. Has the seed script been run?`
    );
  }

  const { data: branding } = await supabase
    .from("site_branding")
    .select("*")
    .eq("site_id", site.id)
    .single();

  return { site, branding };
});
