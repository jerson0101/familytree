(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/hooks/useFamily.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFamily",
    ()=>useFamily
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$familyStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/stores/familyStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/stores/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/supabase.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function useFamily() {
    _s();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "useFamily.useAuthStore[user]": (state)=>state.user
    }["useFamily.useAuthStore[user]"]);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useFamily.useMemo[supabase]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])()
    }["useFamily.useMemo[supabase]"], []);
    const { currentFamily, families, members, currentUserRole, isLoading, setCurrentFamily, setFamilies, setMembers, setCurrentUserRole, setLoading, reset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$familyStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamilyStore"])();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch user's families on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useFamily.useEffect": ()=>{
            if (user?.id) {
                fetchFamilies();
            } else {
                reset();
            }
        }
    }["useFamily.useEffect"], [
        user?.id
    ]);
    // Fetch family members when current family changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useFamily.useEffect": ()=>{
            if (currentFamily?.id && user?.id) {
                fetchMembers(currentFamily.id);
                fetchUserRole(currentFamily.id);
            }
        }
    }["useFamily.useEffect"], [
        currentFamily?.id,
        user?.id
    ]);
    const fetchFamilies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamily.useCallback[fetchFamilies]": async ()=>{
            if (!user?.id) return;
            setLoading(true);
            setError(null);
            try {
                // Get families where user is a member
                const { data: memberData, error: memberError } = await supabase.from('family_members').select(`
          family_id,
          role,
          families (
            id,
            name,
            description,
            primary_color,
            created_at
          )
        `).eq('user_id', user.id).eq('is_active', true);
                if (memberError) throw memberError;
                const familyList = (memberData || []).filter({
                    "useFamily.useCallback[fetchFamilies].familyList": (m)=>m.families
                }["useFamily.useCallback[fetchFamilies].familyList"]).map({
                    "useFamily.useCallback[fetchFamilies].familyList": (m)=>({
                            id: m.families.id,
                            name: m.families.name,
                            description: m.families.description,
                            primaryColor: m.families.primary_color || '#0ea5e9',
                            createdAt: m.families.created_at,
                            memberCount: 0
                        })
                }["useFamily.useCallback[fetchFamilies].familyList"]);
                setFamilies(familyList);
                // Auto-select first family if none selected
                if (familyList.length > 0 && !currentFamily) {
                    setCurrentFamily(familyList[0]);
                }
            } catch (err) {
                console.error('Error fetching families:', err);
                setError('Error loading families');
            } finally{
                setLoading(false);
            }
        }
    }["useFamily.useCallback[fetchFamilies]"], [
        user?.id,
        currentFamily,
        setFamilies,
        setCurrentFamily,
        setLoading
    ]);
    const fetchMembers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamily.useCallback[fetchMembers]": async (familyId)=>{
            try {
                const { data, error } = await supabase.from('family_members').select(`
          id,
          user_id,
          person_id,
          role,
          accepted_at,
          is_active
        `).eq('family_id', familyId).eq('is_active', true);
                if (error) throw error;
                // Fetch user profiles separately to avoid join issues
                const userIds = (data || []).map({
                    "useFamily.useCallback[fetchMembers].userIds": (m)=>m.user_id
                }["useFamily.useCallback[fetchMembers].userIds"]);
                let profilesMap = {};
                if (userIds.length > 0) {
                    const { data: profiles } = await supabase.from('user_profiles').select('id, email, first_name, last_name, avatar_url').in('id', userIds);
                    if (profiles) {
                        profilesMap = profiles.reduce({
                            "useFamily.useCallback[fetchMembers]": (acc, p)=>{
                                acc[p.id] = p;
                                return acc;
                            }
                        }["useFamily.useCallback[fetchMembers]"], {});
                    }
                }
                const memberList = (data || []).map({
                    "useFamily.useCallback[fetchMembers].memberList": (m)=>{
                        const profile = profilesMap[m.user_id] || {};
                        return {
                            id: m.id,
                            userId: m.user_id,
                            personId: m.person_id || undefined,
                            role: m.role,
                            email: profile.email || '',
                            displayName: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'User',
                            avatarUrl: profile.avatar_url,
                            joinedAt: m.accepted_at || '',
                            isActive: m.is_active
                        };
                    }
                }["useFamily.useCallback[fetchMembers].memberList"]);
                setMembers(memberList);
                // Update member count in current family
                if (currentFamily) {
                    setCurrentFamily({
                        ...currentFamily,
                        memberCount: memberList.length
                    });
                }
            } catch (err) {
                console.error('Error fetching members:', err);
                setMembers([]);
            }
        }
    }["useFamily.useCallback[fetchMembers]"], [
        currentFamily,
        setMembers,
        setCurrentFamily
    ]);
    const fetchUserRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamily.useCallback[fetchUserRole]": async (familyId)=>{
            if (!user?.id) return;
            try {
                const { data, error } = await supabase.from('family_members').select('role').eq('family_id', familyId).eq('user_id', user.id).eq('is_active', true).maybeSingle();
                if (error) throw error;
                // data will be null if no record found, which is valid
                setCurrentUserRole(data?.role || null);
            } catch (err) {
                console.error('Error fetching user role:', err);
                setCurrentUserRole(null);
            }
        }
    }["useFamily.useCallback[fetchUserRole]"], [
        user?.id,
        setCurrentUserRole
    ]);
    const createFamily = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamily.useCallback[createFamily]": async (input)=>{
            if (!user?.id) return null;
            setError(null);
            try {
                const { data, error } = await supabase.from('families').insert({
                    name: input.name,
                    description: input.description,
                    primary_color: input.primaryColor || '#0ea5e9',
                    created_by: user.id
                }).select().single();
                if (error) throw error;
                const newFamily = {
                    id: data.id,
                    name: data.name,
                    description: data.description,
                    primaryColor: data.primary_color,
                    createdAt: data.created_at,
                    memberCount: 1
                };
                // Refresh families list
                await fetchFamilies();
                // Set as current family
                setCurrentFamily(newFamily);
                return newFamily;
            } catch (err) {
                console.error('Error creating family:', err);
                setError('Error creating family');
                return null;
            }
        }
    }["useFamily.useCallback[createFamily]"], [
        user?.id,
        fetchFamilies,
        setCurrentFamily
    ]);
    const inviteMember = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamily.useCallback[inviteMember]": async (email, role = 'viewer')=>{
            if (!currentFamily?.id || !user?.id) return false;
            setError(null);
            try {
                // First, find the user by email
                const { data: userData, error: userError } = await supabase.from('user_profiles').select('id').eq('email', email).single();
                if (userError || !userData) {
                    setError('User not found with that email');
                    return false;
                }
                // Add them as a family member
                const { error: memberError } = await supabase.from('family_members').insert({
                    family_id: currentFamily.id,
                    user_id: userData.id,
                    role,
                    invited_by: user.id
                });
                if (memberError) {
                    if (memberError.code === '23505') {
                        setError('User is already a member of this family');
                    } else {
                        throw memberError;
                    }
                    return false;
                }
                // Refresh members
                await fetchMembers(currentFamily.id);
                return true;
            } catch (err) {
                console.error('Error inviting member:', err);
                setError('Error inviting member');
                return false;
            }
        }
    }["useFamily.useCallback[inviteMember]"], [
        currentFamily?.id,
        user?.id,
        fetchMembers
    ]);
    const updateMemberRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamily.useCallback[updateMemberRole]": async (memberId, newRole)=>{
            if (!currentFamily?.id) return false;
            try {
                const { error } = await supabase.from('family_members').update({
                    role: newRole
                }).eq('id', memberId);
                if (error) throw error;
                await fetchMembers(currentFamily.id);
                return true;
            } catch (err) {
                console.error('Error updating member role:', err);
                return false;
            }
        }
    }["useFamily.useCallback[updateMemberRole]"], [
        currentFamily?.id,
        fetchMembers
    ]);
    const removeMember = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamily.useCallback[removeMember]": async (memberId)=>{
            if (!currentFamily?.id) return false;
            try {
                const { error } = await supabase.from('family_members').update({
                    is_active: false
                }).eq('id', memberId);
                if (error) throw error;
                await fetchMembers(currentFamily.id);
                return true;
            } catch (err) {
                console.error('Error removing member:', err);
                return false;
            }
        }
    }["useFamily.useCallback[removeMember]"], [
        currentFamily?.id,
        fetchMembers
    ]);
    const switchFamily = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamily.useCallback[switchFamily]": (familyId)=>{
            const family = families.find({
                "useFamily.useCallback[switchFamily].family": (f)=>f.id === familyId
            }["useFamily.useCallback[switchFamily].family"]);
            if (family) {
                setCurrentFamily(family);
            }
        }
    }["useFamily.useCallback[switchFamily]"], [
        families,
        setCurrentFamily
    ]);
    const canEdit = currentUserRole === 'admin' || currentUserRole === 'editor';
    const isAdmin = currentUserRole === 'admin';
    return {
        currentFamily,
        families,
        members,
        currentUserRole,
        isLoading,
        error,
        canEdit,
        isAdmin,
        fetchFamilies,
        createFamily,
        inviteMember,
        updateMemberRole,
        removeMember,
        switchFamily
    };
}
_s(useFamily, "c05F2DyJ4zApdHKOhTe/runfGng=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$familyStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamilyStore"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/app/(dashboard)/settings/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SettingsPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamily.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/stores/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/auth-provider.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
function SettingsPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { signOut } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"])();
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "SettingsPage.useAuthStore[user]": (state)=>state.user
    }["SettingsPage.useAuthStore[user]"]);
    const { currentFamily, currentUserRole, isLoading: familyLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamily"])();
    const [familyName, setFamilyName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [primaryColor, setPrimaryColor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('#ff6b47');
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSigningOut, setIsSigningOut] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Update local state when family data loads
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SettingsPage.useEffect": ()=>{
            if (currentFamily) {
                setFamilyName(currentFamily.name);
                setPrimaryColor(currentFamily.primaryColor || '#ff6b47');
            }
        }
    }["SettingsPage.useEffect"], [
        currentFamily
    ]);
    const handleSignOut = async ()=>{
        setIsSigningOut(true);
        try {
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        } finally{
            setIsSigningOut(false);
        }
    };
    const handleSaveChanges = async ()=>{
        setIsSaving(true);
        // TODO: Implement save functionality
        setTimeout(()=>setIsSaving(false), 1000);
    };
    if (familyLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SettingsSkeleton, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
            lineNumber: 53,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-3xl mx-auto px-4 pt-8 pb-24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-10 animate-fade-in",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl font-bold text-neutral-900 tracking-tight",
                        children: "Settings"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                        lineNumber: 60,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-neutral-500 mt-2 text-lg",
                        children: "Manage your account and family preferences"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                        lineNumber: 61,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 59,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "space-y-8 animate-slide-up",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserIcon, {
                                        className: "w-5 h-5 text-neutral-400"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                        lineNumber: 70,
                                        columnNumber: 13
                                    }, this),
                                    "Your Profile"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                lineNumber: 69,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col md:flex-row items-center gap-6 mb-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                        name: `${user?.firstName || ''} ${user?.lastName || ''}`,
                                        src: user?.avatarUrl,
                                        size: "xl",
                                        className: "w-24 h-24 text-2xl"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                        lineNumber: 75,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-center md:text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "text-xl font-bold text-neutral-900",
                                                children: [
                                                    user?.firstName,
                                                    " ",
                                                    user?.lastName
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                lineNumber: 82,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-neutral-500 mb-2",
                                                children: user?.email
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                lineNumber: 85,
                                                columnNumber: 15
                                            }, this),
                                            currentUserRole && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "inline-flex items-center px-3 py-1 rounded-full bg-neutral-100 text-neutral-600 text-xs font-bold uppercase tracking-wider",
                                                children: currentUserRole
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                lineNumber: 87,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                        lineNumber: 81,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "md:ml-auto",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            className: "px-5 py-2.5 rounded-full border border-neutral-200 text-neutral-600 font-medium text-sm hover:bg-neutral-50 hover:text-neutral-900 transition-colors",
                                            children: "Edit Profile"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 93,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                        lineNumber: 92,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                lineNumber: 74,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-neutral-900 mb-6 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UsersIcon, {
                                        className: "w-5 h-5 text-neutral-400"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                        lineNumber: 103,
                                        columnNumber: 13
                                    }, this),
                                    "Family Preferences"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                lineNumber: 102,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-bold text-neutral-900 mb-2",
                                                children: "Family Name"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                lineNumber: 109,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: familyName,
                                                onChange: (e)=>setFamilyName(e.target.value),
                                                className: "w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all",
                                                placeholder: "e.g. The Garcia Family"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                lineNumber: 112,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                        lineNumber: 108,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-sm font-bold text-neutral-900 mb-4",
                                                children: "Theme Color"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                lineNumber: 122,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap gap-3",
                                                children: [
                                                    '#ff6b47',
                                                    '#3b82f6',
                                                    '#10b981',
                                                    '#8b5cf6',
                                                    '#ec4899',
                                                    '#f59e0b',
                                                    '#000000'
                                                ].map((color)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setPrimaryColor(color),
                                                        className: `w-10 h-10 rounded-full transition-transform hover:scale-110 flex items-center justify-center ${primaryColor === color ? 'ring-2 ring-offset-2 ring-neutral-900' : ''}`,
                                                        style: {
                                                            backgroundColor: color
                                                        },
                                                        "aria-label": `Select color ${color}`,
                                                        children: primaryColor === color && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckIcon, {
                                                            className: "w-5 h-5 text-white"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                            lineNumber: 135,
                                                            columnNumber: 48
                                                        }, this)
                                                    }, color, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                        lineNumber: 127,
                                                        columnNumber: 19
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                lineNumber: 125,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                        lineNumber: 121,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "pt-4 flex justify-end",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: handleSaveChanges,
                                            disabled: isSaving,
                                            className: "px-6 py-3 rounded-full bg-neutral-900 text-white font-bold text-sm shadow-md hover:bg-neutral-800 disabled:opacity-50 transition-all flex items-center gap-2",
                                            children: [
                                                isSaving && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Spinner, {
                                                    className: "w-4 h-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                    lineNumber: 147,
                                                    columnNumber: 30
                                                }, this),
                                                "Save Changes"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 142,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                        lineNumber: 141,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                lineNumber: 107,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                        lineNumber: 101,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/settings/members",
                                className: "group",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all h-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UsersIcon, {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                lineNumber: 160,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 159,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-neutral-900 mb-1",
                                            children: "Members"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 162,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-neutral-500",
                                            children: "Manage access and roles"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 163,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                    lineNumber: 158,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                lineNumber: 157,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/security",
                                className: "group",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all h-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ShieldIcon, {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                lineNumber: 171,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 170,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-neutral-900 mb-1",
                                            children: "Security"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 173,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-neutral-500",
                                            children: "Password and privacy"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 174,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                    lineNumber: 169,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                lineNumber: 168,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "group cursor-pointer",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all h-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BellIcon, {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                lineNumber: 182,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 181,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-neutral-900 mb-1",
                                            children: "Notifications"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 184,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-neutral-500",
                                            children: "Alert preferences"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 185,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                    lineNumber: 180,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "group cursor-pointer",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all h-full",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HelpIcon, {
                                                className: "w-5 h-5"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                                lineNumber: 193,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 192,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "font-bold text-neutral-900 mb-1",
                                            children: "Help & Support"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 195,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-neutral-500",
                                            children: "FAQs and contact"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                            lineNumber: 196,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                    lineNumber: 191,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                        lineNumber: 155,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "pt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleSignOut,
                                disabled: isSigningOut,
                                className: "w-full flex items-center justify-center gap-2 p-4 rounded-2xl text-red-600 font-bold hover:bg-red-50 transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LogOutIcon, {
                                        className: "w-5 h-5"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                        lineNumber: 208,
                                        columnNumber: 13
                                    }, this),
                                    isSigningOut ? 'Signing out...' : 'Sign Out'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-center text-xs text-neutral-400 mt-4",
                                children: "KinTree v2.0.0"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 66,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
        lineNumber: 57,
        columnNumber: 5
    }, this);
}
_s(SettingsPage, "XZYLUMa4Lrl6AiTkWw4oc0RAxxo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$auth$2d$provider$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuth"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamily"]
    ];
});
_c = SettingsPage;
function SettingsSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-3xl mx-auto px-4 pt-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                width: 150,
                height: 40,
                className: "mb-2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 223,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                width: 250,
                height: 24,
                className: "mb-10"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                height: 200,
                className: "rounded-3xl mb-8"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 226,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                height: 300,
                className: "rounded-3xl mb-8"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 227,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        height: 140,
                        className: "rounded-3xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                        lineNumber: 230,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                        height: 140,
                        className: "rounded-3xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 229,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
        lineNumber: 222,
        columnNumber: 5
    }, this);
}
_c1 = SettingsSkeleton;
// Icons
function UserIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 241,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 242,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
        lineNumber: 240,
        columnNumber: 5
    }, this);
}
_c2 = UserIcon;
function UsersIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 250,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 251,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M23 21v-2a4 4 0 0 0-3-3.87"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 252,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16 3.13a4 4 0 0 1 0 7.75"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 253,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
        lineNumber: 249,
        columnNumber: 5
    }, this);
}
_c3 = UsersIcon;
function CheckIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "3",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
            points: "20 6 9 17 4 12"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
            lineNumber: 261,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
        lineNumber: 260,
        columnNumber: 5
    }, this);
}
_c4 = CheckIcon;
function Spinner({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: `animate-spin ${className}`,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                className: "opacity-25",
                cx: "12",
                cy: "12",
                r: "10",
                stroke: "currentColor",
                strokeWidth: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 269,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                className: "opacity-75",
                fill: "currentColor",
                d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
        lineNumber: 268,
        columnNumber: 5
    }, this);
}
_c5 = Spinner;
function ShieldIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
            lineNumber: 278,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
        lineNumber: 277,
        columnNumber: 5
    }, this);
}
_c6 = ShieldIcon;
function BellIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 286,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M13.73 21a2 2 0 0 1-3.46 0"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 287,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
        lineNumber: 285,
        columnNumber: 5
    }, this);
}
_c7 = BellIcon;
function HelpIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 295,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 296,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "17",
                x2: "12.01",
                y2: "17"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 297,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
        lineNumber: 294,
        columnNumber: 5
    }, this);
}
_c8 = HelpIcon;
function LogOutIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 305,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polyline", {
                points: "16 17 21 12 16 7"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 306,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "21",
                y1: "12",
                x2: "9",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
                lineNumber: 307,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/settings/page.tsx",
        lineNumber: 304,
        columnNumber: 5
    }, this);
}
_c9 = LogOutIcon;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "SettingsPage");
__turbopack_context__.k.register(_c1, "SettingsSkeleton");
__turbopack_context__.k.register(_c2, "UserIcon");
__turbopack_context__.k.register(_c3, "UsersIcon");
__turbopack_context__.k.register(_c4, "CheckIcon");
__turbopack_context__.k.register(_c5, "Spinner");
__turbopack_context__.k.register(_c6, "ShieldIcon");
__turbopack_context__.k.register(_c7, "BellIcon");
__turbopack_context__.k.register(_c8, "HelpIcon");
__turbopack_context__.k.register(_c9, "LogOutIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_f9308085._.js.map