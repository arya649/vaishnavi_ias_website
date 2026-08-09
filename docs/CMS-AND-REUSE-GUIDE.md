# CMS & Reuse Guide

This codebase powers Vaishnavi IAS Academy's website, but it was built to be reused for other coaching-center clients with minimal changes. This document explains the content model, how the admin CMS works, and how to extend or reuse the codebase.

## 1. Overview

- **Framework:** Next.js (App Router, TypeScript) + Supabase (Postgres, Auth, Storage).
- **Multi-tenant model:** every content table has a `site_id` foreign key to a `sites` table, even though today only one site (`vaishnavi-ias`) exists. Reusing this codebase for a new client is a *data* operation (new `sites` row + seeded content), not a code change, unless the new client needs a genuinely new kind of content block.
- **Admin auth:** a single Supabase Auth user (email/password). No roles, no self-serve signup — see §10.
- **Public pages** are Server Components that read directly from Supabase (anon key, protected by Row Level Security). **Admin pages** mutate through Next.js Server Actions, which re-check authentication server-side (see §9) and call `revalidatePath` so edits show up immediately.

## 2. Local setup

1. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SITE_SLUG` — which `sites.slug` this deployment renders (`vaishnavi-ias` today).
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — from the Supabase project's API settings.
   - `SUPABASE_SERVICE_ROLE_KEY` — only needed to run the seed script (`npm run seed`), never used at runtime, never sent to the browser.
2. Apply `supabase/migrations/0001_init.sql` to a fresh Supabase project (via the Supabase MCP `apply_migration` tool, the Supabase CLI, or pasting into the SQL editor).
3. Run `npm run seed` to load a client's content (edit `supabase/seed/seed-vaishnavi.ts` or copy it per §9).
4. `npm run dev`.

## 3. Content model reference

| Table | Purpose | Notes |
|---|---|---|
| `sites` | One row per tenant | `slug` is what `NEXT_PUBLIC_SITE_SLUG` matches against |
| `site_branding` | Logo, colors, tagline, contact info, SEO defaults | 1:1 with `sites` |
| `pages` | Named pages (`home`, `about`, `careers`, ...) | `slug` + `site_id` unique |
| `sections` | Ordered content blocks on a page | `type` + JSONB `content`, see §4 |
| `courses` | Classes / Mentorship tracks | `track` enum, `price_paise` (nullable = TBD) |
| `test_series_categories` | UPSC / KPSC-KEA / Banking etc. | has its own detail page at `/test-series/[slug]` |
| `pricing_plans` | Every priced line item | `category` enum (`test_series`/`classes`/`mentorship`) |
| `testimonials` | Student testimonials | optional photo + video URL |
| `current_affairs_posts` | Daily current-affairs posts | optional YouTube link, own detail page |
| `faq_items` | FAQ list | markdown answers |
| `resources` | Downloadable files (syllabus PDFs, etc.) | file lives in the `resources` Storage bucket |
| `nav_items` | Top nav links | `parent_id` allows one level of nesting if ever needed |
| `enquiries` | Leads from the "Enquire Now" form | `installment_access` flag is currently unused by the public site (see §11) |

Money is always stored as **integer paise** (`price_paise`); `lib/money.ts` converts to/from rupees for display and forms.

## 4. Section registry deep dive

Public pages that are mostly marketing copy (home, about, mentorship-program, state-pcs, and the four legal pages) are built from an ordered list of **sections** rather than hardcoded JSX. Each `sections` row has a `type` string and a `content` JSONB blob.

`lib/sections/registry.ts` maps each `type` to `{ schema, Public component, AdminForm component }`. `components/sections/SectionRenderer.tsx` reads a page's sections, validates each `content` blob against its Zod schema, and renders the matching public component — skipping (and logging a warning for) anything that fails validation, so one bad edit can never take the whole page down.

Existing types:

| Type | Shape (see `lib/sections/types/*.ts`) |
|---|---|
| `hero` | heading, highlight_line, subheading, cta_label, cta_href, background_image |
| `about_block` | heading, body, image_url |
| `badges_strip` | badges: string[] |
| `rich_text` | heading (optional), body_markdown |
| `promo_strip` | badge_label, text, href, enabled |
| `cta_banner` | heading, body, cta_label, cta_href |
| `methodology_levels` | heading, levels: {title, body}[], why_heading, why_points: string[] |

## 5. How to add a new section type

1. `lib/sections/types/<name>.ts` — a Zod schema (give every field a `.default(...)` so `schema.parse({})` produces valid placeholder content — the "Add Section" admin flow relies on this) and the inferred TS type.
2. `components/sections/<Name>.tsx` — the public render component, props = the inferred content type.
3. `components/admin/section-forms/<Name>Form.tsx` — a client component matching the `AdminFormProps<T>` shape (`sectionId`, `pageSlug`, `siteSlug`, `initialContent`) that calls `updateSectionContent` from `lib/actions/sections.ts` on submit.
4. Register all three in `lib/sections/registry.ts`.

No page route, database migration, or `SectionRenderer`/admin page-editor change is needed — the registry is the only place a new type is wired up.

## 6. How to add a new dedicated content table

Use a dedicated table instead of a `sections` JSONB block when the admin needs to add/remove/reorder a *list* of similar items, or the public site needs to filter/sort/paginate/reference it (that's why testimonials, pricing, courses, etc. are tables and not sections).

Pattern to copy (e.g. `testimonials`):
1. Migration: new table with `site_id` FK, `position`, `is_published`/`is_active`, plus RLS: `public read published/active` (select) + `admin full access` (all, `auth.role() = 'authenticated'`) — copy the two-policy pattern from `supabase/migrations/0001_init.sql`.
2. Regenerate types: Supabase MCP `generate_typescript_types`, or `supabase gen types typescript`, into `types/database.types.ts`.
3. `lib/actions/<name>.ts` — Zod-validated `create`/`update`/`delete` Server Actions, each starting with `requireAdmin()` and ending with `revalidatePath(...)`.
4. `lib/data/public.ts` — a `get<Name>()` reader used by public pages.
5. Admin page under `app/admin/(dashboard)/<name>/page.tsx` — copy the list+inline-edit-forms pattern from `app/admin/(dashboard)/courses/page.tsx` (or the list+`/new`+`/[id]` pattern from `current-affairs` if the content needs a full-page editor).
6. Public component under `components/public/<Name>.tsx` and wire it into whichever page(s) display it.

## 7. How to add a new public page

1. Add a `pages` row (`site_id`, `slug`, `title`) — via SQL/seed script or a future admin "Pages" manager.
2. Create the route file at `app/(public)/<slug>/page.tsx`; for a section-based page it's just:
   ```tsx
   const pageData = await getPageWithSections("<slug>");
   if (!pageData) return null;
   return <SectionRenderer sections={pageData.sections} />;
   ```
3. Add a `nav_items` row (or let the admin add it under Admin → Navigation) if it should appear in the nav.
4. Add `/admin/pages/<slug>` to the `navLinks` list in `app/admin/(dashboard)/layout.tsx` so the admin can find its editor.

## 8. Branding & theming

`site_branding.primary_color` / `accent_color` are injected as CSS variables (`--brand-primary`, `--brand-accent`) on a wrapping `<div>` in `app/(public)/layout.tsx`, and exposed as Tailwind utilities (`bg-brand-primary`, `text-brand-accent`, etc.) via `@theme inline` in `app/globals.css`. Changing a client's brand colors is therefore a data edit (Admin → Branding), never a Tailwind config or component change. Logo/favicon are uploaded to the `public-assets` Storage bucket.

## 9. Standing up a brand-new client site

1. Create a new Supabase project (recommended: one project per client, for full data isolation) and apply `supabase/migrations/0001_init.sql`.
2. Copy `supabase/seed/seed-vaishnavi.ts` to `seed-<client>.ts`, change `SITE_SLUG`/`SITE_NAME`, and replace every content literal with the new client's brief.
3. Run the seed script (`SUPABASE_SERVICE_ROLE_KEY` + `NEXT_PUBLIC_SUPABASE_URL` for the *new* project in `.env.local`).
4. Create the client's admin user (§10) and upload their logo/photos under `<their-site-slug>/...` paths in Storage (already namespaced by the `pathPrefix` passed to `FileUploadField` throughout the admin pages).
5. Deploy: new Vercel project, environment variables set to the new Supabase project + `NEXT_PUBLIC_SITE_SLUG=<their-slug>`, connect their domain.
6. Smoke-test: home page renders seeded content, `/admin/login` works, editing one section/table shows up on the public site.

No component, schema, or registry change is required for a standard reuse — only for a client who needs a genuinely new section type or content table (§5, §6).

## 10. Admin user management

There is no self-serve signup route anywhere in the app (by design — single admin, no RBAC). To create or reset the admin's credentials, use the Supabase Dashboard → Authentication → Users → "Add user" (with "Auto Confirm User" checked so no email verification step is required), or "..." → "Send password recovery" to reset an existing user's password.

## 11. Enquiries & the installment-access flag

Every "Enquire Now" submission (floating button, contact page) becomes an `enquiries` row via `lib/actions/enquiry.ts`. Admin → Enquiries lets the admin update `status` and toggle `installment_access`.

The pricing page currently shows a static "Installments available — contact us" note on any plan with `supports_installments = true`, rather than gating the installment view per-visitor — the brief didn't specify a delivery mechanism for granting individual access, and there's no visitor login system to check the `installment_access` flag against. If a client later wants real per-lead gating, the recommended approach is a tokenized link the admin sends manually after approving a lead (e.g. `/pricing?access=<uuid>` mapped to an `enquiries.id`), not a full visitor-accounts system.

## 12. Image/file upload conventions

- `public-assets` bucket: logos, favicons, testimonial photos, current-affairs thumbnails, section images. Public read.
- `resources` bucket: downloadable PDFs (syllabus, notes). Public read.
- Path convention: `{site_slug}/{category}/{uuid}-{original_filename}` (see `pathPrefix` prop on every `<FileUploadField>` usage) — this is what keeps a shared bucket collision-free if a future setup serves multiple tenants from one Supabase project.
- Both buckets restrict `insert`/`update`/`delete` to `auth.role() = 'authenticated'` (see the storage policies in `supabase/migrations/0001_init.sql`).

## 13. Revalidation model

Public pages use `export const revalidate = 300` (5-minute ISR) as a safety net, plus every admin Server Action calls `revalidatePath(...)` for the specific public route(s) it affects, so edits are visible immediately rather than waiting for the ISR window. If an edit "isn't showing up," check that the action's `revalidatePath` call covers the route you're viewing.

## 14. Known limitations / roadmap

- FAQ content and mentorship pricing are seeded as placeholders — the client will finalize copy via the admin panel.
- No payment gateway integration. This build only captures leads (`enquiries`) and displays static pricing; if the client wants online payment collection later, that's a separate integration (Razorpay/Instamojo are typical for Indian coaching sites) and a decision the client should make explicitly, not something to add silently.
- `methodology_levels`' admin form is optimized for exactly 3 levels (matching the client's actual methodology) via fixed title/body fields; the stored shape is a generic array, so supporting a different level count for a future client means editing that one form's fixed field list, not the schema or public component.
