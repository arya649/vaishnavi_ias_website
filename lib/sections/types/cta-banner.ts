import { z } from "zod";

export const ctaBannerSchema = z.object({
  heading: z.string().optional().default("New Call To Action"),
  body: z.string().optional().default(""),
  cta_label: z.string().default("Enquire Now"),
  cta_href: z.string().default("#enquire"),
});

export type CtaBannerContent = z.infer<typeof ctaBannerSchema>;
