import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";
import { createPricingPlan, updatePricingPlan, deletePricingPlan } from "@/lib/actions/pricing";
import { paiseToRupees } from "@/lib/money";
import { AdminCard, Field, inputClass, labelClass, buttonClass } from "@/components/admin/ui";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminPricingPage() {
  const { site } = await getCurrentSite();
  const supabase = await createClient();
  const { data: plans } = await supabase
    .from("pricing_plans")
    .select("*")
    .eq("site_id", site.id)
    .order("category")
    .order("position");

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-slate-900">Pricing Plans</h1>

      <AdminCard title="Add Plan">
        <form action={createPricingPlan} className="grid gap-4 sm:grid-cols-2">
          <Field label="Category" htmlFor="category">
            <select id="category" name="category" required className={inputClass}>
              <option value="test_series">Test Series</option>
              <option value="classes">Classes</option>
              <option value="mentorship">Mentorship</option>
            </select>
          </Field>
          <Field label="Name" htmlFor="name">
            <input id="name" name="name" required className={inputClass} />
          </Field>
          <Field label="Unit Label" htmlFor="unit_label" hint="e.g. per chapter, per subject">
            <input id="unit_label" name="unit_label" className={inputClass} />
          </Field>
          <Field label="Position (order)" htmlFor="position">
            <input id="position" name="position" type="number" defaultValue={0} className={inputClass} />
          </Field>
          <Field label="Price (₹)" htmlFor="price_rupees">
            <input id="price_rupees" name="price_rupees" type="number" step="0.01" className={inputClass} />
          </Field>
          <div className="flex flex-col justify-center gap-2 pt-5">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input name="is_price_tbd" type="checkbox" /> Price TBD
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input name="supports_installments" type="checkbox" /> Installments available
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
              Add Plan
            </button>
          </div>
        </form>
      </AdminCard>

      <div className="space-y-4">
        {(plans ?? []).map((plan) => (
          <AdminCard
            key={plan.id}
            title={`${plan.name} (${plan.category})`}
            action={<DeleteButton action={deletePricingPlan.bind(null, plan.id)} />}
          >
            <form action={updatePricingPlan.bind(null, plan.id)} className="grid gap-4 sm:grid-cols-2">
              <Field label="Category" htmlFor={`category-${plan.id}`}>
                <select
                  id={`category-${plan.id}`}
                  name="category"
                  defaultValue={plan.category}
                  required
                  className={inputClass}
                >
                  <option value="test_series">Test Series</option>
                  <option value="classes">Classes</option>
                  <option value="mentorship">Mentorship</option>
                </select>
              </Field>
              <Field label="Name" htmlFor={`name-${plan.id}`}>
                <input id={`name-${plan.id}`} name="name" defaultValue={plan.name} required className={inputClass} />
              </Field>
              <Field label="Unit Label" htmlFor={`unit-${plan.id}`}>
                <input
                  id={`unit-${plan.id}`}
                  name="unit_label"
                  defaultValue={plan.unit_label ?? ""}
                  className={inputClass}
                />
              </Field>
              <Field label="Position (order)" htmlFor={`position-${plan.id}`}>
                <input
                  id={`position-${plan.id}`}
                  name="position"
                  type="number"
                  defaultValue={plan.position}
                  className={inputClass}
                />
              </Field>
              <Field label="Price (₹)" htmlFor={`price-${plan.id}`}>
                <input
                  id={`price-${plan.id}`}
                  name="price_rupees"
                  type="number"
                  step="0.01"
                  defaultValue={plan.price_paise != null ? paiseToRupees(plan.price_paise) : undefined}
                  className={inputClass}
                />
              </Field>
              <div className="flex flex-col justify-center gap-2 pt-5">
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input name="is_price_tbd" type="checkbox" defaultChecked={plan.is_price_tbd} /> Price TBD
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    name="supports_installments"
                    type="checkbox"
                    defaultChecked={plan.supports_installments}
                  />{" "}
                  Installments available
                </label>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor={`desc-${plan.id}`} className={labelClass}>
                  Description
                </label>
                <textarea
                  id={`desc-${plan.id}`}
                  name="description"
                  rows={2}
                  defaultValue={plan.description ?? ""}
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
