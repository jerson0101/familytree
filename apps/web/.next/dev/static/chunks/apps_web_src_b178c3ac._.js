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
"[project]/apps/web/src/hooks/useDYKQuiz.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDYKQuiz",
    ()=>useDYKQuiz
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamily.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamilyTree.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
function useDYKQuiz() {
    _s();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useDYKQuiz.useMemo[supabase]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])()
    }["useDYKQuiz.useMemo[supabase]"], []);
    const { currentFamily } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamily"])();
    const { persons, unions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamilyTree"])();
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [responses, setResponses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        totalQuestions: 0,
        answered: 0,
        correct: 0,
        score: 0,
        level: 'beginner',
        categoryProgress: {
            maternal: 0,
            paternal: 0,
            self: 0,
            extended: 0
        }
    });
    // Generate questions based on family data
    const generateQuestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDYKQuiz.useCallback[generateQuestions]": ()=>{
            if (persons.length === 0) return [];
            const generatedQuestions = [];
            persons.forEach({
                "useDYKQuiz.useCallback[generateQuestions]": (person, index)=>{
                    const personName = `${person.firstName} ${person.lastName || ''}`.trim();
                    // Birth date question
                    if (person.birthDate) {
                        const birthYear = new Date(person.birthDate).getFullYear();
                        const wrongYears = [
                            birthYear - 2,
                            birthYear + 3,
                            birthYear - 5
                        ].filter({
                            "useDYKQuiz.useCallback[generateQuestions].wrongYears": (y)=>y > 1900
                        }["useDYKQuiz.useCallback[generateQuestions].wrongYears"]);
                        generatedQuestions.push({
                            id: `birth-year-${person.id}`,
                            question: `¿En qué año nació ${personName}?`,
                            category: index % 2 === 0 ? 'maternal' : 'paternal',
                            difficulty: 'medium',
                            answerType: 'multiple_choice',
                            options: shuffleArray([
                                birthYear.toString(),
                                ...wrongYears.map(String)
                            ]),
                            correctAnswer: birthYear.toString(),
                            relatedPersonId: person.id,
                            relatedPersonName: personName,
                            points: 10
                        });
                        // Birth month question
                        const birthMonth = new Date(person.birthDate).toLocaleDateString('es', {
                            month: 'long'
                        });
                        const months = [
                            'enero',
                            'febrero',
                            'marzo',
                            'abril',
                            'mayo',
                            'junio',
                            'julio',
                            'agosto',
                            'septiembre',
                            'octubre',
                            'noviembre',
                            'diciembre'
                        ];
                        const wrongMonths = months.filter({
                            "useDYKQuiz.useCallback[generateQuestions].wrongMonths": (m)=>m !== birthMonth.toLowerCase()
                        }["useDYKQuiz.useCallback[generateQuestions].wrongMonths"]).slice(0, 3);
                        generatedQuestions.push({
                            id: `birth-month-${person.id}`,
                            question: `¿En qué mes nació ${personName}?`,
                            category: index % 2 === 0 ? 'maternal' : 'paternal',
                            difficulty: 'hard',
                            answerType: 'multiple_choice',
                            options: shuffleArray([
                                birthMonth,
                                ...wrongMonths
                            ]),
                            correctAnswer: birthMonth,
                            relatedPersonId: person.id,
                            relatedPersonName: personName,
                            points: 15
                        });
                    }
                    // Birth place question
                    if (person.birthPlace) {
                        generatedQuestions.push({
                            id: `birth-place-${person.id}`,
                            question: `¿Dónde nació ${personName}?`,
                            category: index % 2 === 0 ? 'maternal' : 'paternal',
                            difficulty: 'hard',
                            answerType: 'text',
                            correctAnswer: person.birthPlace,
                            relatedPersonId: person.id,
                            relatedPersonName: personName,
                            points: 20
                        });
                    }
                    // Gender question
                    generatedQuestions.push({
                        id: `gender-${person.id}`,
                        question: `¿${personName} es hombre o mujer?`,
                        category: 'extended',
                        difficulty: 'easy',
                        answerType: 'multiple_choice',
                        options: [
                            'Hombre',
                            'Mujer'
                        ],
                        correctAnswer: person.gender === 'male' ? 'Hombre' : 'Mujer',
                        relatedPersonId: person.id,
                        relatedPersonName: personName,
                        points: 5
                    });
                    // Is living question
                    generatedQuestions.push({
                        id: `living-${person.id}`,
                        question: `¿${personName} está vivo/a actualmente?`,
                        category: 'extended',
                        difficulty: 'easy',
                        answerType: 'yes_no',
                        options: [
                            'Sí',
                            'No'
                        ],
                        correctAnswer: person.isLiving ? 'Sí' : 'No',
                        relatedPersonId: person.id,
                        relatedPersonName: personName,
                        points: 5
                    });
                }
            }["useDYKQuiz.useCallback[generateQuestions]"]);
            // Relationship questions from unions
            unions.forEach({
                "useDYKQuiz.useCallback[generateQuestions]": (union)=>{
                    const partner1 = persons.find({
                        "useDYKQuiz.useCallback[generateQuestions].partner1": (p)=>p.id === union.partner1Id
                    }["useDYKQuiz.useCallback[generateQuestions].partner1"]);
                    const partner2 = persons.find({
                        "useDYKQuiz.useCallback[generateQuestions].partner2": (p)=>p.id === union.partner2Id
                    }["useDYKQuiz.useCallback[generateQuestions].partner2"]);
                    if (partner1 && partner2) {
                        const p1Name = `${partner1.firstName} ${partner1.lastName || ''}`.trim();
                        const p2Name = `${partner2.firstName} ${partner2.lastName || ''}`.trim();
                        generatedQuestions.push({
                            id: `spouse-${union.id}`,
                            question: `¿Quién es el/la esposo/a de ${p1Name}?`,
                            category: 'extended',
                            difficulty: 'medium',
                            answerType: 'multiple_choice',
                            options: shuffleArray([
                                p2Name,
                                ...persons.filter({
                                    "useDYKQuiz.useCallback[generateQuestions]": (p)=>p.id !== partner2.id && p.id !== partner1.id
                                }["useDYKQuiz.useCallback[generateQuestions]"]).slice(0, 3).map({
                                    "useDYKQuiz.useCallback[generateQuestions]": (p)=>`${p.firstName} ${p.lastName || ''}`.trim()
                                }["useDYKQuiz.useCallback[generateQuestions]"])
                            ]),
                            correctAnswer: p2Name,
                            relatedPersonId: partner1.id,
                            relatedPersonName: p1Name,
                            points: 10
                        });
                        // Marriage year question
                        if (union.startDate) {
                            const marriageYear = new Date(union.startDate).getFullYear();
                            const wrongYears = [
                                marriageYear - 3,
                                marriageYear + 2,
                                marriageYear - 7
                            ];
                            generatedQuestions.push({
                                id: `marriage-year-${union.id}`,
                                question: `¿En qué año se casaron ${p1Name} y ${p2Name}?`,
                                category: 'extended',
                                difficulty: 'hard',
                                answerType: 'multiple_choice',
                                options: shuffleArray([
                                    marriageYear.toString(),
                                    ...wrongYears.map(String)
                                ]),
                                correctAnswer: marriageYear.toString(),
                                relatedPersonId: union.id,
                                points: 15
                            });
                        }
                    }
                }
            }["useDYKQuiz.useCallback[generateQuestions]"]);
            // Count family members question
            if (persons.length > 0) {
                const wrongCounts = [
                    persons.length - 2,
                    persons.length + 3,
                    persons.length + 1
                ].filter({
                    "useDYKQuiz.useCallback[generateQuestions].wrongCounts": (n)=>n > 0
                }["useDYKQuiz.useCallback[generateQuestions].wrongCounts"]);
                generatedQuestions.push({
                    id: 'family-count',
                    question: '¿Cuántas personas hay en tu árbol familiar?',
                    category: 'self',
                    difficulty: 'easy',
                    answerType: 'multiple_choice',
                    options: shuffleArray([
                        persons.length.toString(),
                        ...wrongCounts.map(String)
                    ]),
                    correctAnswer: persons.length.toString(),
                    points: 5
                });
            }
            return shuffleArray(generatedQuestions);
        }
    }["useDYKQuiz.useCallback[generateQuestions]"], [
        persons,
        unions
    ]);
    // Fetch existing responses from database
    const fetchResponses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDYKQuiz.useCallback[fetchResponses]": async ()=>{
            if (!currentFamily?.id) return;
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) return;
                const { data, error } = await supabase.from('dyk_responses').select('question_id, response, is_correct, completed_at').eq('family_id', currentFamily.id).eq('user_id', user.id);
                if (error) {
                    // Silently ignore if table doesn't exist - quiz works without persistence
                    const isTableMissing = error.message?.includes('does not exist') || error.message?.includes('Could not find');
                    if (!isTableMissing) {
                        console.error('Error fetching responses:', error);
                    }
                    return;
                }
                const mappedResponses = (data || []).map({
                    "useDYKQuiz.useCallback[fetchResponses].mappedResponses": (r)=>({
                            questionId: r.question_id,
                            response: r.response,
                            isCorrect: r.is_correct,
                            answeredAt: r.completed_at
                        })
                }["useDYKQuiz.useCallback[fetchResponses].mappedResponses"]);
                setResponses(mappedResponses);
            } catch (err) {
                console.error('Error:', err);
            }
        }
    }["useDYKQuiz.useCallback[fetchResponses]"], [
        currentFamily?.id,
        supabase
    ]);
    // Calculate stats
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDYKQuiz.useEffect": ()=>{
            const totalQuestions = questions.length;
            const answered = responses.length;
            const correct = responses.filter({
                "useDYKQuiz.useEffect": (r)=>r.isCorrect
            }["useDYKQuiz.useEffect"]).length;
            const score = answered > 0 ? Math.round(correct / answered * 100) : 0;
            let level = 'beginner';
            if (score >= 80) level = 'high';
            else if (score >= 50) level = 'medium';
            // Calculate category progress
            const categoryProgress = {
                maternal: 0,
                paternal: 0,
                self: 0,
                extended: 0
            };
            const categoryCounts = {
                maternal: 0,
                paternal: 0,
                self: 0,
                extended: 0
            };
            const categoryCorrect = {
                maternal: 0,
                paternal: 0,
                self: 0,
                extended: 0
            };
            questions.forEach({
                "useDYKQuiz.useEffect": (q)=>{
                    categoryCounts[q.category]++;
                    const response = responses.find({
                        "useDYKQuiz.useEffect.response": (r)=>r.questionId === q.id
                    }["useDYKQuiz.useEffect.response"]);
                    if (response?.isCorrect) {
                        categoryCorrect[q.category]++;
                    }
                }
            }["useDYKQuiz.useEffect"]);
            Object.keys(categoryProgress).forEach({
                "useDYKQuiz.useEffect": (cat)=>{
                    const key = cat;
                    categoryProgress[key] = categoryCounts[key] > 0 ? Math.round(categoryCorrect[key] / categoryCounts[key] * 100) : 0;
                }
            }["useDYKQuiz.useEffect"]);
            setStats({
                totalQuestions,
                answered,
                correct,
                score,
                level,
                categoryProgress
            });
        }
    }["useDYKQuiz.useEffect"], [
        questions,
        responses
    ]);
    // Load questions and responses
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useDYKQuiz.useEffect": ()=>{
            setIsLoading(true);
            const generated = generateQuestions();
            setQuestions(generated);
            fetchResponses().finally({
                "useDYKQuiz.useEffect": ()=>setIsLoading(false)
            }["useDYKQuiz.useEffect"]);
        }
    }["useDYKQuiz.useEffect"], [
        generateQuestions,
        fetchResponses
    ]);
    // Submit answer
    const submitAnswer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDYKQuiz.useCallback[submitAnswer]": async (questionId, answer)=>{
            if (!currentFamily?.id) return false;
            const question = questions.find({
                "useDYKQuiz.useCallback[submitAnswer].question": (q)=>q.id === questionId
            }["useDYKQuiz.useCallback[submitAnswer].question"]);
            if (!question) return false;
            // Check if answer is correct
            let isCorrect = false;
            if (question.answerType === 'text') {
                // For text answers, do case-insensitive comparison
                isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
            } else {
                isCorrect = answer === question.correctAnswer;
            }
            // Function to update local state
            const updateLocalState = {
                "useDYKQuiz.useCallback[submitAnswer].updateLocalState": ()=>{
                    setResponses({
                        "useDYKQuiz.useCallback[submitAnswer].updateLocalState": (prev)=>{
                            const existing = prev.findIndex({
                                "useDYKQuiz.useCallback[submitAnswer].updateLocalState.existing": (r)=>r.questionId === questionId
                            }["useDYKQuiz.useCallback[submitAnswer].updateLocalState.existing"]);
                            const newResponse = {
                                questionId,
                                response: answer,
                                isCorrect,
                                answeredAt: new Date().toISOString()
                            };
                            if (existing >= 0) {
                                const updated = [
                                    ...prev
                                ];
                                updated[existing] = newResponse;
                                return updated;
                            }
                            return [
                                ...prev,
                                newResponse
                            ];
                        }
                    }["useDYKQuiz.useCallback[submitAnswer].updateLocalState"]);
                }
            }["useDYKQuiz.useCallback[submitAnswer].updateLocalState"];
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    // Still update local state even without auth
                    updateLocalState();
                    return isCorrect;
                }
                // Save response directly with the generated question ID
                // No need to create a dyk_questions record for dynamically generated questions
                const pointsEarned = isCorrect ? question.points : 0;
                const { error: responseError } = await supabase.from('dyk_responses').upsert({
                    family_id: currentFamily.id,
                    user_id: user.id,
                    question_id: questionId,
                    response: answer,
                    is_correct: isCorrect,
                    points_earned: pointsEarned,
                    completed_at: new Date().toISOString()
                }, {
                    onConflict: 'family_id,user_id,question_id'
                });
                if (responseError) {
                    // Silently ignore if table doesn't exist - quiz still works locally
                    const isTableMissing = responseError.message?.includes('does not exist') || responseError.message?.includes('Could not find');
                    if (!isTableMissing) {
                        console.error('Error saving response:', responseError);
                    }
                }
                // Update local state
                updateLocalState();
                return isCorrect;
            } catch (err) {
                console.error('Error submitting answer:', err);
                return false;
            }
        }
    }["useDYKQuiz.useCallback[submitAnswer]"], [
        currentFamily?.id,
        questions,
        supabase
    ]);
    // Get unanswered questions for quiz
    const getQuizQuestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useDYKQuiz.useCallback[getQuizQuestions]": (count = 10)=>{
            const answeredIds = new Set(responses.map({
                "useDYKQuiz.useCallback[getQuizQuestions]": (r)=>r.questionId
            }["useDYKQuiz.useCallback[getQuizQuestions]"]));
            const unanswered = questions.filter({
                "useDYKQuiz.useCallback[getQuizQuestions].unanswered": (q)=>!answeredIds.has(q.id)
            }["useDYKQuiz.useCallback[getQuizQuestions].unanswered"]);
            return unanswered.slice(0, count);
        }
    }["useDYKQuiz.useCallback[getQuizQuestions]"], [
        questions,
        responses
    ]);
    return {
        questions,
        responses,
        stats,
        isLoading,
        submitAnswer,
        getQuizQuestions,
        refreshQuestions: ()=>{
            const generated = generateQuestions();
            setQuestions(generated);
        }
    };
}
_s(useDYKQuiz, "v1Ibj1TSc+ONeor8goNtgPfiuxk=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamily"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamilyTree"]
    ];
});
// Utility function to shuffle array
function shuffleArray(array) {
    const shuffled = [
        ...array
    ];
    for(let i = shuffled.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [
            shuffled[j],
            shuffled[i]
        ];
    }
    return shuffled;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/apps/web/src/app/(dashboard)/dyk/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DYKPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/layout/Container.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Grid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/layout/Grid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useDYKQuiz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useDYKQuiz.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamily.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamilyTree.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/supabase.ts [app-client] (ecmascript)");
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
function DYKPage() {
    _s();
    const { stats, isLoading: quizLoading, questions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useDYKQuiz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDYKQuiz"])();
    const { currentFamily, isLoading: familyLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamily"])();
    const { persons } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamilyTree"])();
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DYKPage.useMemo[supabase]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])()
    }["DYKPage.useMemo[supabase]"], []);
    const [challenges, setChallenges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoadingChallenges, setIsLoadingChallenges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // Fetch detective challenges
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "DYKPage.useEffect": ()=>{
            async function fetchChallenges() {
                setIsLoadingChallenges(true);
                try {
                    const { data, error } = await supabase.from('detective_challenges').select('id, title, description, points, difficulty').eq('is_active', true).limit(3);
                    if (error) {
                        console.error('Error fetching challenges:', error);
                        // Use default challenges if fetch fails
                        setChallenges([
                            {
                                id: '1',
                                title: 'Interview a Grandparent',
                                description: 'Record a conversation with a grandparent about their childhood',
                                points: 50,
                                difficulty: 'medium'
                            },
                            {
                                id: '2',
                                title: 'Find an Old Photo',
                                description: 'Locate and digitize a photo from before 1980',
                                points: 25,
                                difficulty: 'easy'
                            },
                            {
                                id: '3',
                                title: 'Research Immigration Records',
                                description: 'Find immigration records for an ancestor',
                                points: 100,
                                difficulty: 'hard'
                            }
                        ]);
                    } else {
                        setChallenges(data || []);
                    }
                } catch (err) {
                    console.error('Error:', err);
                } finally{
                    setIsLoadingChallenges(false);
                }
            }
            fetchChallenges();
        }
    }["DYKPage.useEffect"], [
        supabase
    ]);
    const categories = [
        {
            id: 'maternal',
            name: 'Maternal Line',
            icon: '👩',
            progress: stats.categoryProgress.maternal
        },
        {
            id: 'paternal',
            name: 'Paternal Line',
            icon: '👨',
            progress: stats.categoryProgress.paternal
        },
        {
            id: 'self',
            name: 'Personal History',
            icon: '🪞',
            progress: stats.categoryProgress.self
        },
        {
            id: 'extended',
            name: 'Extended Family',
            icon: '👨‍👩‍👧‍👦',
            progress: stats.categoryProgress.extended
        }
    ];
    // Calculate knowledge gaps based on family data
    const knowledgeGaps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "DYKPage.useMemo[knowledgeGaps]": ()=>{
            const gaps = [];
            // Check for missing birth dates
            const missingBirthDates = persons.filter({
                "DYKPage.useMemo[knowledgeGaps].missingBirthDates": (p)=>!p.birthDate
            }["DYKPage.useMemo[knowledgeGaps].missingBirthDates"]);
            if (missingBirthDates.length > 0) {
                gaps.push({
                    title: 'Birth Dates',
                    description: `${missingBirthDates.length} person(s) missing birth date`,
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CalendarIcon, {}, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 104,
                        columnNumber: 15
                    }, this)
                });
            }
            // Check for missing birth places
            const missingBirthPlaces = persons.filter({
                "DYKPage.useMemo[knowledgeGaps].missingBirthPlaces": (p)=>!p.birthPlace
            }["DYKPage.useMemo[knowledgeGaps].missingBirthPlaces"]);
            if (missingBirthPlaces.length > 0) {
                gaps.push({
                    title: 'Birth Places',
                    description: `${missingBirthPlaces.length} person(s) missing birth place`,
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GlobeIcon, {}, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 114,
                        columnNumber: 15
                    }, this)
                });
            }
            // Check for older generations
            const generations = new Set(persons.map({
                "DYKPage.useMemo[knowledgeGaps]": (p)=>{
                    if (p.birthDate) {
                        const year = new Date(p.birthDate).getFullYear();
                        return Math.floor((2024 - year) / 25);
                    }
                    return 0;
                }
            }["DYKPage.useMemo[knowledgeGaps]"]));
            if (generations.size < 3) {
                gaps.push({
                    title: 'More Generations',
                    description: 'Add information about grandparents and great-grandparents',
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UserQuestionIcon, {}, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 131,
                        columnNumber: 15
                    }, this)
                });
            }
            // If no gaps found, show encouragement
            if (gaps.length === 0) {
                gaps.push({
                    title: 'Great Job!',
                    description: 'Your family tree is quite complete',
                    icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StarIcon, {}, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 140,
                        columnNumber: 15
                    }, this)
                });
            }
            return gaps.slice(0, 3);
        }
    }["DYKPage.useMemo[knowledgeGaps]"], [
        persons
    ]);
    const isLoading = quizLoading || familyLoading;
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
            size: "lg",
            padding: false,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                            width: 200,
                            height: 32
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                            width: 300,
                            height: 20,
                            className: "mt-2"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                    lineNumber: 152,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                    height: 200,
                    className: "mb-6 rounded-2xl"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                    lineNumber: 156,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                            height: 300,
                            className: "rounded-2xl"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 158,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                            height: 300,
                            className: "rounded-2xl"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 159,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                    lineNumber: 157,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
            lineNumber: 151,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
        size: "lg",
        padding: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-gradient-primary",
                                children: "Do You Know?"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 170,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-neutral-500 mt-1",
                                children: "Test your family knowledge"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 171,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 169,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dyk/challenges",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "outline",
                                    leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TrophyIcon, {}, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                        lineNumber: 175,
                                        columnNumber: 49
                                    }, void 0),
                                    children: "Challenges"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 175,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 174,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: "/dyk/quiz",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                    leftIcon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(PlayIcon, {}, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                        lineNumber: 180,
                                        columnNumber: 31
                                    }, void 0),
                                    children: "Start Quiz"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 180,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 179,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 173,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 168,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative mb-6 overflow-hidden rounded-2xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/10 animate-float"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 190,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-white/5 animate-float",
                        style: {
                            animationDelay: '1s'
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 191,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-1/2 left-1/3 w-32 h-32 rounded-full bg-accent-400/20 animate-pulse-glow"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 192,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        padding: "lg",
                        className: "relative bg-gradient-hero text-white border-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-white/70 mb-1 font-medium",
                                            children: "Your Family Knowledge Score"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                            lineNumber: 197,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-baseline gap-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-6xl font-bold",
                                                    children: [
                                                        stats.score,
                                                        "%"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                    className: "bg-white/20 text-white border-white/30 backdrop-blur-sm",
                                                    children: stats.level === 'high' ? 'Expert' : stats.level === 'medium' ? 'Intermediate' : 'Beginner'
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                    lineNumber: 200,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                            lineNumber: 198,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-white/70 mt-3",
                                            children: [
                                                stats.correct,
                                                " out of ",
                                                stats.answered,
                                                " questions answered correctly"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                            lineNumber: 204,
                                            columnNumber: 15
                                        }, this),
                                        questions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-white/50 text-sm mt-1",
                                            children: [
                                                questions.length - stats.answered,
                                                " questions available"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                            lineNumber: 208,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 196,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CircularProgress, {
                                        value: stats.score,
                                        size: 140
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                        lineNumber: 214,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 213,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 195,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 188,
                columnNumber: 7
            }, this),
            !currentFamily && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                padding: "lg",
                className: "mb-6 bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 text-white shadow-lg shadow-amber-200",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AlertIcon, {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 225,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 224,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-amber-900",
                                    children: "Create your family first"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 228,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-amber-700 text-sm",
                                    children: "To generate quiz questions, you first need to create your family and add people."
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 229,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 227,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                children: "Go to Home"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 234,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 233,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                    lineNumber: 223,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 222,
                columnNumber: 9
            }, this),
            currentFamily && persons.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                padding: "lg",
                className: "mb-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-3 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg shadow-blue-200",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(UsersIcon, {
                                className: "w-6 h-6"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 245,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 244,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex-1",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-blue-900",
                                    children: "Add people to your tree"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 248,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-blue-700 text-sm",
                                    children: "Quiz questions are generated from your family tree. Add people to start!"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 249,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 247,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: "/tree",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                size: "sm",
                                children: "Go to Tree"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 254,
                                columnNumber: 15
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 253,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                    lineNumber: 243,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 242,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Grid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Grid"], {
                cols: 2,
                gap: "lg",
                responsive: true,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        padding: "md",
                        className: "hover-lift",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                title: "Quiz Categories",
                                subtitle: "Your progress by family line"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 263,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-5",
                                        children: categories.map((category, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-4 animate-slide-up",
                                                style: {
                                                    animationDelay: `${index * 100}ms`
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-12 h-12 rounded-xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center text-2xl",
                                                        children: category.icon
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                        lineNumber: 272,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between mb-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm font-semibold text-neutral-800",
                                                                        children: category.name
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                                        lineNumber: 277,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-sm font-bold text-primary-600",
                                                                        children: [
                                                                            category.progress,
                                                                            "%"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                                        lineNumber: 280,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                                lineNumber: 276,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-2.5 bg-neutral-100 rounded-full overflow-hidden",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "h-full rounded-full transition-all duration-700 ease-out progress-bar-gradient",
                                                                    style: {
                                                                        width: `${category.progress}%`
                                                                    }
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                                    lineNumber: 283,
                                                                    columnNumber: 23
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                                lineNumber: 282,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                        lineNumber: 275,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, category.id, true, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                lineNumber: 267,
                                                columnNumber: 17
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                        lineNumber: 265,
                                        columnNumber: 13
                                    }, this),
                                    questions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-8 pt-6 border-t border-neutral-100",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/dyk/quiz",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                fullWidth: true,
                                                className: "group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "mr-2",
                                                        children: stats.answered > 0 ? `Continue Quiz (${questions.length - stats.answered} remaining)` : `Start Quiz (${questions.length} questions)`
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                        lineNumber: 297,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArrowRightIcon, {
                                                        className: "w-4 h-4 group-hover:translate-x-1 transition-transform"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                        lineNumber: 302,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                lineNumber: 296,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                            lineNumber: 295,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                        lineNumber: 294,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 264,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 262,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        padding: "md",
                        className: "hover-lift",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                title: "Detective Challenges",
                                subtitle: "Earn points by researching your family",
                                action: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    href: "/dyk/challenges",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                        variant: "ghost",
                                        size: "sm",
                                        children: "View all"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                        lineNumber: 317,
                                        columnNumber: 17
                                    }, void 0)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 316,
                                    columnNumber: 15
                                }, void 0)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 312,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                children: isLoadingChallenges ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            height: 80,
                                            className: "rounded-xl"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                            lineNumber: 326,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            height: 80,
                                            className: "rounded-xl"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                            lineNumber: 327,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                                            height: 80,
                                            className: "rounded-xl"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                            lineNumber: 328,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 325,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "space-y-3",
                                    children: challenges.map((challenge, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "p-4 rounded-xl border border-neutral-100 hover:border-primary-200 bg-white hover:bg-gradient-to-r hover:from-primary-50/50 hover:to-transparent transition-all cursor-pointer group animate-slide-up",
                                            style: {
                                                animationDelay: `${index * 100}ms`
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-start justify-between gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                className: "font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors",
                                                                children: challenge.title
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                                lineNumber: 340,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm text-neutral-500 mt-1",
                                                                children: challenge.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                                lineNumber: 343,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                        lineNumber: 339,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: challenge.difficulty === 'easy' ? 'success' : challenge.difficulty === 'medium' ? 'warning' : 'error',
                                                        glow: true,
                                                        size: "sm",
                                                        children: [
                                                            challenge.points,
                                                            " pts"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                        lineNumber: 347,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                                lineNumber: 338,
                                                columnNumber: 21
                                            }, this)
                                        }, challenge.id, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                            lineNumber: 333,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 331,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 323,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 311,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                        padding: "md",
                        className: "col-span-full hover-lift",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                title: "Improvement Areas",
                                subtitle: "Missing information in your family tree"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 370,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                                    children: knowledgeGaps.map((gap, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(GapCard, {
                                            title: gap.title,
                                            description: gap.description,
                                            icon: gap.icon,
                                            delay: index * 100
                                        }, index, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                            lineNumber: 374,
                                            columnNumber: 17
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 372,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                lineNumber: 371,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 369,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 260,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
        lineNumber: 166,
        columnNumber: 5
    }, this);
}
_s(DYKPage, "MdF+hcWRzBEtk/juI7RzgbR/wXo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useDYKQuiz$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useDYKQuiz"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamily"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamilyTree"]
    ];
});
_c = DYKPage;
function CircularProgress({ value, size }) {
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - value / 100 * circumference;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative",
        style: {
            width: size,
            height: size
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 rounded-full blur-xl opacity-50",
                style: {
                    background: `conic-gradient(from 0deg, rgba(255,255,255,0.3) ${value}%, transparent ${value}%)`
                }
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 399,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "transform -rotate-90 relative z-10",
                width: size,
                height: size,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: size / 2,
                        cy: size / 2,
                        r: radius,
                        stroke: "rgba(255,255,255,0.2)",
                        strokeWidth: strokeWidth,
                        fill: "none"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 406,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("linearGradient", {
                            id: "progressGradient",
                            x1: "0%",
                            y1: "0%",
                            x2: "100%",
                            y2: "0%",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "0%",
                                    stopColor: "white"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 417,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("stop", {
                                    offset: "100%",
                                    stopColor: "rgba(255,255,255,0.7)"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                                    lineNumber: 418,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 416,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 415,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                        cx: size / 2,
                        cy: size / 2,
                        r: radius,
                        stroke: "url(#progressGradient)",
                        strokeWidth: strokeWidth,
                        fill: "none",
                        strokeLinecap: "round",
                        strokeDasharray: circumference,
                        strokeDashoffset: offset,
                        className: "transition-all duration-1000 ease-out",
                        style: {
                            filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))'
                        }
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                        lineNumber: 421,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 404,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-4xl font-bold",
                            children: value
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 437,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "text-xl opacity-70",
                            children: "%"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                            lineNumber: 438,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                    lineNumber: 436,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 435,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
        lineNumber: 397,
        columnNumber: 5
    }, this);
}
_c1 = CircularProgress;
function GapCard({ title, description, icon, delay = 0 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "p-5 rounded-2xl bg-gradient-to-br from-accent-50 to-amber-50 border border-accent-100 hover:border-accent-200 transition-all hover:-translate-y-1 cursor-pointer animate-slide-up",
        style: {
            animationDelay: `${delay}ms`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-12 h-12 rounded-xl bg-gradient-to-br from-accent-400 to-amber-400 flex items-center justify-center mb-4 text-white shadow-lg shadow-accent-200",
                children: icon
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 461,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                className: "font-semibold text-neutral-900",
                children: title
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 464,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-sm text-neutral-600 mt-1",
                children: description
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 465,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
        lineNumber: 457,
        columnNumber: 5
    }, this);
}
_c2 = GapCard;
// Icons
function TrophyIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 22V8M14 22V8"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 474,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M18 2H6v7a6 6 0 0012 0V2z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 475,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
        lineNumber: 473,
        columnNumber: 5
    }, this);
}
_c3 = TrophyIcon;
function PlayIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-4 h-4",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
            points: "5 3 19 12 5 21 5 3"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
            lineNumber: 483,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
        lineNumber: 482,
        columnNumber: 5
    }, this);
}
_c4 = PlayIcon;
function ArrowRightIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-4 h-4',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M5 12h14M12 5l7 7-7 7"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
            lineNumber: 491,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
        lineNumber: 490,
        columnNumber: 5
    }, this);
}
_c5 = ArrowRightIcon;
function UserQuestionIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "8",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 499,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 500,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
        lineNumber: 498,
        columnNumber: 5
    }, this);
}
_c6 = UserQuestionIcon;
function CalendarIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "3",
                y: "4",
                width: "18",
                height: "18",
                rx: "2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 508,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16 2v4M8 2v4M3 10h18"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 509,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
        lineNumber: 507,
        columnNumber: 5
    }, this);
}
_c7 = CalendarIcon;
function GlobeIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5",
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
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 517,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 518,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
        lineNumber: 516,
        columnNumber: 5
    }, this);
}
_c8 = GlobeIcon;
function StarIcon() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: "w-5 h-5",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
            points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
            lineNumber: 526,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
        lineNumber: 525,
        columnNumber: 5
    }, this);
}
_c9 = StarIcon;
function AlertIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
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
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 534,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 8v4M12 16h.01"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 535,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
        lineNumber: 533,
        columnNumber: 5
    }, this);
}
_c10 = AlertIcon;
function UsersIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 543,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 544,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
                lineNumber: 545,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/page.tsx",
        lineNumber: 542,
        columnNumber: 5
    }, this);
}
_c11 = UsersIcon;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "DYKPage");
__turbopack_context__.k.register(_c1, "CircularProgress");
__turbopack_context__.k.register(_c2, "GapCard");
__turbopack_context__.k.register(_c3, "TrophyIcon");
__turbopack_context__.k.register(_c4, "PlayIcon");
__turbopack_context__.k.register(_c5, "ArrowRightIcon");
__turbopack_context__.k.register(_c6, "UserQuestionIcon");
__turbopack_context__.k.register(_c7, "CalendarIcon");
__turbopack_context__.k.register(_c8, "GlobeIcon");
__turbopack_context__.k.register(_c9, "StarIcon");
__turbopack_context__.k.register(_c10, "AlertIcon");
__turbopack_context__.k.register(_c11, "UsersIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_b178c3ac._.js.map