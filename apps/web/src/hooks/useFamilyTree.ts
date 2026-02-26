'use client';

import { useEffect, useCallback, useState, useMemo } from 'react';
import { useFamilyStore } from '@/stores/familyStore';
import { createClient } from '@/lib/supabase';
import type { GraphData, GraphPerson, GraphUnion, GraphRelationship } from '@kintree/graph-engine';
import type { Gender } from '@kintree/shared';

export interface Person {
  id: string;
  familyId: string;
  firstName: string;
  middleNames?: string[];
  lastName?: string;
  maidenName?: string;
  nicknames?: string[];
  birthDate?: string;
  birthDateApproximate?: boolean;
  birthPlace?: string;
  deathDate?: string;
  deathDateApproximate?: boolean;
  deathPlace?: string;
  gender: Gender;
  isLiving: boolean;
  biography?: string;
  photoUrl?: string;
  medicalConditions?: any[];
  linkedUserId?: string;
  createdAt: string;
}

export interface Union {
  id: string;
  familyId: string;
  partner1Id: string;
  partner2Id?: string;
  unionType: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  children: string[];
}

export interface Relationship {
  id: string;
  familyId: string;
  person1Id: string;
  person2Id: string;
  relationshipType: string;
  isBiological: boolean;
}

export interface MedicalCondition {
  id: string;
  name: string;
  severity?: 'mild' | 'moderate' | 'severe';
  diagnosed?: string; // Date of diagnosis
  notes?: string;
}

export interface CreatePersonInput {
  firstName: string;
  lastName?: string;
  gender: Gender;
  birthDate?: string;
  birthDateApproximate?: boolean;
  birthPlace?: string;
  deathDate?: string;
  deathDateApproximate?: boolean;
  deathPlace?: string;
  isLiving?: boolean;
  biography?: string;
  photoUrl?: string;
  medicalConditions?: MedicalCondition[];
}

export type RelationshipTypeOption =
  | 'self'           // Root person (me)
  | 'father'
  | 'mother'
  | 'spouse'
  | 'son'
  | 'daughter'
  | 'brother'
  | 'sister'
  | 'grandfather_paternal'
  | 'grandmother_paternal'
  | 'grandfather_maternal'
  | 'grandmother_maternal'
  | 'uncle'
  | 'aunt'
  | 'cousin';

export interface CreatePersonWithRelationshipInput extends CreatePersonInput {
  relationshipType: RelationshipTypeOption;
  relatedToPersonId?: string; // The person this new person is related to
}

