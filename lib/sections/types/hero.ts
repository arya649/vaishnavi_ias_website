import { z } from "zod";

export const heroSchema = z.object({
  heading: z.string().optional().default("New Hero Heading"),
  highlight_line: z.string().optional().default(""),
  subheading: z.string().optional().default(""),
  cta_label: z.string().optional().default("Enquire Now"),
  cta_href: z.string().optional().default("#enquire"),
  background_image: z.string().optional().default(""),
});

export type HeroContent = z.infer<typeof heroSchema>;
