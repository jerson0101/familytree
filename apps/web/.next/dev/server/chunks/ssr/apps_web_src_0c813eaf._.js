module.exports = [
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
        if (personId === root.id) return 'Me';
        const person = persons.find((p)=>p.id === personId);
        if (!person) return null;
        // Get parents of root person
        const rootParents = getParentsOfPerson(root.id);
        // Check if person is parent of root
        if (rootParents.fatherId === personId) return 'Father';
        if (rootParents.motherId === personId) return 'Mother';
        // Check if person is spouse of root
        const rootSpouse = getSpouseOfPerson(root.id);
        if (rootSpouse?.id === personId) {
            return person.gender === 'male' ? 'Husband' : 'Wife';
        }
        // Check if person is child of root (root is parent in a union)
        for (const union of unions){
            if (union.partner1Id === root.id || union.partner2Id === root.id) {
                if (union.children.includes(personId)) {
                    return person.gender === 'male' ? 'Son' : 'Daughter';
                }
            }
        }
        // Check if person is sibling (shares same parents as root)
        if (rootParents.unionId) {
            const rootUnion = unions.find((u)=>u.id === rootParents.unionId);
            if (rootUnion && rootUnion.children.includes(personId)) {
                return person.gender === 'male' ? 'Brother' : 'Sister';
            }
        }
        // Also check sibling relationship in relationships table
        const siblingRelationship = relationships.find((r)=>r.relationshipType === 'sibling' && (r.person1Id === root.id && r.person2Id === personId || r.person1Id === personId && r.person2Id === root.id));
        if (siblingRelationship) {
            return person.gender === 'male' ? 'Brother' : 'Sister';
        }
        // Check if they share at least one parent (alternative sibling check)
        const personParents = getParentsOfPerson(personId);
        if (rootParents.fatherId && rootParents.fatherId === personParents.fatherId || rootParents.motherId && rootParents.motherId === personParents.motherId) {
            return person.gender === 'male' ? 'Brother' : 'Sister';
        }
        // Check if person is grandparent
        if (rootParents.fatherId) {
            const fatherParents = getParentsOfPerson(rootParents.fatherId);
            if (fatherParents.fatherId === personId) return 'Paternal Grandfather';
            if (fatherParents.motherId === personId) return 'Paternal Grandmother';
        }
        if (rootParents.motherId) {
            const motherParents = getParentsOfPerson(rootParents.motherId);
            if (motherParents.fatherId === personId) return 'Maternal Grandfather';
            if (motherParents.motherId === personId) return 'Maternal Grandmother';
        }
        // Check if person is uncle/aunt (sibling of root's parents)
        if (rootParents.fatherId) {
            const fatherParents = getParentsOfPerson(rootParents.fatherId);
            if (fatherParents.unionId) {
                const fatherSiblingsUnion = unions.find((u)=>u.id === fatherParents.unionId);
                if (fatherSiblingsUnion) {
                    // Filter out the root's father himself from the siblings
                    const siblingsOfFather = fatherSiblingsUnion.children.filter((id)=>id !== rootParents.fatherId);
                    if (siblingsOfFather.includes(personId)) {
                        return person.gender === 'male' ? 'Uncle' : 'Aunt';
                    }
                }
            }
        }
        if (rootParents.motherId) {
            const motherParents = getParentsOfPerson(rootParents.motherId);
            if (motherParents.unionId) {
                const motherSiblingsUnion = unions.find((u)=>u.id === motherParents.unionId);
                if (motherSiblingsUnion) {
                    // Filter out the root's mother herself from the siblings
                    const siblingsOfMother = motherSiblingsUnion.children.filter((id)=>id !== rootParents.motherId);
                    if (siblingsOfMother.includes(personId)) {
                        return person.gender === 'male' ? 'Uncle' : 'Aunt';
                    }
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
                                return person.gender === 'male' ? 'Grandson' : 'Granddaughter';
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
                    if (siblingId === root.id) continue; // Skip the root person themselves
                    // Check if person is child of this sibling
                    for (const siblingUnion of unions){
                        if (siblingUnion.partner1Id === siblingId || siblingUnion.partner2Id === siblingId) {
                            if (siblingUnion.children.includes(personId)) {
                                return person.gender === 'male' ? 'Nephew' : 'Niece';
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
                        return 'Cousin';
                    }
                }
            }
        }
        return 'Relative';
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
"[project]/apps/web/src/hooks/useDYKQuiz.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDYKQuiz",
    ()=>useDYKQuiz
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/supabase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamily.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamilyTree.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
function useDYKQuiz() {
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createClient"])(), []);
    const { currentFamily } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFamily"])();
    const { persons, unions } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFamilyTree"])();
    const [questions, setQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [responses, setResponses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
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
    const generateQuestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (persons.length === 0) return [];
        const generatedQuestions = [];
        persons.forEach((person, index)=>{
            const personName = `${person.firstName} ${person.lastName || ''}`.trim();
            // Birth date question
            if (person.birthDate) {
                const birthYear = new Date(person.birthDate).getFullYear();
                const wrongYears = [
                    birthYear - 2,
                    birthYear + 3,
                    birthYear - 5
                ].filter((y)=>y > 1900);
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
                const wrongMonths = months.filter((m)=>m !== birthMonth.toLowerCase()).slice(0, 3);
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
        });
        // Relationship questions from unions
        unions.forEach((union)=>{
            const partner1 = persons.find((p)=>p.id === union.partner1Id);
            const partner2 = persons.find((p)=>p.id === union.partner2Id);
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
                        ...persons.filter((p)=>p.id !== partner2.id && p.id !== partner1.id).slice(0, 3).map((p)=>`${p.firstName} ${p.lastName || ''}`.trim())
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
        });
        // Count family members question
        if (persons.length > 0) {
            const wrongCounts = [
                persons.length - 2,
                persons.length + 3,
                persons.length + 1
            ].filter((n)=>n > 0);
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
    }, [
        persons,
        unions
    ]);
    // Fetch existing responses from database
    const fetchResponses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async ()=>{
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
            const mappedResponses = (data || []).map((r)=>({
                    questionId: r.question_id,
                    response: r.response,
                    isCorrect: r.is_correct,
                    answeredAt: r.completed_at
                }));
            setResponses(mappedResponses);
        } catch (err) {
            console.error('Error:', err);
        }
    }, [
        currentFamily?.id,
        supabase
    ]);
    // Calculate stats
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const totalQuestions = questions.length;
        const answered = responses.length;
        const correct = responses.filter((r)=>r.isCorrect).length;
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
        questions.forEach((q)=>{
            categoryCounts[q.category]++;
            const response = responses.find((r)=>r.questionId === q.id);
            if (response?.isCorrect) {
                categoryCorrect[q.category]++;
            }
        });
        Object.keys(categoryProgress).forEach((cat)=>{
            const key = cat;
            categoryProgress[key] = categoryCounts[key] > 0 ? Math.round(categoryCorrect[key] / categoryCounts[key] * 100) : 0;
        });
        setStats({
            totalQuestions,
            answered,
            correct,
            score,
            level,
            categoryProgress
        });
    }, [
        questions,
        responses
    ]);
    // Load questions and responses
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        setIsLoading(true);
        const generated = generateQuestions();
        setQuestions(generated);
        fetchResponses().finally(()=>setIsLoading(false));
    }, [
        generateQuestions,
        fetchResponses
    ]);
    // Submit answer
    const submitAnswer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(async (questionId, answer)=>{
        if (!currentFamily?.id) return false;
        const question = questions.find((q)=>q.id === questionId);
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
        const updateLocalState = ()=>{
            setResponses((prev)=>{
                const existing = prev.findIndex((r)=>r.questionId === questionId);
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
            });
        };
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
    }, [
        currentFamily?.id,
        questions,
        supabase
    ]);
    // Get unanswered questions for quiz
    const getQuizQuestions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])((count = 10)=>{
        const answeredIds = new Set(responses.map((r)=>r.questionId));
        const unanswered = questions.filter((q)=>!answeredIds.has(q.id));
        return unanswered.slice(0, count);
    }, [
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
}),
"[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>QuizPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/layout/Container.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Skeleton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useDYKQuiz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useDYKQuiz.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function QuizPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { getQuizQuestions, submitAnswer, stats, isLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useDYKQuiz$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useDYKQuiz"])();
    const [quizQuestions, setQuizQuestions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [selectedAnswer, setSelectedAnswer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [textAnswer, setTextAnswer] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showResult, setShowResult] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isCorrect, setIsCorrect] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [quizComplete, setQuizComplete] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [correctCount, setCorrectCount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(0);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const questionsLoadedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(false);
    // Load quiz questions only once when data is ready
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (!isLoading && !questionsLoadedRef.current) {
            questionsLoadedRef.current = true;
            const questions = getQuizQuestions(10);
            setQuizQuestions(questions);
            if (questions.length === 0) {
                setQuizComplete(true);
            }
        }
    }, [
        isLoading,
        getQuizQuestions
    ]);
    const currentQuestion = quizQuestions[currentIndex];
    const handleSubmitAnswer = async ()=>{
        if (!currentQuestion) return;
        const answer = currentQuestion.answerType === 'text' ? textAnswer : selectedAnswer;
        if (!answer) return;
        setIsSubmitting(true);
        const correct = await submitAnswer(currentQuestion.id, answer);
        setIsCorrect(correct);
        setShowResult(true);
        if (correct) {
            setCorrectCount((prev)=>prev + 1);
        }
        setIsSubmitting(false);
    };
    const handleNextQuestion = ()=>{
        setShowResult(false);
        setSelectedAnswer(null);
        setTextAnswer('');
        if (currentIndex + 1 >= quizQuestions.length) {
            setQuizComplete(true);
        } else {
            setCurrentIndex((prev)=>prev + 1);
        }
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"], {
            size: "md",
            padding: false,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-[60vh] flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                    width: 400,
                    height: 300
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                    lineNumber: 77,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 76,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
            lineNumber: 75,
            columnNumber: 7
        }, this);
    }
    if (quizComplete) {
        const percentage = quizQuestions.length > 0 ? Math.round(correctCount / quizQuestions.length * 100) : 0;
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"], {
            size: "md",
            padding: false,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-[60vh] flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    padding: "lg",
                    className: "w-full max-w-md text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-6",
                            children: [
                                percentage >= 80 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(TrophyIcon, {
                                        className: "w-10 h-10 text-green-600"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                        lineNumber: 95,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                    lineNumber: 94,
                                    columnNumber: 17
                                }, this) : percentage >= 50 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StarIcon, {
                                        className: "w-10 h-10 text-yellow-600"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                        lineNumber: 99,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                    lineNumber: 98,
                                    columnNumber: 17
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BookIcon, {
                                        className: "w-10 h-10 text-blue-600"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                        lineNumber: 103,
                                        columnNumber: 19
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                    lineNumber: 102,
                                    columnNumber: 17
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-2xl font-bold text-neutral-900 mb-2",
                                    children: quizQuestions.length === 0 ? '¡No hay preguntas disponibles!' : percentage >= 80 ? '¡Excelente!' : percentage >= 50 ? '¡Buen trabajo!' : '¡Sigue aprendiendo!'
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                    lineNumber: 107,
                                    columnNumber: 15
                                }, this),
                                quizQuestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-4xl font-bold text-primary-600 mb-2",
                                            children: [
                                                correctCount,
                                                " / ",
                                                quizQuestions.length
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                            lineNumber: 119,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-neutral-500",
                                            children: [
                                                "Respondiste correctamente el ",
                                                percentage,
                                                "% de las preguntas"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                            lineNumber: 122,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true),
                                quizQuestions.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-neutral-500",
                                    children: "Agrega más personas a tu árbol familiar para generar preguntas del quiz."
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                    lineNumber: 129,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                            lineNumber: 92,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    fullWidth: true,
                                    onClick: ()=>router.push('/dyk'),
                                    children: "Volver al inicio"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                    lineNumber: 136,
                                    columnNumber: 15
                                }, this),
                                quizQuestions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    fullWidth: true,
                                    variant: "outline",
                                    onClick: ()=>{
                                        setQuizComplete(false);
                                        setCurrentIndex(0);
                                        setCorrectCount(0);
                                        setShowResult(false);
                                        setSelectedAnswer(null);
                                        setTextAnswer('');
                                        questionsLoadedRef.current = false;
                                        // Need to reload with fresh questions
                                        const questions = getQuizQuestions(10);
                                        setQuizQuestions(questions);
                                        if (questions.length === 0) {
                                            setQuizComplete(true);
                                        }
                                    },
                                    children: "Jugar de nuevo"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                    lineNumber: 140,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                    lineNumber: 91,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 90,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
            lineNumber: 89,
            columnNumber: 7
        }, this);
    }
    if (!currentQuestion) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"], {
            size: "md",
            padding: false,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-h-[60vh] flex items-center justify-center",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    padding: "lg",
                    className: "w-full max-w-md text-center",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-neutral-500",
                        children: "Cargando preguntas..."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                        lineNumber: 174,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                    lineNumber: 173,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 172,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
            lineNumber: 171,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Container"], {
        size: "md",
        padding: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: ()=>router.push('/dyk'),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ArrowLeftIcon, {
                                        className: "w-5 h-5 mr-1"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                        lineNumber: 187,
                                        columnNumber: 13
                                    }, this),
                                    "Salir"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                lineNumber: 186,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-neutral-500",
                                children: [
                                    "Pregunta ",
                                    currentIndex + 1,
                                    " de ",
                                    quizQuestions.length
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                lineNumber: 190,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                        lineNumber: 185,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-2 bg-neutral-100 rounded-full overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-full bg-primary-500 rounded-full transition-all duration-300",
                            style: {
                                width: `${(currentIndex + 1) / quizQuestions.length * 100}%`
                            }
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                            lineNumber: 195,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                        lineNumber: 194,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 184,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                padding: "lg",
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-xs px-2 py-1 rounded-full ${currentQuestion.category === 'maternal' ? 'bg-pink-100 text-pink-700' : currentQuestion.category === 'paternal' ? 'bg-blue-100 text-blue-700' : currentQuestion.category === 'self' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`,
                                children: currentQuestion.category === 'maternal' ? 'Línea Materna' : currentQuestion.category === 'paternal' ? 'Línea Paterna' : currentQuestion.category === 'self' ? 'Personal' : 'Familia Extendida'
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                lineNumber: 206,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: `text-xs px-2 py-1 rounded-full ${currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' : currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`,
                                children: [
                                    currentQuestion.points,
                                    " pts"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                lineNumber: 216,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                        lineNumber: 205,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-neutral-900 mb-6",
                        children: currentQuestion.question
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this),
                    !showResult ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-3",
                        children: [
                            currentQuestion.answerType === 'text' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                type: "text",
                                value: textAnswer,
                                onChange: (e)=>setTextAnswer(e.target.value),
                                placeholder: "Escribe tu respuesta...",
                                className: "w-full p-4 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                lineNumber: 234,
                                columnNumber: 15
                            }, this) : currentQuestion.options?.map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setSelectedAnswer(option),
                                    className: `w-full p-4 text-left rounded-xl border-2 transition-all ${selectedAnswer === option ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 hover:border-neutral-300'}`,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: selectedAnswer === option ? 'text-primary-700' : 'text-neutral-700',
                                        children: option
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                        lineNumber: 252,
                                        columnNumber: 19
                                    }, this)
                                }, option, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                    lineNumber: 243,
                                    columnNumber: 17
                                }, this)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                fullWidth: true,
                                size: "lg",
                                className: "mt-4",
                                disabled: currentQuestion.answerType === 'text' ? !textAnswer.trim() : !selectedAnswer,
                                loading: isSubmitting,
                                onClick: handleSubmitAnswer,
                                children: "Confirmar respuesta"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                lineNumber: 259,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                        lineNumber: 232,
                        columnNumber: 11
                    }, this) : /* Result */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `p-4 rounded-xl ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3 mb-2",
                                        children: [
                                            isCorrect ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(CheckCircleIcon, {
                                                className: "w-6 h-6 text-green-600"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                                lineNumber: 278,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(XCircleIcon, {
                                                className: "w-6 h-6 text-red-600"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                                lineNumber: 280,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`,
                                                children: isCorrect ? '¡Correcto!' : 'Incorrecto'
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                                lineNumber: 282,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                        lineNumber: 276,
                                        columnNumber: 15
                                    }, this),
                                    !isCorrect && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-neutral-600",
                                        children: [
                                            "La respuesta correcta es: ",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                children: currentQuestion.correctAnswer
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                                lineNumber: 288,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                        lineNumber: 287,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                lineNumber: 273,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                fullWidth: true,
                                size: "lg",
                                onClick: handleNextQuestion,
                                children: currentIndex + 1 >= quizQuestions.length ? 'Ver resultados' : 'Siguiente pregunta'
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                                lineNumber: 293,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                        lineNumber: 272,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 203,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-center text-sm text-neutral-500",
                children: [
                    "Respuestas correctas: ",
                    correctCount,
                    " / ",
                    currentIndex + (showResult ? 1 : 0)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 301,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
        lineNumber: 182,
        columnNumber: 5
    }, this);
}
// Icons
function ArrowLeftIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M19 12H5M12 19l-7-7 7-7"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
            lineNumber: 312,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
        lineNumber: 311,
        columnNumber: 5
    }, this);
}
function TrophyIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6 9H4.5a2.5 2.5 0 010-5H6M18 9h1.5a2.5 2.5 0 000-5H18M4 22h16M10 22V8M14 22V8"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 320,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M18 2H6v7a6 6 0 0012 0V2z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 321,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
        lineNumber: 319,
        columnNumber: 5
    }, this);
}
function StarIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("polygon", {
            points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
            lineNumber: 329,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
        lineNumber: 328,
        columnNumber: 5
    }, this);
}
function BookIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M4 19.5A2.5 2.5 0 016.5 17H20"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 337,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 338,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
        lineNumber: 336,
        columnNumber: 5
    }, this);
}
function CheckCircleIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 346,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M9 12l2 2 4-4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 347,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
        lineNumber: 345,
        columnNumber: 5
    }, this);
}
function XCircleIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "10"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 355,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M15 9l-6 6M9 9l6 6"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
                lineNumber: 356,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/dyk/quiz/page.tsx",
        lineNumber: 354,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=apps_web_src_0c813eaf._.js.map