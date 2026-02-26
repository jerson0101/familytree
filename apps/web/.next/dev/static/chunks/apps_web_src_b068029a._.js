(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/lib/supabase.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient,
    "getSupabaseClient",
    ()=>getSupabaseClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/index.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/ssr/dist/module/createBrowserClient.js [app-client] (ecmascript)");
;
// Browser client singleton
let browserClient = null;
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
function createClient() {
    if (browserClient) return browserClient;
    const { url, key } = getEnvVars();
    browserClient = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$ssr$2f$dist$2f$module$2f$createBrowserClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createBrowserClient"])(url, key);
    return browserClient;
}
function getSupabaseClient() {
    return createClient();
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/stores/authStore.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAuthStore",
    ()=>useAuthStore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/react.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/zustand/esm/middleware.mjs [app-client] (ecmascript)");
;
;
// Helper to convert Supabase user to our User type
function mapSupabaseUser(supabaseUser) {
    const metadata = supabaseUser.user_metadata || {};
    // Try to get first_name/last_name directly (custom signup)
    // Then try given_name/family_name (Google OAuth)
    // Finally fallback to parsing full_name/name
    let firstName = metadata.first_name || metadata.given_name || '';
    let lastName = metadata.last_name || metadata.family_name || '';
    if (!firstName && !lastName) {
        const fullName = metadata.full_name || metadata.name || '';
        const nameParts = fullName.split(' ');
        firstName = nameParts[0] || '';
        lastName = nameParts.slice(1).join(' ') || '';
    }
    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        firstName,
        lastName,
        avatarUrl: metadata.avatar_url || metadata.picture
    };
}
// Helper to convert Supabase session to our Session type
function mapSupabaseSession(supabaseSession) {
    return {
        accessToken: supabaseSession.access_token,
        refreshToken: supabaseSession.refresh_token || '',
        expiresAt: supabaseSession.expires_at || 0
    };
}
const useAuthStore = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$react$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["create"])()((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$zustand$2f$esm$2f$middleware$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["persist"])((set, get)=>({
        user: null,
        session: null,
        isLoading: true,
        isAuthenticated: false,
        setUser: (user)=>set({
                user,
                isAuthenticated: !!user
            }),
        setSession: (session)=>set({
                session
            }),
        setLoading: (isLoading)=>set({
                isLoading
            }),
        login: (user, session)=>set({
                user,
                session,
                isAuthenticated: true,
                isLoading: false
            }),
        logout: ()=>set({
                user: null,
                session: null,
                isAuthenticated: false
            }),
        updateUser: (updates)=>set((state)=>({
                    user: state.user ? {
                        ...state.user,
                        ...updates
                    } : null
                })),
        syncWithSupabase: (supabaseUser, supabaseSession)=>{
            if (supabaseUser && supabaseSession) {
                set({
                    user: mapSupabaseUser(supabaseUser),
                    session: mapSupabaseSession(supabaseSession),
                    isAuthenticated: true,
                    isLoading: false
                });
            } else {
                set({
                    user: null,
                    session: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            }
        }
    }), {
    name: 'kintree-auth',
    partialize: (state)=>({
            user: state.user,
            session: state.session,
            isAuthenticated: state.isAuthenticated
        })
}));
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/lib/auth-provider.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/stores/authStore.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    _s();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [session, setSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])();
    const syncWithSupabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "AuthProvider.useAuthStore[syncWithSupabase]": (state)=>state.syncWithSupabase
    }["AuthProvider.useAuthStore[syncWithSupabase]"]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            // Get initial session
            const getSession = {
                "AuthProvider.useEffect.getSession": async ()=>{
                    const { data: { session } } = await supabase.auth.getSession();
                    setSession(session);
                    setUser(session?.user ?? null);
                    setIsLoading(false);
                    // Sync with Zustand store
                    syncWithSupabase(session?.user ?? null, session);
                }
            }["AuthProvider.useEffect.getSession"];
            getSession();
            // Listen for auth changes
            const { data: { subscription } } = supabase.auth.onAuthStateChange({
                "AuthProvider.useEffect": (_event, newSession)=>{
                    setSession(newSession);
                    setUser(newSession?.user ?? null);
                    setIsLoading(false);
                    // Sync with Zustand store
                    syncWithSupabase(newSession?.user ?? null, newSession);
                }
            }["AuthProvider.useEffect"]);
            return ({
                "AuthProvider.useEffect": ()=>{
                    subscription.unsubscribe();
                }
            })["AuthProvider.useEffect"];
        }
    }["AuthProvider.useEffect"], [
        supabase,
        syncWithSupabase
    ]);
    const signIn = async (email, password)=>{
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password
        });
        return {
            error: error
        };
    };
    const signUp = async (email, password, metadata)=>{
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: metadata?.firstName || '',
                    last_name: metadata?.lastName || '',
                    full_name: `${metadata?.firstName || ''} ${metadata?.lastName || ''}`.trim()
                }
            }
        });
        return {
            error: error,
            session: data?.session || null
        };
    };
    const signOut = async ()=>{
        await supabase.auth.signOut();
    };
    const resetPassword = async (email)=>{
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`
        });
        return {
            error: error
        };
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            session,
            isLoading,
            signIn,
            signUp,
            signOut,
            resetPassword
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/apps/web/src/lib/auth-provider.tsx",
        lineNumber: 95,
        columnNumber: 5
    }, this);
}
_s(AuthProvider, "0zEML/mE26A5YZUOJ0ISjeWeFmI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"]
    ];
});
_c = AuthProvider;
function useAuth() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
_s1(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/app/providers.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Providers",
    ()=>Providers
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/query-core/build/modern/queryClient.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@tanstack/react-query/build/modern/QueryClientProvider.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function Providers({ children }) {
    _s();
    const [queryClient] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        "Providers.useState": ()=>new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$query$2d$core$2f$build$2f$modern$2f$queryClient$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClient"]({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1000,
                        refetchOnWindowFocus: false
                    }
                }
            })
    }["Providers.useState"]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$tanstack$2f$react$2d$query$2f$build$2f$modern$2f$QueryClientProvider$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["QueryClientProvider"], {
        client: queryClient,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthProvider"], {
            children: children
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/providers.tsx",
            lineNumber: 27,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/providers.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
_s(Providers, "NDy0rYRCCRbNK0KkPSnOUHe68QM=");
_c = Providers;
var _c;
__turbopack_context__.k.register(_c, "Providers");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_b068029a._.js.map