import CurrentAffairsList from "@/components/public/CurrentAffairsList";
import { getCurrentAffairsPosts } from "@/lib/data/public";

export const revalidate = 300;

export default async function CurrentAffairsPage() {
  const posts = await getCurrentAffairsPosts();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-brand-primary">Current Affairs</h1>
      <div className="mt-8">
        <CurrentAffairsList posts={posts} />
      </div>
    </div>
  );
}
