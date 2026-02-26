import { createBrowserClient } from '@supabase/ssr';

// Browser client singleton
let browserClient: ReturnType<typeof createBrowserClient> | null = null;

// Lazy getter for environment variables
function getEnvVars() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return placeholder values during build time
    // This prevents build errors - actual functionality requires real env vars
    return {
      url: 'https://placeholder.supabase.co',
      key: 'placeholder-anon-key-for-build-time-only',
    };
  }

  return { url: supabaseUrl, key: supabaseAnonKey };
}

/**
 * Create a Supabase client for browser/client components
 */
export function createClient() {
  if (browserClient) return browserClient;

  const { url, key } = getEnvVars();
  browserClient = createBrowserClient(url, key);
  return browserClient;
}

/**
 * Get the Supabase client (alias for createClient)
 */
export function getSupabaseClient() {
  return createClient();
}
