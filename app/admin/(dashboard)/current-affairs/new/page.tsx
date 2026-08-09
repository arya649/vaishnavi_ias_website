import { getCurrentSite } from "@/lib/config/site";
import { createCurrentAffairsPost } from "@/lib/actions/current-affairs";
import { AdminCard } from "@/components/admin/ui";
import CurrentAffairsForm from "@/components/admin/CurrentAffairsForm";

export default async function NewCurrentAffairsPostPage() {
  const { site } = await getCurrentSite();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">New Current Affairs Post</h1>
      <AdminCard title="Post Details">
        <CurrentAffairsForm action={createCurrentAffairsPost} siteSlug={site.slug} />
      </AdminCard>
    </div>
  );
}
