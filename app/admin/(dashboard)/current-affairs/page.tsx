import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";
import { deleteCurrentAffairsPost } from "@/lib/actions/current-affairs";
import { AdminCard, buttonClass } from "@/components/admin/ui";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminCurrentAffairsPage() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("current_affairs_posts")
    .select("*")
    .eq("site_id", site.id)
    .order("post_date", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Current Affairs</h1>
        <Link href="/admin/current-affairs/new" className={buttonClass}>
          + New Post
        </Link>
      </div>

      <AdminCard title="All Posts">
        {(!posts || posts.length === 0) && <p className="text-sm text-slate-500">No posts yet.</p>}
        <ul className="divide-y divide-slate-100">
          {(posts ?? []).map((post) => (
            <li key={post.id} className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-slate-900">{post.title}</p>
                <p className="text-xs text-slate-500">
                  {post.post_date} · {post.is_published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/current-affairs/${post.id}`}
                  className="text-sm font-medium text-slate-600 hover:underline"
                >
                  Edit
                </Link>
                <DeleteButton action={deleteCurrentAffairsPost.bind(null, post.id)} />
              </div>
            </li>
          ))}
        </ul>
      </AdminCard>
    </div>
  );
}
