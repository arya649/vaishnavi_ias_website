import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";

export async function getPageWithSections(slug: string) {
  const { site } = await getCurrentSite();
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("site_id", site.id)
    .eq("slug", slug)
    .single();

  if (!page) return null;

  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", page.id)
    .order("position");

  return { page, sections: sections ?? [] };
}

export async function getCourses() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*")
    .eq("site_id", site.id)
    .eq("is_active", true)
    .order("position");
  return data ?? [];
}

export async function getTestSeriesCategories() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data } = await supabase
    .from("test_series_categories")
    .select("*")
    .eq("site_id", site.id)
    .eq("is_active", true)
    .order("position");
  return data ?? [];
}

export async function getTestSeriesCategoryBySlug(slug: string) {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data } = await supabase
    .from("test_series_categories")
    .select("*")
    .eq("site_id", site.id)
    .eq("slug", slug)
    .eq("is_active", true)
    .single();
  return data;
}

export async function getPricingPlans() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data } = await supabase
    .from("pricing_plans")
    .select("*")
    .eq("site_id", site.id)
    .eq("is_active", true)
    .order("position");
  return data ?? [];
}

export async function getTestimonials() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("site_id", site.id)
    .eq("is_published", true)
    .order("position");
  return data ?? [];
}

export async function getCurrentAffairsPosts() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data } = await supabase
    .from("current_affairs_posts")
    .select("*")
    .eq("site_id", site.id)
    .eq("is_published", true)
    .order("post_date", { ascending: false });
  return data ?? [];
}

export async function getCurrentAffairsPostBySlug(slug: string) {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data } = await supabase
    .from("current_affairs_posts")
    .select("*")
    .eq("site_id", site.id)
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

export async function getFaqItems() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data } = await supabase
    .from("faq_items")
    .select("*")
    .eq("site_id", site.id)
    .eq("is_published", true)
    .order("position");
  return data ?? [];
}

export async function getResources() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data } = await supabase
    .from("resources")
    .select("*")
    .eq("site_id", site.id)
    .eq("is_published", true)
    .order("position");
  return data ?? [];
}
