"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentSite } from "@/lib/config/site";
import { enquirySchema, type EnquiryFormState } from "@/lib/validation/enquiry";

export async function submitEnquiry(
  _prevState: EnquiryFormState,
  formData: FormData
): Promise<EnquiryFormState> {
  const validated = enquirySchema.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    message: formData.get("message"),
    interested_in: formData.get("interested_in"),
    source_page: formData.get("source_page"),
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { site } = await getCurrentSite();
  const supabase = await createClient();

  const { error } = await supabase.from("enquiries").insert({
    site_id: site.id,
    name: validated.data.name,
    phone: validated.data.phone,
    email: validated.data.email || null,
    message: validated.data.message || null,
    interested_in: validated.data.interested_in || null,
    source_page: validated.data.source_page || null,
  });

  if (error) {
    return { message: "Something went wrong. Please try again or call us directly." };
  }

  return { success: true, message: "Thanks! We'll get back to you shortly." };
}
