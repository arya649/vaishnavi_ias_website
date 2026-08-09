import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";
import {
  createTestSeriesCategory,
  updateTestSeriesCategory,
  deleteTestSeriesCategory,
} from "@/lib/actions/test-series";
import { AdminCard, Field, inputClass, labelClass, buttonClass } from "@/components/admin/ui";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminTestSeriesPage() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data: categories } = await supabase
    .from("test_series_categories")
    .select("*")
    .eq("site_id", site.id)
    .order("position");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Test Series Categories</h1>

      <AdminCard title="Add Category">
        <form action={createTestSeriesCategory} className="grid gap-4 sm:grid-cols-2">
          <Field label="Name" htmlFor="name">
            <input id="name" name="name" required className={inputClass} />
          </Field>
          <Field label="Slug (URL)" htmlFor="slug" hint="e.g. upsc, kpsc-kea, banking">
            <input id="slug" name="slug" required className={inputClass} />
          </Field>
          <Field label="Position (order)" htmlFor="position">
            <input id="position" name="position" type="number" defaultValue={0} className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <label htmlFor="summary" className={labelClass}>
              Summary
            </label>
            <textarea id="summary" name="summary" rows={2} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="details_markdown" className={labelClass}>
              Details (Markdown, shown on the category&apos;s detail page)
            </label>
            <textarea id="details_markdown" name="details_markdown" rows={5} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className={buttonClass}>
              Add Category
            </button>
          </div>
        </form>
      </AdminCard>

      <div className="space-y-4">
        {(categories ?? []).map((category) => (
          <AdminCard
            key={category.id}
            title={category.name}
            action={<DeleteButton action={deleteTestSeriesCategory.bind(null, category.id)} />}
          >
            <form
              action={updateTestSeriesCategory.bind(null, category.id)}
              className="grid gap-4 sm:grid-cols-2"
            >
              <Field label="Name" htmlFor={`name-${category.id}`}>
                <input
                  id={`name-${category.id}`}
                  name="name"
                  defaultValue={category.name}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Slug (URL)" htmlFor={`slug-${category.id}`}>
                <input
                  id={`slug-${category.id}`}
                  name="slug"
                  defaultValue={category.slug}
                  required
                  className={inputClass}
                />
              </Field>
              <Field label="Position (order)" htmlFor={`position-${category.id}`}>
                <input
                  id={`position-${category.id}`}
                  name="position"
                  type="number"
                  defaultValue={category.position}
                  className={inputClass}
                />
              </Field>
              <div className="sm:col-span-2">
                <label htmlFor={`summary-${category.id}`} className={labelClass}>
                  Summary
                </label>
                <textarea
                  id={`summary-${category.id}`}
                  name="summary"
                  rows={2}
                  defaultValue={category.summary ?? ""}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={`details-${category.id}`} className={labelClass}>
                  Details (Markdown)
                </label>
                <textarea
                  id={`details-${category.id}`}
                  name="details_markdown"
                  rows={5}
                  defaultValue={category.details_markdown ?? ""}
                  className={inputClass}
                />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className={buttonClass}>
                  Save
                </button>
              </div>
            </form>
          </AdminCard>
        ))}
      </div>
    </div>
  );
}
