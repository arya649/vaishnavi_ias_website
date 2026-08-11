"use client";

import { useState } from "react";
import Link from "next/link";
import type { Tables } from "@/types/database.types";

type NavItem = Tables<"nav_items">;

export default function NavBar({
  navItems,
  siteName,
  logoUrl,
}: {
  navItems: NavItem[];
  siteName: string;
  logoUrl: string | null;
}) {
  const [open, setOpen] = useState(false);
  const topLevel = navItems.filter((n) => !n.parent_id).sort((a, b) => a.position - b.position);

  return (
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="flex items-center gap-3 py-1">
          {logoUrl && (
            // The logo artwork bakes the wordmark into the image itself, which
            // gets illegible at nav-bar height; the text label alongside it
            // (below) is what stays crisp and readable regardless of scale.
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={siteName} className="h-20 w-auto sm:h-24" />
          )}
          <span className="text-xl font-bold leading-tight text-brand-primary sm:text-2xl">
            {siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {topLevel.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-sm font-medium text-gray-700 transition hover:text-brand-primary"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-md bg-brand-primary px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Enquire Now
          </Link>
        </nav>

        <button
          className="md:hidden"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block h-0.5 w-6 bg-brand-primary" />
          <span className="mt-1.5 block h-0.5 w-6 bg-brand-primary" />
          <span className="mt-1.5 block h-0.5 w-6 bg-brand-primary" />
        </button>
      </div>

      {open && (
        <nav className="flex flex-col gap-1 border-t border-gray-200 bg-white px-6 py-4 md:hidden">
          {topLevel.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded px-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-2 rounded-md bg-brand-primary px-4 py-2 text-center text-sm font-semibold text-white"
          >
            Enquire Now
          </Link>
        </nav>
      )}
    </header>
  );
}
