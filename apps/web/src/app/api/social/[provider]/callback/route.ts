import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

const META_APP_ID = process.env.META_APP_ID || '';
const META_APP_SECRET = process.env.META_APP_SECRET || '';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

interface StateData {
  userId: string;
  familyId: string | null;
  personId: string | null;
  provider: string;
  timestamp: number;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');

  // Handle OAuth error
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    return NextResponse.redirect(
      new URL(`/social/connect?error=${encodeURIComponent(error)}`, APP_URL)
    );
  }

  // Validate code and state
  if (!code || !state) {
    return NextResponse.redirect(
      new URL('/social/connect?error=missing_params', APP_URL)
    );
  }

  // Decode and validate state
  let stateData: StateData;
  try {
    stateData = JSON.parse(Buffer.from(state, 'base64').toString());

    // Check state is not too old (5 minutes max)
    if (Date.now() - stateData.timestamp > 5 * 60 * 1000) {
      return NextResponse.redirect(
        new URL('/social/connect?error=state_expired', APP_URL)
      );
    }
  } catch {
    return NextResponse.redirect(
      new URL('/social/connect?error=invalid_state', APP_URL)
    );
  }

  const supabase = await createServerSupabaseClient();

  // Verify user is still authenticated
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user || user.id !== stateData.userId) {
    return NextResponse.redirect(new URL('/login', APP_URL));
  }

  try {
    const redirectUri = `${APP_URL}/api/social/${provider}/callback`;

    // Exchange code for access token
    const tokenResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `client_id=${META_APP_ID}` +
      `&client_secret=${META_APP_SECRET}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&code=${code}`
    );

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      console.error('Token exchange failed:', errorData);
      return NextResponse.redirect(
        new URL('/social/connect?error=token_exchange_failed', APP_URL)
      );
    }

    const tokenData = await tokenResponse.json();
    const shortLivedToken = tokenData.access_token;

    // Exchange for long-lived token (60 days)
    const longLivedResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?` +
      `grant_type=fb_exchange_token` +
      `&client_id=${META_APP_ID}` +
      `&client_secret=${META_APP_SECRET}` +
      `&fb_exchange_token=${shortLivedToken}`
    );

    let accessToken = shortLivedToken;
    let expiresIn = tokenData.expires_in || 3600;

    if (longLivedResponse.ok) {
      const longLivedData = await longLivedResponse.json();
      accessToken = longLivedData.access_token;
      expiresIn = longLivedData.expires_in || 5184000; // 60 days
    }

    // Get user profile from Facebook/Instagram
    let profileData: any;
    let platformUserId: string;
    let username: string;
    let displayName: string;
    let profilePictureUrl: string | null = null;

    if (provider === 'instagram') {
      // For Instagram, we need to get the Instagram Business Account
      // First, get Facebook Pages the user manages
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
      );
      const pagesData = await pagesResponse.json();

      if (!pagesData.data || pagesData.data.length === 0) {
        return NextResponse.redirect(
          new URL('/social/connect?error=no_pages_found', APP_URL)
        );
      }

      // Get the first page's Instagram Business Account
      const page = pagesData.data[0];
      const pageAccessToken = page.access_token;

      const igAccountResponse = await fetch(
        `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${pageAccessToken}`
      );
      const igAccountData = await igAccountResponse.json();

      if (!igAccountData.instagram_business_account) {
        // Try to get basic Instagram account info
        const meResponse = await fetch(
          `https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${accessToken}`
        );
        profileData = await meResponse.json();
        platformUserId = profileData.id;
        username = profileData.name || 'instagram_user';
        displayName = profileData.name || 'Instagram User';
      } else {
        const igUserId = igAccountData.instagram_business_account.id;

        // Get Instagram profile info
        const igProfileResponse = await fetch(
          `https://graph.facebook.com/v18.0/${igUserId}?fields=id,username,name,profile_picture_url&access_token=${accessToken}`
        );
        profileData = await igProfileResponse.json();
        platformUserId = profileData.id;
        username = profileData.username || 'instagram_user';
        displayName = profileData.name || profileData.username || 'Instagram User';
        profilePictureUrl = profileData.profile_picture_url;
      }
    } else {
      // Facebook profile
      const fbProfileResponse = await fetch(
        `https://graph.facebook.com/v18.0/me?fields=id,name,email,picture&access_token=${accessToken}`
      );
      profileData = await fbProfileResponse.json();
      platformUserId = profileData.id;
      username = profileData.email || profileData.id;
      displayName = profileData.name || 'Facebook User';
      profilePictureUrl = profileData.picture?.data?.url || null;
    }

    // Calculate token expiration
    const tokenExpiresAt = new Date(Date.now() + expiresIn * 1000).toISOString();

    // Get or create person_id if not provided
    let personId = stateData.personId;

    // If no personId and we have a familyId, try to find/create the user's person record
    if (!personId && stateData.familyId) {
      const { data: existingPerson } = await supabase
        .from('persons')
        .select('id')
        .eq('family_id', stateData.familyId)
        .eq('linked_user_id', user.id)
        .single();

      if (existingPerson) {
        personId = existingPerson.id;
      }
    }

    // Check if this account is already connected
    const { data: existingAccount } = await supabase
      .from('social_media_accounts')
      .select('id')
      .eq('platform', provider)
      .eq('platform_user_id', platformUserId)
      .single();

    if (existingAccount) {
      // Update existing account
      await supabase
        .from('social_media_accounts')
        .update({
          username,
          display_name: displayName,
          profile_picture_url: profilePictureUrl,
          access_token: accessToken,
          token_expires_at: tokenExpiresAt,
          is_active: true,
          last_synced_at: new Date().toISOString(),
        })
        .eq('id', existingAccount.id);
    } else {
      // Create new social media account
      const insertData: any = {
        platform: provider,
        platform_user_id: platformUserId,
        username,
        display_name: displayName,
        profile_picture_url: profilePictureUrl,
        access_token: accessToken,
        token_expires_at: tokenExpiresAt,
        is_active: true,
        family_id: stateData.familyId,
      };

      // Only add person_id if we have one
      if (personId) {
        insertData.person_id = personId;
      }

      const { error: insertError } = await supabase
        .from('social_media_accounts')
        .insert(insertData);

      if (insertError) {
        console.error('Error saving account:', insertError);
        return NextResponse.redirect(
          new URL('/social/connect?error=save_failed', APP_URL)
        );
      }
    }

    // Redirect back to connect page with success
    return NextResponse.redirect(
      new URL(`/social/connect?success=true&provider=${provider}`, APP_URL)
    );
  } catch (err) {
    console.error('OAuth callback error:', err);
    return NextResponse.redirect(
      new URL('/social/connect?error=connection_failed', APP_URL)
    );
  }
}
