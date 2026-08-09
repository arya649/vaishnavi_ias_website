import PricingTable from "@/components/public/PricingTable";
import { getPricingPlans } from "@/lib/data/public";

export const revalidate = 300;

export default async function PricingPage() {
  const plans = await getPricingPlans();

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold text-brand-primary">Pricing</h1>
      <div className="mt-8">
        <PricingTable plans={plans} />
      </div>
    </div>
  );
}
