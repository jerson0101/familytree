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
"[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>GenogramPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Card.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Button.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Badge.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Skeleton.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamilyTree.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
// Medical condition recommendations
const CONDITION_RECOMMENDATIONS = {
    'Diabetes': 'Revisiones anuales de glucosa, mantener peso saludable',
    'Hipertensión': 'Monitoreo regular de presión arterial, reducir sodio',
    'Enfermedades Cardíacas': 'Controles cardíacos periódicos, ejercicio moderado',
    'Cáncer': 'Exámenes preventivos según edad y tipo',
    'Asma': 'Evitar alérgenos, tener siempre inhalador disponible',
    'Alzheimer': 'Ejercicio mental, vida social activa',
    'Depresión': 'Apoyo psicológico, actividad física regular',
    'Artritis': 'Ejercicio de bajo impacto, control de peso',
    'Tiroides': 'Controles hormonales periódicos',
    'Obesidad': 'Dieta balanceada, ejercicio regular'
};
function GenogramPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [selectedPerson, setSelectedPerson] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const { persons, unions, isLoading, getRootPerson, getParentsOfPerson, getPersonRole } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useFamilyTree"])();
    const rootPerson = getRootPerson();
    // Transform persons into genogram format with generations
    const genogramPersons = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!rootPerson || persons.length === 0) return [];
        const result = [];
        const visited = new Set();
        // Helper to add person with generation
        const addPerson = (person, generation)=>{
            if (visited.has(person.id)) return;
            visited.add(person.id);
            const conditions = (person.medicalConditions || []).map((c)=>c.name);
            result.push({
                id: person.id,
                name: `${person.firstName} ${person.lastName || ''}`.trim(),
                gender: person.gender,
                generation,
                isDeceased: !person.isLiving,
                conditions,
                isProband: person.id === rootPerson.id
            });
        };
        // Add root person (generation 2 = current generation)
        addPerson(rootPerson, 2);
        // Add parents (generation 1)
        const rootParents = getParentsOfPerson(rootPerson.id);
        if (rootParents.fatherId) {
            const father = persons.find((p)=>p.id === rootParents.fatherId);
            if (father) addPerson(father, 1);
        }
        if (rootParents.motherId) {
            const mother = persons.find((p)=>p.id === rootParents.motherId);
            if (mother) addPerson(mother, 1);
        }
        // Add grandparents (generation 0)
        if (rootParents.fatherId) {
            const fatherParents = getParentsOfPerson(rootParents.fatherId);
            if (fatherParents.fatherId) {
                const gf = persons.find((p)=>p.id === fatherParents.fatherId);
                if (gf) addPerson(gf, 0);
            }
            if (fatherParents.motherId) {
                const gm = persons.find((p)=>p.id === fatherParents.motherId);
                if (gm) addPerson(gm, 0);
            }
        }
        if (rootParents.motherId) {
            const motherParents = getParentsOfPerson(rootParents.motherId);
            if (motherParents.fatherId) {
                const gf = persons.find((p)=>p.id === motherParents.fatherId);
                if (gf) addPerson(gf, 0);
            }
            if (motherParents.motherId) {
                const gm = persons.find((p)=>p.id === motherParents.motherId);
                if (gm) addPerson(gm, 0);
            }
        }
        // Add siblings (generation 2)
        if (rootParents.unionId) {
            const parentUnion = unions.find((u)=>u.id === rootParents.unionId);
            if (parentUnion) {
                for (const childId of parentUnion.children){
                    const sibling = persons.find((p)=>p.id === childId);
                    if (sibling && sibling.id !== rootPerson.id) {
                        addPerson(sibling, 2);
                    }
                }
            }
        }
        // Add children (generation 3) - find unions where root is a partner
        for (const union of unions){
            if (union.partner1Id === rootPerson.id || union.partner2Id === rootPerson.id) {
                for (const childId of union.children){
                    const child = persons.find((p)=>p.id === childId);
                    if (child) addPerson(child, 3);
                }
            }
        }
        // Add any remaining persons not yet assigned
        for (const person of persons){
            if (!visited.has(person.id)) {
                const role = getPersonRole(person.id);
                let gen = 2;
                if (role?.includes('Abuelo') || role?.includes('Abuela')) gen = 0;
                else if (role === 'Padre' || role === 'Madre' || role?.includes('Tío') || role?.includes('Tía')) gen = 1;
                else if (role?.includes('Hijo') || role?.includes('Hija') || role?.includes('Sobrino') || role?.includes('Sobrina')) gen = 3;
                addPerson(person, gen);
            }
        }
        return result;
    }, [
        persons,
        unions,
        rootPerson,
        getParentsOfPerson,
        getPersonRole
    ]);
    // Calculate risk analysis based on actual medical conditions
    const conditionRisks = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        const conditionCount = {};
        for (const person of genogramPersons){
            for (const condition of person.conditions){
                conditionCount[condition] = (conditionCount[condition] || 0) + 1;
            }
        }
        return Object.entries(conditionCount).sort(([, a], [, b])=>b - a).map(([condition, count])=>({
                condition,
                occurrences: count,
                risk: count >= 3 ? 'Alto' : count >= 2 ? 'Moderado' : 'Bajo',
                recommendation: CONDITION_RECOMMENDATIONS[condition] || 'Consultar con un especialista'
            }));
    }, [
        genogramPersons
    ]);
    const generations = [
        genogramPersons.filter((p)=>p.generation === 0),
        genogramPersons.filter((p)=>p.generation === 1),
        genogramPersons.filter((p)=>p.generation === 2),
        genogramPersons.filter((p)=>p.generation === 3)
    ].filter((gen)=>gen.length > 0);
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                    height: 48,
                    width: 300
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                    lineNumber: 184,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                    height: 200
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                    lineNumber: 185,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Skeleton"], {
                    height: 400
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                    lineNumber: 186,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
            lineNumber: 183,
            columnNumber: 7
        }, this);
    }
    // Empty state if no family data
    if (genogramPersons.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-6xl mx-auto space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                            variant: "ghost",
                            size: "sm",
                            onClick: ()=>router.back(),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ArrowLeftIcon, {
                                className: "w-5 h-5"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                lineNumber: 197,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                            lineNumber: 196,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-2xl font-bold text-neutral-900",
                                    children: "Genograma Médico"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                    lineNumber: 200,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-neutral-500",
                                    children: "Visualización de condiciones médicas hereditarias"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                    lineNumber: 201,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                            lineNumber: 199,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                    lineNumber: 195,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        className: "p-8 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(HeartIcon, {
                                    className: "w-8 h-8 text-primary-500"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                    lineNumber: 209,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                lineNumber: 208,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "text-lg font-semibold text-neutral-800 mb-2",
                                children: "No hay datos familiares"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                lineNumber: 211,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-neutral-500 max-w-sm mx-auto mb-4",
                                children: "Agrega miembros a tu árbol genealógico con sus condiciones médicas para ver el genograma."
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                lineNumber: 214,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                onClick: ()=>router.push('/tree'),
                                children: "Ir al Árbol Genealógico"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                lineNumber: 217,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                        lineNumber: 207,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                    lineNumber: 206,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
            lineNumber: 194,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-6xl mx-auto space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                variant: "ghost",
                                size: "sm",
                                onClick: ()=>router.back(),
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ArrowLeftIcon, {
                                    className: "w-5 h-5"
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                    lineNumber: 231,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                lineNumber: 230,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                        className: "text-2xl font-bold text-neutral-900",
                                        children: "Genograma Médico"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                        lineNumber: 234,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-neutral-500",
                                        children: "Visualización de condiciones médicas hereditarias"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                        lineNumber: 235,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                lineNumber: 233,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                        lineNumber: 229,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "outline",
                        size: "sm",
                        children: "Exportar PDF"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                lineNumber: 228,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "p-4",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-4 text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-6 h-6 border-2 border-neutral-800"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                        lineNumber: 250,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Hombre"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                        lineNumber: 251,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                lineNumber: 249,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-6 h-6 rounded-full border-2 border-neutral-800"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                        lineNumber: 254,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Mujer"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                        lineNumber: 255,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                lineNumber: 253,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-6 h-6 border-2 border-neutral-800 relative",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-neutral-800",
                                            style: {
                                                clipPath: 'polygon(0 0, 100% 100%, 0 100%)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                            lineNumber: 259,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                        lineNumber: 258,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Con condición"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                        lineNumber: 261,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                lineNumber: 257,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "w-6 h-6 border-2 border-neutral-800 relative",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute -top-1 -right-1 w-full h-0.5 bg-neutral-800 origin-center rotate-45"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                            lineNumber: 265,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                        lineNumber: 264,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Fallecido"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                        lineNumber: 267,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                lineNumber: 263,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                        lineNumber: 248,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                    lineNumber: 247,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                lineNumber: 246,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "p-8",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-12",
                        children: generations.map((gen, genIndex)=>{
                            const genNumber = gen[0]?.generation ?? genIndex;
                            const genLabels = {
                                0: 'Abuelos',
                                1: 'Padres y Tíos',
                                2: 'Tu Generación',
                                3: 'Hijos'
                            };
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-neutral-400 mb-4",
                                        children: genLabels[genNumber] || `Generación ${genNumber}`
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                        lineNumber: 287,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-center gap-8",
                                        children: gen.map((person)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setSelectedPerson(person),
                                                className: "flex flex-col items-center group",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: 'w-16 h-16 border-3 transition-colors ' + (person.gender === 'male' ? '' : 'rounded-full ') + (person.isProband ? 'border-primary-600 ' : 'border-neutral-800 ') + (selectedPerson?.id === person.id ? 'ring-2 ring-primary-300 ' : '') + 'group-hover:border-primary-500',
                                                                style: {
                                                                    borderWidth: '3px',
                                                                    background: person.conditions.length > 0 ? 'linear-gradient(135deg, transparent 50%, #374151 50%)' : 'transparent'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                                                lineNumber: 299,
                                                                columnNumber: 25
                                                            }, this),
                                                            person.isDeceased && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute -top-1 left-1/2 w-20 h-0.5 bg-neutral-800",
                                                                style: {
                                                                    transform: 'translateX(-50%) rotate(-45deg)',
                                                                    transformOrigin: 'center'
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                                                lineNumber: 316,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                                        lineNumber: 297,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "mt-2 text-xs text-neutral-600 text-center max-w-20 truncate",
                                                        children: person.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                                        lineNumber: 325,
                                                        columnNumber: 23
                                                    }, this),
                                                    person.conditions.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                        variant: "secondary",
                                                        className: "mt-1 text-xs",
                                                        children: [
                                                            person.conditions.length,
                                                            " condición",
                                                            person.conditions.length > 1 ? 'es' : ''
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                                        lineNumber: 329,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, person.id, true, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                                lineNumber: 292,
                                                columnNumber: 21
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                        lineNumber: 290,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, genIndex, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                lineNumber: 286,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                        lineNumber: 276,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                    lineNumber: 275,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                lineNumber: 274,
                columnNumber: 7
            }, this),
            selectedPerson && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                    className: "font-semibold text-neutral-900",
                                    children: selectedPerson.name
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                    lineNumber: 348,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Button"], {
                                    variant: "ghost",
                                    size: "sm",
                                    onClick: ()=>setSelectedPerson(null),
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(XIcon, {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                        lineNumber: 350,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                    lineNumber: 349,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                            lineNumber: 347,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                        lineNumber: 346,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-neutral-500",
                                            children: "Estado"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                            lineNumber: 357,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-neutral-900",
                                            children: selectedPerson.isDeceased ? 'Fallecido' : 'Vivo'
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                            lineNumber: 358,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                    lineNumber: 356,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-neutral-500",
                                            children: "Condiciones Médicas"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                            lineNumber: 363,
                                            columnNumber: 17
                                        }, this),
                                        selectedPerson.conditions.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2 mt-1",
                                            children: selectedPerson.conditions.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: "warning",
                                                    children: c
                                                }, c, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                                    lineNumber: 367,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                            lineNumber: 365,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-neutral-600",
                                            children: "Sin condiciones registradas"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                            lineNumber: 371,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                    lineNumber: 362,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                            lineNumber: 355,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                        lineNumber: 354,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                lineNumber: 345,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Card"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardHeader"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-semibold text-neutral-900",
                            children: "Análisis de Riesgo Hereditario"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                            lineNumber: 382,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                        lineNumber: 381,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["CardContent"], {
                        children: conditionRisks.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: conditionRisks.map((risk)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-4 bg-neutral-50 rounded-xl",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "font-medium text-neutral-900",
                                                    children: risk.condition
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                                    lineNumber: 390,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Badge"], {
                                                    variant: risk.risk === 'Alto' ? 'error' : risk.risk === 'Moderado' ? 'warning' : 'secondary',
                                                    children: [
                                                        "Riesgo ",
                                                        risk.risk
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                                    lineNumber: 391,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                            lineNumber: 389,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-neutral-600",
                                            children: [
                                                risk.occurrences,
                                                " familiar",
                                                risk.occurrences > 1 ? 'es' : '',
                                                " con esta condición"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                            lineNumber: 399,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-primary-600 mt-2",
                                            children: [
                                                "Recomendación: ",
                                                risk.recommendation
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                            lineNumber: 402,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, risk.condition, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                    lineNumber: 388,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                            lineNumber: 386,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "text-center py-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-neutral-500",
                                    children: "No hay condiciones médicas registradas aún."
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                    lineNumber: 410,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-neutral-400 mt-1",
                                    children: "Agrega condiciones médicas al crear o editar miembros de la familia."
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                                    lineNumber: 413,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                            lineNumber: 409,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                        lineNumber: 384,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                lineNumber: 380,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-neutral-400 text-center",
                children: "Esta información es solo para referencia y no constituye consejo médico. Consulta con un profesional de salud para evaluación personalizada."
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
                lineNumber: 422,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
        lineNumber: 227,
        columnNumber: 5
    }, this);
}
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
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
            lineNumber: 433,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
        lineNumber: 432,
        columnNumber: 5
    }, this);
}
function XIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M18 6L6 18M6 6l12 12"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
            lineNumber: 441,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
        lineNumber: 440,
        columnNumber: 5
    }, this);
}
function HeartIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
            lineNumber: 449,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/genogram/page.tsx",
        lineNumber: 448,
        columnNumber: 5
    }, this);
}
}),
];

//# sourceMappingURL=apps_web_src_7118bff9._.js.map