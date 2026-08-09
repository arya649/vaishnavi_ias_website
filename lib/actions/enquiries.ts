"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";

const schema = z.object({
  status: z.enum(["new", "contacted", "converted", "closed"]),
  installment_access: z.coerce.boolean().default(false),
});

export async function updateEnquiry(id: string, formData: FormData) {
  const { supabase } = await requireAdmin();
  const data = schema.parse({
    status: formData.get("status"),
    installment_access: formData.get("installment_access") === "on",
  });

  await supabase.from("enquiries").update(data).eq("id", id);
  revalidatePath("/admin/enquiries");
}

export async function deleteEnquiry(id: string) {
  const { supabase } = await requireAdmin();
  await supabase.from("enquiries").delete().eq("id", id);
  revalidatePath("/admin/enquiries");
}
