import type { BadgesStripContent } from "@/lib/sections/types/badges-strip";

export default function BadgesStrip({ badges }: BadgesStripContent) {
  if (!badges?.length) return null;

  return (
    <section className="border-y border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-6">
        {badges.map((badge) => (
          <span
            key={badge}
            className="flex items-center gap-2 text-sm font-semibold text-brand-primary sm:text-base"
          >
            <span className="h-2 w-2 rounded-full bg-brand-accent" />
            {badge}
          </span>
        ))}
      </div>
    </section>
  );
}
