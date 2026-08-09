/**
 * Seeds Vaishnavi IAS Academy's real launch content.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY (Project Settings → API → service_role
 * in the Supabase dashboard) in .env.local — the service role key bypasses
 * Row Level Security, which is required here since this script runs
 * unauthenticated. Never expose this key to the browser or commit it.
 *
 * Run with: npm run seed
 *
 * To reuse for a new client: copy this file, change SITE_SLUG/SITE_NAME and
 * every content literal below to the new client's brief. See
 * docs/CMS-AND-REUSE-GUIDE.md, "Standing up a brand-new client site".
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import type { Database, Json } from "../../types/database.types";

const SITE_SLUG = "vaishnavi-ias";
const SITE_NAME = "Vaishnavi IAS Academy";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local to run the seed script."
  );
}

const supabase = createClient<Database>(supabaseUrl, serviceRoleKey);

async function main() {
  console.log(`Seeding site "${SITE_SLUG}"...`);

  const { data: site, error: siteError } = await supabase
    .from("sites")
    .upsert({ slug: SITE_SLUG, name: SITE_NAME, is_active: true }, { onConflict: "slug" })
    .select()
    .single();
  if (siteError || !site) throw siteError ?? new Error("Failed to upsert site");

  await supabase.from("site_branding").upsert({
    site_id: site.id,
    tagline: "Right path to achieve",
    primary_color: "#0b1f4d",
    accent_color: "#c9a227",
    seo_default_title: `${SITE_NAME} — Right Path to Achieve`,
    seo_default_desc:
      "India's chapterwise UPSC test series, expert-led classes, and personalized mentorship.",
  });

  // ---- Pages + sections -----------------------------------------------
  const pages = [
    { slug: "home", title: "Home" },
    { slug: "about", title: "About" },
    { slug: "mentorship-program", title: "Mentorship Program" },
    { slug: "state-pcs", title: "State PCS" },
    { slug: "privacy-policy", title: "Privacy Policy" },
    { slug: "terms-and-conditions", title: "Terms & Conditions" },
    { slug: "refund-and-cancellation", title: "Refund & Cancellation" },
    { slug: "careers", title: "Careers" },
  ];

  const pageIds: Record<string, string> = {};
  for (const p of pages) {
    const { data } = await supabase
      .from("pages")
      .upsert({ site_id: site.id, slug: p.slug, title: p.title }, { onConflict: "site_id,slug" })
      .select()
      .single();
    if (data) pageIds[p.slug] = data.id;
  }

  async function setSections(pageSlug: string, sections: { type: string; position: number; content: Json }[]) {
    const pageId = pageIds[pageSlug];
    await supabase.from("sections").delete().eq("page_id", pageId);
    await supabase
      .from("sections")
      .insert(sections.map((s) => ({ page_id: pageId, type: s.type, position: s.position, content: s.content })));
  }

  await setSections("home", [
    {
      type: "hero",
      position: 0,
      content: {
        heading: "Right Path to Achieve",
        highlight_line: "We are guiding the misguided students to a right path.",
        subheading:
          "Vaishnavi IAS Academy offers structured UPSC preparation — expert-led classes, exam-standard test series, and personalized mentorship that keeps you on track from day one to the interview.",
        cta_label: "Enquire Now",
        cta_href: "/contact",
      },
    },
    {
      type: "badges_strip",
      position: 1,
      content: {
        badges: [
          "India's Premier UPSC Mentorship Platform",
          "India's First Chapterwise Structured Test Series",
          "India's Affordable UPSC Platform",
        ],
      },
    },
    {
      type: "promo_strip",
      position: 2,
      content: { badge_label: "50% OFF", text: "Get 50% off on all courses — limited time offer!", href: "/pricing", enabled: true },
    },
    {
      type: "methodology_levels",
      position: 3,
      content: {
        heading: "Our Test Series Methodology",
        levels: [
          {
            title: "Level 1 — Foundation",
            body: "Build a rock-solid foundation with 150+ carefully curated questions covering every important fact, concept, and syllabus area of the chapter. This stage ensures comprehensive syllabus coverage and strengthens factual recall.",
          },
          {
            title: "Level 2 — Conceptual Clarity",
            body: "Once your basics are strong, move to 100 statement-based questions that sharpen conceptual clarity, analytical thinking, and the ability to distinguish between closely related concepts — the core skill required for UPSC prelims.",
          },
          {
            title: "Level 3 — Exam Simulation",
            body: "Finally, attempt a full UPSC-standard test based on the same chapter. Experience the actual exam pattern with intelligently framed questions that test application, integration of concepts, and elimination techniques.",
          },
        ],
        why_heading: "Why our test series?",
        why_points: [
          "Complete chapterwise preparation from basics to advanced.",
          "More than just practice — structured learning at every stage.",
          "Comprehensive syllabus coverage with no important topic left behind.",
          "Gradual increase in difficulty to build confidence and accuracy.",
          "Designed to match the evolving UPSC prelims question pattern.",
          "Helps transform knowledge into exam-ready performance.",
        ],
      },
    },
    {
      type: "cta_banner",
      position: 4,
      content: {
        heading: "Ready to start your UPSC journey?",
        body: "Talk to our mentors and find the right course for you.",
        cta_label: "Enquire Now",
        cta_href: "/contact",
      },
    },
  ]);

  await setSections("about", [
    {
      type: "about_block",
      position: 0,
      content: {
        heading: "About Vaishnavi IAS Academy",
        body: "We are guiding the misguided students to a right path through personalized mentorship, exam-standard test series, and structured classes.",
        image_url: "",
      },
    },
  ]);

  await setSections("mentorship-program", [
    {
      type: "rich_text",
      position: 0,
      content: {
        heading: "Mentorship Program",
        body_markdown:
          "Personalized mentorship for up to 3 years. Details and pricing will be updated soon — please [contact us](/contact) to learn more.",
      },
    },
  ]);

  await setSections("state-pcs", [
    {
      type: "rich_text",
      position: 0,
      content: {
        heading: "State PCS",
        body_markdown: "Coverage for State PCS exams. Content coming soon.",
      },
    },
  ]);

  await setSections("privacy-policy", [
    { type: "rich_text", position: 0, content: { heading: "Privacy Policy", body_markdown: "_Content to be added by the admin._" } },
  ]);
  await setSections("terms-and-conditions", [
    { type: "rich_text", position: 0, content: { heading: "Terms & Conditions", body_markdown: "_Content to be added by the admin._" } },
  ]);
  await setSections("refund-and-cancellation", [
    { type: "rich_text", position: 0, content: { heading: "Refund & Cancellation", body_markdown: "_Content to be added by the admin._" } },
  ]);
  await setSections("careers", [
    { type: "rich_text", position: 0, content: { heading: "Careers", body_markdown: "_No open positions right now. Check back soon._" } },
  ]);

  // ---- Nav items ---------------------------------------------------------
  await supabase.from("nav_items").delete().eq("site_id", site.id);
  await supabase.from("nav_items").insert(
    [
      { label: "Courses", href: "/courses" },
      { label: "Current Affairs", href: "/current-affairs" },
      { label: "Test Series", href: "/test-series" },
      { label: "Mentorship Program", href: "/mentorship-program" },
      { label: "State PCS", href: "/state-pcs" },
      { label: "Resources", href: "/resources" },
      { label: "Pricing", href: "/pricing" },
      { label: "About", href: "/about" },
    ].map((item, i) => ({ ...item, site_id: site.id, position: i * 10 }))
  );

  // ---- Courses -------------------------------------------------------
  await supabase.from("courses").delete().eq("site_id", site.id);
  await supabase.from("courses").insert([
    {
      site_id: site.id,
      track: "classes",
      name: "Long Term Classes",
      duration_label: "Up to 3 years",
      description: "Comprehensive long-term classroom program covering the full UPSC syllabus.",
      price_paise: 6000000,
      is_price_tbd: false,
      position: 0,
    },
    {
      site_id: site.id,
      track: "classes",
      name: "UPSC 1-Year Course",
      duration_label: "1 year",
      description: "Intensive 1-year classroom program for UPSC aspirants.",
      price_paise: 6000000,
      is_price_tbd: false,
      position: 10,
    },
    {
      site_id: site.id,
      track: "mentorship",
      name: "Mentorship Program",
      duration_label: "Up to 3 years",
      description: "One-on-one personalized mentorship throughout your UPSC journey.",
      price_paise: 3500000,
      is_price_tbd: false,
      position: 0,
    },
  ]);

  // ---- Test series categories -----------------------------------------
  await supabase.from("test_series_categories").delete().eq("site_id", site.id);
  await supabase.from("test_series_categories").insert([
    {
      site_id: site.id,
      name: "UPSC",
      slug: "upsc",
      summary: "Chapterwise and full-length test series for UPSC Prelims & Mains.",
      details_markdown: "Full UPSC test series details coming soon.",
      position: 0,
    },
    {
      site_id: site.id,
      name: "KPSC / KEA & Other State Government Exams",
      slug: "kpsc-kea",
      summary: "Test series covering KPSC, KEA, and other state government exams.",
      details_markdown: "Details coming soon.",
      position: 10,
    },
    {
      site_id: site.id,
      name: "Banking",
      slug: "banking",
      summary: "1-year Banking exam preparation course.",
      details_markdown: "Click for more details about the Banking course — coming soon.",
      position: 20,
    },
  ]);

  // ---- Pricing plans ----------------------------------------------------
  await supabase.from("pricing_plans").delete().eq("site_id", site.id);
  await supabase.from("pricing_plans").insert([
    {
      site_id: site.id,
      category: "test_series",
      name: "Per Chapter",
      unit_label: "per chapter",
      price_paise: 2900,
      position: 0,
      supports_installments: false,
    },
    {
      site_id: site.id,
      category: "test_series",
      name: "Subject-wise Full Series",
      unit_label: "per subject",
      price_paise: 149900,
      position: 10,
      supports_installments: false,
    },
    {
      site_id: site.id,
      category: "test_series",
      name: "Sectional-wise Papers",
      description: "Overall chapters of a subject — 10 papers per subject.",
      unit_label: "10 papers/subject",
      price_paise: 129900,
      position: 20,
      supports_installments: false,
    },
    {
      site_id: site.id,
      category: "test_series",
      name: "Overall Test Series",
      unit_label: "one-time",
      price_paise: 699900,
      position: 30,
      supports_installments: true,
    },
    {
      site_id: site.id,
      category: "test_series",
      name: "CSAT Paper Series",
      unit_label: "10 papers",
      price_paise: 69900,
      position: 40,
      supports_installments: false,
    },
    {
      site_id: site.id,
      category: "classes",
      name: "Classes",
      unit_label: "one-time",
      price_paise: 6000000,
      position: 0,
      supports_installments: true,
    },
    {
      site_id: site.id,
      category: "mentorship",
      name: "Mentorship",
      unit_label: "one-time",
      price_paise: 3500000,
      position: 0,
      supports_installments: true,
    },
  ]);

  // ---- FAQ (placeholders — client will finalize content later) ---------
  await supabase.from("faq_items").delete().eq("site_id", site.id);
  await supabase.from("faq_items").insert([
    {
      site_id: site.id,
      question: "How do I enroll in a course?",
      answer_markdown: "Use the Enquire Now button and our team will get in touch with you.",
      position: 0,
    },
    {
      site_id: site.id,
      question: "Do you offer installment payment options?",
      answer_markdown: "Installments are available for select plans — contact us for details.",
      position: 10,
    },
  ]);

  console.log("Seed complete.");
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
