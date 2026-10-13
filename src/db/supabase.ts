import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase client for the anonymous click-tracking easter egg (Neonmap).
 * Credentials are read from VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY.
 * When they are not configured the app still runs — the Neonmap feature
 * simply stays disabled.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;
