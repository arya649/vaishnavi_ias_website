import TestimonialsGrid from "@/components/public/TestimonialsGrid";
import { getTestimonials } from "@/lib/data/public";

export const revalidate = 300;

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-brand-primary">Testimonials</h1>
      <div className="mt-8">
        <TestimonialsGrid testimonials={testimonials} />
      </div>
    </div>
  );
}
