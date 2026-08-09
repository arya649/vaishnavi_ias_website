import { getCurrentSite } from "@/lib/config/site";
import { updateBranding } from "@/lib/actions/branding";
import { AdminCard, Field, inputClass, buttonClass } from "@/components/admin/ui";
import FileUploadField from "@/components/admin/FileUploadField";

export default async function AdminBrandingPage() {
  const { site, branding } = await getCurrentSite();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Branding & Contact</h1>

      <AdminCard title="Site Settings">
        <form action={updateBranding} className="grid gap-4 sm:grid-cols-2">
          <Field label="Tagline" htmlFor="tagline">
            <input id="tagline" name="tagline" defaultValue={branding?.tagline ?? ""} className={inputClass} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Primary Color" htmlFor="primary_color">
              <input
                id="primary_color"
                name="primary_color"
                type="color"
                defaultValue={branding?.primary_color ?? "#0b1f4d"}
                className={`${inputClass} h-10`}
              />
            </Field>
            <Field label="Accent Color" htmlFor="accent_color">
              <input
                id="accent_color"
                name="accent_color"
                type="color"
                defaultValue={branding?.accent_color ?? "#c9a227"}
                className={`${inputClass} h-10`}
              />
            </Field>
          </div>

          <div className="sm:col-span-2">
            <FileUploadField
              name="logo_url"
              label="Logo"
              bucket="public-assets"
              pathPrefix={`${site.slug}/branding`}
              initialUrl={branding?.logo_url}
              accept="image/*"
            />
          </div>
          <div className="sm:col-span-2">
            <FileUploadField
              name="favicon_url"
              label="Favicon"
              bucket="public-assets"
              pathPrefix={`${site.slug}/branding`}
              initialUrl={branding?.favicon_url}
              accept="image/*"
            />
          </div>

          <Field label="Contact Phone" htmlFor="contact_phone">
            <input
              id="contact_phone"
              name="contact_phone"
              defaultValue={branding?.contact_phone ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="Contact Email" htmlFor="contact_email">
            <input
              id="contact_email"
              name="contact_email"
              defaultValue={branding?.contact_email ?? ""}
              className={inputClass}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Contact Address" htmlFor="contact_address">
              <input
                id="contact_address"
                name="contact_address"
                defaultValue={branding?.contact_address ?? ""}
                className={inputClass}
              />
            </Field>
          </div>
          <Field label="SEO Default Title" htmlFor="seo_default_title">
            <input
              id="seo_default_title"
              name="seo_default_title"
              defaultValue={branding?.seo_default_title ?? ""}
              className={inputClass}
            />
          </Field>
          <Field label="SEO Default Description" htmlFor="seo_default_desc">
            <input
              id="seo_default_desc"
              name="seo_default_desc"
              defaultValue={branding?.seo_default_desc ?? ""}
              className={inputClass}
            />
          </Field>

          <div className="sm:col-span-2">
            <button type="submit" className={buttonClass}>
              Save Branding
            </button>
          </div>
        </form>
      </AdminCard>
    </div>
  );
}
