import Link from "next/link";
import type { Tables } from "@/types/database.types";

type Post = Tables<"current_affairs_posts">;

export default function CurrentAffairsList({ posts }: { posts: Post[] }) {
  if (!posts.length) {
    return <p className="text-sm text-gray-500">No current affairs posts yet.</p>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts
        .sort((a, b) => (a.post_date < b.post_date ? 1 : -1))
        .map((post) => (
          <Link
            key={post.id}
            href={`/current-affairs/${post.slug}`}
            className="block overflow-hidden rounded-lg border border-gray-200 shadow-sm transition hover:shadow-md"
          >
            {post.thumbnail_url && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.thumbnail_url}
                alt={post.title}
                className="h-40 w-full object-cover"
              />
            )}
            <div className="p-4">
              <p className="text-xs text-gray-500">
                {new Date(post.post_date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
              <h3 className="mt-1 font-semibold text-brand-primary">{post.title}</h3>
              {post.youtube_url && (
                <span className="mt-2 inline-block text-xs font-medium text-red-600">
                  ▶ Video available
                </span>
              )}
            </div>
          </Link>
        ))}
    </div>
  );
}
