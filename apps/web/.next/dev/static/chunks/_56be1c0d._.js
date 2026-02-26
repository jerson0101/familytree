(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/hooks/useFamilyTree.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFamilyTree",
    ()=>useFamilyTree
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
function useFamilyTree() {
    _s();
    const [persons, setPersons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [unions, setUnions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [graphData, setGraphData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        nodes: [],
        edges: [],
        persons: [],
        unions: []
    });
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const createPersonWithRelationship = async (personOptions, relatedPersonId, relationshipType)=>{
        return {
            success: true
        };
    };
    const getRootPerson = ()=>{
        return persons.length > 0 ? persons[0] : null;
    };
    const getPersonRole = (personId)=>{
        return 'relative';
    };
    const updatePerson = async (personId, updates)=>{
        return {
            success: true
        };
    };
    const deletePerson = async (personId)=>{
        return {
            success: true
        };
    };
    const getParentsOfPerson = (personId)=>{
        return [];
    };
    return {
        persons,
        unions,
        graphData,
        isLoading,
        createPersonWithRelationship,
        getRootPerson,
        getPersonRole,
        updatePerson,
        deletePerson,
        getParentsOfPerson
    };
}
_s(useFamilyTree, "EWRdrm7oVkuy2FreF5S8FAukAfY=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
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
"[project]/apps/web/src/hooks/useLocationTracking.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useLocationTracking",
    ()=>useLocationTracking
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamily.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function useLocationTracking() {
    _s();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useLocationTracking.useMemo[supabase]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])()
    }["useLocationTracking.useMemo[supabase]"], []);
    const { currentFamily } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamily"])();
    const [permissionStatus, setPermissionStatus] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('prompt');
    const [isTracking, setIsTracking] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [currentLocation, setCurrentLocation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [familyLocations, setFamilyLocations] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        shareLocation: false,
        shareWithAll: true,
        sharePreciseLocation: true,
        updateFrequency: 'realtime'
    });
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Check if geolocation is available
    const isGeolocationAvailable = typeof navigator !== 'undefined' && 'geolocation' in navigator;
    // Check permission status
    const checkPermission = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLocationTracking.useCallback[checkPermission]": async ()=>{
            if (!isGeolocationAvailable) {
                setPermissionStatus('unavailable');
                return 'unavailable';
            }
            try {
                const result = await navigator.permissions.query({
                    name: 'geolocation'
                });
                setPermissionStatus(result.state);
                result.onchange = ({
                    "useLocationTracking.useCallback[checkPermission]": ()=>{
                        setPermissionStatus(result.state);
                    }
                })["useLocationTracking.useCallback[checkPermission]"];
                return result.state;
            } catch  {
                // Some browsers don't support permissions API
                setPermissionStatus('prompt');
                return 'prompt';
            }
        }
    }["useLocationTracking.useCallback[checkPermission]"], [
        isGeolocationAvailable
    ]);
    // Request location permission
    const requestPermission = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLocationTracking.useCallback[requestPermission]": async ()=>{
            if (!isGeolocationAvailable) {
                setError('Geolocation not available on this device');
                return false;
            }
            return new Promise({
                "useLocationTracking.useCallback[requestPermission]": (resolve)=>{
                    navigator.geolocation.getCurrentPosition({
                        "useLocationTracking.useCallback[requestPermission]": (position)=>{
                            setPermissionStatus('granted');
                            setCurrentLocation({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                accuracy: position.coords.accuracy,
                                altitude: position.coords.altitude || undefined,
                                heading: position.coords.heading || undefined,
                                speed: position.coords.speed || undefined
                            });
                            resolve(true);
                        }
                    }["useLocationTracking.useCallback[requestPermission]"], {
                        "useLocationTracking.useCallback[requestPermission]": (error)=>{
                            if (error.code === error.PERMISSION_DENIED) {
                                setPermissionStatus('denied');
                                setError('Location permission denied');
                            } else {
                                setError('Error getting location');
                            }
                            resolve(false);
                        }
                    }["useLocationTracking.useCallback[requestPermission]"], {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    });
                }
            }["useLocationTracking.useCallback[requestPermission]"]);
        }
    }["useLocationTracking.useCallback[requestPermission]"], [
        isGeolocationAvailable
    ]);
    // Reverse geocode to get address
    const reverseGeocode = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLocationTracking.useCallback[reverseGeocode]": async (lat, lng)=>{
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`, {
                    headers: {
                        'User-Agent': 'KinTree Family App'
                    }
                });
                if (!response.ok) return {};
                const data = await response.json();
                const addr = data.address || {};
                return {
                    address: data.display_name?.split(',').slice(0, 2).join(',') || undefined,
                    city: addr.city || addr.town || addr.village || addr.municipality || undefined,
                    country: addr.country || undefined
                };
            } catch  {
                return {};
            }
        }
    }["useLocationTracking.useCallback[reverseGeocode]"], []);
    // Update location in database
    const updateLocation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLocationTracking.useCallback[updateLocation]": async (location)=>{
            if (!currentFamily?.id) return;
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                // Get address if not provided
                let locationWithAddress = {
                    ...location
                };
                if (!location.address) {
                    const geoData = await reverseGeocode(location.latitude, location.longitude);
                    locationWithAddress = {
                        ...location,
                        ...geoData
                    };
                }
                // Get battery info if available
                let batteryLevel;
                let isCharging;
                if ('getBattery' in navigator) {
                    try {
                        const battery = await navigator.getBattery();
                        batteryLevel = Math.round(battery.level * 100);
                        isCharging = battery.charging;
                    } catch  {
                    // Battery API not available
                    }
                }
                const { error: rpcError } = await supabase.rpc('update_user_location', {
                    p_family_id: currentFamily.id,
                    p_latitude: locationWithAddress.latitude,
                    p_longitude: locationWithAddress.longitude,
                    p_accuracy: locationWithAddress.accuracy || null,
                    p_altitude: locationWithAddress.altitude || null,
                    p_heading: locationWithAddress.heading || null,
                    p_speed: locationWithAddress.speed || null,
                    p_address: locationWithAddress.address || null,
                    p_city: locationWithAddress.city || null,
                    p_country: locationWithAddress.country || null,
                    p_battery_level: batteryLevel || null,
                    p_is_charging: isCharging || null
                });
                if (rpcError) {
                    setError('Error updating location');
                    return;
                }
                setCurrentLocation(locationWithAddress);
                setError(null);
            } catch (err) {
                setError('Error updating location');
            }
        }
    }["useLocationTracking.useCallback[updateLocation]"], [
        currentFamily?.id,
        supabase,
        reverseGeocode
    ]);
    // Start tracking location
    const startTracking = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLocationTracking.useCallback[startTracking]": ()=>{
            if (!isGeolocationAvailable || permissionStatus !== 'granted') return ({
                "useLocationTracking.useCallback[startTracking]": ()=>{}
            })["useLocationTracking.useCallback[startTracking]"];
            let currentWatchId = null;
            let usingHighAccuracy = true;
            const handlePosition = {
                "useLocationTracking.useCallback[startTracking].handlePosition": (position)=>{
                    const location = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy,
                        altitude: position.coords.altitude || undefined,
                        heading: position.coords.heading || undefined,
                        speed: position.coords.speed || undefined
                    };
                    updateLocation(location);
                }
            }["useLocationTracking.useCallback[startTracking].handlePosition"];
            const handleError = {
                "useLocationTracking.useCallback[startTracking].handleError": (error)=>{
                    // If high accuracy fails, switch to low accuracy
                    if (usingHighAccuracy && (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE)) {
                        usingHighAccuracy = false;
                        if (currentWatchId !== null) navigator.geolocation.clearWatch(currentWatchId);
                        currentWatchId = navigator.geolocation.watchPosition(handlePosition, {
                            "useLocationTracking.useCallback[startTracking].handleError": (fallbackError)=>{
                                setError(`Error tracking location: ${fallbackError.message}`);
                            }
                        }["useLocationTracking.useCallback[startTracking].handleError"], {
                            enableHighAccuracy: false,
                            timeout: 30000,
                            maximumAge: 60000
                        });
                        return;
                    }
                    setError(`Error tracking location: ${error.message}`);
                }
            }["useLocationTracking.useCallback[startTracking].handleError"];
            currentWatchId = navigator.geolocation.watchPosition(handlePosition, handleError, {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            });
            return ({
                "useLocationTracking.useCallback[startTracking]": ()=>{
                    if (currentWatchId !== null) navigator.geolocation.clearWatch(currentWatchId);
                }
            })["useLocationTracking.useCallback[startTracking]"];
        }
    }["useLocationTracking.useCallback[startTracking]"], [
        isGeolocationAvailable,
        permissionStatus,
        updateLocation
    ]);
    // Fetch family members' locations
    const fetchFamilyLocations = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLocationTracking.useCallback[fetchFamilyLocations]": async ()=>{
            if (!currentFamily?.id) {
                setFamilyLocations([]);
                return;
            }
            try {
                const { data, error: rpcError } = await supabase.rpc('get_family_locations', {
                    p_family_id: currentFamily.id
                });
                if (rpcError) {
                    setError('Error fetching family locations');
                    setFamilyLocations([]);
                    return;
                }
                const locations = (data || []).map({
                    "useLocationTracking.useCallback[fetchFamilyLocations].locations": (loc)=>({
                            userId: loc.user_id,
                            personId: loc.person_id,
                            firstName: loc.first_name,
                            lastName: loc.last_name,
                            photoUrl: loc.photo_url,
                            latitude: parseFloat(loc.latitude),
                            longitude: parseFloat(loc.longitude),
                            accuracy: loc.accuracy ? parseFloat(loc.accuracy) : null,
                            address: loc.address,
                            city: loc.city,
                            batteryLevel: loc.battery_level,
                            isCharging: loc.is_charging || false,
                            lastUpdatedAt: loc.last_updated_at,
                            isOnline: loc.is_online
                        })
                }["useLocationTracking.useCallback[fetchFamilyLocations].locations"]);
                setFamilyLocations(locations);
                setError(null);
            } catch (err) {
                setError('Error fetching family locations');
                setFamilyLocations([]);
            }
        }
    }["useLocationTracking.useCallback[fetchFamilyLocations]"], [
        currentFamily?.id,
        supabase
    ]);
    // Load settings
    const loadSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLocationTracking.useCallback[loadSettings]": async ()=>{
            if (!currentFamily?.id) return;
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                const { data, error: queryError } = await supabase.from('location_sharing_settings').select('*').eq('user_id', user.id).eq('family_id', currentFamily.id).maybeSingle();
                if (queryError) {
                    setError('Error loading location settings');
                    return;
                }
                if (data) {
                    setSettings({
                        shareLocation: data.share_location,
                        shareWithAll: data.share_with_all,
                        sharePreciseLocation: data.share_precise_location,
                        updateFrequency: data.update_frequency
                    });
                }
            } catch (err) {
                setError('Error loading location settings');
            }
        }
    }["useLocationTracking.useCallback[loadSettings]"], [
        currentFamily?.id,
        supabase
    ]);
    // Save settings
    const saveSettings = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLocationTracking.useCallback[saveSettings]": async (newSettings)=>{
            if (!currentFamily?.id) return;
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                const updatedSettings = {
                    ...settings,
                    ...newSettings
                };
                const { error: upsertError } = await supabase.from('location_sharing_settings').upsert({
                    user_id: user.id,
                    family_id: currentFamily.id,
                    share_location: updatedSettings.shareLocation,
                    share_with_all: updatedSettings.shareWithAll,
                    share_precise_location: updatedSettings.sharePreciseLocation,
                    update_frequency: updatedSettings.updateFrequency,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'user_id,family_id'
                });
                if (upsertError) {
                    setError('Error saving settings');
                    return;
                }
                setSettings(updatedSettings);
                setError(null);
            } catch (err) {
                setError('Error saving settings');
            }
        }
    }["useLocationTracking.useCallback[saveSettings]"], [
        currentFamily?.id,
        supabase,
        settings
    ]);
    // Enable location sharing
    const enableLocationSharing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLocationTracking.useCallback[enableLocationSharing]": async ()=>{
            try {
                const hasPermission = await requestPermission();
                if (hasPermission) {
                    await saveSettings({
                        shareLocation: true
                    });
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Error enabling location sharing:', error);
                return false;
            }
        }
    }["useLocationTracking.useCallback[enableLocationSharing]"], [
        requestPermission,
        saveSettings
    ]);
    // Disable location sharing
    const disableLocationSharing = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useLocationTracking.useCallback[disableLocationSharing]": async ()=>{
            await saveSettings({
                shareLocation: false
            });
            setIsTracking(false);
        }
    }["useLocationTracking.useCallback[disableLocationSharing]"], [
        saveSettings
    ]);
    // Initialize on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLocationTracking.useEffect": ()=>{
            const init = {
                "useLocationTracking.useEffect.init": async ()=>{
                    setIsLoading(true);
                    await checkPermission();
                    await loadSettings();
                    await fetchFamilyLocations();
                    setIsLoading(false);
                }
            }["useLocationTracking.useEffect.init"];
            init();
        }
    }["useLocationTracking.useEffect"], [
        checkPermission,
        loadSettings,
        fetchFamilyLocations
    ]);
    // Auto-start tracking if enabled
    // Auto-start tracking if enabled
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLocationTracking.useEffect": ()=>{
            if (settings.shareLocation && permissionStatus === 'granted') {
                setIsTracking(true);
                const cleanup = startTracking();
                return ({
                    "useLocationTracking.useEffect": ()=>{
                        if (cleanup) cleanup();
                        setIsTracking(false);
                    }
                })["useLocationTracking.useEffect"];
            } else {
                setIsTracking(false);
            }
        }
    }["useLocationTracking.useEffect"], [
        settings.shareLocation,
        permissionStatus,
        startTracking
    ]);
    // Refresh family locations periodically
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useLocationTracking.useEffect": ()=>{
            if (!currentFamily?.id) return;
            const interval = setInterval(fetchFamilyLocations, 30000); // Every 30 seconds
            return ({
                "useLocationTracking.useEffect": ()=>clearInterval(interval)
            })["useLocationTracking.useEffect"];
        }
    }["useLocationTracking.useEffect"], [
        currentFamily?.id,
        fetchFamilyLocations
    ]);
    return {
        // State
        permissionStatus,
        isTracking,
        currentLocation,
        familyLocations,
        settings,
        isLoading,
        error,
        isGeolocationAvailable,
        // Actions
        requestPermission,
        enableLocationSharing,
        disableLocationSharing,
        saveSettings,
        refreshLocations: fetchFamilyLocations,
        updateLocationManually: updateLocation
    };
}
_s(useLocationTracking, "lS4fInUus/2SGfow6ebvNNTdu6Q=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamily"]
    ];
});
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/app/(dashboard)/security/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SecurityPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/layout/Container.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/navigation/Tabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamilyTree.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useLocationTracking$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useLocationTracking.ts [app-client] (ecmascript)");
;
;
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
// Dynamically import components
const FamilyMap = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/web/src/components/FamilyMap.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/apps/web/src/components/FamilyMap.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full h-full flex items-center justify-center bg-gradient-to-br from-neutral-50 to-primary-50/30",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-12 h-12 mx-auto mb-4 rounded-full border-4 border-primary-200 border-t-primary-500 animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                        lineNumber: 29,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-neutral-500",
                        children: "Loading map..."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                        lineNumber: 30,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
            lineNumber: 27,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
});
_c = FamilyMap;
const LocationPermissionModal = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$shared$2f$lib$2f$app$2d$dynamic$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/apps/web/src/components/LocationPermissionModal.tsx [app-client] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/apps/web/src/components/LocationPermissionModal.tsx [app-client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
_c1 = LocationPermissionModal;
function SecurityPage() {
    _s();
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('map');
    const [selectedMember, setSelectedMember] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [showPermissionModal, setShowPermissionModal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const { persons, isLoading: personsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamilyTree"])();
    const { familyLocations, settings, permissionStatus, isTracking, enableLocationSharing, disableLocationSharing, isLoading: locationLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useLocationTracking$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocationTracking"])();
    // Combine persons data with real location data
    const familyMembersWithLocation = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "SecurityPage.useMemo[familyMembersWithLocation]": ()=>{
            return persons.map({
                "SecurityPage.useMemo[familyMembersWithLocation]": (person)=>{
                    // Find real location data for this person
                    const locationData = familyLocations.find({
                        "SecurityPage.useMemo[familyMembersWithLocation].locationData": (loc)=>loc.personId === person.id
                    }["SecurityPage.useMemo[familyMembersWithLocation].locationData"]);
                    if (locationData) {
                        // Has real location data
                        const now = new Date();
                        const lastUpdate = new Date(locationData.lastUpdatedAt);
                        const minutesSinceUpdate = (now.getTime() - lastUpdate.getTime()) / 60000;
                        let status = 'offline';
                        if (minutesSinceUpdate < 5) {
                            status = 'online';
                        } else if (minutesSinceUpdate < 30) {
                            status = 'away';
                        }
                        return {
                            id: person.id,
                            name: `${person.firstName} ${person.lastName || ''}`.trim(),
                            photoUrl: person.photoUrl || locationData.photoUrl,
                            status,
                            lastSeen: locationData.lastUpdatedAt,
                            location: {
                                lat: locationData.latitude,
                                lng: locationData.longitude,
                                address: locationData.address || locationData.city || 'Unknown location'
                            },
                            batteryLevel: locationData.batteryLevel,
                            linkedUserId: locationData.userId
                        };
                    }
                    // No location data - check if has linked user
                    return {
                        id: person.id,
                        name: `${person.firstName} ${person.lastName || ''}`.trim(),
                        photoUrl: person.photoUrl || null,
                        status: 'offline',
                        lastSeen: null,
                        location: null,
                        batteryLevel: null,
                        linkedUserId: person.linkedUserId || null
                    };
                }
            }["SecurityPage.useMemo[familyMembersWithLocation]"]);
        }
    }["SecurityPage.useMemo[familyMembersWithLocation]"], [
        persons,
        familyLocations
    ]);
    const activeMembersCount = familyMembersWithLocation.filter((m)=>m.status !== 'offline').length;
    const membersWithLocationCount = familyMembersWithLocation.filter((m)=>m.location !== null).length;
    const isLoading = personsLoading || locationLoading;
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
            size: "full",
            padding: false,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                width: 200,
                                height: 32
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                lineNumber: 126,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                width: 300,
                                height: 20,
                                className: "mt-2"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                lineNumber: 127,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                        lineNumber: 125,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                    lineNumber: 124,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-4 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-1",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                height: 300,
                                className: "rounded-2xl"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                            lineNumber: 131,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                height: 600,
                                className: "rounded-2xl"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                lineNumber: 135,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                            lineNumber: 134,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                    lineNumber: 130,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
            lineNumber: 123,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
        size: "full",
        padding: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-gradient-primary",
                                children: "Family Security"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                lineNumber: 147,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-neutral-500 mt-1",
                                children: "Location tracking and safety zones"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                lineNumber: 148,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                        lineNumber: 146,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            permissionStatus === 'granted' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: settings.shareLocation ? 'primary' : 'outline',
                                leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LocationIcon, {}, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                    lineNumber: 155,
                                    columnNumber: 25
                                }, void 0),
                                onClick: ()=>settings.shareLocation ? disableLocationSharing() : enableLocationSharing(),
                                children: settings.shareLocation ? 'Sharing' : 'Share'
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                lineNumber: 153,
                                columnNumber: 13
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "primary",
                                leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LocationIcon, {}, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                    lineNumber: 163,
                                    columnNumber: 25
                                }, void 0),
                                onClick: ()=>setShowPermissionModal(true),
                                children: "Enable Location"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                lineNumber: 161,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/security/zones",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ZoneIcon, {}, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                        lineNumber: 170,
                                        columnNumber: 49
                                    }, void 0),
                                    children: "Zones"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                    lineNumber: 170,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/security/history",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HistoryIcon, {}, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 49
                                    }, void 0),
                                    children: "History"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                        lineNumber: 150,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 145,
                columnNumber: 7
            }, this),
            isTracking && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 flex items-center gap-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "w-3 h-3 rounded-full bg-green-500 animate-pulse"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                        lineNumber: 185,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-green-700",
                        children: "Your location is being shared with your family"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                        lineNumber: 186,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "sm",
                        onClick: disableLocationSharing,
                        className: "ml-auto text-green-600 hover:text-green-700",
                        children: "Disable"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                        lineNumber: 189,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 184,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-4 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-1 space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                padding: "md",
                                className: "hover-lift",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        title: "Family Members",
                                        subtitle: `${familyMembersWithLocation.length} members · ${membersWithLocationCount} with location`
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                        lineNumber: 204,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        children: familyMembersWithLocation.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center py-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UsersIcon, {
                                                        className: "w-8 h-8 text-primary-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                        lineNumber: 212,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                    lineNumber: 211,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-neutral-500 text-sm mb-3",
                                                    children: "No family members yet."
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                    lineNumber: 214,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                    href: "/tree",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                        variant: "outline",
                                                        size: "sm",
                                                        children: "Add members"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                        lineNumber: 216,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                    lineNumber: 215,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                            lineNumber: 210,
                                            columnNumber: 17
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-2",
                                            children: familyMembersWithLocation.map((member, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setSelectedMember(member.id),
                                                    className: `w-full flex items-center gap-3 p-3 rounded-xl transition-all animate-slide-up ${selectedMember === member.id ? 'bg-gradient-to-r from-primary-50 to-secondary-50 border border-primary-200 shadow-sm' : 'hover:bg-neutral-50 border border-transparent'}`,
                                                    style: {
                                                        animationDelay: `${index * 50}ms`
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "relative",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                                                    name: member.name,
                                                                    size: "md",
                                                                    ringColor: selectedMember === member.id ? 'primary' : undefined
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                                    lineNumber: 234,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: `absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${member.status === 'online' ? 'bg-gradient-to-br from-green-400 to-emerald-500 shadow-sm shadow-green-300' : member.status === 'away' ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-sm shadow-amber-300' : 'bg-neutral-300'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                                    lineNumber: 235,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                            lineNumber: 233,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 text-left min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "font-medium text-neutral-900 truncate",
                                                                    children: member.name
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                                    lineNumber: 245,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-neutral-500 truncate",
                                                                    children: member.location?.address || (member.linkedUserId ? 'Location not shared' : 'No linked account')
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                                    lineNumber: 246,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                            lineNumber: 244,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-end",
                                                            children: [
                                                                member.batteryLevel !== null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BatteryIndicator, {
                                                                    level: member.batteryLevel
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                                    lineNumber: 252,
                                                                    columnNumber: 27
                                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-neutral-300",
                                                                    children: "--"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                                    lineNumber: 254,
                                                                    columnNumber: 27
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs text-neutral-400 mt-1",
                                                                    children: member.lastSeen ? formatLastSeen(member.lastSeen) : 'Never'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                                    lineNumber: 256,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                            lineNumber: 250,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, member.id, true, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                    lineNumber: 224,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                            lineNumber: 222,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                        lineNumber: 208,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                lineNumber: 203,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                padding: "md",
                                variant: "glass",
                                className: "hover-lift",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                        title: "Security Status"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                        lineNumber: 269,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "space-y-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-neutral-700 font-medium",
                                                            children: "All safe"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                            lineNumber: 273,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                            variant: "success",
                                                            glow: true,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckIcon, {
                                                                    className: "w-3 h-3 mr-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                                    lineNumber: 275,
                                                                    columnNumber: 21
                                                                }, this),
                                                                "OK"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                            lineNumber: 274,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                    lineNumber: 272,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-neutral-600",
                                                            children: "Active members"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                            lineNumber: 280,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-bold text-primary-600",
                                                            children: activeMembersCount
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                            lineNumber: 281,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                    lineNumber: 279,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-neutral-600",
                                                            children: "Sharing location"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                            lineNumber: 284,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-bold text-neutral-800",
                                                            children: membersWithLocationCount
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                            lineNumber: 285,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                    lineNumber: 283,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-neutral-600",
                                                            children: "Alerts today"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                            lineNumber: 288,
                                                            columnNumber: 19
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "font-bold text-neutral-800",
                                                            children: "0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                            lineNumber: 289,
                                                            columnNumber: 19
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                    lineNumber: 287,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                            lineNumber: 271,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                        lineNumber: 270,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                        lineNumber: 202,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tabs"], {
                            value: activeTab,
                            onChange: setActiveTab,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabList"], {
                                    className: "mb-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabTrigger"], {
                                            value: "map",
                                            children: "Live Map"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                            lineNumber: 300,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabTrigger"], {
                                            value: "alerts",
                                            children: "Alerts"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                            lineNumber: 301,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                    lineNumber: 299,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabContent"], {
                                    value: "map",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative p-[2px] rounded-2xl bg-gradient-to-br from-primary-400 via-secondary-400 to-accent-400",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                            variant: "default",
                                            padding: "none",
                                            className: "h-[600px] rounded-2xl overflow-hidden",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FamilyMap, {
                                                members: familyMembersWithLocation.map((m)=>({
                                                        id: m.id,
                                                        name: m.name,
                                                        photoUrl: m.photoUrl,
                                                        status: m.status,
                                                        location: m.location,
                                                        isSelected: selectedMember === m.id
                                                    })),
                                                selectedMemberId: selectedMember,
                                                onMemberSelect: setSelectedMember,
                                                className: "w-full h-full"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                lineNumber: 308,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                            lineNumber: 307,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                        lineNumber: 306,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                    lineNumber: 304,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabContent"], {
                                    value: "alerts",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                        padding: "lg",
                                        className: "hover-lift",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "text-center py-16",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(BellIcon, {
                                                        className: "w-10 h-10 text-primary-500"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                        lineNumber: 329,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                    lineNumber: 328,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "text-xl font-semibold text-neutral-800 mb-3",
                                                    children: "No alerts"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                    lineNumber: 331,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-neutral-500 max-w-sm mx-auto",
                                                    children: "All your family members are in safe zones. You will receive notifications when someone enters or leaves a configured zone."
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                                    lineNumber: 332,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                            lineNumber: 327,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                        lineNumber: 326,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                                    lineNumber: 325,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                            lineNumber: 298,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                        lineNumber: 297,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 200,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(LocationPermissionModal, {
                isOpen: showPermissionModal,
                onClose: ()=>setShowPermissionModal(false),
                onEnable: enableLocationSharing,
                onSkip: ()=>setShowPermissionModal(false)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 344,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
}
_s(SecurityPage, "YdVmqYbOVH46vD8E2zLrjQCKEOY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamilyTree"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useLocationTracking$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLocationTracking"]
    ];
});
_c2 = SecurityPage;
function formatLastSeen(timestamp) {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
}
function BatteryIndicator({ level }) {
    const gradientClass = level > 50 ? 'from-green-400 to-emerald-500' : level > 20 ? 'from-amber-400 to-orange-500' : 'from-red-400 to-rose-500';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-1.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-5 h-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute inset-0 rounded-sm border border-neutral-300 overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: `h-full bg-gradient-to-r ${gradientClass} transition-all`,
                            style: {
                                width: `${level}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                            lineNumber: 376,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                        lineNumber: 375,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute -right-0.5 top-1/2 -translate-y-1/2 w-0.5 h-1.5 bg-neutral-300 rounded-r-full"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                        lineNumber: 381,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 374,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "text-xs font-medium text-neutral-600",
                children: [
                    level,
                    "%"
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 383,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
        lineNumber: 373,
        columnNumber: 5
    }, this);
}
_c3 = BatteryIndicator;
// Icons
function LocationIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 392,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "10",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 393,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
        lineNumber: 391,
        columnNumber: 5
    }, this);
}
_c4 = LocationIcon;
function ZoneIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: "12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 401,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 22V15.5M22 8.5L12 15.5 2 8.5"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 402,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
        lineNumber: 400,
        columnNumber: 5
    }, this);
}
_c5 = ZoneIcon;
function HistoryIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 410,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 6v6l4 2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 411,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
        lineNumber: 409,
        columnNumber: 5
    }, this);
}
_c6 = HistoryIcon;
function BellIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-4 h-4',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
            lineNumber: 419,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
        lineNumber: 418,
        columnNumber: 5
    }, this);
}
_c7 = BellIcon;
function CheckIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-4 h-4',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M20 6L9 17l-5-5"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
            lineNumber: 427,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
        lineNumber: 426,
        columnNumber: 5
    }, this);
}
_c8 = CheckIcon;
function UsersIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-4 h-4',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 435,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 436,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
                lineNumber: 437,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/security/page.tsx",
        lineNumber: 434,
        columnNumber: 5
    }, this);
}
_c9 = UsersIcon;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9;
__turbopack_context__.k.register(_c, "FamilyMap");
__turbopack_context__.k.register(_c1, "LocationPermissionModal");
__turbopack_context__.k.register(_c2, "SecurityPage");
__turbopack_context__.k.register(_c3, "BatteryIndicator");
__turbopack_context__.k.register(_c4, "LocationIcon");
__turbopack_context__.k.register(_c5, "ZoneIcon");
__turbopack_context__.k.register(_c6, "HistoryIcon");
__turbopack_context__.k.register(_c7, "BellIcon");
__turbopack_context__.k.register(_c8, "CheckIcon");
__turbopack_context__.k.register(_c9, "UsersIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "BailoutToCSR", {
    enumerable: true,
    get: function() {
        return BailoutToCSR;
    }
});
const _bailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/bailout-to-csr.js [app-client] (ecmascript)");
function BailoutToCSR({ reason, children }) {
    if (typeof window === 'undefined') {
        throw Object.defineProperty(new _bailouttocsr.BailoutToCSRError(reason), "__NEXT_ERROR_CODE", {
            value: "E394",
            enumerable: false,
            configurable: true
        });
    }
    return children;
} //# sourceMappingURL=dynamic-bailout-to-csr.js.map
}),
"[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "encodeURIPath", {
    enumerable: true,
    get: function() {
        return encodeURIPath;
    }
});
function encodeURIPath(file) {
    return file.split('/').map((p)=>encodeURIComponent(p)).join('/');
} //# sourceMappingURL=encode-uri-path.js.map
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "PreloadChunks", {
    enumerable: true,
    get: function() {
        return PreloadChunks;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _reactdom = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
const _workasyncstorageexternal = __turbopack_context__.r("[project]/node_modules/next/dist/server/app-render/work-async-storage.external.js [app-client] (ecmascript)");
const _encodeuripath = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/encode-uri-path.js [app-client] (ecmascript)");
const _deploymentid = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/deployment-id.js [app-client] (ecmascript)");
function PreloadChunks({ moduleIds }) {
    // Early return in client compilation and only load requestStore on server side
    if (typeof window !== 'undefined') {
        return null;
    }
    const workStore = _workasyncstorageexternal.workAsyncStorage.getStore();
    if (workStore === undefined) {
        return null;
    }
    const allFiles = [];
    // Search the current dynamic call unique key id in react loadable manifest,
    // and find the corresponding CSS files to preload
    if (workStore.reactLoadableManifest && moduleIds) {
        const manifest = workStore.reactLoadableManifest;
        for (const key of moduleIds){
            if (!manifest[key]) continue;
            const chunks = manifest[key].files;
            allFiles.push(...chunks);
        }
    }
    if (allFiles.length === 0) {
        return null;
    }
    const dplId = (0, _deploymentid.getDeploymentIdQueryOrEmptyString)();
    return /*#__PURE__*/ (0, _jsxruntime.jsx)(_jsxruntime.Fragment, {
        children: allFiles.map((chunk)=>{
            const href = `${workStore.assetPrefix}/_next/${(0, _encodeuripath.encodeURIPath)(chunk)}${dplId}`;
            const isCss = chunk.endsWith('.css');
            // If it's stylesheet we use `precedence` o help hoist with React Float.
            // For stylesheets we actually need to render the CSS because nothing else is going to do it so it needs to be part of the component tree.
            // The `preload` for stylesheet is not optional.
            if (isCss) {
                return /*#__PURE__*/ (0, _jsxruntime.jsx)("link", {
                    // @ts-ignore
                    precedence: "dynamic",
                    href: href,
                    rel: "stylesheet",
                    as: "style",
                    nonce: workStore.nonce
                }, chunk);
            } else {
                // If it's script we use ReactDOM.preload to preload the resources
                (0, _reactdom.preload)(href, {
                    as: 'script',
                    fetchPriority: 'low',
                    nonce: workStore.nonce
                });
                return null;
            }
        })
    });
} //# sourceMappingURL=preload-chunks.js.map
}),
"[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _jsxruntime = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/jsx-runtime.js [app-client] (ecmascript)");
const _react = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
const _dynamicbailouttocsr = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/dynamic-bailout-to-csr.js [app-client] (ecmascript)");
const _preloadchunks = __turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/preload-chunks.js [app-client] (ecmascript)");
// Normalize loader to return the module as form { default: Component } for `React.lazy`.
// Also for backward compatible since next/dynamic allows to resolve a component directly with loader
// Client component reference proxy need to be converted to a module.
function convertModule(mod) {
    // Check "default" prop before accessing it, as it could be client reference proxy that could break it reference.
    // Cases:
    // mod: { default: Component }
    // mod: Component
    // mod: { default: proxy(Component) }
    // mod: proxy(Component)
    const hasDefault = mod && 'default' in mod;
    return {
        default: hasDefault ? mod.default : mod
    };
}
const defaultOptions = {
    loader: ()=>Promise.resolve(convertModule(()=>null)),
    loading: null,
    ssr: true
};
function Loadable(options) {
    const opts = {
        ...defaultOptions,
        ...options
    };
    const Lazy = /*#__PURE__*/ (0, _react.lazy)(()=>opts.loader().then(convertModule));
    const Loading = opts.loading;
    function LoadableComponent(props) {
        const fallbackElement = Loading ? /*#__PURE__*/ (0, _jsxruntime.jsx)(Loading, {
            isLoading: true,
            pastDelay: true,
            error: null
        }) : null;
        // If it's non-SSR or provided a loading component, wrap it in a suspense boundary
        const hasSuspenseBoundary = !opts.ssr || !!opts.loading;
        const Wrap = hasSuspenseBoundary ? _react.Suspense : _react.Fragment;
        const wrapProps = hasSuspenseBoundary ? {
            fallback: fallbackElement
        } : {};
        const children = opts.ssr ? /*#__PURE__*/ (0, _jsxruntime.jsxs)(_jsxruntime.Fragment, {
            children: [
                typeof window === 'undefined' ? /*#__PURE__*/ (0, _jsxruntime.jsx)(_preloadchunks.PreloadChunks, {
                    moduleIds: opts.modules
                }) : null,
                /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                    ...props
                })
            ]
        }) : /*#__PURE__*/ (0, _jsxruntime.jsx)(_dynamicbailouttocsr.BailoutToCSR, {
            reason: "next/dynamic",
            children: /*#__PURE__*/ (0, _jsxruntime.jsx)(Lazy, {
                ...props
            })
        });
        return /*#__PURE__*/ (0, _jsxruntime.jsx)(Wrap, {
            ...wrapProps,
            children: children
        });
    }
    LoadableComponent.displayName = 'LoadableComponent';
    return LoadableComponent;
}
const _default = Loadable; //# sourceMappingURL=loadable.js.map
}),
"[project]/node_modules/next/dist/shared/lib/app-dynamic.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return dynamic;
    }
});
const _interop_require_default = __turbopack_context__.r("[project]/node_modules/@swc/helpers/cjs/_interop_require_default.cjs [app-client] (ecmascript)");
const _loadable = /*#__PURE__*/ _interop_require_default._(__turbopack_context__.r("[project]/node_modules/next/dist/shared/lib/lazy-dynamic/loadable.js [app-client] (ecmascript)"));
function dynamic(dynamicOptions, options) {
    const loadableOptions = {};
    if (typeof dynamicOptions === 'function') {
        loadableOptions.loader = dynamicOptions;
    }
    const mergedOptions = {
        ...loadableOptions,
        ...options
    };
    return (0, _loadable.default)({
        ...mergedOptions,
        modules: mergedOptions.loadableGenerated?.modules
    });
}
if ((typeof exports.default === 'function' || typeof exports.default === 'object' && exports.default !== null) && typeof exports.default.__esModule === 'undefined') {
    Object.defineProperty(exports.default, '__esModule', {
        value: true
    });
    Object.assign(exports.default, exports);
    module.exports = exports.default;
} //# sourceMappingURL=app-dynamic.js.map
}),
]);

//# sourceMappingURL=_56be1c0d._.js.map