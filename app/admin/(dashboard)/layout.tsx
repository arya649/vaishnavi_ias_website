import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { logout } from "@/lib/actions/auth";

const navLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/branding", label: "Branding" },
  { href: "/admin/nav", label: "Navigation" },
  { href: "/admin/pages/home", label: "Home Page" },
  { href: "/admin/pages/about", label: "About Page" },
  { href: "/admin/pages/mentorship-program", label: "Mentorship Page" },
  { href: "/admin/pages/state-pcs", label: "State PCS Page" },
  { href: "/admin/pages/privacy-policy", label: "Privacy Policy" },
  { href: "/admin/pages/terms-and-conditions", label: "Terms & Conditions" },
  { href: "/admin/pages/refund-and-cancellation", label: "Refund & Cancellation" },
  { href: "/admin/pages/careers", label: "Careers" },
  { href: "/admin/courses", label: "Courses" },
  { href: "/admin/test-series", label: "Test Series Categories" },
  { href: "/admin/pricing", label: "Pricing Plans" },
  { href: "/admin/testimonials", label: "Testimonials" },
  { href: "/admin/current-affairs", label: "Current Affairs" },
  { href: "/admin/faq", label: "FAQ" },
  { href: "/admin/resources", label: "Resources" },
  { href: "/admin/enquiries", label: "Enquiries" },
];

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  // Defense in depth: proxy.ts already redirects unauthenticated requests to
  // /admin/*, but Server Actions can be invoked directly, so every protected
  // layout/action re-checks. See docs/CMS-AND-REUSE-GUIDE.md, "Admin auth".
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="w-64 shrink-0 border-r border-slate-200 bg-white">
        <div className="border-b border-slate-200 px-5 py-4">
          <p className="font-bold text-slate-900">Admin</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
        </div>
        <nav className="flex flex-col gap-0.5 p-3 text-sm">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded px-3 py-2 text-slate-700 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
          <form action={logout} className="mt-2 border-t border-slate-200 pt-2">
            <button
              type="submit"
              className="w-full rounded px-3 py-2 text-left text-red-600 hover:bg-red-50"
            >
              Log Out
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
