module.exports = [
"[project]/apps/web/src/hooks/useFamily.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFamily",
    ()=>useFamily
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$familyStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/stores/familyStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/stores/authStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/supabase.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function useFamily() {
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((state)=>state.user);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])(), []);
    const { currentFamily, families, members, currentUserRole, isLoading, setCurrentFamily, setFamilies, setMembers, setCurrentUserRole, setLoading, reset } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$familyStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFamilyStore"])();
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch user's families on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (user?.id) {
            fetchFamilies();
        } else {
            reset();
        }
    }, [
        user?.id
    ]);
    // Fetch family members when current family changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (currentFamily?.id && user?.id) {
            fetchMembers(currentFamily.id);
            fetchUserRole(currentFamily.id);
        }
    }, [
        currentFamily?.id,
        user?.id
    ]);
    const fetchFamilies = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
            const familyList = (memberData || []).filter((m)=>m.families).map((m)=>({
                    id: m.families.id,
                    name: m.families.name,
                    description: m.families.description,
                    primaryColor: m.families.primary_color || '#0ea5e9',
                    createdAt: m.families.created_at,
                    memberCount: 0
                }));
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
    }, [
        user?.id,
        currentFamily,
        setFamilies,
        setCurrentFamily,
        setLoading
    ]);
    const fetchMembers = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (familyId)=>{
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
            const userIds = (data || []).map((m)=>m.user_id);
            let profilesMap = {};
            if (userIds.length > 0) {
                const { data: profiles } = await supabase.from('user_profiles').select('id, email, first_name, last_name, avatar_url').in('id', userIds);
                if (profiles) {
                    profilesMap = profiles.reduce((acc, p)=>{
                        acc[p.id] = p;
                        return acc;
                    }, {});
                }
            }
            const memberList = (data || []).map((m)=>{
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
            });
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
    }, [
        currentFamily,
        setMembers,
        setCurrentFamily
    ]);
    const fetchUserRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (familyId)=>{
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
    }, [
        user?.id,
        setCurrentUserRole
    ]);
    const createFamily = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (input)=>{
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
    }, [
        user?.id,
        fetchFamilies,
        setCurrentFamily
    ]);
    const inviteMember = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (email, role = 'viewer')=>{
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
    }, [
        currentFamily?.id,
        user?.id,
        fetchMembers
    ]);
    const updateMemberRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (memberId, newRole)=>{
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
    }, [
        currentFamily?.id,
        fetchMembers
    ]);
    const removeMember = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (memberId)=>{
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
    }, [
        currentFamily?.id,
        fetchMembers
    ]);
    const switchFamily = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((familyId)=>{
        const family = families.find((f)=>f.id === familyId);
        if (family) {
            setCurrentFamily(family);
        }
    }, [
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
}),
"[project]/apps/web/src/hooks/useFamilyTree.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFamilyTree",
    ()=>useFamilyTree
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$familyStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/stores/familyStore.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/supabase.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
function useFamilyTree() {
    const currentFamily = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$familyStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFamilyStore"])((state)=>state.currentFamily);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])(), []);
    const [persons, setPersons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [unions, setUnions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [relationships, setRelationships] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch all data when family changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (currentFamily?.id) {
            fetchTreeData(currentFamily.id);
        } else {
            setPersons([]);
            setUnions([]);
            setRelationships([]);
            setIsLoading(false);
        }
    }, [
        currentFamily?.id
    ]);
    const fetchTreeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (familyId)=>{
        setIsLoading(true);
        setError(null);
        try {
            // Fetch persons
            const { data: personsData, error: personsError } = await supabase.from('persons').select('*').eq('family_id', familyId).order('created_at', {
                ascending: true
            });
            if (personsError) throw personsError;
            // Fetch unions
            const { data: unionsData, error: unionsError } = await supabase.from('unions').select('*').eq('family_id', familyId);
            if (unionsError) throw unionsError;
            // Fetch union children
            const { data: childrenData, error: childrenError } = await supabase.from('union_children').select('union_id, child_id').in('union_id', (unionsData || []).map((u)=>u.id));
            if (childrenError) throw childrenError;
            // Fetch relationships
            const { data: relationshipsData, error: relError } = await supabase.from('relationships').select('*').eq('family_id', familyId);
            if (relError) throw relError;
            // Map data
            const personsList = (personsData || []).map((p)=>({
                    id: p.id,
                    familyId: p.family_id,
                    firstName: p.first_name,
                    middleNames: p.middle_names,
                    lastName: p.last_name,
                    maidenName: p.maiden_name,
                    nicknames: p.nicknames,
                    birthDate: p.birth_date,
                    birthDateApproximate: p.birth_date_approximate,
                    birthPlace: p.birth_place,
                    deathDate: p.death_date,
                    deathDateApproximate: p.death_date_approximate,
                    deathPlace: p.death_place,
                    gender: p.gender,
                    isLiving: p.is_living,
                    biography: p.biography,
                    photoUrl: p.photo_url,
                    medicalConditions: p.medical_conditions,
                    linkedUserId: p.linked_user_id,
                    createdAt: p.created_at
                }));
            // Group children by union
            const childrenByUnion = new Map();
            (childrenData || []).forEach((c)=>{
                const existing = childrenByUnion.get(c.union_id) || [];
                existing.push(c.child_id);
                childrenByUnion.set(c.union_id, existing);
            });
            const unionsList = (unionsData || []).map((u)=>({
                    id: u.id,
                    familyId: u.family_id,
                    partner1Id: u.partner1_id,
                    partner2Id: u.partner2_id,
                    unionType: u.union_type,
                    startDate: u.start_date,
                    endDate: u.end_date,
                    location: u.location,
                    children: childrenByUnion.get(u.id) || []
                }));
            const relationshipsList = (relationshipsData || []).map((r)=>({
                    id: r.id,
                    familyId: r.family_id,
                    person1Id: r.person1_id,
                    person2Id: r.person2_id,
                    relationshipType: r.relationship_type,
                    isBiological: r.is_biological
                }));
            setPersons(personsList);
            setUnions(unionsList);
            setRelationships(relationshipsList);
        } catch (err) {
            console.error('Error fetching tree data:', err);
            setError('Error loading family tree');
        } finally{
            setIsLoading(false);
        }
    }, []);
    // Convert to GraphData format for the layout engine
    const graphData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const graphPersons = persons.map((p)=>({
                id: p.id,
                firstName: p.firstName,
                lastName: p.lastName || '',
                gender: p.gender,
                birthDate: p.birthDate,
                birthDateApproximate: p.birthDateApproximate,
                deathDate: p.deathDate,
                deathDateApproximate: p.deathDateApproximate,
                photoUrl: p.photoUrl,
                isLiving: p.isLiving,
                medicalConditions: p.medicalConditions
            }));
        const graphUnions = unions.map((u)=>({
                id: u.id,
                partner1Id: u.partner1Id,
                partner2Id: u.partner2Id || '',
                unionType: u.unionType,
                startDate: u.startDate,
                endDate: u.endDate,
                childrenIds: u.children
            }));
        const graphRelationships = relationships.map((r)=>({
                id: r.id,
                personId: r.person1Id,
                relatedPersonId: r.person2Id,
                type: r.relationshipType === 'parent_child' ? 'parent' : r.relationshipType
            }));
        return {
            persons: graphPersons,
            unions: graphUnions,
            relationships: graphRelationships
        };
    }, [
        persons,
        unions,
        relationships
    ]);
    // CRUD operations
    const createPerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (input)=>{
        if (!currentFamily?.id) return null;
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;
        try {
            const { data, error } = await supabase.from('persons').insert({
                family_id: currentFamily.id,
                first_name: input.firstName,
                last_name: input.lastName,
                gender: input.gender,
                birth_date: input.birthDate,
                is_living: input.isLiving ?? true,
                photo_url: input.photoUrl,
                created_by: userData.user.id
            }).select().single();
            if (error) throw error;
            const newPerson = {
                id: data.id,
                familyId: data.family_id,
                firstName: data.first_name,
                lastName: data.last_name,
                gender: data.gender,
                birthDate: data.birth_date,
                isLiving: data.is_living,
                photoUrl: data.photo_url,
                createdAt: data.created_at
            };
            setPersons((prev)=>[
                    ...prev,
                    newPerson
                ]);
            return newPerson;
        } catch (err) {
            console.error('Error creating person:', err);
            setError('Error creating person');
            return null;
        }
    }, [
        currentFamily?.id
    ]);
    const updatePerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (personId, updates)=>{
        try {
            const updateData = {};
            if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
            if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
            if (updates.gender !== undefined) updateData.gender = updates.gender;
            if (updates.birthDate !== undefined) updateData.birth_date = updates.birthDate;
            if (updates.isLiving !== undefined) updateData.is_living = updates.isLiving;
            if (updates.photoUrl !== undefined) updateData.photo_url = updates.photoUrl;
            const { error } = await supabase.from('persons').update(updateData).eq('id', personId);
            if (error) throw error;
            // Refresh data
            if (currentFamily?.id) {
                await fetchTreeData(currentFamily.id);
            }
            return true;
        } catch (err) {
            console.error('Error updating person:', err);
            return false;
        }
    }, [
        currentFamily?.id,
        fetchTreeData
    ]);
    const deletePerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (personId)=>{
        try {
            const { error } = await supabase.from('persons').delete().eq('id', personId);
            if (error) throw error;
            setPersons((prev)=>prev.filter((p)=>p.id !== personId));
            return true;
        } catch (err) {
            console.error('Error deleting person:', err);
            return false;
        }
    }, []);
    const createUnion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (partner1Id, partner2Id, type = 'marriage')=>{
        if (!currentFamily?.id) return null;
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;
        try {
            const { data, error } = await supabase.from('unions').insert({
                family_id: currentFamily.id,
                partner1_id: partner1Id,
                partner2_id: partner2Id,
                union_type: type,
                created_by: userData.user.id
            }).select().single();
            if (error) throw error;
            const newUnion = {
                id: data.id,
                familyId: data.family_id,
                partner1Id: data.partner1_id,
                partner2Id: data.partner2_id,
                unionType: data.union_type,
                startDate: data.start_date,
                endDate: data.end_date,
                location: data.location,
                children: []
            };
            setUnions((prev)=>[
                    ...prev,
                    newUnion
                ]);
            return newUnion;
        } catch (err) {
            console.error('Error creating union:', err);
            return null;
        }
    }, [
        currentFamily?.id
    ]);
    const addChildToUnion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (unionId, childId)=>{
        try {
            const { error } = await supabase.from('union_children').insert({
                union_id: unionId,
                child_id: childId
            });
            if (error) throw error;
            // Update local state
            setUnions((prev)=>prev.map((u)=>u.id === unionId ? {
                        ...u,
                        children: [
                            ...u.children,
                            childId
                        ]
                    } : u));
            return true;
        } catch (err) {
            console.error('Error adding child to union:', err);
            return false;
        }
    }, []);
    const createRelationship = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (person1Id, person2Id, type, isBiological = true)=>{
        if (!currentFamily?.id) return false;
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return false;
        try {
            const { error } = await supabase.from('relationships').insert({
                family_id: currentFamily.id,
                person1_id: person1Id,
                person2_id: person2Id,
                relationship_type: type,
                is_biological: isBiological,
                created_by: userData.user.id
            });
            if (error) throw error;
            // Refresh data
            await fetchTreeData(currentFamily.id);
            return true;
        } catch (err) {
            console.error('Error creating relationship:', err);
            return false;
        }
    }, [
        currentFamily?.id,
        fetchTreeData
    ]);
    const getPersonById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((personId)=>{
        return persons.find((p)=>p.id === personId);
    }, [
        persons
    ]);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
        if (currentFamily?.id) {
            await fetchTreeData(currentFamily.id);
        }
    }, [
        currentFamily?.id,
        fetchTreeData
    ]);
    // Get root person (first person added or self-marked person)
    const getRootPerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (persons.length === 0) return null;
        // For now, return the first person created
        return persons[0];
    }, [
        persons
    ]);
    // Find or create a union between two people
    const findOrCreateUnion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (partner1Id, partner2Id, type = 'marriage')=>{
        // Look for existing union
        const existingUnion = unions.find((u)=>u.partner1Id === partner1Id && u.partner2Id === partner2Id || u.partner1Id === partner2Id && u.partner2Id === partner1Id);
        if (existingUnion) {
            return existingUnion.id;
        }
        // Create new union
        const newUnion = await createUnion(partner1Id, partner2Id, type);
        return newUnion?.id || null;
    }, [
        unions,
        createUnion
    ]);
    // Get parents of a person
    const getParentsOfPerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((personId)=>{
        // Find union where this person is a child
        for (const union of unions){
            if (union.children.includes(personId)) {
                const partner1 = persons.find((p)=>p.id === union.partner1Id);
                const partner2 = persons.find((p)=>p.id === union.partner2Id);
                let fatherId;
                let motherId;
                if (partner1?.gender === 'male') fatherId = partner1.id;
                else if (partner1?.gender === 'female') motherId = partner1.id;
                if (partner2?.gender === 'male') fatherId = partner2.id;
                else if (partner2?.gender === 'female') motherId = partner2.id;
                return {
                    fatherId,
                    motherId,
                    unionId: union.id
                };
            }
        }
        return {};
    }, [
        unions,
        persons
    ]);
    // Get spouse of a person
    const getSpouseOfPerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((personId)=>{
        for (const union of unions){
            if (union.partner1Id === personId && union.partner2Id) {
                return persons.find((p)=>p.id === union.partner2Id) || null;
            }
            if (union.partner2Id === personId) {
                return persons.find((p)=>p.id === union.partner1Id) || null;
            }
        }
        return null;
    }, [
        unions,
        persons
    ]);
    // Create person with relationship - the main function for adding family members
    const createPersonWithRelationship = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (input)=>{
        if (!currentFamily?.id) return null;
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return null;
        try {
            // First, create the person
            const { data: personData, error: personError } = await supabase.from('persons').insert({
                family_id: currentFamily.id,
                first_name: input.firstName,
                last_name: input.lastName,
                gender: input.gender,
                birth_date: input.birthDate,
                is_living: input.isLiving ?? true,
                photo_url: input.photoUrl,
                medical_conditions: input.medicalConditions || null,
                created_by: userData.user.id
            }).select().single();
            if (personError) throw personError;
            const newPersonId = personData.id;
            const relatedToId = input.relatedToPersonId;
            // Now handle the relationship based on type
            switch(input.relationshipType){
                case 'self':
                    break;
                case 'father':
                case 'mother':
                    {
                        // Adding a parent to the related person
                        if (!relatedToId) break;
                        // Get existing parents of the related person
                        const existingParents = getParentsOfPerson(relatedToId);
                        if (existingParents.unionId) {
                            // Union exists, update it to add this parent as the second partner
                            if (input.relationshipType === 'father' && !existingParents.fatherId) {
                                // If partner1 is already the mother, add father as partner2
                                // Otherwise update partner1
                                const currentUnion = unions.find((u)=>u.id === existingParents.unionId);
                                if (currentUnion?.partner1Id && !currentUnion?.partner2Id) {
                                    await supabase.from('unions').update({
                                        partner2_id: newPersonId
                                    }).eq('id', existingParents.unionId);
                                } else {
                                    await supabase.from('unions').update({
                                        partner1_id: newPersonId
                                    }).eq('id', existingParents.unionId);
                                }
                            } else if (input.relationshipType === 'mother' && !existingParents.motherId) {
                                const currentUnion = unions.find((u)=>u.id === existingParents.unionId);
                                if (currentUnion?.partner1Id && !currentUnion?.partner2Id) {
                                    await supabase.from('unions').update({
                                        partner2_id: newPersonId
                                    }).eq('id', existingParents.unionId);
                                } else {
                                    await supabase.from('unions').update({
                                        partner1_id: newPersonId
                                    }).eq('id', existingParents.unionId);
                                }
                            }
                        } else {
                            // Create new union with new parent and add related person as child
                            // The new parent is always partner1, partner2 will be added later
                            const union = await createUnion(newPersonId, null, 'marriage');
                            if (union) {
                                await addChildToUnion(union.id, relatedToId);
                            }
                        }
                        // Create parent-child relationship
                        await createRelationship(newPersonId, relatedToId, 'parent_child', true);
                        break;
                    }
                case 'spouse':
                    {
                        // Adding a spouse to the related person
                        if (!relatedToId) break;
                        // Create or find union between them
                        await findOrCreateUnion(relatedToId, newPersonId, 'marriage');
                        // Create spouse relationship
                        await createRelationship(relatedToId, newPersonId, 'spouse', false);
                        break;
                    }
                case 'son':
                case 'daughter':
                    {
                        // Adding a child to the related person
                        if (!relatedToId) break;
                        // Find or create union for the parent
                        const spouse = getSpouseOfPerson(relatedToId);
                        let unionId = null;
                        if (spouse) {
                            // Find existing union with spouse
                            unionId = await findOrCreateUnion(relatedToId, spouse.id, 'marriage');
                        } else {
                            // Create single-parent union
                            const union = await createUnion(relatedToId, null, 'other');
                            unionId = union?.id || null;
                        }
                        if (unionId) {
                            await addChildToUnion(unionId, newPersonId);
                        }
                        // Create parent-child relationship
                        await createRelationship(relatedToId, newPersonId, 'parent_child', true);
                        break;
                    }
                case 'brother':
                case 'sister':
                    {
                        // Adding a sibling to the related person
                        if (!relatedToId) break;
                        // Find the parents union of the related person
                        const existingParents = getParentsOfPerson(relatedToId);
                        if (existingParents.unionId) {
                            // Add to same union as sibling (they share the same parents)
                            await addChildToUnion(existingParents.unionId, newPersonId);
                        }
                        // If no parents exist yet, we just create the sibling relationship
                        // Parents can be added later, and both siblings will be linked to them
                        // Create sibling relationship
                        await createRelationship(relatedToId, newPersonId, 'sibling', true);
                        break;
                    }
                case 'grandfather_paternal':
                case 'grandmother_paternal':
                    {
                        // Adding paternal grandparent
                        if (!relatedToId) break;
                        const parents = getParentsOfPerson(relatedToId);
                        if (parents.fatherId) {
                            // Add as parent of the father
                            const fatherParents = getParentsOfPerson(parents.fatherId);
                            if (fatherParents.unionId) {
                                // Update existing grandparents union - add as second partner
                                const currentUnion = unions.find((u)=>u.id === fatherParents.unionId);
                                if (currentUnion?.partner1Id && !currentUnion?.partner2Id) {
                                    await supabase.from('unions').update({
                                        partner2_id: newPersonId
                                    }).eq('id', fatherParents.unionId);
                                } else if (!currentUnion?.partner1Id) {
                                    await supabase.from('unions').update({
                                        partner1_id: newPersonId
                                    }).eq('id', fatherParents.unionId);
                                }
                            } else {
                                // Create new union and add father as child
                                const union = await createUnion(newPersonId, null, 'marriage');
                                if (union) {
                                    await addChildToUnion(union.id, parents.fatherId);
                                }
                            }
                            await createRelationship(newPersonId, parents.fatherId, 'parent_child', true);
                        }
                        break;
                    }
                case 'grandfather_maternal':
                case 'grandmother_maternal':
                    {
                        // Adding maternal grandparent
                        if (!relatedToId) break;
                        const parents = getParentsOfPerson(relatedToId);
                        if (parents.motherId) {
                            // Add as parent of the mother
                            const motherParents = getParentsOfPerson(parents.motherId);
                            if (motherParents.unionId) {
                                // Update existing grandparents union - add as second partner
                                const currentUnion = unions.find((u)=>u.id === motherParents.unionId);
                                if (currentUnion?.partner1Id && !currentUnion?.partner2Id) {
                                    await supabase.from('unions').update({
                                        partner2_id: newPersonId
                                    }).eq('id', motherParents.unionId);
                                } else if (!currentUnion?.partner1Id) {
                                    await supabase.from('unions').update({
                                        partner1_id: newPersonId
                                    }).eq('id', motherParents.unionId);
                                }
                            } else {
                                // Create new union and add mother as child
                                const union = await createUnion(newPersonId, null, 'marriage');
                                if (union) {
                                    await addChildToUnion(union.id, parents.motherId);
                                }
                            }
                            await createRelationship(newPersonId, parents.motherId, 'parent_child', true);
                        }
                        break;
                    }
                case 'uncle':
                case 'aunt':
                    {
                        // Adding uncle/aunt (sibling of parent)
                        if (!relatedToId) break;
                        const parents = getParentsOfPerson(relatedToId);
                        const parentId = input.gender === 'male' ? parents.fatherId || parents.motherId : parents.motherId || parents.fatherId;
                        if (parentId) {
                            // Find grandparents union
                            const grandparents = getParentsOfPerson(parentId);
                            if (grandparents.unionId) {
                                // Add new person as child of grandparents
                                await addChildToUnion(grandparents.unionId, newPersonId);
                                await createRelationship(parentId, newPersonId, 'sibling', true);
                            }
                        }
                        break;
                    }
                case 'cousin':
                    {
                        // Adding a cousin is complex - need to find uncle/aunt first
                        // For now, just add as a person without automatic relationship
                        console.log('Cousin relationship requires manual setup');
                        break;
                    }
            }
            // Refresh all data
            await fetchTreeData(currentFamily.id);
            // Return the created person (constructed from the insert response)
            const createdPerson = {
                id: personData.id,
                familyId: personData.family_id,
                firstName: personData.first_name,
                lastName: personData.last_name,
                gender: personData.gender,
                birthDate: personData.birth_date,
                isLiving: personData.is_living,
                photoUrl: personData.photo_url,
                medicalConditions: personData.medical_conditions,
                createdAt: personData.created_at
            };
            return createdPerson;
        } catch (err) {
            console.error('Error creating person with relationship:', err);
            setError('Error creating person');
            return null;
        }
    }, [
        currentFamily?.id,
        supabase,
        createUnion,
        addChildToUnion,
        createRelationship,
        getParentsOfPerson,
        getSpouseOfPerson,
        findOrCreateUnion,
        fetchTreeData,
        persons
    ]);
    // Calculate the relationship role of a person relative to the root person
    const getPersonRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((personId)=>{
        const root = getRootPerson();
        if (!root) return null;
        if (personId === root.id) return 'Yo';
        const person = persons.find((p)=>p.id === personId);
        if (!person) return null;
        // Get parents of root person
        const rootParents = getParentsOfPerson(root.id);
        // Check if person is parent of root
        if (rootParents.fatherId === personId) return 'Padre';
        if (rootParents.motherId === personId) return 'Madre';
        // Check if person is spouse of root
        const rootSpouse = getSpouseOfPerson(root.id);
        if (rootSpouse?.id === personId) {
            return person.gender === 'male' ? 'Esposo' : 'Esposa';
        }
        // Check if person is child of root (root is parent in a union)
        for (const union of unions){
            if (union.partner1Id === root.id || union.partner2Id === root.id) {
                if (union.children.includes(personId)) {
                    return person.gender === 'male' ? 'Hijo' : 'Hija';
                }
            }
        }
        // Check if person is sibling (shares same parents as root)
        if (rootParents.unionId) {
            const rootUnion = unions.find((u)=>u.id === rootParents.unionId);
            if (rootUnion && rootUnion.children.includes(personId)) {
                return person.gender === 'male' ? 'Hermano' : 'Hermana';
            }
        }
        // Also check sibling relationship in relationships table
        const siblingRelationship = relationships.find((r)=>r.relationshipType === 'sibling' && (r.person1Id === root.id && r.person2Id === personId || r.person1Id === personId && r.person2Id === root.id));
        if (siblingRelationship) {
            return person.gender === 'male' ? 'Hermano' : 'Hermana';
        }
        // Check if they share at least one parent (alternative sibling check)
        const personParents = getParentsOfPerson(personId);
        if (rootParents.fatherId && rootParents.fatherId === personParents.fatherId || rootParents.motherId && rootParents.motherId === personParents.motherId) {
            return person.gender === 'male' ? 'Hermano' : 'Hermana';
        }
        // Check if person is grandparent
        if (rootParents.fatherId) {
            const fatherParents = getParentsOfPerson(rootParents.fatherId);
            if (fatherParents.fatherId === personId) return 'Abuelo paterno';
            if (fatherParents.motherId === personId) return 'Abuela paterna';
        }
        if (rootParents.motherId) {
            const motherParents = getParentsOfPerson(rootParents.motherId);
            if (motherParents.fatherId === personId) return 'Abuelo materno';
            if (motherParents.motherId === personId) return 'Abuela materna';
        }
        // Check if person is uncle/aunt (sibling of root's parents)
        if (rootParents.fatherId) {
            const fatherParents = getParentsOfPerson(rootParents.fatherId);
            if (fatherParents.unionId) {
                const fatherSiblingsUnion = unions.find((u)=>u.id === fatherParents.unionId);
                if (fatherSiblingsUnion && fatherSiblingsUnion.children.includes(personId)) {
                    return person.gender === 'male' ? 'Tío' : 'Tía';
                }
            }
        }
        if (rootParents.motherId) {
            const motherParents = getParentsOfPerson(rootParents.motherId);
            if (motherParents.unionId) {
                const motherSiblingsUnion = unions.find((u)=>u.id === motherParents.unionId);
                if (motherSiblingsUnion && motherSiblingsUnion.children.includes(personId)) {
                    return person.gender === 'male' ? 'Tío' : 'Tía';
                }
            }
        }
        // Check if person is grandchild
        for (const union of unions){
            if (union.partner1Id === root.id || union.partner2Id === root.id) {
                for (const childId of union.children){
                    // Check if this child has children that include the person
                    for (const childUnion of unions){
                        if (childUnion.partner1Id === childId || childUnion.partner2Id === childId) {
                            if (childUnion.children.includes(personId)) {
                                return person.gender === 'male' ? 'Nieto' : 'Nieta';
                            }
                        }
                    }
                }
            }
        }
        // Check if person is nephew/niece (child of sibling)
        if (rootParents.unionId) {
            const rootUnion = unions.find((u)=>u.id === rootParents.unionId);
            if (rootUnion) {
                for (const siblingId of rootUnion.children){
                    if (siblingId === root.id) continue;
                    // Check if person is child of this sibling
                    for (const siblingUnion of unions){
                        if (siblingUnion.partner1Id === siblingId || siblingUnion.partner2Id === siblingId) {
                            if (siblingUnion.children.includes(personId)) {
                                return person.gender === 'male' ? 'Sobrino' : 'Sobrina';
                            }
                        }
                    }
                }
            }
        }
        // Check if person is cousin (child of uncle/aunt)
        // First get uncles/aunts
        const unclesAunts = [];
        if (rootParents.fatherId) {
            const fatherParents = getParentsOfPerson(rootParents.fatherId);
            if (fatherParents.unionId) {
                const fatherSiblingsUnion = unions.find((u)=>u.id === fatherParents.unionId);
                if (fatherSiblingsUnion) {
                    unclesAunts.push(...fatherSiblingsUnion.children.filter((id)=>id !== rootParents.fatherId));
                }
            }
        }
        if (rootParents.motherId) {
            const motherParents = getParentsOfPerson(rootParents.motherId);
            if (motherParents.unionId) {
                const motherSiblingsUnion = unions.find((u)=>u.id === motherParents.unionId);
                if (motherSiblingsUnion) {
                    unclesAunts.push(...motherSiblingsUnion.children.filter((id)=>id !== rootParents.motherId));
                }
            }
        }
        // Check if person is child of any uncle/aunt
        for (const uncleAuntId of unclesAunts){
            for (const uncleAuntUnion of unions){
                if (uncleAuntUnion.partner1Id === uncleAuntId || uncleAuntUnion.partner2Id === uncleAuntId) {
                    if (uncleAuntUnion.children.includes(personId)) {
                        return person.gender === 'male' ? 'Primo' : 'Prima';
                    }
                }
            }
        }
        return 'Familiar';
    }, [
        persons,
        unions,
        relationships,
        getRootPerson,
        getParentsOfPerson,
        getSpouseOfPerson
    ]);
    return {
        persons,
        unions,
        relationships,
        graphData,
        isLoading,
        error,
        createPerson,
        createPersonWithRelationship,
        updatePerson,
        deletePerson,
        createUnion,
        addChildToUnion,
        createRelationship,
        getPersonById,
        getRootPerson,
        getParentsOfPerson,
        getSpouseOfPerson,
        getPersonRole,
        refresh
    };
}
}),
"[project]/apps/web/src/app/(dashboard)/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Skeleton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Avatar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamily.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamilyTree.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/stores/authStore.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
function DashboardPage() {
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((state)=>state.user);
    const { currentFamily, families, isLoading: familyLoading, createFamily } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFamily"])();
    const { persons, unions, isLoading: treeLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFamilyTree"])();
    // If loading, show skeleton
    if (familyLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(DashboardSkeleton, {}, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
            lineNumber: 20,
            columnNumber: 12
        }, this);
    }
    // If no families, show onboarding
    if (families.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(OnboardingFlow, {
            onCreateFamily: createFamily
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
            lineNumber: 25,
            columnNumber: 12
        }, this);
    }
    // Calculate stats from real data
    const totalMembers = persons.length;
    const livingMembers = persons.filter((p)=>p.isLiving).length;
    const generations = calculateGenerations(persons);
    const completionRate = totalMembers === 0 ? 0 : Math.min(100, Math.round(totalMembers / 10 * 100)); // Arbitrary goal of 10 members
    const userName = user?.firstName || 'there';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-5xl mx-auto px-4 md:px-6 pt-8 pb-24",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-10 animate-fade-in",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-3xl md:text-4xl font-bold text-neutral-900 tracking-tight",
                        children: [
                            "Good morning, ",
                            userName
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 40,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-neutral-500 mt-2 text-lg",
                        children: currentFamily?.name ? `Managing ${currentFamily.name}` : "Here's what's happening with your family"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 43,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 39,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 animate-slide-up",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CleanStatCard, {
                        label: "Family Members",
                        value: totalMembers,
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UsersIcon, {}, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                            lineNumber: 53,
                            columnNumber: 17
                        }, void 0),
                        delay: 0
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CleanStatCard, {
                        label: "Generations",
                        value: generations,
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TreeIcon, {}, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                            lineNumber: 59,
                            columnNumber: 17
                        }, void 0),
                        delay: 100
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 56,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CleanStatCard, {
                        label: "Living Members",
                        value: livingMembers,
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HeartIcon, {}, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                            lineNumber: 65,
                            columnNumber: 17
                        }, void 0),
                        delay: 200
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 62,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CleanStatCard, {
                        label: "Tree Progress",
                        value: `${completionRate}%`,
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ChartIcon, {}, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                            lineNumber: 71,
                            columnNumber: 17
                        }, void 0),
                        delay: 300
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 68,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-12 animate-slide-up animation-delay-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-lg font-bold text-neutral-900 mb-5 pl-1",
                        children: "Quick Actions"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionCard, {
                                href: "/tree?action=add",
                                title: "Add Person",
                                subtitle: "Grow your tree",
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PlusIcon, {
                                    className: "w-6 h-6 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                    lineNumber: 84,
                                    columnNumber: 19
                                }, void 0),
                                color: "bg-neutral-900"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                lineNumber: 80,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionCard, {
                                href: "/tree",
                                title: "View Tree",
                                subtitle: "Explore lineage",
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TreeIcon, {
                                    className: "w-6 h-6 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                    lineNumber: 91,
                                    columnNumber: 19
                                }, void 0),
                                color: "bg-emerald-600"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionCard, {
                                href: "/social",
                                title: "Post Memory",
                                subtitle: "Share moments",
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CameraIcon, {
                                    className: "w-6 h-6 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                    lineNumber: 98,
                                    columnNumber: 19
                                }, void 0),
                                color: "bg-blue-600"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                lineNumber: 94,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActionCard, {
                                href: "/invitations",
                                title: "Invite Family",
                                subtitle: "Collaborate",
                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(InviteIcon, {
                                    className: "w-6 h-6 text-white"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                    lineNumber: 105,
                                    columnNumber: 19
                                }, void 0),
                                color: "bg-purple-600"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                lineNumber: 101,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "animate-slide-up animation-delay-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-5 pl-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-lg font-bold text-neutral-900",
                                children: "Recent Additions"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                lineNumber: 114,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                                href: "/tree",
                                className: "text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors",
                                children: "View All"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                lineNumber: 115,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, this),
                    treeLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                height: 80
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                lineNumber: 122,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                                height: 80
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                lineNumber: 123,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 121,
                        columnNumber: 11
                    }, this) : persons.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
                        children: persons.slice(0, 6).map((person)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CleanMemberCard, {
                                person: person
                            }, person.id, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                lineNumber: 128,
                                columnNumber: 15
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 126,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EmptyState, {}, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 132,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 37,
        columnNumber: 5
    }, this);
}
// Components
function CleanStatCard({ label, value, icon, delay }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-start justify-between min-h-[120px] transition-all hover:shadow-md hover:-translate-y-1",
        style: {
            animationDelay: `${delay}ms`
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-2 bg-neutral-50 rounded-xl text-neutral-900 mb-3",
                children: icon
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 147,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-2xl font-bold text-neutral-900 tracking-tight",
                        children: value
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs font-medium text-neutral-500 mt-0.5",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 152,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 150,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 143,
        columnNumber: 5
    }, this);
}
function ActionCard({ href, title, subtitle, icon, color }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
        href: href,
        className: "group block",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "bg-white p-4 rounded-3xl border border-neutral-100 shadow-sm h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group-hover:border-neutral-200",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: `w-12 h-12 rounded-2xl flex items-center justify-center mb-4 shadow-sm transition-transform group-hover:scale-110 ${color}`,
                    children: icon
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                    lineNumber: 162,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "font-bold text-neutral-900 mb-1",
                    children: title
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                    lineNumber: 165,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-neutral-500",
                    children: subtitle
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                    lineNumber: 166,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
            lineNumber: 161,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 160,
        columnNumber: 5
    }, this);
}
function CleanMemberCard({ person }) {
    const fullName = `${person.firstName} ${person.lastName || ''}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white p-3 pr-5 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4 transition-colors hover:border-neutral-200",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Avatar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Avatar"], {
                name: fullName,
                src: person.photoUrl,
                size: "md"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 176,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                        className: "font-bold text-neutral-900 text-sm truncate",
                        children: fullName
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 178,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-neutral-500 truncate",
                        children: [
                            person.birthDate ? new Date(person.birthDate).getFullYear() : 'Unknown Year',
                            " • ",
                            person.gender?.charAt(0).toUpperCase() + person.gender?.slice(1)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 179,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 177,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 175,
        columnNumber: 5
    }, this);
}
function EmptyState() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-white rounded-3xl border border-neutral-100 p-8 text-center",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mx-auto mb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(UsersIcon, {
                    className: "w-8 h-8 text-neutral-400"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                    lineNumber: 191,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 190,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                className: "font-bold text-neutral-900 mb-2",
                children: "Start your tree"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 193,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-neutral-500 text-sm mb-6 max-w-xs mx-auto",
                children: "Your family tree is empty. Add yourself or a relative to get started."
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 194,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: "/tree?action=add",
                className: "inline-flex items-center gap-2 bg-neutral-900 text-white px-6 py-3 rounded-full font-medium text-sm hover:bg-neutral-800 transition-colors",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(PlusIcon, {
                        className: "w-4 h-4"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 198,
                        columnNumber: 9
                    }, this),
                    "Add First Person"
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 197,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 189,
        columnNumber: 5
    }, this);
}
function OnboardingFlow({ onCreateFamily }) {
    const [familyName, setFamilyName] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [isCreating, setIsCreating] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const user = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useAuthStore"])((state)=>state.user);
    const handleCreate = async ()=>{
        if (!familyName.trim()) return;
        setIsCreating(true);
        await onCreateFamily({
            name: familyName.trim()
        });
        setIsCreating(false);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-[80vh] flex flex-col items-center justify-center p-4",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-md",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-center mb-10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-20 h-20 bg-neutral-900 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl rotate-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TreeIcon, {
                                className: "w-10 h-10 text-white"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                                lineNumber: 222,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                            lineNumber: 221,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                            className: "text-3xl font-bold text-neutral-900 mb-3",
                            children: "Welcome to KinTree"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                            lineNumber: 224,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-neutral-500 text-lg",
                            children: "Let's start by naming your family group."
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                            lineNumber: 227,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                    lineNumber: 220,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white p-8 rounded-3xl shadow-xl border border-neutral-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            className: "block text-sm font-bold text-neutral-900 mb-2",
                            children: "Family Name"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                            lineNumber: 233,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                            type: "text",
                            placeholder: "e.g., The Garcia Family",
                            className: "w-full px-4 py-3 rounded-xl border border-neutral-200 bg-neutral-50 focus:bg-white focus:ring-2 focus:ring-neutral-900 focus:outline-none transition-all mb-6",
                            value: familyName,
                            onChange: (e)=>setFamilyName(e.target.value)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                            lineNumber: 236,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleCreate,
                            disabled: !familyName.trim() || isCreating,
                            className: "w-full bg-neutral-900 text-white py-4 rounded-xl font-bold text-lg hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all",
                            children: isCreating ? 'Creating...' : 'Create Family'
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                            lineNumber: 244,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                    lineNumber: 232,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
            lineNumber: 219,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 218,
        columnNumber: 5
    }, this);
}
function DashboardSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-5xl mx-auto px-4 pt-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-10",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        width: 300,
                        height: 40
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 261,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        width: 200,
                        height: 24,
                        className: "mt-3"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 262,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 260,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-12",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        height: 140,
                        className: "rounded-3xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 265,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        height: 140,
                        className: "rounded-3xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 266,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        height: 140,
                        className: "rounded-3xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        height: 140,
                        className: "rounded-3xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 268,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-2 md:grid-cols-4 gap-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        height: 160,
                        className: "rounded-3xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 271,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        height: 160,
                        className: "rounded-3xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 272,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        height: 160,
                        className: "rounded-3xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 273,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                        height: 160,
                        className: "rounded-3xl"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 270,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 259,
        columnNumber: 5
    }, this);
}
// Helpers & Icons
function calculateGenerations(persons) {
    if (persons.length === 0) return 0;
    if (persons.length < 3) return 1;
    return Math.min(Math.ceil(Math.log2(persons.length + 1)), 7);
}
function UsersIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-5 h-5',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 291,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "9",
                cy: "7",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 292,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 293,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 290,
        columnNumber: 5
    }, this);
}
function TreeIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-5 h-5',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 22V8M12 8C9 8 6 5 6 2h12c0 3-3 6-6 6z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 301,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 22h6"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 302,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 300,
        columnNumber: 5
    }, this);
}
function HeartIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-5 h-5',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
            lineNumber: 310,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 309,
        columnNumber: 5
    }, this);
}
function ChartIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-5 h-5',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M18 20V10"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 318,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M12 20V4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 319,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 20v-6"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 320,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 317,
        columnNumber: 5
    }, this);
}
function PlusIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-5 h-5',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "12",
                y1: "5",
                x2: "12",
                y2: "19"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 328,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "5",
                y1: "12",
                x2: "19",
                y2: "12"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 329,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 327,
        columnNumber: 5
    }, this);
}
function CameraIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-5 h-5',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 337,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "13",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 338,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 336,
        columnNumber: 5
    }, this);
}
function InviteIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className || 'w-5 h-5',
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("line", {
                x1: "22",
                y1: "2",
                x2: "11",
                y2: "13"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 346,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
                points: "22 2 15 22 11 13 2 9 22 2"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
                lineNumber: 347,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/page.tsx",
        lineNumber: 345,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=apps_web_src_5a2699c2._.js.map