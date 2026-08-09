import { z } from "zod";

export const promoStripSchema = z.object({
  text: z.string().optional().default("New promo message"),
  href: z.string().optional().default("#"),
  badge_label: z.string().optional().default(""),
  enabled: z.boolean().default(true),
});

export type PromoStripContent = z.infer<typeof promoStripSchema>;
