/**
 * Social Media Service
 * Handles OAuth connections, post syncing, and family feed
 */

import { getSupabaseClient } from '../client';

export type SocialPlatform = 'instagram' | 'facebook';

export interface SocialMediaAccount {
  id: string;
  personId: string;
  familyId: string;
  platform: SocialPlatform;
  platformUserId: string;
  username: string;
  displayName?: string;
  profilePictureUrl?: string;
  accessToken: string; // Encrypted in DB
  refreshToken?: string; // Encrypted in DB
  tokenExpiresAt?: string;
  isActive: boolean;
  lastSyncedAt?: string;
  createdAt: string;
}

export interface SocialPost {
  id: string;
  accountId: string;
  personId: string;
  familyId: string;
  platformPostId: string;
  postType: 'text' | 'photo' | 'video' | 'link' | 'story';
  content?: string;
  mediaUrls: string[];
  thumbnailUrl?: string;
  permalink?: string;
  likesCount: number;
  commentsCount: number;
  postedAt: string;
  syncedAt: string;
}

export interface FeedPreferences {
  userId: string;
  familyId: string;
  showInstagram: boolean;
  showFacebook: boolean;
  hideFromPersonIds: string[];
  showOnlyFromPersonIds?: string[];
}

export interface ConnectAccountInput {
  personId: string;
  familyId: string;
  platform: SocialPlatform;
  authorizationCode: string;
  redirectUri: string;
}

export interface FamilyFeedOptions {
  familyId: string;
  userId?: string;
  platform?: SocialPlatform;
  personIds?: string[];
  limit?: number;
  offset?: number;
  startDate?: string;
  endDate?: string;
}

/**
 * Connect a social media account via OAuth
 * This would typically be called after the OAuth redirect
 */
export async function connectSocialAccount(
  input: ConnectAccountInput
): Promise<SocialMediaAccount> {
  const supabase = getSupabaseClient();

  // In a real implementation, this would:
  // 1. Exchange authorization code for tokens via the platform's API
  // 2. Fetch user profile from the platform
  // 3. Encrypt and store tokens

  // For now, we'll create a placeholder record
  // The actual OAuth flow would be handled by the frontend/API routes

  const { data, error } = await supabase
    .from('social_media_accounts')
    .insert({
      person_id: input.personId,
      family_id: input.familyId,
      platform: input.platform,
      platform_user_id: 'pending', // Would be filled by OAuth response
      username: 'pending',
      access_token: input.authorizationCode, // Would be exchanged for actual token
      is_active: false, // Mark as inactive until OAuth completes
    })
    .select()
    .single();

  if (error) throw error;

  return mapToSocialMediaAccount(data);
}

/**
 * Disconnect a social media account
 */
export async function disconnectSocialAccount(
  accountId: string
): Promise<void> {
  const supabase = getSupabaseClient();

  // Soft delete - mark as inactive
  const { error } = await supabase
    .from('social_media_accounts')
    .update({ is_active: false })
    .eq('id', accountId);

  if (error) throw error;

  // In a real implementation, we would also:
  // - Revoke the OAuth token with the platform
  // - Delete cached posts
}

/**
 * Get connected accounts for a family
 */
export async function getConnectedAccounts(
  familyId: string,
  options?: { personId?: string; platform?: SocialPlatform }
): Promise<SocialMediaAccount[]> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('social_media_accounts')
    .select('*')
    .eq('family_id', familyId)
    .eq('is_active', true);

  if (options?.personId) {
    query = query.eq('person_id', options.personId);
  }

  if (options?.platform) {
    query = query.eq('platform', options.platform);
  }

  const { data, error } = await query;

  if (error) throw error;

  return (data || []).map(mapToSocialMediaAccount);
}

/**
 * Get the family social feed
 */
export async function getFamilyFeed(
  options: FamilyFeedOptions
): Promise<{ posts: SocialPost[]; total: number }> {
  const supabase = getSupabaseClient();

  let query = supabase
    .from('social_posts')
    .select('*', { count: 'exact' })
    .eq('family_id', options.familyId)
    .order('posted_at', { ascending: false });

  if (options.platform) {
    // Join with accounts to filter by platform
    query = supabase
      .from('social_posts')
      .select('*, social_media_accounts!inner(platform)', { count: 'exact' })
      .eq('family_id', options.familyId)
      .eq('social_media_accounts.platform', options.platform)
      .order('posted_at', { ascending: false });
  }

  if (options.personIds && options.personIds.length > 0) {
    query = query.in('person_id', options.personIds);
  }

  if (options.startDate) {
    query = query.gte('posted_at', options.startDate);
  }

  if (options.endDate) {
    query = query.lte('posted_at', options.endDate);
  }

  const limit = options.limit || 20;
  const offset = options.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    posts: (data || []).map(mapToSocialPost),
    total: count || 0,
  };
}

