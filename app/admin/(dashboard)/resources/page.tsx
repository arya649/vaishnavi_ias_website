import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";
import { createResource, updateResource, deleteResource } from "@/lib/actions/resources";
import { AdminCard, Field, inputClass, buttonClass } from "@/components/admin/ui";
import DeleteButton from "@/components/admin/DeleteButton";
import FileUploadField from "@/components/admin/FileUploadField";

export default async function AdminResourcesPage() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("*")
    .eq("site_id", site.id)
    .order("position");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Resources</h1>

      <AdminCard title="Add Resource">
        <form action={createResource} className="grid gap-4 sm:grid-cols-2">
          <Field label="Title" htmlFor="title">
            <input id="title" name="title" required className={inputClass} />
          </Field>
          <Field label="Category (optional)" htmlFor="category" hint="e.g. syllabus, notes">
            <input id="category" name="category" className={inputClass} />
          </Field>
          <Field label="Position (order)" htmlFor="position">
            <input id="position" name="position" type="number" defaultValue={0} className={inputClass} />
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700">
            <input name="is_published" type="checkbox" defaultChecked /> Published
          </label>
          <div className="sm:col-span-2">
            <FileUploadField
              name="file_url"
              label="File (PDF)"
              bucket="resources"
              pathPrefix={`${site.slug}/resources`}
              accept="application/pdf"
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className={buttonClass}>
              Add Resource
            </button>
          </div>
        </form>
      </AdminCard>

      <AdminCard title="All Resources">
        {(!resources || resources.length === 0) && (
          <p className="text-sm text-slate-500">No resources yet.</p>
        )}
        <div className="space-y-6">
          {(resources ?? []).map((resource) => (
            <form
              key={resource.id}
              action={updateResource.bind(null, resource.id)}
              className="grid gap-4 border-t border-slate-100 pt-4 first:border-0 first:pt-0 sm:grid-cols-2"
            >
              <Field label="Title" htmlFor={`title-${resource.id}`}>
                <input
                  id={`title-${resource.id}`}
                  name="title"
                  defaultValue={resource.title}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Category" htmlFor={`cat-${resource.id}`}>
                <input
                  id={`cat-${resource.id}`}
                  name="category"
                  defaultValue={resource.category ?? ""}
                  className={inputClass}
                />
              </Field>
              <Field label="Position (order)" htmlFor={`pos-${resource.id}`}>
                <input
                  id={`pos-${resource.id}`}
                  name="position"
                  type="number"
                  defaultValue={resource.position}
                  className={inputClass}
                />
              </Field>
              <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700">
                <input name="is_published" type="checkbox" defaultChecked={resource.is_published} /> Published
              </label>
              <div className="sm:col-span-2">
                <FileUploadField
                  name="file_url"
                  label="File (PDF)"
                  bucket="resources"
                  pathPrefix={`${site.slug}/resources`}
                  initialUrl={resource.file_url}
                  accept="application/pdf"
                />
              </div>
              <div className="flex gap-2 sm:col-span-2">
                <button type="submit" className={buttonClass}>
                  Save
                </button>
                <DeleteButton action={deleteResource.bind(null, resource.id)} />
              </div>
            </form>
          ))}
        </div>
      </AdminCard>
    </div>
  );
}
