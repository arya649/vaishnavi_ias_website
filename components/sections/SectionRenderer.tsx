import { sectionRegistry, type SectionType } from "@/lib/sections/registry";
import type { Tables } from "@/types/database.types";

type SectionRow = Tables<"sections">;

// The single place that turns a page's `sections` rows into rendered public
// UI. Unknown types or content that fails Zod validation are skipped (logged,
// not thrown) so one bad admin edit can never take down the whole page.
export default function SectionRenderer({ sections }: { sections: SectionRow[] }) {
  return (
    <>
      {sections
        .filter((s) => s.is_visible)
        .sort((a, b) => a.position - b.position)
        .map((section) => {
          const definition = sectionRegistry[section.type as SectionType];
          if (!definition) {
            console.warn(`Unknown section type "${section.type}" (id ${section.id}), skipping.`);
            return null;
          }

          const parsed = definition.schema.safeParse(section.content);
          if (!parsed.success) {
            console.warn(
              `Section ${section.id} (type "${section.type}") failed validation, skipping.`,
              parsed.error.flatten()
            );
            return null;
          }

          const Public = definition.Public;
          // Each registry entry's schema/component pair is type-safe on its own
          // (see lib/sections/registry.ts); this loop deliberately erases that
          // per-type link to dispatch across all of them at runtime.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return <Public key={section.id} {...(parsed.data as any)} />;
        })}
    </>
  );
}
