import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/** Client serveur avec la clé service (bypass RLS). Ne jamais exposer au navigateur. */
export function createServiceSupabase(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function getStorageBucket(): string {
  return (
    process.env.SUPABASE_STORAGE_BUCKET?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET?.trim() ||
    "site-uploads"
  );
}
