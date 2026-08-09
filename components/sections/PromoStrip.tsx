import type { PromoStripContent } from "@/lib/sections/types/promo-strip";

export default function PromoStrip({ text, href, badge_label, enabled }: PromoStripContent) {
  if (!enabled) return null;

  return (
    <a
      href={href}
      className="flex flex-wrap items-center justify-center gap-3 bg-red-600 px-4 py-2.5 text-center text-sm font-medium text-white transition hover:bg-red-700"
    >
      {badge_label && (
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold">
          {badge_label}
        </span>
      )}
      <span>{text}</span>
      <span aria-hidden>→</span>
    </a>
  );
}
