import { z } from "zod";

export const aboutBlockSchema = z.object({
  heading: z.string().optional().default("About Us"),
  body: z.string().optional().default(""),
  image_url: z.string().optional().default(""),
});

export type AboutBlockContent = z.infer<typeof aboutBlockSchema>;
