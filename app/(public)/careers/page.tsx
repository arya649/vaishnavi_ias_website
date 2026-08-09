import SectionRenderer from "@/components/sections/SectionRenderer";
import { getPageWithSections } from "@/lib/data/public";

export const revalidate = 300;

export default async function CareersPage() {
  const pageData = await getPageWithSections("careers");
  if (!pageData) return null;
  return <SectionRenderer sections={pageData.sections} />;
}
