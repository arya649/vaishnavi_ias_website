import type { AboutBlockContent } from "@/lib/sections/types/about-block";

export default function AboutBlock({ heading, body, image_url }: AboutBlockContent) {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className={`grid gap-10 ${image_url ? "items-center md:grid-cols-2" : ""}`}>
        <div>
          <h2 className="text-2xl font-bold text-brand-primary sm:text-3xl">{heading}</h2>
          <p className="mt-4 whitespace-pre-line text-gray-700">{body}</p>
        </div>
        {image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image_url}
            alt={heading}
            className="w-full rounded-lg object-cover shadow-md"
          />
        )}
      </div>
    </section>
  );
}
