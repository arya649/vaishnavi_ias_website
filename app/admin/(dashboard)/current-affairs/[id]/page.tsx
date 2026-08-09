import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";
import { updateCurrentAffairsPost } from "@/lib/actions/current-affairs";
import { AdminCard } from "@/components/admin/ui";
import CurrentAffairsForm from "@/components/admin/CurrentAffairsForm";

export default async function EditCurrentAffairsPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("current_affairs_posts")
    .select("*")
    .eq("id", id)
    .single();

  if (!post) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Edit Post</h1>
      <AdminCard title={post.title}>
        <CurrentAffairsForm action={updateCurrentAffairsPost.bind(null, id)} siteSlug={site.slug} post={post} />
      </AdminCard>
    </div>
  );
}
