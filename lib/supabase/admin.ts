import { createClient as createServiceRoleClient } from "@supabase/supabase-js";
import type { Database } from "./types";

/**
 * Service-role client — BYPASSES RLS. Server-side only, never import in client code.
 * Use for trusted operations: writing leads from public form, promoting users to admin, etc.
 */
export function createAdminClient() {
  if (typeof window !== "undefined") {
    throw new Error("createAdminClient must not be called in the browser.");
  }
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env var."
    );
  }
  return createServiceRoleClient<Database>(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
