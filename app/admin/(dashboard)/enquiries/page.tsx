import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";
import { updateEnquiry, deleteEnquiry } from "@/lib/actions/enquiries";
import { AdminCard, inputClass, buttonClass } from "@/components/admin/ui";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminEnquiriesPage() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data: enquiries } = await supabase
    .from("enquiries")
    .select("*")
    .eq("site_id", site.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Enquiries</h1>

      <AdminCard title="All Enquiries">
        {(!enquiries || enquiries.length === 0) && (
          <p className="text-sm text-slate-500">No enquiries yet.</p>
        )}
        <div className="space-y-4">
          {(enquiries ?? []).map((enquiry) => (
            <form
              key={enquiry.id}
              action={updateEnquiry.bind(null, enquiry.id)}
              className="grid items-center gap-4 border-t border-slate-100 pt-4 first:border-0 first:pt-0 sm:grid-cols-6"
            >
              <div className="sm:col-span-2">
                <p className="font-medium text-slate-900">{enquiry.name}</p>
                <p className="text-xs text-slate-500">
                  {enquiry.phone} {enquiry.email ? `· ${enquiry.email}` : ""}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {enquiry.interested_in || enquiry.message || "—"}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(enquiry.created_at).toLocaleString("en-IN")} · from {enquiry.source_page || "—"}
                </p>
              </div>
              <select name="status" defaultValue={enquiry.status} className={inputClass}>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input name="installment_access" type="checkbox" defaultChecked={enquiry.installment_access} />
                Installment access
              </label>
              <div className="flex gap-2">
                <button type="submit" className={buttonClass}>
                  Save
                </button>
                <DeleteButton action={deleteEnquiry.bind(null, enquiry.id)} />
              </div>
            </form>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
