import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://qjcybjhhigeltswneylh.supabase.co";
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_0_ik1Mb84ol66dOUUAchEw_7RO71DcX";

const url = (import.meta.env["VITE_SUPABASE_URL"] as string | undefined) || DEFAULT_SUPABASE_URL;
const key =
  ((import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] ??
    import.meta.env["VITE_SUPABASE_ANON_KEY"]) as string | undefined) ||
  DEFAULT_SUPABASE_PUBLISHABLE_KEY;

let client: SupabaseClient | null = null;

/**
 * Browser-only Supabase client for the connected project.
 *
 * Returns null while server-rendering (there is no session storage there) and
 * when the project isn't connected, so every caller can safely no-op instead of
 * throwing during SSR or in an offline build.
 */
export function getSupabase(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (!url || !key) return null;
  client ??= createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
  return client;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(url && key);
}
