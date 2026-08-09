import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import { getTestSeriesCategoryBySlug } from "@/lib/data/public";

export const revalidate = 300;

export default async function TestSeriesDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await getTestSeriesCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-brand-primary">{category.name}</h1>
      {category.summary && <p className="mt-3 text-gray-600">{category.summary}</p>}
      {category.details_markdown && (
        <div className="mt-8">
          <Markdown>{category.details_markdown}</Markdown>
        </div>
      )}
    </div>
  );
}
