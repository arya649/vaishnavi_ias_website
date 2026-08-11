import type { BadgesStripContent } from "@/lib/sections/types/badges-strip";

// The first badge is treated as the flagship claim and rendered as a real
// subheading (not just a small pill) — admin controls which one leads simply
// by ordering the `badges` list. Remaining badges render as a smaller
// supporting strip underneath.
export default function BadgesStrip({ badges }: BadgesStripContent) {
  if (!badges?.length) return null;

  const [featured, ...rest] = badges;

  return (
    <section className="border-y border-gray-200 bg-gray-50 px-6 py-8 text-center">
      <h2 className="mx-auto flex max-w-3xl items-center justify-center gap-2 text-xl font-bold text-brand-primary sm:text-2xl">
        <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-brand-accent" />
        {featured}
      </h2>

      {rest.length > 0 && (
        <div className="mx-auto mt-4 flex max-w-4xl flex-wrap items-center justify-center gap-x-8 gap-y-2">
          {rest.map((badge) => (
            <span
              key={badge}
              className="flex items-center gap-2 text-sm font-medium text-gray-600"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-brand-accent/70" />
              {badge}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
