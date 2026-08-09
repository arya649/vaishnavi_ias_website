import EnquireForm from "@/components/layout/EnquireForm";
import { getCurrentSite } from "@/lib/config/site";

export const revalidate = 300;

export default async function ContactPage() {
  const { branding } = await getCurrentSite();

  return (
    <div className="mx-auto grid max-w-4xl gap-10 px-6 py-16 sm:grid-cols-2">
      <div>
        <h1 className="text-3xl font-bold text-brand-primary">Contact Us</h1>
        <p className="mt-3 text-gray-600">
          Have a question about our courses, test series, or mentorship program? Send us a
          message and we&apos;ll get back to you shortly.
        </p>
        <ul className="mt-6 space-y-2 text-sm text-gray-700">
          {branding?.contact_phone && <li>📞 {branding.contact_phone}</li>}
          {branding?.contact_email && <li>✉️ {branding.contact_email}</li>}
          {branding?.contact_address && <li>📍 {branding.contact_address}</li>}
        </ul>
      </div>
      <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
        <EnquireForm sourcePage="contact" />
      </div>
    </div>
  );
}
