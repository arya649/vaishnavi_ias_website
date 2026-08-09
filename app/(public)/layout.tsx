import type { ReactNode } from "react";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import FloatingEnquireButton from "@/components/layout/FloatingEnquireButton";

export async function generateMetadata(): Promise<Metadata> {
  const { branding, site } = await getCurrentSite();
  return {
    title: {
      default: branding?.seo_default_title || site.name,
      template: `%s | ${site.name}`,
    },
    description: branding?.seo_default_desc || branding?.tagline || undefined,
  };
}

export default async function PublicLayout({ children }: { children: ReactNode }) {
  const { site, branding } = await getCurrentSite();
  const supabase = await createClient();

  const { data: navItems } = await supabase
    .from("nav_items")
    .select("*")
    .eq("site_id", site.id)
    .order("position");

  const brandStyle = {
    "--brand-primary": branding?.primary_color || "#0b1f4d",
    "--brand-accent": branding?.accent_color || "#c9a227",
  } as React.CSSProperties;

  return (
    <div style={brandStyle} className="flex min-h-screen flex-col">
      <NavBar
        navItems={navItems ?? []}
        siteName={site.name}
        logoUrl={branding?.logo_url ?? null}
      />
      <main className="flex-1">{children}</main>
      <Footer
        siteName={site.name}
        tagline={branding?.tagline ?? null}
        contactPhone={branding?.contact_phone ?? null}
        contactEmail={branding?.contact_email ?? null}
        contactAddress={branding?.contact_address ?? null}
      />
      <FloatingEnquireButton sourcePage="global" />
    </div>
  );
}
