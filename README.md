# Vaishnavi IAS Academy Website

Public marketing site + admin CMS for Vaishnavi IAS Academy, built with Next.js (App Router, TypeScript) and Supabase (Postgres, Auth, Storage). The codebase is structured to be reused for other coaching-center clients — see [docs/CMS-AND-REUSE-GUIDE.md](docs/CMS-AND-REUSE-GUIDE.md) for the content model, how to extend the admin CMS, and how to stand up a new client site.

## Local development

1. `npm install`
2. Copy `.env.example` to `.env.local` and fill in the Supabase project URL/anon key (and, only if you need to run the seed script, the service role key).
3. `npm run dev` — the site runs at http://localhost:3000, the admin panel at http://localhost:3000/admin/login.

## Deployment

Deploy on [Vercel](https://vercel.com/new) — connect this GitHub repository and set the same environment variables from `.env.local` in the Vercel project settings.

## Admin access

Create the admin user via the Supabase Dashboard → Authentication → Users → "Add user" (check "Auto Confirm User"). There is no self-serve signup route.
