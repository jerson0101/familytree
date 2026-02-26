'use client';

import { useState, useEffect, useMemo } from 'react';
import Script from 'next/script';

import {
  Card,


  Avatar,
  Badge,
  Tabs,
  TabList,
  TabTrigger,
  TabContent,
  Skeleton,
} from '@kintree/ui';
import { useFamily } from '@/hooks/useFamily';
import { createClient } from '@/lib/supabase';
import { CreatePostForm } from '@/components/social/CreatePostForm';

interface SocialPost {
  id: string;
  author: { name: string; photoUrl: string | null };
  platform: 'instagram' | 'facebook';
  content: string;
  mediaUrl: string | null;
  postedAt: string;
  likes: number;
  comments: number;
  permalink?: string;
}



declare global {
  interface Window {
    instgrm?: any;
    FB?: any;
  }
}

export default function SocialPage() {
  const [activeTab, setActiveTab] = useState('feed');
  const { currentFamily, isLoading: familyLoading } = useFamily();
  const supabase = useMemo(() => createClient(), []);

  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch social posts from Supabase
  useEffect(() => {
    async function fetchSocialData() {
      if (!currentFamily?.id) {
        // For demo purposes, if no family ID, still show a demo post? 
        // No, let's keep it clean but maybe log why.
        console.log('No family ID found');

        // For DEBUGGING: Uncomment to test without family
        // setPosts([DEMO_POST]);
        // setIsLoading(false);

        setPosts([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        // Fetch social posts for this family
        const { data: postsData, error: postsError } = await supabase
          .from('social_posts')
          .select(`
            id,
            content,
            media_urls,
            thumbnail_url,
            likes_count,
            comments_count,
            posted_at,
            account_id,
            permalink,
            platform,
            social_media_accounts (
              platform,
              username,
              display_name,
              profile_picture_url
            )
          `)
          .eq('family_id', currentFamily.id)
          .order('posted_at', { ascending: false })
          .limit(20);

        if (postsError) {
          console.error('Error fetching posts:', postsError);
        }

        // Map posts to our format
        const mappedPosts: SocialPost[] = (postsData || []).map((post: any) => ({
          id: post.id,
          author: {
            name: post.social_media_accounts?.display_name || post.social_media_accounts?.username || 'Shared Post',
            photoUrl: post.social_media_accounts?.profile_picture_url || null,
          },
          platform: post.platform || post.social_media_accounts?.platform || 'instagram',
          content: post.content || '',
          mediaUrl: post.thumbnail_url || (post.media_urls && post.media_urls[0]) || null,
          postedAt: post.posted_at,
          likes: post.likes_count || 0,
          comments: post.comments_count || 0,
          permalink: post.permalink,
        }));

        setPosts(mappedPosts);



      } catch (error) {
        console.error('Error fetching social data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSocialData();
  }, [currentFamily?.id, supabase]);

  const refreshPosts = async () => {
    // Re-fetch posts logic (simplified for now to just reload page or we can extract fetch logic)
    // For now let's just reload the page content by re-running the effect? 
    // Better to extract fetchSocialData but for speed let's just reload window for now or force a re-render.
    // Actually, let's extract fetchSocialData if possible, but inside useEffect it's trapped.
    // Let's just reload the valid way:
    window.location.reload();
  };

  if (familyLoading || isLoading) {
    return (
      <div className="max-w-lg mx-auto px-4 pt-6 pb-20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <Skeleton width={200} height={32} />
            <Skeleton width={300} height={20} className="mt-2" />
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton height={150} />
          <Skeleton height={150} />
          <Skeleton height={150} />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-neutral-50 pb-20">
        {/* Sticky App Bar */}
        <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-neutral-200/50 px-4 py-3">
          <div className="max-w-lg mx-auto flex items-center justify-between">
            <h1 className="text-lg font-bold text-neutral-900">Social</h1>
            <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center">
              <span className="text-sm font-medium text-neutral-600">
                {currentFamily?.name?.[0] || 'F'}
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto px-4 pt-6">
          {/* Main Feed */}
          <div>
            <Tabs value={activeTab} onChange={setActiveTab}>
              <TabList className="mb-4">
                <TabTrigger value="feed">Family Feed</TabTrigger>
                <TabTrigger value="highlights">Highlights</TabTrigger>
              </TabList>

              <TabContent value="feed">
                {currentFamily?.id && (
                  <CreatePostForm familyId={currentFamily.id} onPostCreated={refreshPosts} />
                )}
                {posts.length > 0 ? (
                  <div className="space-y-4">
                    {posts.map((post) => (
                      <FeedCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <Card padding="lg">
                    <div className="text-center py-12">
                      <SocialIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-neutral-600 mb-2">
                        No posts yet
                      </h3>
                      <p className="text-neutral-400 max-w-sm mx-auto mb-4">
                        Share your favorite family moments by pasting a link above.
                      </p>
                    </div>
                  </Card>
                )}
              </TabContent>

              <TabContent value="highlights">
                <Card padding="lg">
                  <div className="text-center py-12">
                    <StarIcon className="w-16 h-16 text-neutral-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-neutral-600 mb-2">
                      Highlights Coming Soon
                    </h3>
                    <p className="text-neutral-400 max-w-sm mx-auto">
                      We'll automatically curate the best moments from your family's social posts.
                    </p>
                  </div>
                </Card>
              </TabContent>
            </Tabs>
          </div>
        </div>
      </div>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0"
        strategy="lazyOnload"
        crossOrigin="anonymous"
        onLoad={() => {
          if (window.FB) {
            window.FB.init({
              appId: process.env.NEXT_PUBLIC_META_APP_ID,
              autoLogAppEvents: true,
              xfbml: true,
              version: 'v19.0'
            });
          }
        }}
      />
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
      />
    </>
  );
}

function FeedCard({ post }: { post: SocialPost }) {
  const platform = post.platform?.trim().toLowerCase();

  useEffect(() => {
    // Re-run scripts when post changes or loads
    if (platform === 'instagram' && window.instgrm) {
      window.instgrm.Embeds.process();
    } else if (platform === 'facebook' && window.FB) {
      window.FB.XFBML.parse();
    }
  }, [post.permalink, platform]);

  // Render the embed container
  if (platform === 'instagram' || platform === 'facebook') {
    return (
      <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden mb-6">
        <div className="p-4 flex items-center gap-3">
          <Avatar name={post.author.name} src={post.author.photoUrl} size="sm" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-neutral-900 text-sm">{post.author.name}</span>
              {post.platform === 'instagram' && <InstagramIcon className="w-3 h-3 text-pink-500" />}
              {post.platform === 'facebook' && <FacebookIcon className="w-3 h-3 text-blue-600" />}
            </div>
            <p className="text-xs text-neutral-400">{formatTimeAgo(post.postedAt)}</p>
          </div>
        </div>

        <div className="w-full bg-neutral-50 min-h-[300px] flex items-center justify-center">
          {platform === 'instagram' ? (
            <blockquote
              className="instagram-media"
              data-instgrm-permalink={post.permalink}
              data-instgrm-version="14"
              style={{ background: '#FFF', border: 0, borderRadius: '0', boxShadow: 'none', margin: '0', maxWidth: '100%', minWidth: '326px', padding: 0, width: '100%' }}
            >
              <div style={{ padding: '8px' }}>
                <div style={{ background: '#F8F8F8', lineHeight: 0, marginTop: '40px', padding: '50% 0', textAlign: 'center', width: '100%' }}>
                  <div style={{ background: 'url(https://www.instagram.com/images/instagram/glyph/instagram_glyph_transparent.png)', display: 'block', height: '44px', margin: '0 auto -44px', position: 'relative', top: '-22px', width: '44px' }}></div>
                </div>
                <p style={{ color: '#c9c8cd', fontFamily: 'Arial,sans-serif', fontSize: '14px', lineHeight: '17px', marginBottom: 0, marginTop: '8px', overflow: 'hidden', padding: '8px 0 7px', textAlign: 'center', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <a href={post.permalink} style={{ color: '#c9c8cd', fontFamily: 'Arial,sans-serif', fontSize: '14px', fontStyle: 'normal', fontWeight: 'normal', lineHeight: '17px', textDecoration: 'none' }} target="_blank">View on Instagram</a>
                </p>
              </div>
            </blockquote>
          ) : (
            <div
              className="fb-post"
              data-href={post.permalink}
              data-width="500"
              data-show-text="true"
            >
              <blockquote cite={post.permalink} className="fb-xfbml-parse-ignore">
                <a href={post.permalink}>View on Facebook</a>
              </blockquote>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Fallback to original design
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden mb-6">
      <div className="p-4 flex items-center gap-3">
        <Avatar name={post.author.name} src={post.author.photoUrl} size="sm" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-neutral-900 text-sm">{post.author.name}</span>
            {post.platform === 'instagram' && <InstagramIcon className="w-3 h-3 text-pink-500" />}
            {post.platform === 'facebook' && <FacebookIcon className="w-3 h-3 text-blue-600" />}
          </div>
          <p className="text-xs text-neutral-400">{formatTimeAgo(post.postedAt)}</p>
        </div>
      </div>

      <div className="px-4 pb-3">
        <p className="text-neutral-800 text-sm leading-relaxed">{post.content}</p>
      </div>

      {post.mediaUrl && (
        <div className="aspect-square bg-neutral-100 relative">
          <img src={post.mediaUrl} alt="Post content" className="object-cover w-full h-full" />
        </div>
      )}

      <div className="px-4 py-3 flex items-center gap-6 border-t border-neutral-50">
        <button className="flex items-center gap-2 text-neutral-600 hover:text-pink-500 transition-colors group">
          <HeartIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">{post.likes}</span>
        </button>
        <button className="flex items-center gap-2 text-neutral-600 hover:text-blue-500 transition-colors group">
          <CommentIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <span className="text-sm font-medium">{post.comments}</span>
        </button>
        {post.permalink && (
          <a href={post.permalink} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs font-semibold text-neutral-400 hover:text-neutral-600">
            VIEW ORIGINAL
          </a>
        )}
      </div>
    </div>
  );
}

function formatTimeAgo(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));

  if (hours < 1) return 'Just now';
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

// Icons


function SocialIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
      <circle cx="12" cy="2" r="1" fill="currentColor" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="18" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
    </svg>
  );
}

function CommentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
    </svg>
  );
}
