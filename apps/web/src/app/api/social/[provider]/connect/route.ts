import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Meta OAuth configuration
const META_APP_ID = process.env.META_APP_ID || '';
const META_REDIRECT_URI = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/api/social/instagram/callback`
  : 'http://localhost:3001/api/social/instagram/callback';

// Instagram/Facebook OAuth scopes
const INSTAGRAM_SCOPES = [
  'instagram_basic',
  'instagram_content_publish',
  'instagram_manage_comments',
  'instagram_manage_insights',
  'pages_show_list',
  'pages_read_engagement',
].join(',');

const FACEBOOK_SCOPES = [
  'public_profile',
  'email',
  'pages_show_list',
  'pages_read_engagement',
  'pages_read_user_content',
].join(',');

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(request.url);
  const familyId = searchParams.get('familyId');
  const personId = searchParams.get('personId');

  // Validate provider
  if (!['instagram', 'facebook'].includes(provider)) {
    return NextResponse.json(
      { error: 'Invalid provider' },
      { status: 400 }
    );
  }

  // Check authentication
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (!META_APP_ID) {
    return NextResponse.json(
      { error: 'Meta App ID not configured. Please set META_APP_ID environment variable.' },
      { status: 500 }
    );
  }

  // Create state parameter to prevent CSRF and pass context
  const stateData = {
    userId: user.id,
    familyId,
    personId,
    provider,
    timestamp: Date.now(),
  };
  const state = Buffer.from(JSON.stringify(stateData)).toString('base64');

  // Build OAuth URL based on provider
  let authUrl: string;

  if (provider === 'instagram') {
    // Instagram uses Facebook OAuth with Instagram scopes
    authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${META_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(META_REDIRECT_URI)}` +
      `&scope=${encodeURIComponent(INSTAGRAM_SCOPES)}` +
      `&state=${encodeURIComponent(state)}` +
      `&response_type=code`;
  } else {
    // Facebook OAuth
    const fbRedirectUri = META_REDIRECT_URI.replace('/instagram/', '/facebook/');
    authUrl = `https://www.facebook.com/v18.0/dialog/oauth?` +
      `client_id=${META_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(fbRedirectUri)}` +
      `&scope=${encodeURIComponent(FACEBOOK_SCOPES)}` +
      `&state=${encodeURIComponent(state)}` +
      `&response_type=code`;
  }

  return NextResponse.redirect(authUrl);
}
