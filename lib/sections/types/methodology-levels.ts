import { z } from "zod";

export const methodologyLevelSchema = z.object({
  title: z.string().min(1),
  body: z.string().min(1),
});

export const methodologyLevelsSchema = z.object({
  heading: z.string().optional().default("Our Test Series Methodology"),
  levels: z.array(methodologyLevelSchema).default([]),
  why_heading: z.string().optional().default("Why our test series?"),
  why_points: z.array(z.string().min(1)).default([]),
});

export type MethodologyLevelsContent = z.infer<typeof methodologyLevelsSchema>;
