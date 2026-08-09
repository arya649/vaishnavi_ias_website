import TestSeriesCategoryCard from "@/components/public/TestSeriesCategoryCard";
import { getTestSeriesCategories } from "@/lib/data/public";

export const revalidate = 300;

export default async function TestSeriesPage() {
  const categories = await getTestSeriesCategories();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-brand-primary">Test Series</h1>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <TestSeriesCategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
