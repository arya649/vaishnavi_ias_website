import type { PromoStripContent } from "@/lib/sections/types/promo-strip";

// Rendered site-wide above the nav bar (see app/(public)/layout.tsx). The
// message repeats several times in one continuous track so the CSS loop
// (globals.css, .marquee-track) can jump seamlessly from the end back to
// the start without a visible gap.
export default function PromoStrip({ text, href, badge_label, enabled }: PromoStripContent) {
  if (!enabled) return null;

  const item = (key: number) => (
    <span key={key} className="mx-6 flex items-center gap-3 whitespace-nowrap">
      {badge_label && (
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
          {badge_label}
        </span>
      )}
      <span>{text}</span>
    </span>
  );

  // Two identical halves back to back; the animation slides exactly -50%
  // (one half's width) so the loop point is invisible regardless of how
  // long `text` is.
  return (
    <a
      href={href}
      className="block overflow-hidden bg-red-600 py-2 text-sm font-medium text-white"
    >
      <div className="marquee-track flex w-max">
        <div className="flex shrink-0">{Array.from({ length: 4 }, (_, i) => item(i))}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {Array.from({ length: 4 }, (_, i) => item(i + 4))}
        </div>
      </div>
    </a>
  );
}
