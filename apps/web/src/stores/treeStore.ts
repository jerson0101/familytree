import { create } from 'zustand';
import type { Gender } from '@kintree/shared';

export interface TreePerson {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birthDate?: string;
  birthDateApproximate?: boolean;
  birthPlace?: string;
  deathDate?: string;
  deathDateApproximate?: boolean;
  deathPlace?: string;
  photoUrl?: string;
  isLiving: boolean;
  generation?: number;
  x?: number;
  y?: number;
}

export interface TreeUnion {
  id: string;
  partner1Id: string;
  partner2Id: string;
  unionType: 'marriage' | 'partnership' | 'other';
  startDate?: string;
  endDate?: string;
  childrenIds: string[];
  x?: number;
  y?: number;
}

export interface TreeRelationship {
  id: string;
  personId: string;
  relatedPersonId: string;
  relationshipType: 'parent' | 'child' | 'spouse' | 'sibling';
}

export type TreeViewMode = 'tree' | 'genogram' | 'list' | 'treeplus';

export interface TreeFilters {
  showLiving: boolean;
  showDeceased: boolean;
  generations?: number;
  searchQuery: string;
  highlightedPersonId?: string;
}

export interface TreeViewport {
  x: number;
  y: number;
  scale: number;
  width: number;
  height: number;
}

interface TreeState {
  // Data
  persons: TreePerson[];
  unions: TreeUnion[];
  relationships: TreeRelationship[];

  // View state
  viewMode: TreeViewMode;
  viewport: TreeViewport;
  filters: TreeFilters;
  selectedPersonId: string | null;
  focusedPersonId: string | null;
  isLoading: boolean;

  // Actions
  setPersons: (persons: TreePerson[]) => void;
  setUnions: (unions: TreeUnion[]) => void;
  setRelationships: (relationships: TreeRelationship[]) => void;
  addPerson: (person: TreePerson) => void;
  updatePerson: (personId: string, updates: Partial<TreePerson>) => void;
  removePerson: (personId: string) => void;
  addUnion: (union: TreeUnion) => void;
  updateUnion: (unionId: string, updates: Partial<TreeUnion>) => void;
  removeUnion: (unionId: string) => void;

  setViewMode: (mode: TreeViewMode) => void;
  setViewport: (viewport: Partial<TreeViewport>) => void;
  setFilters: (filters: Partial<TreeFilters>) => void;
  setSelectedPerson: (personId: string | null) => void;
  setFocusedPerson: (personId: string | null) => void;
  setLoading: (loading: boolean) => void;

  // Computed helpers
  getPersonById: (id: string) => TreePerson | undefined;
  getParents: (personId: string) => TreePerson[];
  getChildren: (personId: string) => TreePerson[];
  getSpouses: (personId: string) => TreePerson[];
  getSiblings: (personId: string) => TreePerson[];

  zoomIn: () => void;
  zoomOut: () => void;
  fitToScreen: () => void;
  centerOnPerson: (personId: string) => void;
  reset: () => void;
}

const initialViewport: TreeViewport = {
  x: 0,
  y: 0,
  scale: 1,
  width: 0,
  height: 0,
};

const initialFilters: TreeFilters = {
  showLiving: true,
  showDeceased: true,
  searchQuery: '',
};

