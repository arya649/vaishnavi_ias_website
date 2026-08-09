import { z } from "zod";

export const richTextSchema = z.object({
  heading: z.string().optional().default(""),
  body_markdown: z.string().optional().default("New text block. Edit me in the admin panel."),
});

export type RichTextContent = z.infer<typeof richTextSchema>;