export function useFamilyTree() {
  const currentFamily = useFamilyStore((state) => state.currentFamily);
  const supabase = useMemo(() => createClient(), []);
  const [persons, setPersons] = useState<Person[]>([]);
  const [unions, setUnions] = useState<Union[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all data when family changes
  useEffect(() => {
    if (currentFamily?.id) {
      fetchTreeData(currentFamily.id);
    } else {
      setPersons([]);
      setUnions([]);
      setRelationships([]);
      setIsLoading(false);
    }
  }, [currentFamily?.id]);

  const fetchTreeData = useCallback(async (familyId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // Fetch persons
      const { data: personsData, error: personsError } = await supabase
        .from('persons')
        .select('*')
        .eq('family_id', familyId)
        .order('created_at', { ascending: true });

      if (personsError) throw personsError;

      // Fetch unions
      const { data: unionsData, error: unionsError } = await supabase
        .from('unions')
        .select('*')
        .eq('family_id', familyId);

      if (unionsError) throw unionsError;

      // Fetch union children
      const { data: childrenData, error: childrenError } = await supabase
        .from('union_children')
        .select('union_id, child_id')
        .in('union_id', (unionsData || []).map((u: any) => u.id));

      if (childrenError) throw childrenError;

      // Fetch relationships
      const { data: relationshipsData, error: relError } = await supabase
        .from('relationships')
        .select('*')
        .eq('family_id', familyId);

      if (relError) throw relError;

      // Map data
      const personsList: Person[] = (personsData || []).map((p: any) => ({
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
        gender: p.gender as Gender,
        isLiving: p.is_living,
        biography: p.biography,
        photoUrl: p.photo_url,
        medicalConditions: p.medical_conditions,
        linkedUserId: p.linked_user_id,
        createdAt: p.created_at,
      }));

      // Group children by union
      const childrenByUnion = new Map<string, string[]>();
      (childrenData || []).forEach((c: any) => {
        const existing = childrenByUnion.get(c.union_id) || [];
        existing.push(c.child_id);
        childrenByUnion.set(c.union_id, existing);
      });

      const unionsList: Union[] = (unionsData || []).map((u: any) => ({
        id: u.id,
        familyId: u.family_id,
        partner1Id: u.partner1_id,
        partner2Id: u.partner2_id,
        unionType: u.union_type,
        startDate: u.start_date,
        endDate: u.end_date,
        location: u.location,
        children: childrenByUnion.get(u.id) || [],
      }));

      const relationshipsList: Relationship[] = (relationshipsData || []).map((r: any) => ({
        id: r.id,
        familyId: r.family_id,
        person1Id: r.person1_id,
        person2Id: r.person2_id,
        relationshipType: r.relationship_type,
        isBiological: r.is_biological,
      }));

      setPersons(personsList);
      setUnions(unionsList);
      setRelationships(relationshipsList);
    } catch (err) {
      console.error('Error fetching tree data:', err);
      setError('Error loading family tree');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Convert to GraphData format for the layout engine
  const graphData: GraphData = useMemo(() => {
    const graphPersons: GraphPerson[] = persons.map(p => ({
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
      medicalConditions: p.medicalConditions,
    }));

    const graphUnions: GraphUnion[] = unions.map(u => ({
      id: u.id,
      partner1Id: u.partner1Id,
      partner2Id: u.partner2Id || '',
      unionType: u.unionType as any,
      startDate: u.startDate,
      endDate: u.endDate,
      childrenIds: u.children,
    }));

    const graphRelationships: GraphRelationship[] = relationships.map(r => ({
      id: r.id,
      personId: r.person1Id,
      relatedPersonId: r.person2Id,
      type: r.relationshipType === 'parent_child' ? 'parent' : r.relationshipType as any,
    }));

    return {
      persons: graphPersons,
      unions: graphUnions,
      relationships: graphRelationships,
    };
  }, [persons, unions, relationships]);

  // CRUD operations
  const createPerson = useCallback(async (input: CreatePersonInput): Promise<Person | null> => {
    if (!currentFamily?.id) return null;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    try {
      const { data, error } = await supabase
        .from('persons')
        .insert({
          family_id: currentFamily.id,
          first_name: input.firstName,
          last_name: input.lastName,
          gender: input.gender,
          birth_date: input.birthDate,
          is_living: input.isLiving ?? true,
          photo_url: input.photoUrl,
          created_by: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newPerson: Person = {
        id: data.id,
        familyId: data.family_id,
        firstName: data.first_name,
        lastName: data.last_name,
        gender: data.gender as Gender,
        birthDate: data.birth_date,
        isLiving: data.is_living,
        photoUrl: data.photo_url,
        createdAt: data.created_at,
      };

      setPersons(prev => [...prev, newPerson]);
      return newPerson;
    } catch (err) {
      console.error('Error creating person:', err);
      setError('Error creating person');
      return null;
    }
  }, [currentFamily?.id]);

  const updatePerson = useCallback(async (personId: string, updates: Partial<CreatePersonInput>): Promise<boolean> => {
    try {
      const updateData: Record<string, any> = {};
      if (updates.firstName !== undefined) updateData.first_name = updates.firstName;
      if (updates.lastName !== undefined) updateData.last_name = updates.lastName;
      if (updates.gender !== undefined) updateData.gender = updates.gender;
      if (updates.birthDate !== undefined) updateData.birth_date = updates.birthDate;
      if (updates.isLiving !== undefined) updateData.is_living = updates.isLiving;
      if (updates.photoUrl !== undefined) updateData.photo_url = updates.photoUrl;

      const { error } = await supabase
        .from('persons')
        .update(updateData)
        .eq('id', personId);

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
  }, [currentFamily?.id, fetchTreeData]);

  const deletePerson = useCallback(async (personId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('persons')
        .delete()
        .eq('id', personId);

      if (error) throw error;

      setPersons(prev => prev.filter(p => p.id !== personId));
      return true;
    } catch (err) {
      console.error('Error deleting person:', err);
      return false;
    }
  }, []);

  const createUnion = useCallback(async (
    partner1Id: string,
    partner2Id: string | null,
    type: string = 'marriage'
  ): Promise<Union | null> => {
    if (!currentFamily?.id) return null;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    try {
      const { data, error } = await supabase
        .from('unions')
        .insert({
          family_id: currentFamily.id,
          partner1_id: partner1Id,
          partner2_id: partner2Id,
          union_type: type,
          created_by: userData.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      const newUnion: Union = {
        id: data.id,
        familyId: data.family_id,
        partner1Id: data.partner1_id,
        partner2Id: data.partner2_id,
        unionType: data.union_type,
        startDate: data.start_date,
        endDate: data.end_date,
        location: data.location,
        children: [],
      };

      setUnions(prev => [...prev, newUnion]);
      return newUnion;
    } catch (err) {
      console.error('Error creating union:', err);
      return null;
    }
  }, [currentFamily?.id]);

  const addChildToUnion = useCallback(async (unionId: string, childId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('union_children')
        .insert({
          union_id: unionId,
          child_id: childId,
        });

      if (error) throw error;

      // Update local state
      setUnions(prev => prev.map(u =>
        u.id === unionId
          ? { ...u, children: [...u.children, childId] }
          : u
      ));

      return true;
    } catch (err) {
      console.error('Error adding child to union:', err);
      return false;
    }
  }, []);

  const createRelationship = useCallback(async (
    person1Id: string,
    person2Id: string,
    type: string,
    isBiological: boolean = true
  ): Promise<boolean> => {
    if (!currentFamily?.id) return false;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return false;

    try {
      const { error } = await supabase
        .from('relationships')
        .insert({
          family_id: currentFamily.id,
          person1_id: person1Id,
          person2_id: person2Id,
          relationship_type: type,
          is_biological: isBiological,
          created_by: userData.user.id,
        });

      if (error) throw error;

      // Refresh data
      await fetchTreeData(currentFamily.id);
      return true;
    } catch (err) {
      console.error('Error creating relationship:', err);
      return false;
    }
  }, [currentFamily?.id, fetchTreeData]);

  const getPersonById = useCallback((personId: string): Person | undefined => {
    return persons.find(p => p.id === personId);
  }, [persons]);

  const refresh = useCallback(async () => {
    if (currentFamily?.id) {
      await fetchTreeData(currentFamily.id);
    }
  }, [currentFamily?.id, fetchTreeData]);

  // Get root person (first person added or self-marked person)
  const getRootPerson = useCallback((): Person | null => {
    if (persons.length === 0) return null;
    // For now, return the first person created
    return persons[0];
  }, [persons]);

  // Find or create a union between two people
  const findOrCreateUnion = useCallback(async (
    partner1Id: string,
    partner2Id: string | null,
    type: string = 'marriage'
  ): Promise<string | null> => {
    // Look for existing union
    const existingUnion = unions.find(u =>
      (u.partner1Id === partner1Id && u.partner2Id === partner2Id) ||
      (u.partner1Id === partner2Id && u.partner2Id === partner1Id)
    );

    if (existingUnion) {
      return existingUnion.id;
    }

    // Create new union
    const newUnion = await createUnion(partner1Id, partner2Id, type);
    return newUnion?.id || null;
  }, [unions, createUnion]);

  // Get parents of a person
  const getParentsOfPerson = useCallback((personId: string): { fatherId?: string; motherId?: string; unionId?: string } => {
    // Find union where this person is a child
    for (const union of unions) {
      if (union.children.includes(personId)) {
        const partner1 = persons.find(p => p.id === union.partner1Id);
        const partner2 = persons.find(p => p.id === union.partner2Id);

        let fatherId: string | undefined;
        let motherId: string | undefined;

        if (partner1?.gender === 'male') fatherId = partner1.id;
        else if (partner1?.gender === 'female') motherId = partner1.id;

        if (partner2?.gender === 'male') fatherId = partner2.id;
        else if (partner2?.gender === 'female') motherId = partner2.id;

        return { fatherId, motherId, unionId: union.id };
      }
    }
    return {};
  }, [unions, persons]);

  // Get spouse of a person
  const getSpouseOfPerson = useCallback((personId: string): Person | null => {
    for (const union of unions) {
      if (union.partner1Id === personId && union.partner2Id) {
        return persons.find(p => p.id === union.partner2Id) || null;
      }
      if (union.partner2Id === personId) {
        return persons.find(p => p.id === union.partner1Id) || null;
      }
    }
    return null;
  }, [unions, persons]);

  // Create person with relationship - the main function for adding family members
  const createPersonWithRelationship = useCallback(async (
    input: CreatePersonWithRelationshipInput
  ): Promise<Person | null> => {
    if (!currentFamily?.id) return null;

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) return null;

    try {
      // First, create the person
      const { data: personData, error: personError } = await supabase
        .from('persons')
        .insert({
          family_id: currentFamily.id,
          first_name: input.firstName,
          last_name: input.lastName,
          gender: input.gender,
          birth_date: input.birthDate,
          birth_date_approximate: input.birthDateApproximate,
          birth_place: input.birthPlace,
          death_date: input.deathDate,
          death_date_approximate: input.deathDateApproximate,
          death_place: input.deathPlace,
          biography: input.biography,
          is_living: input.isLiving ?? true,
          photo_url: input.photoUrl,
          medical_conditions: input.medicalConditions || null,
          created_by: userData.user.id,
        })
        .select()
        .single();

      if (personError) throw personError;

      const newPersonId = personData.id;
      const relatedToId = input.relatedToPersonId;

      // Now handle the relationship based on type
      switch (input.relationshipType) {
        case 'self':
          // This is the root person, no relationship needed
          break;

        case 'father':
        case 'mother': {
          // Adding a parent to the related person
          if (!relatedToId) break;

          // Get existing parents of the related person
          const existingParents = getParentsOfPerson(relatedToId);

          if (existingParents.unionId) {
            // Union exists, update it to add this parent as the second partner
            if (input.relationshipType === 'father' && !existingParents.fatherId) {
              // If partner1 is already the mother, add father as partner2
              // Otherwise update partner1
              const currentUnion = unions.find(u => u.id === existingParents.unionId);
              if (currentUnion?.partner1Id && !currentUnion?.partner2Id) {
                await supabase.from('unions').update({ partner2_id: newPersonId }).eq('id', existingParents.unionId);
              } else {
                await supabase.from('unions').update({ partner1_id: newPersonId }).eq('id', existingParents.unionId);
              }
            } else if (input.relationshipType === 'mother' && !existingParents.motherId) {
              const currentUnion = unions.find(u => u.id === existingParents.unionId);
              if (currentUnion?.partner1Id && !currentUnion?.partner2Id) {
                await supabase.from('unions').update({ partner2_id: newPersonId }).eq('id', existingParents.unionId);
              } else {
                await supabase.from('unions').update({ partner1_id: newPersonId }).eq('id', existingParents.unionId);
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

        case 'spouse': {
          // Adding a spouse to the related person
          if (!relatedToId) break;

          // Create or find union between them
          await findOrCreateUnion(relatedToId, newPersonId, 'marriage');

          // Create spouse relationship
          await createRelationship(relatedToId, newPersonId, 'spouse', false);
          break;
        }

        case 'son':
        case 'daughter': {
          // Adding a child to the related person
          if (!relatedToId) break;

          // Find or create union for the parent
          const spouse = getSpouseOfPerson(relatedToId);
          let unionId: string | null = null;

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
        case 'sister': {
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
        case 'grandmother_paternal': {
          // Adding paternal grandparent
          if (!relatedToId) break;

          const parents = getParentsOfPerson(relatedToId);
          if (parents.fatherId) {
            // Add as parent of the father
            const fatherParents = getParentsOfPerson(parents.fatherId);

            if (fatherParents.unionId) {
              // Update existing grandparents union - add as second partner
              const currentUnion = unions.find(u => u.id === fatherParents.unionId);
              if (currentUnion?.partner1Id && !currentUnion?.partner2Id) {
                await supabase.from('unions').update({ partner2_id: newPersonId }).eq('id', fatherParents.unionId);
              } else if (!currentUnion?.partner1Id) {
                await supabase.from('unions').update({ partner1_id: newPersonId }).eq('id', fatherParents.unionId);
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
        case 'grandmother_maternal': {
          // Adding maternal grandparent
          if (!relatedToId) break;

          const parents = getParentsOfPerson(relatedToId);
          if (parents.motherId) {
            // Add as parent of the mother
            const motherParents = getParentsOfPerson(parents.motherId);

            if (motherParents.unionId) {
              // Update existing grandparents union - add as second partner
              const currentUnion = unions.find(u => u.id === motherParents.unionId);
              if (currentUnion?.partner1Id && !currentUnion?.partner2Id) {
                await supabase.from('unions').update({ partner2_id: newPersonId }).eq('id', motherParents.unionId);
              } else if (!currentUnion?.partner1Id) {
                await supabase.from('unions').update({ partner1_id: newPersonId }).eq('id', motherParents.unionId);
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
        case 'aunt': {
          // Adding uncle/aunt (sibling of parent)
          if (!relatedToId) break;

          const parents = getParentsOfPerson(relatedToId);
          const parentId = input.gender === 'male'
            ? (parents.fatherId || parents.motherId)
            : (parents.motherId || parents.fatherId);

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

        case 'cousin': {
          // Adding a cousin is complex - need to find uncle/aunt first
          // For now, just add as a person without automatic relationship
          console.log('Cousin relationship requires manual setup');
          break;
        }
      }

      // Refresh all data
      await fetchTreeData(currentFamily.id);

      // Return the created person (constructed from the insert response)
      const createdPerson: Person = {
        id: personData.id,
        familyId: personData.family_id,
        firstName: personData.first_name,
        lastName: personData.last_name,
        gender: personData.gender as Gender,
        birthDate: personData.birth_date,
        isLiving: personData.is_living,
        photoUrl: personData.photo_url,
        medicalConditions: personData.medical_conditions,
        createdAt: personData.created_at,
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
    persons,
  ]);

  // Calculate the relationship role of a person relative to the root person
  const getPersonRole = useCallback((personId: string): string | null => {
    const root = getRootPerson();
    if (!root) return null;
    if (personId === root.id) return 'Me';

    const person = persons.find(p => p.id === personId);
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
    for (const union of unions) {
      if (union.partner1Id === root.id || union.partner2Id === root.id) {
        if (union.children.includes(personId)) {
          return person.gender === 'male' ? 'Son' : 'Daughter';
        }
      }
    }

    // Check if person is sibling (shares same parents as root)
    if (rootParents.unionId) {
      const rootUnion = unions.find(u => u.id === rootParents.unionId);
      if (rootUnion && rootUnion.children.includes(personId)) {
        return person.gender === 'male' ? 'Brother' : 'Sister';
      }
    }

    // Also check sibling relationship in relationships table
    const siblingRelationship = relationships.find(r =>
    (r.relationshipType === 'sibling' &&
      ((r.person1Id === root.id && r.person2Id === personId) ||
        (r.person1Id === personId && r.person2Id === root.id)))
    );
    if (siblingRelationship) {
      return person.gender === 'male' ? 'Brother' : 'Sister';
    }

    // Check if they share at least one parent (alternative sibling check)
    const personParents = getParentsOfPerson(personId);
    if ((rootParents.fatherId && rootParents.fatherId === personParents.fatherId) ||
      (rootParents.motherId && rootParents.motherId === personParents.motherId)) {
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
        const fatherSiblingsUnion = unions.find(u => u.id === fatherParents.unionId);
        if (fatherSiblingsUnion) {
          // Filter out the root's father himself from the siblings
          const siblingsOfFather = fatherSiblingsUnion.children.filter(id => id !== rootParents.fatherId);
          if (siblingsOfFather.includes(personId)) {
            return person.gender === 'male' ? 'Uncle' : 'Aunt';
          }
        }
      }
    }
    if (rootParents.motherId) {
      const motherParents = getParentsOfPerson(rootParents.motherId);
      if (motherParents.unionId) {
        const motherSiblingsUnion = unions.find(u => u.id === motherParents.unionId);
        if (motherSiblingsUnion) {
          // Filter out the root's mother herself from the siblings
          const siblingsOfMother = motherSiblingsUnion.children.filter(id => id !== rootParents.motherId);
          if (siblingsOfMother.includes(personId)) {
            return person.gender === 'male' ? 'Uncle' : 'Aunt';
          }
        }
      }
    }

    // Check if person is grandchild
    for (const union of unions) {
      if (union.partner1Id === root.id || union.partner2Id === root.id) {
        for (const childId of union.children) {
          // Check if this child has children that include the person
          for (const childUnion of unions) {
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
      const rootUnion = unions.find(u => u.id === rootParents.unionId);
      if (rootUnion) {
        for (const siblingId of rootUnion.children) {
          if (siblingId === root.id) continue; // Skip the root person themselves
          // Check if person is child of this sibling
          for (const siblingUnion of unions) {
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
    const unclesAunts: string[] = [];
    if (rootParents.fatherId) {
      const fatherParents = getParentsOfPerson(rootParents.fatherId);
      if (fatherParents.unionId) {
        const fatherSiblingsUnion = unions.find(u => u.id === fatherParents.unionId);
        if (fatherSiblingsUnion) {
          unclesAunts.push(...fatherSiblingsUnion.children.filter(id => id !== rootParents.fatherId));
        }
      }
    }
    if (rootParents.motherId) {
      const motherParents = getParentsOfPerson(rootParents.motherId);
      if (motherParents.unionId) {
        const motherSiblingsUnion = unions.find(u => u.id === motherParents.unionId);
        if (motherSiblingsUnion) {
          unclesAunts.push(...motherSiblingsUnion.children.filter(id => id !== rootParents.motherId));
        }
      }
    }

    // Check if person is child of any uncle/aunt
    for (const uncleAuntId of unclesAunts) {
      for (const uncleAuntUnion of unions) {
        if (uncleAuntUnion.partner1Id === uncleAuntId || uncleAuntUnion.partner2Id === uncleAuntId) {
          if (uncleAuntUnion.children.includes(personId)) {
            return 'Cousin';
          }
        }
      }
    }

    return 'Relative';
  }, [persons, unions, relationships, getRootPerson, getParentsOfPerson, getSpouseOfPerson]);

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
    refresh,
  };
}
