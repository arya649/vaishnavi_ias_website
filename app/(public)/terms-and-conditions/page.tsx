import SectionRenderer from "@/components/sections/SectionRenderer";
import { getPageWithSections } from "@/lib/data/public";

export const revalidate = 300;

export default async function TermsPage() {
  const pageData = await getPageWithSections("terms-and-conditions");
  if (!pageData) return null;
  return <SectionRenderer sections={pageData.sections} />;
}
