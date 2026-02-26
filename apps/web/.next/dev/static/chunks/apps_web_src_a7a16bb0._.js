(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/apps/web/src/hooks/useFamilyTree.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useFamilyTree",
    ()=>useFamilyTree
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$familyStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/stores/familyStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/supabase.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function useFamilyTree() {
    _s();
    const currentFamily = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$familyStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamilyStore"])({
        "useFamilyTree.useFamilyStore[currentFamily]": (state)=>state.currentFamily
    }["useFamilyTree.useFamilyStore[currentFamily]"]);
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useFamilyTree.useMemo[supabase]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])()
    }["useFamilyTree.useMemo[supabase]"], []);
    const [persons, setPersons] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [unions, setUnions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [relationships, setRelationships] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch all data when family changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useFamilyTree.useEffect": ()=>{
            if (currentFamily?.id) {
                fetchTreeData(currentFamily.id);
            } else {
                setPersons([]);
                setUnions([]);
                setRelationships([]);
                setIsLoading(false);
            }
        }
    }["useFamilyTree.useEffect"], [
        currentFamily?.id
    ]);
    const fetchTreeData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[fetchTreeData]": async (familyId)=>{
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
                const { data: childrenData, error: childrenError } = await supabase.from('union_children').select('union_id, child_id').in('union_id', (unionsData || []).map({
                    "useFamilyTree.useCallback[fetchTreeData]": (u)=>u.id
                }["useFamilyTree.useCallback[fetchTreeData]"]));
                if (childrenError) throw childrenError;
                // Fetch relationships
                const { data: relationshipsData, error: relError } = await supabase.from('relationships').select('*').eq('family_id', familyId);
                if (relError) throw relError;
                // Map data
                const personsList = (personsData || []).map({
                    "useFamilyTree.useCallback[fetchTreeData].personsList": (p)=>({
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
                        })
                }["useFamilyTree.useCallback[fetchTreeData].personsList"]);
                // Group children by union
                const childrenByUnion = new Map();
                (childrenData || []).forEach({
                    "useFamilyTree.useCallback[fetchTreeData]": (c)=>{
                        const existing = childrenByUnion.get(c.union_id) || [];
                        existing.push(c.child_id);
                        childrenByUnion.set(c.union_id, existing);
                    }
                }["useFamilyTree.useCallback[fetchTreeData]"]);
                const unionsList = (unionsData || []).map({
                    "useFamilyTree.useCallback[fetchTreeData].unionsList": (u)=>({
                            id: u.id,
                            familyId: u.family_id,
                            partner1Id: u.partner1_id,
                            partner2Id: u.partner2_id,
                            unionType: u.union_type,
                            startDate: u.start_date,
                            endDate: u.end_date,
                            location: u.location,
                            children: childrenByUnion.get(u.id) || []
                        })
                }["useFamilyTree.useCallback[fetchTreeData].unionsList"]);
                const relationshipsList = (relationshipsData || []).map({
                    "useFamilyTree.useCallback[fetchTreeData].relationshipsList": (r)=>({
                            id: r.id,
                            familyId: r.family_id,
                            person1Id: r.person1_id,
                            person2Id: r.person2_id,
                            relationshipType: r.relationship_type,
                            isBiological: r.is_biological
                        })
                }["useFamilyTree.useCallback[fetchTreeData].relationshipsList"]);
                setPersons(personsList);
                setUnions(unionsList);
                setRelationships(relationshipsList);
            } catch (err) {
                console.error('Error fetching tree data:', err);
                setError('Error loading family tree');
            } finally{
                setIsLoading(false);
            }
        }
    }["useFamilyTree.useCallback[fetchTreeData]"], []);
    // Convert to GraphData format for the layout engine
    const graphData = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "useFamilyTree.useMemo[graphData]": ()=>{
            const graphPersons = persons.map({
                "useFamilyTree.useMemo[graphData].graphPersons": (p)=>({
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
                    })
            }["useFamilyTree.useMemo[graphData].graphPersons"]);
            const graphUnions = unions.map({
                "useFamilyTree.useMemo[graphData].graphUnions": (u)=>({
                        id: u.id,
                        partner1Id: u.partner1Id,
                        partner2Id: u.partner2Id || '',
                        unionType: u.unionType,
                        startDate: u.startDate,
                        endDate: u.endDate,
                        childrenIds: u.children
                    })
            }["useFamilyTree.useMemo[graphData].graphUnions"]);
            const graphRelationships = relationships.map({
                "useFamilyTree.useMemo[graphData].graphRelationships": (r)=>({
                        id: r.id,
                        personId: r.person1Id,
                        relatedPersonId: r.person2Id,
                        type: r.relationshipType === 'parent_child' ? 'parent' : r.relationshipType
                    })
            }["useFamilyTree.useMemo[graphData].graphRelationships"]);
            return {
                persons: graphPersons,
                unions: graphUnions,
                relationships: graphRelationships
            };
        }
    }["useFamilyTree.useMemo[graphData]"], [
        persons,
        unions,
        relationships
    ]);
    // CRUD operations
    const createPerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[createPerson]": async (input)=>{
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
                setPersons({
                    "useFamilyTree.useCallback[createPerson]": (prev)=>[
                            ...prev,
                            newPerson
                        ]
                }["useFamilyTree.useCallback[createPerson]"]);
                return newPerson;
            } catch (err) {
                console.error('Error creating person:', err);
                setError('Error creating person');
                return null;
            }
        }
    }["useFamilyTree.useCallback[createPerson]"], [
        currentFamily?.id
    ]);
    const updatePerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[updatePerson]": async (personId, updates)=>{
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
        }
    }["useFamilyTree.useCallback[updatePerson]"], [
        currentFamily?.id,
        fetchTreeData
    ]);
    const deletePerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[deletePerson]": async (personId)=>{
            try {
                const { error } = await supabase.from('persons').delete().eq('id', personId);
                if (error) throw error;
                setPersons({
                    "useFamilyTree.useCallback[deletePerson]": (prev)=>prev.filter({
                            "useFamilyTree.useCallback[deletePerson]": (p)=>p.id !== personId
                        }["useFamilyTree.useCallback[deletePerson]"])
                }["useFamilyTree.useCallback[deletePerson]"]);
                return true;
            } catch (err) {
                console.error('Error deleting person:', err);
                return false;
            }
        }
    }["useFamilyTree.useCallback[deletePerson]"], []);
    const createUnion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[createUnion]": async (partner1Id, partner2Id, type = 'marriage')=>{
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
                setUnions({
                    "useFamilyTree.useCallback[createUnion]": (prev)=>[
                            ...prev,
                            newUnion
                        ]
                }["useFamilyTree.useCallback[createUnion]"]);
                return newUnion;
            } catch (err) {
                console.error('Error creating union:', err);
                return null;
            }
        }
    }["useFamilyTree.useCallback[createUnion]"], [
        currentFamily?.id
    ]);
    const addChildToUnion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[addChildToUnion]": async (unionId, childId)=>{
            try {
                const { error } = await supabase.from('union_children').insert({
                    union_id: unionId,
                    child_id: childId
                });
                if (error) throw error;
                // Update local state
                setUnions({
                    "useFamilyTree.useCallback[addChildToUnion]": (prev)=>prev.map({
                            "useFamilyTree.useCallback[addChildToUnion]": (u)=>u.id === unionId ? {
                                    ...u,
                                    children: [
                                        ...u.children,
                                        childId
                                    ]
                                } : u
                        }["useFamilyTree.useCallback[addChildToUnion]"])
                }["useFamilyTree.useCallback[addChildToUnion]"]);
                return true;
            } catch (err) {
                console.error('Error adding child to union:', err);
                return false;
            }
        }
    }["useFamilyTree.useCallback[addChildToUnion]"], []);
    const createRelationship = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[createRelationship]": async (person1Id, person2Id, type, isBiological = true)=>{
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
        }
    }["useFamilyTree.useCallback[createRelationship]"], [
        currentFamily?.id,
        fetchTreeData
    ]);
    const getPersonById = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[getPersonById]": (personId)=>{
            return persons.find({
                "useFamilyTree.useCallback[getPersonById]": (p)=>p.id === personId
            }["useFamilyTree.useCallback[getPersonById]"]);
        }
    }["useFamilyTree.useCallback[getPersonById]"], [
        persons
    ]);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[refresh]": async ()=>{
            if (currentFamily?.id) {
                await fetchTreeData(currentFamily.id);
            }
        }
    }["useFamilyTree.useCallback[refresh]"], [
        currentFamily?.id,
        fetchTreeData
    ]);
    // Get root person (first person added or self-marked person)
    const getRootPerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[getRootPerson]": ()=>{
            if (persons.length === 0) return null;
            // For now, return the first person created
            return persons[0];
        }
    }["useFamilyTree.useCallback[getRootPerson]"], [
        persons
    ]);
    // Find or create a union between two people
    const findOrCreateUnion = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[findOrCreateUnion]": async (partner1Id, partner2Id, type = 'marriage')=>{
            // Look for existing union
            const existingUnion = unions.find({
                "useFamilyTree.useCallback[findOrCreateUnion].existingUnion": (u)=>u.partner1Id === partner1Id && u.partner2Id === partner2Id || u.partner1Id === partner2Id && u.partner2Id === partner1Id
            }["useFamilyTree.useCallback[findOrCreateUnion].existingUnion"]);
            if (existingUnion) {
                return existingUnion.id;
            }
            // Create new union
            const newUnion = await createUnion(partner1Id, partner2Id, type);
            return newUnion?.id || null;
        }
    }["useFamilyTree.useCallback[findOrCreateUnion]"], [
        unions,
        createUnion
    ]);
    // Get parents of a person
    const getParentsOfPerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[getParentsOfPerson]": (personId)=>{
            // Find union where this person is a child
            for (const union of unions){
                if (union.children.includes(personId)) {
                    const partner1 = persons.find({
                        "useFamilyTree.useCallback[getParentsOfPerson].partner1": (p)=>p.id === union.partner1Id
                    }["useFamilyTree.useCallback[getParentsOfPerson].partner1"]);
                    const partner2 = persons.find({
                        "useFamilyTree.useCallback[getParentsOfPerson].partner2": (p)=>p.id === union.partner2Id
                    }["useFamilyTree.useCallback[getParentsOfPerson].partner2"]);
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
        }
    }["useFamilyTree.useCallback[getParentsOfPerson]"], [
        unions,
        persons
    ]);
    // Get spouse of a person
    const getSpouseOfPerson = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[getSpouseOfPerson]": (personId)=>{
            for (const union of unions){
                if (union.partner1Id === personId && union.partner2Id) {
                    return persons.find({
                        "useFamilyTree.useCallback[getSpouseOfPerson]": (p)=>p.id === union.partner2Id
                    }["useFamilyTree.useCallback[getSpouseOfPerson]"]) || null;
                }
                if (union.partner2Id === personId) {
                    return persons.find({
                        "useFamilyTree.useCallback[getSpouseOfPerson]": (p)=>p.id === union.partner1Id
                    }["useFamilyTree.useCallback[getSpouseOfPerson]"]) || null;
                }
            }
            return null;
        }
    }["useFamilyTree.useCallback[getSpouseOfPerson]"], [
        unions,
        persons
    ]);
    // Create person with relationship - the main function for adding family members
    const createPersonWithRelationship = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[createPersonWithRelationship]": async (input)=>{
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
                                    const currentUnion = unions.find({
                                        "useFamilyTree.useCallback[createPersonWithRelationship].currentUnion": (u)=>u.id === existingParents.unionId
                                    }["useFamilyTree.useCallback[createPersonWithRelationship].currentUnion"]);
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
                                    const currentUnion = unions.find({
                                        "useFamilyTree.useCallback[createPersonWithRelationship].currentUnion": (u)=>u.id === existingParents.unionId
                                    }["useFamilyTree.useCallback[createPersonWithRelationship].currentUnion"]);
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
                                    const currentUnion = unions.find({
                                        "useFamilyTree.useCallback[createPersonWithRelationship].currentUnion": (u)=>u.id === fatherParents.unionId
                                    }["useFamilyTree.useCallback[createPersonWithRelationship].currentUnion"]);
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
                                    const currentUnion = unions.find({
                                        "useFamilyTree.useCallback[createPersonWithRelationship].currentUnion": (u)=>u.id === motherParents.unionId
                                    }["useFamilyTree.useCallback[createPersonWithRelationship].currentUnion"]);
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
        }
    }["useFamilyTree.useCallback[createPersonWithRelationship]"], [
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
    const getPersonRole = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useFamilyTree.useCallback[getPersonRole]": (personId)=>{
            const root = getRootPerson();
            if (!root) return null;
            if (personId === root.id) return 'Yo';
            const person = persons.find({
                "useFamilyTree.useCallback[getPersonRole].person": (p)=>p.id === personId
            }["useFamilyTree.useCallback[getPersonRole].person"]);
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
                const rootUnion = unions.find({
                    "useFamilyTree.useCallback[getPersonRole].rootUnion": (u)=>u.id === rootParents.unionId
                }["useFamilyTree.useCallback[getPersonRole].rootUnion"]);
                if (rootUnion && rootUnion.children.includes(personId)) {
                    return person.gender === 'male' ? 'Hermano' : 'Hermana';
                }
            }
            // Also check sibling relationship in relationships table
            const siblingRelationship = relationships.find({
                "useFamilyTree.useCallback[getPersonRole].siblingRelationship": (r)=>r.relationshipType === 'sibling' && (r.person1Id === root.id && r.person2Id === personId || r.person1Id === personId && r.person2Id === root.id)
            }["useFamilyTree.useCallback[getPersonRole].siblingRelationship"]);
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
                    const fatherSiblingsUnion = unions.find({
                        "useFamilyTree.useCallback[getPersonRole].fatherSiblingsUnion": (u)=>u.id === fatherParents.unionId
                    }["useFamilyTree.useCallback[getPersonRole].fatherSiblingsUnion"]);
                    if (fatherSiblingsUnion && fatherSiblingsUnion.children.includes(personId)) {
                        return person.gender === 'male' ? 'Tío' : 'Tía';
                    }
                }
            }
            if (rootParents.motherId) {
                const motherParents = getParentsOfPerson(rootParents.motherId);
                if (motherParents.unionId) {
                    const motherSiblingsUnion = unions.find({
                        "useFamilyTree.useCallback[getPersonRole].motherSiblingsUnion": (u)=>u.id === motherParents.unionId
                    }["useFamilyTree.useCallback[getPersonRole].motherSiblingsUnion"]);
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
                const rootUnion = unions.find({
                    "useFamilyTree.useCallback[getPersonRole].rootUnion": (u)=>u.id === rootParents.unionId
                }["useFamilyTree.useCallback[getPersonRole].rootUnion"]);
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
                    const fatherSiblingsUnion = unions.find({
                        "useFamilyTree.useCallback[getPersonRole].fatherSiblingsUnion": (u)=>u.id === fatherParents.unionId
                    }["useFamilyTree.useCallback[getPersonRole].fatherSiblingsUnion"]);
                    if (fatherSiblingsUnion) {
                        unclesAunts.push(...fatherSiblingsUnion.children.filter({
                            "useFamilyTree.useCallback[getPersonRole]": (id)=>id !== rootParents.fatherId
                        }["useFamilyTree.useCallback[getPersonRole]"]));
                    }
                }
            }
            if (rootParents.motherId) {
                const motherParents = getParentsOfPerson(rootParents.motherId);
                if (motherParents.unionId) {
                    const motherSiblingsUnion = unions.find({
                        "useFamilyTree.useCallback[getPersonRole].motherSiblingsUnion": (u)=>u.id === motherParents.unionId
                    }["useFamilyTree.useCallback[getPersonRole].motherSiblingsUnion"]);
                    if (motherSiblingsUnion) {
                        unclesAunts.push(...motherSiblingsUnion.children.filter({
                            "useFamilyTree.useCallback[getPersonRole]": (id)=>id !== rootParents.motherId
                        }["useFamilyTree.useCallback[getPersonRole]"]));
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
        }
    }["useFamilyTree.useCallback[getPersonRole]"], [
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
_s(useFamilyTree, "I1iU6zjEQryVQxpQLkuEXSzgEBY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$familyStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamilyStore"]
    ];
});
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
]);

//# sourceMappingURL=apps_web_src_a7a16bb0._.js.map