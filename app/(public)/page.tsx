import SectionRenderer from "@/components/sections/SectionRenderer";
import TestimonialsGrid from "@/components/public/TestimonialsGrid";
import CurrentAffairsList from "@/components/public/CurrentAffairsList";
import {
  getPageWithSections,
  getTestimonials,
  getCurrentAffairsPosts,
} from "@/lib/data/public";

export const revalidate = 300;

export default async function HomePage() {
  const [pageData, testimonials, currentAffairs] = await Promise.all([
    getPageWithSections("home"),
    getTestimonials(),
    getCurrentAffairsPosts(),
  ]);

  // promo_strip is rendered site-wide above the nav bar (see
  // app/(public)/layout.tsx) even though it's still edited here as a Home
  // page section, so it's excluded from the normal in-page flow.
  const sections = pageData?.sections.filter((s) => s.type !== "promo_strip") ?? [];

  return (
    <>
      {pageData && <SectionRenderer sections={sections} />}

      <section className="mx-auto max-w-5xl px-6 py-16">
        <h2 className="text-2xl font-bold text-brand-primary sm:text-3xl">Testimonials</h2>
        <div className="mt-6">
          <TestimonialsGrid testimonials={testimonials.slice(0, 3)} />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 pb-16">
        <h2 className="text-2xl font-bold text-brand-primary sm:text-3xl">Current Affairs</h2>
        <div className="mt-6">
          <CurrentAffairsList posts={currentAffairs.slice(0, 3)} />
        </div>
      </section>
    </>
  );
}
