import type { MethodologyLevelsContent } from "@/lib/sections/types/methodology-levels";

export default function MethodologyLevels({
  heading,
  levels,
  why_heading,
  why_points,
}: MethodologyLevelsContent) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      {heading && (
        <h2 className="text-center text-2xl font-bold text-brand-primary sm:text-3xl">
          {heading}
        </h2>
      )}

      {levels?.length > 0 && (
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {levels.map((level, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-6 shadow-sm">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-brand-primary text-sm font-bold text-white">
                {i + 1}
              </div>
              <h3 className="font-semibold text-brand-primary">{level.title}</h3>
              <p className="mt-2 text-sm text-gray-600">{level.body}</p>
            </div>
          ))}
        </div>
      )}

      {why_points?.length > 0 && (
        <div className="mt-14">
          {why_heading && (
            <h3 className="text-center text-xl font-bold text-brand-primary">{why_heading}</h3>
          )}
          <ul className="mx-auto mt-6 grid max-w-3xl gap-3 sm:grid-cols-2">
            {why_points.map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="mt-1 text-brand-accent">✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
