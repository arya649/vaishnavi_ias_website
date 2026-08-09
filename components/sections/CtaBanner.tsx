import type { CtaBannerContent } from "@/lib/sections/types/cta-banner";

export default function CtaBanner({ heading, body, cta_label, cta_href }: CtaBannerContent) {
  return (
    <section className="bg-brand-accent/10">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 px-6 py-14 text-center">
        <h2 className="text-2xl font-bold text-brand-primary sm:text-3xl">{heading}</h2>
        {body && <p className="max-w-2xl text-gray-700">{body}</p>}
        <a
          href={cta_href}
          className="mt-2 inline-block rounded-md bg-brand-primary px-8 py-3 text-sm font-semibold text-white transition hover:opacity-90 sm:text-base"
        >
          {cta_label}
        </a>
      </div>
    </section>
  );
}
