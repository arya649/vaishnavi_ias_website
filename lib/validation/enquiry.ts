import { z } from "zod";

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters."),
  phone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number.")
    .max(15, "Enter a valid phone number."),
  email: z.union([z.string().trim().email("Enter a valid email."), z.literal("")]).optional(),
  message: z.string().trim().optional(),
  interested_in: z.string().trim().optional(),
  source_page: z.string().trim().optional(),
});

export type EnquiryFormState = {
  errors?: Partial<Record<keyof z.infer<typeof enquirySchema>, string[]>>;
  success?: boolean;
  message?: string;
};
