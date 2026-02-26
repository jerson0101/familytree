import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Use untyped client since we don't have auto-generated Supabase types
// In production, run `supabase gen types typescript` to generate proper types
type UntypedSupabaseClient = SupabaseClient;

// Browser/Client-side Supabase client (singleton)
let browserClient: UntypedSupabaseClient | null = null;

// Lazy getter for environment variables
function getEnvVars() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Return mock values during build time or when env vars are missing
    // This prevents build errors - actual functionality requires real env vars
    return {
      url: 'https://placeholder.supabase.co',
      key: 'placeholder-key',
      isPlaceholder: true,
    };
  }

  return { url: supabaseUrl, key: supabaseAnonKey, isPlaceholder: false };
}

export function getSupabaseClient(): UntypedSupabaseClient {
  const { url, key } = getEnvVars();

  if (typeof window === 'undefined') {
    // Server-side: create new client each time
    return createClient(url, key, {
      auth: {
        persistSession: false,
      },
    });
  }

  // Browser: reuse client
  if (!browserClient) {
    browserClient = createClient(url, key, {
      auth: {
        persistSession: true,
        storageKey: 'kintree-auth',
      },
    });
  }

  return browserClient;
}

// Create a Supabase client with a custom access token (for server-side with user context)
export function createServerClient(accessToken: string): UntypedSupabaseClient {
  const { url, key } = getEnvVars();

  return createClient(url, key, {
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    auth: {
      persistSession: false,
    },
  });
}

// Type helper for Supabase realtime subscriptions
export type RealtimeChannel = ReturnType<SupabaseClient['channel']>;

// Re-export types
export type { SupabaseClient };
