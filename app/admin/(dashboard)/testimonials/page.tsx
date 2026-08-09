import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";
import { createTestimonial, updateTestimonial, deleteTestimonial } from "@/lib/actions/testimonials";
import { AdminCard, Field, inputClass, labelClass, buttonClass } from "@/components/admin/ui";
import DeleteButton from "@/components/admin/DeleteButton";
import FileUploadField from "@/components/admin/FileUploadField";

export default async function AdminTestimonialsPage() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data: testimonials } = await supabase
    .from("testimonials")
    .select("*")
    .eq("site_id", site.id)
    .order("position");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>

      <AdminCard title="Add Testimonial">
        <form action={createTestimonial} className="grid gap-4 sm:grid-cols-2">
          <Field label="Student Name" htmlFor="student_name">
            <input id="student_name" name="student_name" required className={inputClass} />
          </Field>
          <Field label="Rank / Batch" htmlFor="rank_or_batch">
            <input id="rank_or_batch" name="rank_or_batch" placeholder="e.g. AIR 245, CSE 2025" className={inputClass} />
          </Field>
          <Field label="Video URL (optional)" htmlFor="video_url">
            <input id="video_url" name="video_url" className={inputClass} />
          </Field>
          <Field label="Position (order)" htmlFor="position">
            <input id="position" name="position" type="number" defaultValue={0} className={inputClass} />
          </Field>
          <div className="sm:col-span-2">
            <FileUploadField
              name="photo_url"
              label="Photo"
              bucket="public-assets"
              pathPrefix={`${site.slug}/testimonials`}
              accept="image/*"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="quote" className={labelClass}>
              Quote
            </label>
            <textarea id="quote" name="quote" rows={3} required className={inputClass} />
          </div>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input name="is_published" type="checkbox" defaultChecked /> Published
          </label>
          <div className="sm:col-span-2">
            <button type="submit" className={buttonClass}>
              Add Testimonial
            </button>
          </div>
        </form>
      </AdminCard>

      <div className="space-y-4">
        {(testimonials ?? []).map((t) => (
          <AdminCard
            key={t.id}
            title={t.student_name}
            action={<DeleteButton action={deleteTestimonial.bind(null, t.id)} />}
          >
            <form action={updateTestimonial.bind(null, t.id)} className="grid gap-4 sm:grid-cols-2">
              <Field label="Student Name" htmlFor={`name-${t.id}`}>
                <input id={`name-${t.id}`} name="student_name" defaultValue={t.student_name} required className={inputClass} />
              </Field>
              <Field label="Rank / Batch" htmlFor={`rank-${t.id}`}>
                <input id={`rank-${t.id}`} name="rank_or_batch" defaultValue={t.rank_or_batch ?? ""} className={inputClass} />
              </Field>
              <Field label="Video URL" htmlFor={`video-${t.id}`}>
                <input id={`video-${t.id}`} name="video_url" defaultValue={t.video_url ?? ""} className={inputClass} />
              </Field>
              <Field label="Position (order)" htmlFor={`position-${t.id}`}>
                <input
                  id={`position-${t.id}`}
                  name="position"
                  type="number"
                  defaultValue={t.position}
                  className={inputClass}
                />
              </Field>
              <div className="sm:col-span-2">
                <FileUploadField
                  name="photo_url"
                  label="Photo"
                  bucket="public-assets"
                  pathPrefix={`${site.slug}/testimonials`}
                  initialUrl={t.photo_url}
                  accept="image/*"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={`quote-${t.id}`} className={labelClass}>
                  Quote
                </label>
                <textarea id={`quote-${t.id}`} name="quote" rows={3} defaultValue={t.quote} required className={inputClass} />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-700">
                <input name="is_published" type="checkbox" defaultChecked={t.is_published} /> Published
              </label>
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
