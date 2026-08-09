import "server-only";
import { createClient } from "@/lib/supabase/server";

// Every admin Server Action must call this first. Server Actions are
// reachable via direct POST requests, not just through the admin UI, so the
// proxy.ts route guard is not sufficient on its own — see
// docs/CMS-AND-REUSE-GUIDE.md, "Admin auth".
export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: admin session required.");
  }

  return { supabase, user };
}
