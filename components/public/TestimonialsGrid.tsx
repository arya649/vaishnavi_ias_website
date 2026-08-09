import type { Tables } from "@/types/database.types";

type Testimonial = Tables<"testimonials">;

export default function TestimonialsGrid({ testimonials }: { testimonials: Testimonial[] }) {
  if (!testimonials.length) {
    return <p className="text-sm text-gray-500">Testimonials coming soon.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {testimonials
        .sort((a, b) => a.position - b.position)
        .map((t) => (
          <div key={t.id} className="rounded-lg border border-gray-200 p-5 shadow-sm">
            <p className="text-sm text-gray-700">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-4 flex items-center gap-3">
              {t.photo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={t.photo_url}
                  alt={t.student_name}
                  className="h-10 w-10 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                  {t.student_name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-semibold text-gray-900">{t.student_name}</p>
                {t.rank_or_batch && (
                  <p className="text-xs text-gray-500">{t.rank_or_batch}</p>
                )}
              </div>
            </div>
            {t.video_url && (
              <a
                href={t.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block text-xs font-medium text-brand-primary hover:underline"
              >
                Watch video →
              </a>
            )}
          </div>
        ))}
    </div>
  );
}
