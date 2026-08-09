import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";
import { sectionRegistry, sectionTypeOptions, type SectionType } from "@/lib/sections/registry";
import { deleteSection } from "@/lib/actions/sections";
import { AdminCard } from "@/components/admin/ui";
import DeleteButton from "@/components/admin/DeleteButton";
import AddSectionForm from "@/components/admin/AddSectionForm";

export default async function AdminPageEditor({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { site } = await getCurrentSite();
  const supabase = await createClient();

  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("site_id", site.id)
    .eq("slug", slug)
    .single();

  if (!page) notFound();

  const { data: sections } = await supabase
    .from("sections")
    .select("*")
    .eq("page_id", page.id)
    .order("position");

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">{page.title}</h1>

      <div className="space-y-6">
        {(sections ?? []).map((section) => {
          const definition = sectionRegistry[section.type as SectionType];
          if (!definition) {
            return (
              <AdminCard key={section.id} title={`Unknown section type: ${section.type}`}>
                <DeleteButton action={deleteSection.bind(null, section.id, slug)} />
              </AdminCard>
            );
          }

          const parsed = definition.schema.safeParse(section.content);
          const AdminForm = definition.AdminForm;

          return (
            <AdminCard
              key={section.id}
              title={`${definition.label} (position ${section.position})`}
              action={<DeleteButton action={deleteSection.bind(null, section.id, slug)} />}
            >
              {parsed.success ? (
                <AdminForm
                  sectionId={section.id}
                  pageSlug={slug}
                  siteSlug={site.slug}
                  initialContent={parsed.data as never}
                />
              ) : (
                <p className="text-sm text-red-600">
                  This section&apos;s stored content doesn&apos;t match its expected shape and can&apos;t be edited
                  here. Contact a developer.
                </p>
              )}
            </AdminCard>
          );
        })}
      </div>

      <AdminCard title="Add Section">
        <AddSectionForm
          pageId={page.id}
          pageSlug={slug}
          nextPosition={(sections?.length ?? 0) * 10}
          options={sectionTypeOptions}
        />
      </AdminCard>
    </div>
  );
}
