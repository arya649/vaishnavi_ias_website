import type { ComponentType } from "react";
import type { z } from "zod";

import { heroSchema } from "./types/hero";
import { aboutBlockSchema } from "./types/about-block";
import { badgesStripSchema } from "./types/badges-strip";
import { richTextSchema } from "./types/rich-text";
import { promoStripSchema } from "./types/promo-strip";
import { ctaBannerSchema } from "./types/cta-banner";
import { methodologyLevelsSchema } from "./types/methodology-levels";

import Hero from "@/components/sections/Hero";
import AboutBlock from "@/components/sections/AboutBlock";
import BadgesStrip from "@/components/sections/BadgesStrip";
import RichText from "@/components/sections/RichText";
import PromoStrip from "@/components/sections/PromoStrip";
import CtaBanner from "@/components/sections/CtaBanner";
import MethodologyLevels from "@/components/sections/MethodologyLevels";

import HeroForm from "@/components/admin/section-forms/HeroForm";
import AboutBlockForm from "@/components/admin/section-forms/AboutBlockForm";
import BadgesStripForm from "@/components/admin/section-forms/BadgesStripForm";
import RichTextForm from "@/components/admin/section-forms/RichTextForm";
import PromoStripForm from "@/components/admin/section-forms/PromoStripForm";
import CtaBannerForm from "@/components/admin/section-forms/CtaBannerForm";
import MethodologyLevelsForm from "@/components/admin/section-forms/MethodologyLevelsForm";

export type AdminFormProps<T> = {
  sectionId: string;
  pageSlug: string;
  siteSlug: string;
  initialContent: T;
};

type SectionDefinition<T> = {
  schema: z.ZodType<T>;
  label: string;
  Public: ComponentType<T>;
  AdminForm: ComponentType<AdminFormProps<T>>;
};

// The single place a new section "type" is registered. To add a new type:
// 1. lib/sections/types/<name>.ts        — Zod schema + inferred TS type
// 2. components/sections/<Name>.tsx      — public render component
// 3. components/admin/section-forms/<Name>Form.tsx — admin edit form
// 4. Add an entry below.
// No page routes, DB migration, or SectionRenderer/admin editor changes
// needed. See docs/CMS-AND-REUSE-GUIDE.md, "How to add a new section type".
export const sectionRegistry = {
  hero: {
    schema: heroSchema,
    label: "Hero",
    Public: Hero,
    AdminForm: HeroForm,
  },
  about_block: {
    schema: aboutBlockSchema,
    label: "About Block",
    Public: AboutBlock,
    AdminForm: AboutBlockForm,
  },
  badges_strip: {
    schema: badgesStripSchema,
    label: "Badges Strip",
    Public: BadgesStrip,
    AdminForm: BadgesStripForm,
  },
  rich_text: {
    schema: richTextSchema,
    label: "Rich Text",
    Public: RichText,
    AdminForm: RichTextForm,
  },
  promo_strip: {
    schema: promoStripSchema,
    label: "Promo Strip",
    Public: PromoStrip,
    AdminForm: PromoStripForm,
  },
  cta_banner: {
    schema: ctaBannerSchema,
    label: "CTA Banner",
    Public: CtaBanner,
    AdminForm: CtaBannerForm,
  },
  methodology_levels: {
    schema: methodologyLevelsSchema,
    label: "Methodology Levels",
    Public: MethodologyLevels,
    AdminForm: MethodologyLevelsForm,
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} satisfies Record<string, SectionDefinition<any>>;

export type SectionType = keyof typeof sectionRegistry;

export const sectionTypeOptions = Object.entries(sectionRegistry).map(([type, def]) => ({
  type: type as SectionType,
  label: def.label,
}));
