import Link from "next/link";
import type { Tables } from "@/types/database.types";

type Category = Tables<"test_series_categories">;

export default function TestSeriesCategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/test-series/${category.slug}`}
      className="block rounded-lg border border-gray-200 p-6 shadow-sm transition hover:shadow-md"
    >
      <h3 className="text-lg font-bold text-brand-primary">{category.name}</h3>
      {category.summary && <p className="mt-2 text-sm text-gray-700">{category.summary}</p>}
      <span className="mt-4 inline-block text-sm font-medium text-brand-accent">
        View details →
      </span>
    </Link>
  );
}
