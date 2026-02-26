import { createServerSupabaseClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const user = data.user;

      // For OAuth users (Google), ensure user_profile exists
      // The database trigger should handle this, but we check just in case
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (!existingProfile) {
        // Extract name from user metadata (Google provides full_name, name, or given_name/family_name)
        const metadata = user.user_metadata || {};
        const fullName = metadata.full_name || metadata.name || '';
        const nameParts = fullName.split(' ');
        const firstName = metadata.given_name || metadata.first_name || nameParts[0] || '';
        const lastName = metadata.family_name || metadata.last_name || nameParts.slice(1).join(' ') || '';

        // Create user profile for OAuth user
        await supabase.from('user_profiles').insert({
          id: user.id,
          email: user.email,
          first_name: firstName,
          last_name: lastName,
          avatar_url: metadata.avatar_url || metadata.picture,
        });
      }

      // Successful authentication
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // Return to login on error
  return NextResponse.redirect(new URL('/login?error=auth', requestUrl.origin));
}
