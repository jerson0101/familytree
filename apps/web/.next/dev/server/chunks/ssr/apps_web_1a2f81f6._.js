module.exports = [
"[project]/apps/web/src/lib/supabase-server.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createServerSupabaseClient",
    ()=>createServerSupabaseClient,
    "getServerSession",
    ()=>getServerSession,
    "getServerUser",
    ()=>getServerUser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createServerClient.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
;
;
// Lazy getter for environment variables
function getEnvVars() {
    const supabaseUrl = ("TURBOPACK compile-time value", "https://endcmiiupqaldqfusklb.supabase.co");
    const supabaseAnonKey = ("TURBOPACK compile-time value", "sb_publishable_x8fmeY6r2gDOvF-0JXXk8g_vG71WzTI");
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return {
        url: supabaseUrl,
        key: supabaseAnonKey
    };
}
async function createServerSupabaseClient() {
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const { url, key } = getEnvVars();
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createServerClient$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])(url, key, {
        cookies: {
            getAll () {
                return cookieStore.getAll();
            },
            setAll (cookiesToSet) {
                try {
                    cookiesToSet.forEach(({ name, value, options })=>cookieStore.set(name, value, options));
                } catch  {
                // The `setAll` method was called from a Server Component.
                // This can be ignored if you have middleware refreshing sessions.
                }
            }
        }
    });
}
async function getServerSession() {
    const supabase = await createServerSupabaseClient();
    const { data: { session }, error } = await supabase.auth.getSession();
    return {
        session,
        error
    };
}
async function getServerUser() {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    return {
        user,
        error
    };
}
}),
"[project]/apps/web/src/app/actions/social.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60403b1f8f1e14c5cdc5d1ab8a40a9ca6a9805e0e7":"sharePost"},"",""] */ __turbopack_context__.s([
    "sharePost",
    ()=>sharePost
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/server-reference.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/supabase-server.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/cache.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-validate.js [app-rsc] (ecmascript)");
;
;
;
async function sharePost(prevState, formData) {
    const url = formData.get('url');
    const familyId = formData.get('familyId');
    if (!url || !familyId) {
        return {
            success: false,
            message: 'URL is required'
        };
    }
    // Basic URL validation and platform detection
    let platform = '';
    if (url.includes('instagram.com')) {
        platform = 'instagram';
    } else if (url.includes('facebook.com')) {
        platform = 'facebook';
    } else {
        return {
            success: false,
            message: 'Only Instagram and Facebook URLs are supported'
        };
    }
    const supabase = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2d$server$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerSupabaseClient"])();
    try {
        const { error } = await supabase.from('social_posts').insert({
            family_id: familyId,
            permalink: url,
            platform_post_id: url,
            platform: platform,
            post_type: 'link',
            posted_at: new Date().toISOString(),
            content: ''
        });
        if (error) {
            console.error('Error inserting post:', error);
            return {
                success: false,
                message: `Failed to share post: ${error.message}`
            };
        }
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$cache$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["revalidatePath"])('/social');
        return {
            success: true,
            message: 'Post shared successfully!'
        };
    } catch (error) {
        console.error('Server error:', error);
        return {
            success: false,
            message: 'Internal server error'
        };
    }
}
;
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$validate$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["ensureServerEntryExports"])([
    sharePost
]);
(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$server$2d$reference$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerServerReference"])(sharePost, "60403b1f8f1e14c5cdc5d1ab8a40a9ca6a9805e0e7", null);
}),
"[project]/apps/web/.next-internal/server/app/(dashboard)/social/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/app/actions/social.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$actions$2f$social$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/app/actions/social.ts [app-rsc] (ecmascript)");
;
}),
"[project]/apps/web/.next-internal/server/app/(dashboard)/social/page/actions.js { ACTIONS_MODULE0 => \"[project]/apps/web/src/app/actions/social.ts [app-rsc] (ecmascript)\" } [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "60403b1f8f1e14c5cdc5d1ab8a40a9ca6a9805e0e7",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$actions$2f$social$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["sharePost"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f2e$next$2d$internal$2f$server$2f$app$2f28$dashboard$292f$social$2f$page$2f$actions$2e$js__$7b$__ACTIONS_MODULE0__$3d3e$__$225b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$actions$2f$social$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$2922$__$7d$__$5b$app$2d$rsc$5d$__$28$server__actions__loader$2c$__ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i('[project]/apps/web/.next-internal/server/app/(dashboard)/social/page/actions.js { ACTIONS_MODULE0 => "[project]/apps/web/src/app/actions/social.ts [app-rsc] (ecmascript)" } [app-rsc] (server actions loader, ecmascript) <locals>');
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$app$2f$actions$2f$social$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/app/actions/social.ts [app-rsc] (ecmascript)");
}),
];

//# sourceMappingURL=apps_web_1a2f81f6._.js.map