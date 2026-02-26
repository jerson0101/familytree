'use client';

import { useState } from 'react';

import { sharePost } from '@/app/actions/social';

export function CreatePostForm({ familyId, onPostCreated }: { familyId: string, onPostCreated: () => void }) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // We will implement the server action call here
            const formData = new FormData();
            formData.append('url', url);
            formData.append('familyId', familyId);

            // This is a placeholder for the actual server action call
            const result = await sharePost(null, formData);

            if (result.success) {
                setUrl('');
                onPostCreated();
            } else {
                setError(result.message);
            }
        } catch (err) {
            setError('Failed to share post');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-4 mb-6">
            <h3 className="text-sm font-semibold text-neutral-900 mb-3 px-1">Share a memory</h3>
            <form onSubmit={handleSubmit} className="relative">
                <div className="bg-neutral-50 rounded-2xl p-3 mb-3 border border-transparent focus-within:border-neutral-200 focus-within:bg-white transition-all">
                    <input
                        type="url"
                        placeholder="Paste Facebook or Instagram link..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-transparent text-neutral-900 placeholder-neutral-400 text-base focus:outline-none"
                    />
                </div>

                <div className="flex items-center justify-between px-1">
                    <p className="text-xs text-neutral-400">
                        Supports public posts only
                    </p>
                    <button
                        type="submit"
                        disabled={!url || loading}
                        className={`
                            px-6 py-2 rounded-full font-medium text-sm transition-all transform active:scale-95
                            ${!url || loading
                                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                                : 'bg-neutral-900 text-white hover:bg-neutral-800 shadow-md hover:shadow-lg'}
                        `}
                    >
                        {loading ? 'Sharing...' : 'Share Post'}
                    </button>
                </div>
            </form>
            {error && <p className="text-red-500 text-sm mt-3 px-1">{error}</p>}
        </div>
    );
}
