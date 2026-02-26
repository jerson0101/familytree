import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accountId = searchParams.get('accountId');

  if (!accountId) {
    return NextResponse.json({ error: 'Account ID required' }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();

  // Verify authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get the social media account
    const { data: account, error: accountError } = await supabase
      .from('social_media_accounts')
      .select('*')
      .eq('id', accountId)
      .single();

    if (accountError || !account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Check if token is expired
    if (account.token_expires_at && new Date(account.token_expires_at) < new Date()) {
      return NextResponse.json({ error: 'Token expired. Please reconnect the account.' }, { status: 401 });
    }

    const accessToken = account.access_token;
    let posts: any[] = [];

    if (account.platform === 'instagram') {
      // Fetch Instagram posts
      // First, get Instagram Business Account ID
      const pagesResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/accounts?access_token=${accessToken}`
      );
      const pagesData = await pagesResponse.json();

      if (pagesData.data && pagesData.data.length > 0) {
        const page = pagesData.data[0];
        const pageAccessToken = page.access_token;

        // Get Instagram Business Account
        const igAccountResponse = await fetch(
          `https://graph.facebook.com/v18.0/${page.id}?fields=instagram_business_account&access_token=${pageAccessToken}`
        );
        const igAccountData = await igAccountResponse.json();

        if (igAccountData.instagram_business_account) {
          const igUserId = igAccountData.instagram_business_account.id;

          // Fetch recent media
          const mediaResponse = await fetch(
            `https://graph.facebook.com/v18.0/${igUserId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count&limit=25&access_token=${accessToken}`
          );
          const mediaData = await mediaResponse.json();

          if (mediaData.data) {
            posts = mediaData.data.map((post: any) => ({
              platform_post_id: post.id,
              post_type: post.media_type?.toLowerCase() || 'photo',
              content: post.caption || '',
              media_urls: post.media_url ? [post.media_url] : [],
              thumbnail_url: post.thumbnail_url || post.media_url,
              permalink: post.permalink,
              likes_count: post.like_count || 0,
              comments_count: post.comments_count || 0,
              posted_at: post.timestamp,
            }));
          }
        }
      }
    } else if (account.platform === 'facebook') {
      // Fetch Facebook posts
      const postsResponse = await fetch(
        `https://graph.facebook.com/v18.0/me/posts?fields=id,message,full_picture,permalink_url,created_time,likes.summary(true),comments.summary(true)&limit=25&access_token=${accessToken}`
      );
      const postsData = await postsResponse.json();

      if (postsData.data) {
        posts = postsData.data.map((post: any) => ({
          platform_post_id: post.id,
          post_type: post.full_picture ? 'photo' : 'text',
          content: post.message || '',
          media_urls: post.full_picture ? [post.full_picture] : [],
          thumbnail_url: post.full_picture,
          permalink: post.permalink_url,
          likes_count: post.likes?.summary?.total_count || 0,
          comments_count: post.comments?.summary?.total_count || 0,
          posted_at: post.created_time,
        }));
      }
    }

    // Save posts to database
    let savedCount = 0;
    for (const post of posts) {
      // Check if post already exists
      const { data: existing } = await supabase
        .from('social_posts')
        .select('id')
        .eq('account_id', accountId)
        .eq('platform_post_id', post.platform_post_id)
        .single();

      if (existing) {
        // Update existing post
        await supabase
          .from('social_posts')
          .update({
            content: post.content,
            likes_count: post.likes_count,
            comments_count: post.comments_count,
            synced_at: new Date().toISOString(),
          })
          .eq('id', existing.id);
      } else {
        // Insert new post
        const { error: insertError } = await supabase
          .from('social_posts')
          .insert({
            account_id: accountId,
            person_id: account.person_id,
            family_id: account.family_id,
            platform_post_id: post.platform_post_id,
            post_type: post.post_type,
            content: post.content,
            media_urls: post.media_urls,
            thumbnail_url: post.thumbnail_url,
            permalink: post.permalink,
            likes_count: post.likes_count,
            comments_count: post.comments_count,
            posted_at: post.posted_at,
            synced_at: new Date().toISOString(),
          });

        if (!insertError) {
          savedCount++;
        }
      }
    }

    // Update last sync time
    await supabase
      .from('social_media_accounts')
      .update({ last_synced_at: new Date().toISOString() })
      .eq('id', accountId);

    return NextResponse.json({
      success: true,
      message: `Synced ${posts.length} posts, ${savedCount} new`,
      totalPosts: posts.length,
      newPosts: savedCount,
    });
  } catch (error) {
    console.error('Sync error:', error);
    return NextResponse.json(
      { error: 'Failed to sync posts' },
      { status: 500 }
    );
  }
}
