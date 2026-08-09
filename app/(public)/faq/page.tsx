import FAQAccordion from "@/components/public/FAQAccordion";
import { getFaqItems } from "@/lib/data/public";

export const revalidate = 300;

export default async function FaqPage() {
  const items = await getFaqItems();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-brand-primary">Frequently Asked Questions</h1>
      <div className="mt-8">
        <FAQAccordion items={items} />
      </div>
    </div>
  );
}
