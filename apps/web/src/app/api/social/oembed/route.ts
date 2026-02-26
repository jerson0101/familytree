import { NextRequest, NextResponse } from 'next/server';

const APP_ID = process.env.NEXT_PUBLIC_META_APP_ID;
const APP_SECRET = process.env.META_APP_SECRET;

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');
    const platform = searchParams.get('platform');

    if (!url || !platform) {
        return NextResponse.json(
            { error: 'URL and platform are required' },
            { status: 400 }
        );
    }

    try {
        let apiUrl = '';
        const accessToken = `${APP_ID}|${APP_SECRET}`;

        // Construct the Meta oEmbed API URL
        if (platform === 'instagram') {
            apiUrl = `https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${accessToken}&omitscript=true`;
        } else if (platform === 'facebook') {
            apiUrl = `https://graph.facebook.com/v19.0/oembed_post?url=${encodeURIComponent(url)}&access_token=${accessToken}&omitscript=true`;
        } else {
            return NextResponse.json(
                { error: 'Unsupported platform' },
                { status: 400 }
            );
        }

        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!response.ok) {
            console.error('Meta API Error:', data);
            return NextResponse.json(
                { error: data.error?.message || 'Failed to fetch oEmbed data' },
                { status: response.status }
            );
        }

        return NextResponse.json({
            success: true,
            data: data,
        });
    } catch (error) {
        console.error('Error in oEmbed route:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
