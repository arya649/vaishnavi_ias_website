import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";
import { createCourse, updateCourse, deleteCourse } from "@/lib/actions/courses";
import { paiseToRupees } from "@/lib/money";
import { AdminCard, Field, inputClass, labelClass, buttonClass } from "@/components/admin/ui";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminCoursesPage() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("*")
    .eq("site_id", site.id)
    .order("track")
    .order("position");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Courses</h1>

      <AdminCard title="Add Course">
        <form action={createCourse} className="grid gap-4 sm:grid-cols-2">
          <Field label="Track" htmlFor="track">
            <select id="track" name="track" required className={inputClass}>
              <option value="classes">Classes</option>
              <option value="mentorship">Mentorship</option>
            </select>
          </Field>
          <Field label="Name" htmlFor="name">
            <input id="name" name="name" required className={inputClass} />
          </Field>
          <Field label="Duration Label" htmlFor="duration_label">
            <input id="duration_label" name="duration_label" placeholder="e.g. Up to 3 years" className={inputClass} />
          </Field>
          <Field label="Position (order)" htmlFor="position">
            <input id="position" name="position" type="number" defaultValue={0} className={inputClass} />
          </Field>
          <Field label="Price (₹)" htmlFor="price_rupees">
            <input id="price_rupees" name="price_rupees" type="number" step="0.01" className={inputClass} />
          </Field>
          <div className="flex items-center gap-2 pt-6">
            <input id="is_price_tbd" name="is_price_tbd" type="checkbox" />
            <label htmlFor="is_price_tbd" className="text-sm text-slate-700">
              Price TBD (hide price, show &quot;TBD&quot;)
            </label>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea id="description" name="description" rows={2} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className={buttonClass}>
              Add Course
            </button>
          </div>
        </form>
      </AdminCard>

      <div className="space-y-4">
        {(courses ?? []).map((course) => (
          <AdminCard
            key={course.id}
            title={`${course.name} (${course.track})`}
            action={<DeleteButton action={deleteCourse.bind(null, course.id)} />}
          >
            <form action={updateCourse.bind(null, course.id)} className="grid gap-4 sm:grid-cols-2">
              <Field label="Track" htmlFor={`track-${course.id}`}>
                <select id={`track-${course.id}`} name="track" defaultValue={course.track} required className={inputClass}>
                  <option value="classes">Classes</option>
                  <option value="mentorship">Mentorship</option>
                </select>
              </Field>
              <Field label="Name" htmlFor={`name-${course.id}`}>
                <input id={`name-${course.id}`} name="name" defaultValue={course.name} required className={inputClass} />
              </Field>
              <Field label="Duration Label" htmlFor={`duration-${course.id}`}>
                <input
                  id={`duration-${course.id}`}
                  name="duration_label"
                  defaultValue={course.duration_label ?? ""}
                  className={inputClass}
                />
              </Field>
              <Field label="Position (order)" htmlFor={`position-${course.id}`}>
                <input
                  id={`position-${course.id}`}
                  name="position"
                  type="number"
                  defaultValue={course.position}
                  className={inputClass}
                />
              </Field>
              <Field label="Price (₹)" htmlFor={`price-${course.id}`}>
                <input
                  id={`price-${course.id}`}
                  name="price_rupees"
                  type="number"
                  step="0.01"
                  defaultValue={course.price_paise != null ? paiseToRupees(course.price_paise) : undefined}
                  className={inputClass}
                />
              </Field>
              <div className="flex items-center gap-2 pt-6">
                <input
                  id={`tbd-${course.id}`}
                  name="is_price_tbd"
                  type="checkbox"
                  defaultChecked={course.is_price_tbd}
                />
                <label htmlFor={`tbd-${course.id}`} className="text-sm text-slate-700">
                  Price TBD
                </label>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={`desc-${course.id}`} className={labelClass}>
                  Description
                </label>
                <textarea
                  id={`desc-${course.id}`}
                  name="description"
                  rows={2}
                  defaultValue={course.description ?? ""}
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
