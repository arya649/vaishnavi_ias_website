import type { Tables } from "@/types/database.types";
import { formatPaise } from "@/lib/money";

type PricingPlan = Tables<"pricing_plans">;

const categoryLabels: Record<string, string> = {
  test_series: "Test Series",
  classes: "Classes",
  mentorship: "Mentorship",
};

export default function PricingTable({ plans }: { plans: PricingPlan[] }) {
  const categories = Array.from(new Set(plans.map((p) => p.category)));

  return (
    <div className="space-y-12">
      {categories.map((category) => {
        const items = plans
          .filter((p) => p.category === category)
          .sort((a, b) => a.position - b.position);

        return (
          <div key={category}>
            <h3 className="text-xl font-bold text-brand-primary">
              {categoryLabels[category] ?? category}
            </h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((plan) => (
                <div
                  key={plan.id}
                  className="flex flex-col justify-between rounded-lg border border-gray-200 p-5 shadow-sm"
                >
                  <div>
                    <h4 className="font-semibold text-gray-900">{plan.name}</h4>
                    {plan.description && (
                      <p className="mt-1 text-sm text-gray-600">{plan.description}</p>
                    )}
                  </div>
                  <div className="mt-4 flex items-end justify-between">
                    <span className="text-2xl font-bold text-brand-primary">
                      {plan.is_price_tbd ? "TBD" : formatPaise(plan.price_paise)}
                    </span>
                    {plan.unit_label && (
                      <span className="text-xs text-gray-500">{plan.unit_label}</span>
                    )}
                  </div>
                  {plan.supports_installments && (
                    <p className="mt-2 text-xs text-gray-500">
                      Installments available — contact us.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
