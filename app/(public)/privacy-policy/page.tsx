import SectionRenderer from "@/components/sections/SectionRenderer";
import { getPageWithSections } from "@/lib/data/public";

export const revalidate = 300;

export default async function PrivacyPolicyPage() {
  const pageData = await getPageWithSections("privacy-policy");
  if (!pageData) return null;
  return <SectionRenderer sections={pageData.sections} />;
}
