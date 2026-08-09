import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";
import { createFaqItem, updateFaqItem, deleteFaqItem } from "@/lib/actions/faq";
import { AdminCard, Field, inputClass, labelClass, buttonClass } from "@/components/admin/ui";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminFaqPage() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("faq_items")
    .select("*")
    .eq("site_id", site.id)
    .order("position");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">FAQ</h1>

      <AdminCard title="Add FAQ Item">
        <form action={createFaqItem} className="grid gap-4 sm:grid-cols-2">
          <Field label="Question" htmlFor="question">
            <input id="question" name="question" required className={inputClass} />
          </Field>
          <Field label="Category (optional)" htmlFor="category">
            <input id="category" name="category" className={inputClass} />
          </Field>
          <Field label="Position (order)" htmlFor="position">
            <input id="position" name="position" type="number" defaultValue={0} className={inputClass} />
          </Field>
          <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700">
            <input name="is_published" type="checkbox" defaultChecked /> Published
          </label>
          <div className="sm:col-span-2">
            <label htmlFor="answer_markdown" className={labelClass}>
              Answer (Markdown)
            </label>
            <textarea id="answer_markdown" name="answer_markdown" rows={4} required className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className={buttonClass}>
              Add FAQ Item
            </button>
          </div>
        </form>
      </AdminCard>

      <div className="space-y-4">
        {(items ?? []).map((item) => (
          <AdminCard
            key={item.id}
            title={item.question}
            action={<DeleteButton action={deleteFaqItem.bind(null, item.id)} />}
          >
            <form action={updateFaqItem.bind(null, item.id)} className="grid gap-4 sm:grid-cols-2">
              <Field label="Question" htmlFor={`q-${item.id}`}>
                <input id={`q-${item.id}`} name="question" defaultValue={item.question} required className={inputClass} />
              </Field>
              <Field label="Category" htmlFor={`cat-${item.id}`}>
                <input id={`cat-${item.id}`} name="category" defaultValue={item.category ?? ""} className={inputClass} />
              </Field>
              <Field label="Position (order)" htmlFor={`pos-${item.id}`}>
                <input
                  id={`pos-${item.id}`}
                  name="position"
                  type="number"
                  defaultValue={item.position}
                  className={inputClass}
                />
              </Field>
              <label className="flex items-center gap-2 self-end pb-2 text-sm text-slate-700">
                <input name="is_published" type="checkbox" defaultChecked={item.is_published} /> Published
              </label>
              <div className="sm:col-span-2">
                <label htmlFor={`a-${item.id}`} className={labelClass}>
                  Answer (Markdown)
                </label>
                <textarea
                  id={`a-${item.id}`}
                  name="answer_markdown"
                  rows={4}
                  defaultValue={item.answer_markdown}
                  required
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
