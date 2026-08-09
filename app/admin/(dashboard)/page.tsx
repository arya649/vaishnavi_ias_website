import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";

export default async function AdminDashboardPage() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();

  const { data: recentEnquiries } = await supabase
    .from("enquiries")
    .select("*")
    .eq("site_id", site.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-1 text-sm text-slate-500">Site: {site.name}</p>

      <div className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Recent Enquiries</h2>
          <Link href="/admin/enquiries" className="text-sm text-slate-500 hover:underline">
            View all →
          </Link>
        </div>
        {!recentEnquiries || recentEnquiries.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">No enquiries yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {recentEnquiries.map((e) => (
              <li key={e.id} className="py-3 text-sm">
                <p className="font-medium text-slate-900">
                  {e.name} · {e.phone}
                </p>
                <p className="text-slate-500">{e.interested_in || e.message || "—"}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
