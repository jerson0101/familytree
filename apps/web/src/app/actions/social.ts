'use server';

import { createServerSupabaseClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function sharePost(prevState: any, formData: FormData) {
    const url = formData.get('url') as string;
    const familyId = formData.get('familyId') as string;

    if (!url || !familyId) {
        return { success: false, message: 'URL is required' };
    }

    // Basic URL validation and platform detection
    let platform = '';
    if (url.includes('instagram.com')) {
        platform = 'instagram';
    } else if (url.includes('facebook.com')) {
        platform = 'facebook';
    } else {
        return { success: false, message: 'Only Instagram and Facebook URLs are supported' };
    }

    const supabase = await createServerSupabaseClient();

    try {
        const { error } = await supabase.from('social_posts').insert({
            family_id: familyId,
            permalink: url,
            platform_post_id: url, // Using URL as ID for now, or extract meaningful ID
            platform: platform,
            post_type: 'link',
            posted_at: new Date().toISOString(),
            content: '', // Optional content
        });

        if (error) {
            console.error('Error inserting post:', error);
            return { success: false, message: `Failed to share post: ${error.message}` };
        }

        revalidatePath('/social');
        return { success: true, message: 'Post shared successfully!' };
    } catch (error) {
        console.error('Server error:', error);
        return { success: false, message: 'Internal server error' };
    }
}
