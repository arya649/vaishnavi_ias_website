import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";
import { createNavItem, updateNavItem, deleteNavItem } from "@/lib/actions/nav";
import { AdminCard, Field, inputClass, buttonClass } from "@/components/admin/ui";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminNavPage() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("nav_items")
    .select("*")
    .eq("site_id", site.id)
    .order("position");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Navigation</h1>

      <AdminCard title="Add Nav Item">
        <form action={createNavItem} className="grid gap-4 sm:grid-cols-4">
          <Field label="Label" htmlFor="label">
            <input id="label" name="label" required className={inputClass} />
          </Field>
          <Field label="Link (href)" htmlFor="href" hint="e.g. /courses">
            <input id="href" name="href" required className={inputClass} />
          </Field>
          <Field label="Position (order)" htmlFor="position">
            <input id="position" name="position" type="number" defaultValue={0} className={inputClass} />
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700">
            <input name="is_visible" type="checkbox" defaultChecked /> Visible
          </label>
          <div className="sm:col-span-4">
            <button type="submit" className={buttonClass}>
              Add Nav Item
            </button>
          </div>
        </form>
      </AdminCard>

      <AdminCard title="All Nav Items">
        <div className="space-y-4">
          {(items ?? []).map((item) => (
            <form
              key={item.id}
              action={updateNavItem.bind(null, item.id)}
              className="grid items-end gap-4 border-t border-slate-100 pt-4 first:border-0 first:pt-0 sm:grid-cols-5"
            >
              <Field label="Label" htmlFor={`label-${item.id}`}>
                <input id={`label-${item.id}`} name="label" defaultValue={item.label} required className={inputClass} />
              </Field>
              <Field label="Link" htmlFor={`href-${item.id}`}>
                <input id={`href-${item.id}`} name="href" defaultValue={item.href} required className={inputClass} />
              </Field>
              <Field label="Position" htmlFor={`pos-${item.id}`}>
                <input
                  id={`pos-${item.id}`}
                  name="position"
                  type="number"
                  defaultValue={item.position}
                  className={inputClass}
                />
              </Field>
              <label className="flex items-center gap-2 pb-2 text-sm text-slate-700">
                <input name="is_visible" type="checkbox" defaultChecked={item.is_visible} /> Visible
              </label>
              <div className="flex gap-2">
                <button type="submit" className={buttonClass}>
                  Save
                </button>
                <DeleteButton action={deleteNavItem.bind(null, item.id)} />
              </div>
            </form>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
