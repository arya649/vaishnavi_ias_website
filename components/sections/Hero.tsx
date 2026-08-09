import type { HeroContent } from "@/lib/sections/types/hero";

export default function Hero(content: HeroContent) {
  const { heading, highlight_line, subheading, cta_label, cta_href, background_image } = content;

  return (
    <section
      className="relative overflow-hidden bg-brand-primary text-white"
      style={
        background_image
          ? {
              backgroundImage: `linear-gradient(to bottom, rgba(11,31,77,0.88), rgba(11,31,77,0.94)), url(${background_image})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }
          : undefined
      }
    >
      <div className="mx-auto max-w-5xl px-6 py-20 text-center sm:py-28">
        <h1 className="text-3xl font-bold leading-tight sm:text-5xl">{heading}</h1>
        {subheading && (
          <p className="mx-auto mt-5 max-w-3xl text-base text-white/85 sm:text-lg">
            {subheading}
          </p>
        )}
        {highlight_line && (
          <p className="mx-auto mt-6 inline-block rounded-full bg-brand-accent/20 px-5 py-2 text-sm font-semibold text-brand-accent sm:text-base">
            {highlight_line}
          </p>
        )}
        {cta_label && (
          <div className="mt-8">
            <a
              href={cta_href}
              className="inline-block rounded-md bg-brand-accent px-8 py-3 text-sm font-semibold text-brand-primary transition hover:opacity-90 sm:text-base"
            >
              {cta_label}
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
