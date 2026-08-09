import { z } from "zod";

export const badgesStripSchema = z.object({
  badges: z.array(z.string().min(1)).default([]),
});

export type BadgesStripContent = z.infer<typeof badgesStripSchema>;
