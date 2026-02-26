import { NextRequest, NextResponse } from 'next/server';

// Mock social feed data
const mockPosts = [
  {
    id: '1',
    accountId: 'acc-1',
    personId: '1',
    personName: 'Juan García',
    platform: 'instagram',
    postType: 'photo',
    content: 'Domingo en familia',
    mediaUrls: ['https://picsum.photos/400/400?random=1'],
    likesCount: 45,
    commentsCount: 8,
    postedAt: '2024-01-14T15:30:00Z',
    permalink: 'https://instagram.com/p/abc123',
  },
  {
    id: '2',
    accountId: 'acc-2',
    personId: '2',
    personName: 'Ana García',
    platform: 'facebook',
    postType: 'text',
    content: 'Feliz de compartir este momento especial con la familia. Los domingos son para estar juntos.',
    mediaUrls: [],
    likesCount: 32,
    commentsCount: 5,
    postedAt: '2024-01-13T18:00:00Z',
    permalink: 'https://facebook.com/posts/xyz789',
  },
  {
    id: '3',
    accountId: 'acc-1',
    personId: '1',
    personName: 'Juan García',
    platform: 'instagram',
    postType: 'photo',
    content: 'Celebrando el cumple de Sofia',
    mediaUrls: [
      'https://picsum.photos/400/400?random=2',
      'https://picsum.photos/400/400?random=3',
    ],
    likesCount: 89,
    commentsCount: 15,
    postedAt: '2024-01-12T20:00:00Z',
    permalink: 'https://instagram.com/p/def456',
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const familyId = searchParams.get('familyId');
  const platform = searchParams.get('platform');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = parseInt(searchParams.get('offset') || '0');

  // Filter by platform if specified
  let posts = mockPosts;
  if (platform) {
    posts = posts.filter((p) => p.platform === platform);
  }

  // Apply pagination
  const paginatedPosts = posts.slice(offset, offset + limit);

  return NextResponse.json({
    success: true,
    data: {
      posts: paginatedPosts,
      total: posts.length,
      hasMore: offset + limit < posts.length,
    },
  });
}
