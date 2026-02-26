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
            if (personId === root.id) return 'Me';
            const person = persons.find({
                "useFamilyTree.useCallback[getPersonRole].person": (p)=>p.id === personId
            }["useFamilyTree.useCallback[getPersonRole].person"]);
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
                const rootUnion = unions.find({
                    "useFamilyTree.useCallback[getPersonRole].rootUnion": (u)=>u.id === rootParents.unionId
                }["useFamilyTree.useCallback[getPersonRole].rootUnion"]);
                if (rootUnion && rootUnion.children.includes(personId)) {
                    return person.gender === 'male' ? 'Brother' : 'Sister';
                }
            }
            // Also check sibling relationship in relationships table
            const siblingRelationship = relationships.find({
                "useFamilyTree.useCallback[getPersonRole].siblingRelationship": (r)=>r.relationshipType === 'sibling' && (r.person1Id === root.id && r.person2Id === personId || r.person1Id === personId && r.person2Id === root.id)
            }["useFamilyTree.useCallback[getPersonRole].siblingRelationship"]);
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
                    const fatherSiblingsUnion = unions.find({
                        "useFamilyTree.useCallback[getPersonRole].fatherSiblingsUnion": (u)=>u.id === fatherParents.unionId
                    }["useFamilyTree.useCallback[getPersonRole].fatherSiblingsUnion"]);
                    if (fatherSiblingsUnion) {
                        // Filter out the root's father himself from the siblings
                        const siblingsOfFather = fatherSiblingsUnion.children.filter({
                            "useFamilyTree.useCallback[getPersonRole].siblingsOfFather": (id)=>id !== rootParents.fatherId
                        }["useFamilyTree.useCallback[getPersonRole].siblingsOfFather"]);
                        if (siblingsOfFather.includes(personId)) {
                            return person.gender === 'male' ? 'Uncle' : 'Aunt';
                        }
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
                        // Filter out the root's mother herself from the siblings
                        const siblingsOfMother = motherSiblingsUnion.children.filter({
                            "useFamilyTree.useCallback[getPersonRole].siblingsOfMother": (id)=>id !== rootParents.motherId
                        }["useFamilyTree.useCallback[getPersonRole].siblingsOfMother"]);
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
                const rootUnion = unions.find({
                    "useFamilyTree.useCallback[getPersonRole].rootUnion": (u)=>u.id === rootParents.unionId
                }["useFamilyTree.useCallback[getPersonRole].rootUnion"]);
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
                            return 'Cousin';
                        }
                    }
                }
            }
            return 'Relative';
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
"[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PersonDetailPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$index$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/packages/ui/src/index.ts [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/layout/Container.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Card.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Button.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Avatar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Badge.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/navigation/Tabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Skeleton.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Dialog.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/packages/ui/src/primitives/Input.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamily.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/stores/authStore.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/apps/web/src/hooks/useFamilyTree.ts [app-client] (ecmascript)");
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
function PersonDetailPage() {
    _s();
    const params = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"])();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const personId = params.personId;
    const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "PersonDetailPage.useMemo[supabase]": ()=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createClient"])()
    }["PersonDetailPage.useMemo[supabase]"], []);
    const { currentFamily } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamily"])();
    const currentUser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"])({
        "PersonDetailPage.useAuthStore[currentUser]": (state)=>state.user
    }["PersonDetailPage.useAuthStore[currentUser]"]);
    const [person, setPerson] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [relatives, setRelatives] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        parents: [],
        children: [],
        siblings: []
    });
    const [socialAccounts, setSocialAccounts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [socialPosts, setSocialPosts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('info');
    const [isSyncing, setIsSyncing] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // Edit/Delete state
    const [isEditModalOpen, setIsEditModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [isSubmitting, setIsSubmitting] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editForm, setEditForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({
        firstName: '',
        lastName: '',
        gender: 'male',
        birthDate: '',
        birthPlace: '',
        isLiving: true
    });
    // Get update/delete functions from hook
    const { updatePerson, deletePerson } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamilyTree"])();
    // Check if current user is the linked user for this person
    const isOwner = person?.linkedUserId && currentUser?.id === person.linkedUserId;
    // Fetch person data with retry logic
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PersonDetailPage.useEffect": ()=>{
            let retryCount = 0;
            const maxRetries = 3;
            async function fetchData() {
                if (!personId) return;
                setIsLoading(true);
                try {
                    // Fetch person
                    const { data: personData, error: personError } = await supabase.from('persons').select('*').eq('id', personId).single();
                    if (personError) {
                        // If access denied, might be due to family context not being set yet
                        // Retry a few times with delay
                        if (retryCount < maxRetries && (personError.code === 'PGRST116' || personError.code === '42501')) {
                            retryCount++;
                            console.log(`Retrying fetch person (${retryCount}/${maxRetries})...`);
                            setTimeout(fetchData, 500 * retryCount);
                            return;
                        }
                        console.error('Error fetching person:', personError);
                        setIsLoading(false);
                        return;
                    }
                    const mappedPerson = {
                        id: personData.id,
                        firstName: personData.first_name,
                        lastName: personData.last_name,
                        gender: personData.gender,
                        birthDate: personData.birth_date,
                        birthPlace: personData.birth_place,
                        deathDate: personData.death_date,
                        isLiving: personData.is_living,
                        biography: personData.biography,
                        photoUrl: personData.photo_url,
                        linkedUserId: personData.linked_user_id
                    };
                    setPerson(mappedPerson);
                    // Fetch relatives (simplified - would need more complex queries for full relationship mapping)
                    const { data: unions } = await supabase.from('unions').select('*, partner1:partner1_id(*), partner2:partner2_id(*)').or(`partner1_id.eq.${personId},partner2_id.eq.${personId}`);
                    if (unions && unions.length > 0) {
                        const union = unions[0];
                        const spouse = union.partner1_id === personId ? union.partner2 : union.partner1;
                        if (spouse) {
                            setRelatives({
                                "PersonDetailPage.useEffect.fetchData": (prev)=>({
                                        ...prev,
                                        spouse: {
                                            id: spouse.id,
                                            firstName: spouse.first_name,
                                            lastName: spouse.last_name,
                                            gender: spouse.gender,
                                            isLiving: spouse.is_living
                                        }
                                    })
                            }["PersonDetailPage.useEffect.fetchData"]);
                        }
                    }
                    // Fetch social accounts
                    const { data: accounts } = await supabase.from('social_media_accounts').select('*').eq('person_id', personId).eq('is_active', true);
                    if (accounts) {
                        setSocialAccounts(accounts.map({
                            "PersonDetailPage.useEffect.fetchData": (a)=>({
                                    id: a.id,
                                    platform: a.platform,
                                    username: a.username,
                                    displayName: a.display_name,
                                    profilePictureUrl: a.profile_picture_url,
                                    isActive: a.is_active
                                })
                        }["PersonDetailPage.useEffect.fetchData"]));
                    }
                    // Fetch social posts
                    const { data: posts } = await supabase.from('social_posts').select('*').eq('person_id', personId).order('posted_at', {
                        ascending: false
                    }).limit(20);
                    if (posts) {
                        setSocialPosts(posts.map({
                            "PersonDetailPage.useEffect.fetchData": (p)=>({
                                    id: p.id,
                                    platform: p.account_id,
                                    postType: p.post_type,
                                    content: p.content,
                                    mediaUrls: p.media_urls || [],
                                    thumbnailUrl: p.thumbnail_url,
                                    permalink: p.permalink,
                                    likesCount: p.likes_count,
                                    commentsCount: p.comments_count,
                                    postedAt: p.posted_at
                                })
                        }["PersonDetailPage.useEffect.fetchData"]));
                    }
                } catch (err) {
                    console.error('Error:', err);
                } finally{
                    setIsLoading(false);
                }
            }
            fetchData();
        }
    }["PersonDetailPage.useEffect"], [
        personId,
        supabase
    ]);
    // Initialize edit form when person data loads
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "PersonDetailPage.useEffect": ()=>{
            if (person) {
                setEditForm({
                    firstName: person.firstName,
                    lastName: person.lastName || '',
                    gender: person.gender,
                    birthDate: person.birthDate || '',
                    birthPlace: person.birthPlace || '',
                    isLiving: person.isLiving
                });
            }
        }
    }["PersonDetailPage.useEffect"], [
        person
    ]);
    const handleOpenEdit = ()=>{
        if (person) {
            setEditForm({
                firstName: person.firstName,
                lastName: person.lastName || '',
                gender: person.gender,
                birthDate: person.birthDate || '',
                birthPlace: person.birthPlace || '',
                isLiving: person.isLiving
            });
            setIsEditModalOpen(true);
        }
    };
    const handleSaveEdit = async ()=>{
        if (!person) return;
        setIsSubmitting(true);
        try {
            const success = await updatePerson(person.id, {
                firstName: editForm.firstName,
                lastName: editForm.lastName || undefined,
                gender: editForm.gender,
                birthDate: editForm.birthDate || undefined,
                isLiving: editForm.isLiving
            });
            if (success) {
                // Update local state
                setPerson({
                    ...person,
                    firstName: editForm.firstName,
                    lastName: editForm.lastName,
                    gender: editForm.gender,
                    birthDate: editForm.birthDate,
                    isLiving: editForm.isLiving
                });
                setIsEditModalOpen(false);
            }
        } catch (err) {
            console.error('Error updating person:', err);
        } finally{
            setIsSubmitting(false);
        }
    };
    const handleDelete = async ()=>{
        if (!person) return;
        setIsSubmitting(true);
        try {
            const success = await deletePerson(person.id);
            if (success) {
                router.push('/tree');
            }
        } catch (err) {
            console.error('Error deleting person:', err);
        } finally{
            setIsSubmitting(false);
            setIsDeleteDialogOpen(false);
        }
    };
    const calculateAge = (birthDate)=>{
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birth.getDate()) {
            age--;
        }
        return age;
    };
    const handleConnectSocial = (platform)=>{
        // Store personId in sessionStorage to link account after OAuth
        sessionStorage.setItem('linkToPersonId', personId);
        router.push(`/api/social/${platform}/connect`);
    };
    const handleSyncPosts = async (accountId)=>{
        setIsSyncing(true);
        try {
            const response = await fetch(`/api/social/sync?accountId=${accountId}`, {
                method: 'POST'
            });
            const result = await response.json();
            if (result.success) {
                // Refresh posts
                const { data: posts } = await supabase.from('social_posts').select('*').eq('person_id', personId).order('posted_at', {
                    ascending: false
                }).limit(20);
                if (posts) {
                    setSocialPosts(posts.map((p)=>({
                            id: p.id,
                            platform: p.account_id,
                            postType: p.post_type,
                            content: p.content,
                            mediaUrls: p.media_urls || [],
                            thumbnailUrl: p.thumbnail_url,
                            permalink: p.permalink,
                            likesCount: p.likes_count,
                            commentsCount: p.comments_count,
                            postedAt: p.posted_at
                        })));
                }
            }
        } catch (err) {
            console.error('Sync error:', err);
        } finally{
            setIsSyncing(false);
        }
    };
    if (isLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
            size: "md",
            padding: false,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-4 mb-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                            width: 40,
                            height: 40
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                            lineNumber: 361,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                            width: 200,
                            height: 32
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                            lineNumber: 362,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                    lineNumber: 360,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                    height: 200,
                    className: "mb-6"
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                    lineNumber: 364,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Skeleton$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Skeleton"], {
                    height: 300
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                    lineNumber: 365,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
            lineNumber: 359,
            columnNumber: 7
        }, this);
    }
    if (!person) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
            size: "md",
            padding: false,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                padding: "lg",
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-neutral-900 mb-2",
                        children: "Persona no encontrada"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 374,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-neutral-500 mb-4",
                        children: "No se pudo encontrar la persona solicitada."
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 375,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        onClick: ()=>router.push('/tree'),
                        children: "Volver al árbol"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 376,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 373,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
            lineNumber: 372,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$layout$2f$Container$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Container"], {
        size: "md",
        padding: false,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-4 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                        variant: "ghost",
                        size: "sm",
                        onClick: ()=>router.back(),
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ArrowLeftIcon, {
                            className: "w-5 h-5"
                        }, void 0, false, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                            lineNumber: 386,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 385,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-bold text-neutral-900",
                        children: "Detalle de Persona"
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 388,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 384,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                className: "mb-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                    className: "p-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row gap-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-col items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                                        name: `${person.firstName} ${person.lastName || ''}`,
                                        size: "xl",
                                        src: person.photoUrl
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                        lineNumber: 396,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-3 flex gap-2",
                                        children: [
                                            person.isLiving ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "success",
                                                children: "Vivo"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 403,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "secondary",
                                                children: "Fallecido"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 405,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                                variant: "secondary",
                                                children: person.gender === 'male' ? 'Hombre' : person.gender === 'female' ? 'Mujer' : 'Otro'
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 407,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                        lineNumber: 401,
                                        columnNumber: 15
                                    }, this),
                                    isOwner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Badge$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Badge"], {
                                        variant: "primary",
                                        className: "mt-2",
                                        children: "Tu perfil"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                        lineNumber: 412,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                lineNumber: 395,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "text-2xl font-bold text-neutral-900",
                                            children: [
                                                person.firstName,
                                                " ",
                                                person.lastName || ''
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 418,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                        lineNumber: 417,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm",
                                        children: [
                                            person.birthDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoItem, {
                                                        label: "Fecha de Nacimiento",
                                                        value: new Date(person.birthDate).toLocaleDateString('es')
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                        lineNumber: 426,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoItem, {
                                                        label: "Edad",
                                                        value: `${calculateAge(person.birthDate)} años`
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                        lineNumber: 427,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true),
                                            person.birthPlace && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InfoItem, {
                                                label: "Lugar de Nacimiento",
                                                value: person.birthPlace
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 431,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                        lineNumber: 423,
                                        columnNumber: 15
                                    }, this),
                                    person.biography && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-neutral-600 text-sm italic",
                                        children: person.biography
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                        lineNumber: 436,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                size: "sm",
                                                onClick: handleOpenEdit,
                                                children: "Editar"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 440,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "outline",
                                                size: "sm",
                                                onClick: ()=>router.push('/tree'),
                                                children: "Ver en Árbol"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 441,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                variant: "ghost",
                                                size: "sm",
                                                onClick: ()=>setIsDeleteDialogOpen(true),
                                                className: "text-red-600 hover:text-red-700 hover:bg-red-50",
                                                children: "Eliminar"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 444,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                        lineNumber: 439,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                lineNumber: 416,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 394,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                    lineNumber: 393,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 392,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Tabs"], {
                value: activeTab,
                onChange: setActiveTab,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabList"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabTrigger"], {
                                value: "info",
                                children: "Información"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                lineNumber: 456,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabTrigger"], {
                                value: "family",
                                children: "Familia"
                            }, void 0, false, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                lineNumber: 457,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabTrigger"], {
                                value: "social",
                                children: [
                                    "Redes Sociales",
                                    socialAccounts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-1 px-1.5 py-0.5 text-xs bg-primary-100 text-primary-700 rounded-full",
                                        children: socialAccounts.length
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                        lineNumber: 461,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                lineNumber: 458,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 455,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabContent"], {
                        value: "info",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-semibold text-neutral-900",
                                        children: "Información Personal"
                                    }, void 0, false, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                        lineNumber: 471,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 470,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            person.birthDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CalendarIcon, {
                                                        className: "w-5 h-5 text-neutral-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                        lineNumber: 477,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-neutral-700",
                                                        children: [
                                                            "Nacido el ",
                                                            new Date(person.birthDate).toLocaleDateString('es', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                        lineNumber: 478,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 476,
                                                columnNumber: 19
                                            }, this),
                                            person.birthPlace && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MapPinIcon, {
                                                        className: "w-5 h-5 text-neutral-400"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                        lineNumber: 489,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-neutral-700",
                                                        children: person.birthPlace
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                        lineNumber: 490,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 488,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                        lineNumber: 474,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 473,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                            lineNumber: 469,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 468,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabContent"], {
                        value: "family",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                relatives.spouse && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-neutral-900",
                                                children: "Cónyuge"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 503,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 502,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RelativeCard, {
                                                person: relatives.spouse,
                                                relationship: "Esposo/a",
                                                onClick: ()=>router.push(`/tree/${relatives.spouse.id}`)
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 506,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 505,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 501,
                                    columnNumber: 15
                                }, this),
                                relatives.parents.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-neutral-900",
                                                children: "Padres"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 518,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 517,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: relatives.parents.map((parent)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RelativeCard, {
                                                        person: parent,
                                                        relationship: parent.gender === 'male' ? 'Padre' : 'Madre',
                                                        onClick: ()=>router.push(`/tree/${parent.id}`)
                                                    }, parent.id, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                        lineNumber: 523,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 521,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 520,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 516,
                                    columnNumber: 15
                                }, this),
                                relatives.children.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-semibold text-neutral-900",
                                                children: "Hijos"
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 538,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 537,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: relatives.children.map((child)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RelativeCard, {
                                                        person: child,
                                                        relationship: child.gender === 'male' ? 'Hijo' : 'Hija',
                                                        onClick: ()=>router.push(`/tree/${child.id}`)
                                                    }, child.id, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                        lineNumber: 543,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 541,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 540,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 536,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                            lineNumber: 499,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 498,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$navigation$2f$Tabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["TabContent"], {
                        value: "social",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                            title: "Cuentas Conectadas",
                                            subtitle: isOwner ? 'Conecta tus redes sociales para compartir publicaciones' : 'Redes sociales vinculadas'
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 561,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            children: socialAccounts.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-center py-6",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(SocialIcon, {
                                                        className: "w-12 h-12 text-neutral-300 mx-auto mb-3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                        lineNumber: 568,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-neutral-500 mb-4",
                                                        children: isOwner ? 'Conecta tus redes sociales para mostrar tus publicaciones en el árbol familiar' : 'Este familiar aún no ha conectado sus redes sociales'
                                                    }, void 0, false, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                        lineNumber: 569,
                                                        columnNumber: 21
                                                    }, this),
                                                    isOwner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2 justify-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                variant: "outline",
                                                                size: "sm",
                                                                onClick: ()=>handleConnectSocial('instagram'),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InstagramIcon, {
                                                                        className: "w-4 h-4 mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                        lineNumber: 581,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    "Conectar Instagram"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                lineNumber: 576,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                variant: "outline",
                                                                size: "sm",
                                                                onClick: ()=>handleConnectSocial('facebook'),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FacebookIcon, {
                                                                        className: "w-4 h-4 mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                        lineNumber: 589,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    "Conectar Facebook"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                lineNumber: 584,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                        lineNumber: 575,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 567,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-3",
                                                children: [
                                                    socialAccounts.map((account)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between p-3 rounded-xl border border-neutral-200",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        account.platform === 'instagram' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InstagramIcon, {
                                                                                className: "w-5 h-5 text-white"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                                lineNumber: 605,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                            lineNumber: 604,
                                                                            columnNumber: 29
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            className: "w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FacebookIcon, {
                                                                                className: "w-5 h-5 text-white"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                                lineNumber: 609,
                                                                                columnNumber: 31
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                            lineNumber: 608,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "font-medium text-neutral-900",
                                                                                    children: account.displayName || account.username
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                                    lineNumber: 613,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm text-neutral-500",
                                                                                    children: [
                                                                                        "@",
                                                                                        account.username
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                                    lineNumber: 616,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                            lineNumber: 612,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                    lineNumber: 602,
                                                                    columnNumber: 25
                                                                }, this),
                                                                isOwner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                    variant: "ghost",
                                                                    size: "sm",
                                                                    onClick: ()=>handleSyncPosts(account.id),
                                                                    loading: isSyncing,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(RefreshIcon, {
                                                                            className: "w-4 h-4 mr-1"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                            lineNumber: 626,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        "Sincronizar"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                    lineNumber: 620,
                                                                    columnNumber: 27
                                                                }, this)
                                                            ]
                                                        }, account.id, true, {
                                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                            lineNumber: 598,
                                                            columnNumber: 23
                                                        }, this)),
                                                    isOwner && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2 pt-2",
                                                        children: [
                                                            !socialAccounts.find((a)=>a.platform === 'instagram') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                variant: "outline",
                                                                size: "sm",
                                                                onClick: ()=>handleConnectSocial('instagram'),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(InstagramIcon, {
                                                                        className: "w-4 h-4 mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                        lineNumber: 641,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    "Agregar Instagram"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                lineNumber: 636,
                                                                columnNumber: 27
                                                            }, this),
                                                            !socialAccounts.find((a)=>a.platform === 'facebook') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                                                variant: "outline",
                                                                size: "sm",
                                                                onClick: ()=>handleConnectSocial('facebook'),
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(FacebookIcon, {
                                                                        className: "w-4 h-4 mr-2"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                        lineNumber: 651,
                                                                        columnNumber: 29
                                                                    }, this),
                                                                    "Agregar Facebook"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                lineNumber: 646,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                        lineNumber: 634,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 596,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 565,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 560,
                                    columnNumber: 13
                                }, this),
                                socialPosts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Card"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardHeader"], {
                                            title: "Publicaciones Recientes"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 665,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Card$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["CardContent"], {
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 md:grid-cols-3 gap-3",
                                                children: socialPosts.map((post)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: post.permalink || '#',
                                                        target: "_blank",
                                                        rel: "noopener noreferrer",
                                                        className: "block aspect-square rounded-xl overflow-hidden bg-neutral-100 hover:opacity-90 transition-opacity relative group",
                                                        children: [
                                                            post.thumbnailUrl || post.mediaUrls && post.mediaUrls[0] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: post.thumbnailUrl || post.mediaUrls[0],
                                                                alt: post.content?.slice(0, 50) || 'Post',
                                                                className: "w-full h-full object-cover"
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                lineNumber: 677,
                                                                columnNumber: 27
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "w-full h-full flex items-center justify-center p-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs text-neutral-500 line-clamp-4",
                                                                    children: post.content
                                                                }, void 0, false, {
                                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                    lineNumber: 684,
                                                                    columnNumber: 29
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                lineNumber: 683,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(HeartIcon, {
                                                                                className: "w-4 h-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                                lineNumber: 689,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            post.likesCount
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                        lineNumber: 688,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "flex items-center gap-1",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(CommentIcon, {
                                                                                className: "w-4 h-4"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                                lineNumber: 693,
                                                                                columnNumber: 29
                                                                            }, this),
                                                                            post.commentsCount
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                        lineNumber: 692,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                                lineNumber: 687,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, post.id, true, {
                                                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                        lineNumber: 669,
                                                        columnNumber: 23
                                                    }, this))
                                            }, void 0, false, {
                                                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                lineNumber: 667,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 666,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 664,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                            lineNumber: 558,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 557,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 454,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isEditModalOpen,
                onClose: ()=>setIsEditModalOpen(false),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                        title: "Editar Persona",
                        onClose: ()=>setIsEditModalOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 709,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-2 gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            label: "Nombre",
                                            value: editForm.firstName,
                                            onChange: (e)=>setEditForm({
                                                    ...editForm,
                                                    firstName: e.target.value
                                                }),
                                            required: true,
                                            fullWidth: true
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 713,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                            label: "Apellido",
                                            value: editForm.lastName,
                                            onChange: (e)=>setEditForm({
                                                    ...editForm,
                                                    lastName: e.target.value
                                                }),
                                            fullWidth: true
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 720,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 712,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium text-neutral-700 mb-1.5",
                                            children: "Género"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 729,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: editForm.gender,
                                            onChange: (e)=>setEditForm({
                                                    ...editForm,
                                                    gender: e.target.value
                                                }),
                                            className: "w-full px-4 py-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "male",
                                                    children: "Masculino"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                    lineNumber: 737,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "female",
                                                    children: "Femenino"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                    lineNumber: 738,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    value: "other",
                                                    children: "Otro"
                                                }, void 0, false, {
                                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                                    lineNumber: 739,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 732,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 728,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Input$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Input"], {
                                    label: "Fecha de nacimiento",
                                    type: "date",
                                    value: editForm.birthDate,
                                    onChange: (e)=>setEditForm({
                                            ...editForm,
                                            birthDate: e.target.value
                                        }),
                                    fullWidth: true
                                }, void 0, false, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 743,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center gap-2 cursor-pointer",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: editForm.isLiving,
                                            onChange: (e)=>setEditForm({
                                                    ...editForm,
                                                    isLiving: e.target.checked
                                                }),
                                            className: "w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 752,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-neutral-700",
                                            children: "Persona viva"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 758,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 751,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            fullWidth: true,
                                            onClick: ()=>setIsEditModalOpen(false),
                                            disabled: isSubmitting,
                                            children: "Cancelar"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 762,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            fullWidth: true,
                                            onClick: handleSaveEdit,
                                            loading: isSubmitting,
                                            disabled: !editForm.firstName.trim(),
                                            children: "Guardar"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 770,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 761,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                            lineNumber: 711,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 710,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 708,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Dialog"], {
                open: isDeleteDialogOpen,
                onClose: ()=>setIsDeleteDialogOpen(false),
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogHeader"], {
                        title: "Eliminar Persona",
                        onClose: ()=>setIsDeleteDialogOpen(false)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 785,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Dialog$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["DialogContent"], {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-neutral-600",
                                    children: [
                                        "¿Estás seguro de que deseas eliminar a ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                            children: [
                                                person?.firstName,
                                                " ",
                                                person?.lastName
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 789,
                                            columnNumber: 54
                                        }, this),
                                        "? Esta acción no se puede deshacer."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 788,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex gap-3 pt-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            variant: "outline",
                                            fullWidth: true,
                                            onClick: ()=>setIsDeleteDialogOpen(false),
                                            disabled: isSubmitting,
                                            children: "Cancelar"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 793,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Button$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Button"], {
                                            fullWidth: true,
                                            onClick: handleDelete,
                                            loading: isSubmitting,
                                            className: "bg-red-600 hover:bg-red-700 text-white",
                                            children: "Eliminar"
                                        }, void 0, false, {
                                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                            lineNumber: 801,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                                    lineNumber: 792,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                            lineNumber: 787,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 786,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 784,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
        lineNumber: 383,
        columnNumber: 5
    }, this);
}
_s(PersonDetailPage, "S2QwjEyJHRnJfsMMllDlTGSOggM=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useParams"],
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamily$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamily"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$stores$2f$authStore$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useAuthStore"],
        __TURBOPACK__imported__module__$5b$project$5d2f$apps$2f$web$2f$src$2f$hooks$2f$useFamilyTree$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useFamilyTree"]
    ];
});
_c = PersonDetailPage;
function InfoItem({ label, value }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-neutral-500 text-xs uppercase tracking-wide",
                children: label
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 820,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-neutral-900 font-medium",
                children: value
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 821,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
        lineNumber: 819,
        columnNumber: 5
    }, this);
}
_c1 = InfoItem;
function RelativeCard({ person, relationship, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: "w-full flex items-center gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors text-left",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$packages$2f$ui$2f$src$2f$primitives$2f$Avatar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Avatar"], {
                name: `${person.firstName} ${person.lastName || ''}`,
                size: "md"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 840,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "font-medium text-neutral-900",
                        children: [
                            person.firstName,
                            " ",
                            person.lastName || ''
                        ]
                    }, void 0, true, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 842,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-neutral-500",
                        children: relationship
                    }, void 0, false, {
                        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                        lineNumber: 845,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 841,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
        lineNumber: 836,
        columnNumber: 5
    }, this);
}
_c2 = RelativeCard;
// Icons
function ArrowLeftIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M19 12H5M12 19l-7-7 7-7"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
            lineNumber: 855,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
        lineNumber: 854,
        columnNumber: 5
    }, this);
}
_c3 = ArrowLeftIcon;
function CalendarIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
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
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 863,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M16 2v4M8 2v4M3 10h18"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 864,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
        lineNumber: 862,
        columnNumber: 5
    }, this);
}
_c4 = CalendarIcon;
function MapPinIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1118 0z"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 872,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "10",
                r: "3"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 873,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
        lineNumber: 871,
        columnNumber: 5
    }, this);
}
_c5 = MapPinIcon;
function SocialIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
            lineNumber: 881,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
        lineNumber: 880,
        columnNumber: 5
    }, this);
}
_c6 = SocialIcon;
function InstagramIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                x: "2",
                y: "2",
                width: "20",
                height: "20",
                rx: "5"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 889,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "12",
                cy: "12",
                r: "4"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 890,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                cx: "18",
                cy: "6",
                r: "1",
                fill: "currentColor"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 891,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
        lineNumber: 888,
        columnNumber: 5
    }, this);
}
_c7 = InstagramIcon;
function FacebookIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
            lineNumber: 899,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
        lineNumber: 898,
        columnNumber: 5
    }, this);
}
_c8 = FacebookIcon;
function RefreshIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M23 4v6h-6M1 20v-6h6"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 907,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                d: "M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"
            }, void 0, false, {
                fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
                lineNumber: 908,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
        lineNumber: 906,
        columnNumber: 5
    }, this);
}
_c9 = RefreshIcon;
function HeartIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "currentColor",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
            lineNumber: 916,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
        lineNumber: 915,
        columnNumber: 5
    }, this);
}
_c10 = HeartIcon;
function CommentIcon({ className }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        className: className,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
        }, void 0, false, {
            fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
            lineNumber: 924,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/apps/web/src/app/(dashboard)/tree/[personId]/page.tsx",
        lineNumber: 923,
        columnNumber: 5
    }, this);
}
_c11 = CommentIcon;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7, _c8, _c9, _c10, _c11;
__turbopack_context__.k.register(_c, "PersonDetailPage");
__turbopack_context__.k.register(_c1, "InfoItem");
__turbopack_context__.k.register(_c2, "RelativeCard");
__turbopack_context__.k.register(_c3, "ArrowLeftIcon");
__turbopack_context__.k.register(_c4, "CalendarIcon");
__turbopack_context__.k.register(_c5, "MapPinIcon");
__turbopack_context__.k.register(_c6, "SocialIcon");
__turbopack_context__.k.register(_c7, "InstagramIcon");
__turbopack_context__.k.register(_c8, "FacebookIcon");
__turbopack_context__.k.register(_c9, "RefreshIcon");
__turbopack_context__.k.register(_c10, "HeartIcon");
__turbopack_context__.k.register(_c11, "CommentIcon");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=apps_web_src_db98eac6._.js.map