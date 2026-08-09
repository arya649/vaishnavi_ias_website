import { notFound } from "next/navigation";
import Markdown from "@/components/Markdown";
import { getCurrentAffairsPostBySlug } from "@/lib/data/public";

export const revalidate = 300;

export default async function CurrentAffairsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getCurrentAffairsPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-sm text-gray-500">
        {new Date(post.post_date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
      <h1 className="mt-2 text-3xl font-bold text-brand-primary">{post.title}</h1>

      {post.youtube_url && (
        <div className="mt-6 aspect-video overflow-hidden rounded-lg">
          <iframe
            className="h-full w-full"
            src={post.youtube_url.replace("watch?v=", "embed/")}
            title={post.title}
            allowFullScreen
          />
        </div>
      )}

      <div className="mt-8">
        <Markdown>{post.body_markdown}</Markdown>
      </div>
    </div>
  );
}
