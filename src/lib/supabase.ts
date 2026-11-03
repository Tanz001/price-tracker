import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Prefer Vercel / local env. Fallbacks are the public publishable key
 * (safe in the browser) so Presentation Mode still works if Vercel env
 * vars were not set at build time.
 */
const url =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  'https://jchbzbjevgttrwsbidsw.supabase.co';

const anonKey =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) ||
  'sb_publishable_zCw8y4KYgcNmsgndkpov6w_VWzOtme5';

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, {
      realtime: {
        params: {
          eventsPerSecond: 20,
        },
      },
    })
  : null;
