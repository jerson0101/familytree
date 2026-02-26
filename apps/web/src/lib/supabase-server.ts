import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Lazy getter for environment variables
function getEnvVars() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      url: 'https://placeholder.supabase.co',
      key: 'placeholder-anon-key-for-build-time-only',
    };
  }

  return { url: supabaseUrl, key: supabaseAnonKey };
}

/**
 * Create a Supabase client for server components
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();
  const { url, key } = getEnvVars();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing sessions.
        }
      },
    },
  });
}

/**
 * Get the current user session from server
 */
export async function getServerSession() {
  const supabase = await createServerSupabaseClient();
  const { data: { session }, error } = await supabase.auth.getSession();
  return { session, error };
}

/**
 * Get the current user from server
 */
export async function getServerUser() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}
