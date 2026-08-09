import SectionRenderer from "@/components/sections/SectionRenderer";
import { getPageWithSections } from "@/lib/data/public";

export const revalidate = 300;

export default async function RefundPolicyPage() {
  const pageData = await getPageWithSections("refund-and-cancellation");
  if (!pageData) return null;
  return <SectionRenderer sections={pageData.sections} />;
}