export const useTreeStore = create<TreeState>((set, get) => ({
  // Initial state
  persons: [],
  unions: [],
  relationships: [],
  viewMode: 'tree',
  viewport: initialViewport,
  filters: initialFilters,
  selectedPersonId: null,
  focusedPersonId: null,
  isLoading: true,

  // Data actions
  setPersons: (persons) => set({ persons }),
  setUnions: (unions) => set({ unions }),
  setRelationships: (relationships) => set({ relationships }),

  addPerson: (person) =>
    set((state) => ({
      persons: [...state.persons, person],
    })),

  updatePerson: (personId, updates) =>
    set((state) => ({
      persons: state.persons.map((p) =>
        p.id === personId ? { ...p, ...updates } : p
      ),
    })),

  removePerson: (personId) =>
    set((state) => ({
      persons: state.persons.filter((p) => p.id !== personId),
      relationships: state.relationships.filter(
        (r) => r.personId !== personId && r.relatedPersonId !== personId
      ),
    })),

  addUnion: (union) =>
    set((state) => ({
      unions: [...state.unions, union],
    })),

  updateUnion: (unionId, updates) =>
    set((state) => ({
      unions: state.unions.map((u) =>
        u.id === unionId ? { ...u, ...updates } : u
      ),
    })),

  removeUnion: (unionId) =>
    set((state) => ({
      unions: state.unions.filter((u) => u.id !== unionId),
    })),

  // View actions
  setViewMode: (viewMode) => set({ viewMode }),

  setViewport: (updates) =>
    set((state) => ({
      viewport: { ...state.viewport, ...updates },
    })),

  setFilters: (updates) =>
    set((state) => ({
      filters: { ...state.filters, ...updates },
    })),

  setSelectedPerson: (selectedPersonId) => set({ selectedPersonId }),

  setFocusedPerson: (focusedPersonId) => set({ focusedPersonId }),

  setLoading: (isLoading) => set({ isLoading }),

  // Computed helpers
  getPersonById: (id) => get().persons.find((p) => p.id === id),

  getParents: (personId) => {
    const { relationships, persons } = get();
    const parentRels = relationships.filter(
      (r) => r.personId === personId && r.relationshipType === 'parent'
    );
    return parentRels
      .map((r) => persons.find((p) => p.id === r.relatedPersonId))
      .filter(Boolean) as TreePerson[];
  },

  getChildren: (personId) => {
    const { relationships, persons } = get();
    const childRels = relationships.filter(
      (r) => r.relatedPersonId === personId && r.relationshipType === 'parent'
    );
    return childRels
      .map((r) => persons.find((p) => p.id === r.personId))
      .filter(Boolean) as TreePerson[];
  },

  getSpouses: (personId) => {
    const { unions, persons } = get();
    const personUnions = unions.filter(
      (u) => u.partner1Id === personId || u.partner2Id === personId
    );
    return personUnions
      .map((u) => {
        const spouseId = u.partner1Id === personId ? u.partner2Id : u.partner1Id;
        return persons.find((p) => p.id === spouseId);
      })
      .filter(Boolean) as TreePerson[];
  },

  getSiblings: (personId) => {
    const { relationships, persons } = get();
    const siblingRels = relationships.filter(
      (r) => r.personId === personId && r.relationshipType === 'sibling'
    );
    return siblingRels
      .map((r) => persons.find((p) => p.id === r.relatedPersonId))
      .filter(Boolean) as TreePerson[];
  },

  // Viewport actions
  zoomIn: () =>
    set((state) => ({
      viewport: {
        ...state.viewport,
        scale: Math.min(state.viewport.scale * 1.2, 3),
      },
    })),

  zoomOut: () =>
    set((state) => ({
      viewport: {
        ...state.viewport,
        scale: Math.max(state.viewport.scale / 1.2, 0.1),
      },
    })),

  fitToScreen: () =>
    set((state) => ({
      viewport: { ...state.viewport, x: 0, y: 0, scale: 1 },
    })),

  centerOnPerson: (personId) => {
    const person = get().getPersonById(personId);
    if (person && person.x !== undefined && person.y !== undefined) {
      const { viewport } = get();
      set({
        viewport: {
          ...viewport,
          x: person.x - viewport.width / 2,
          y: person.y - viewport.height / 2,
        },
        focusedPersonId: personId,
      });
    }
  },

  reset: () =>
    set({
      persons: [],
      unions: [],
      relationships: [],
      viewport: initialViewport,
      filters: initialFilters,
      selectedPersonId: null,
      focusedPersonId: null,
      isLoading: true,
    }),
}));