/**
 * Sync posts from a connected account
 * In a real implementation, this would call the platform's API
 */
export async function syncAccountPosts(
  accountId: string
): Promise<{ synced: number; errors: string[] }> {
  const supabase = getSupabaseClient();

  // Get account details
  const { data: account, error: accountError } = await supabase
    .from('social_media_accounts')
    .select('*')
    .eq('id', accountId)
    .single();

  if (accountError) throw accountError;
  if (!account) throw new Error('Account not found');

  // In a real implementation, this would:
  // 1. Use the access token to fetch recent posts from the platform API
  // 2. Transform and store the posts
  // 3. Update the last_synced_at timestamp

  // Update last synced timestamp
  await supabase
    .from('social_media_accounts')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('id', accountId);

  return {
    synced: 0, // Would be actual count
    errors: [],
  };
}

/**
 * Update feed preferences for a user
 */
export async function updateFeedPreferences(
  userId: string,
  familyId: string,
  preferences: Partial<Omit<FeedPreferences, 'userId' | 'familyId'>>
): Promise<FeedPreferences> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('feed_preferences')
    .upsert({
      user_id: userId,
      family_id: familyId,
      show_instagram: preferences.showInstagram ?? true,
      show_facebook: preferences.showFacebook ?? true,
      hide_from_person_ids: preferences.hideFromPersonIds ?? [],
      show_only_from_person_ids: preferences.showOnlyFromPersonIds,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    userId: data.user_id,
    familyId: data.family_id,
    showInstagram: data.show_instagram,
    showFacebook: data.show_facebook,
    hideFromPersonIds: data.hide_from_person_ids || [],
    showOnlyFromPersonIds: data.show_only_from_person_ids,
  };
}

/**
 * Get feed preferences for a user
 */
export async function getFeedPreferences(
  userId: string,
  familyId: string
): Promise<FeedPreferences> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from('feed_preferences')
    .select('*')
    .eq('user_id', userId)
    .eq('family_id', familyId)
    .single();

  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned

  // Return defaults if no preferences exist
  return {
    userId,
    familyId,
    showInstagram: data?.show_instagram ?? true,
    showFacebook: data?.show_facebook ?? true,
    hideFromPersonIds: data?.hide_from_person_ids || [],
    showOnlyFromPersonIds: data?.show_only_from_person_ids,
  };
}

/**
 * Get OAuth URL for a platform
 */
export function getOAuthUrl(
  platform: SocialPlatform,
  redirectUri: string,
  state: string
): string {
  // In a real implementation, these would use environment variables
  const INSTAGRAM_APP_ID = process.env.INSTAGRAM_APP_ID || '';
  const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID || '';

  if (platform === 'instagram') {
    const scope = 'user_profile,user_media';
    return `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}`;
  }

  if (platform === 'facebook') {
    const scope = 'public_profile,user_posts,user_photos';
    return `https://www.facebook.com/v18.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}&response_type=code&state=${state}`;
  }

  throw new Error(`Unsupported platform: ${platform}`);
}

// Helper functions to map database rows to interfaces
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToSocialMediaAccount(row: any): SocialMediaAccount {
  return {
    id: row.id,
    personId: row.person_id,
    familyId: row.family_id,
    platform: row.platform,
    platformUserId: row.platform_user_id,
    username: row.username,
    displayName: row.display_name,
    profilePictureUrl: row.profile_picture_url,
    accessToken: row.access_token,
    refreshToken: row.refresh_token,
    tokenExpiresAt: row.token_expires_at,
    isActive: row.is_active,
    lastSyncedAt: row.last_synced_at,
    createdAt: row.created_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapToSocialPost(row: any): SocialPost {
  return {
    id: row.id,
    accountId: row.account_id,
    personId: row.person_id,
    familyId: row.family_id,
    platformPostId: row.platform_post_id,
    postType: row.post_type,
    content: row.content,
    mediaUrls: row.media_urls || [],
    thumbnailUrl: row.thumbnail_url,
    permalink: row.permalink,
    likesCount: row.likes_count || 0,
    commentsCount: row.comments_count || 0,
    postedAt: row.posted_at,
    syncedAt: row.synced_at,
  };
}
