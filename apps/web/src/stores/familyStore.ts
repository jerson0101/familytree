import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FamilyRole } from '@kintree/shared';

export interface FamilyMember {
  id: string;
  userId: string;
  personId?: string;
  role: FamilyRole;
  email: string;
  displayName: string;
  avatarUrl?: string;
  joinedAt: string;
  isActive: boolean;
}

export interface Family {
  id: string;
  name: string;
  description?: string;
  primaryColor: string;
  createdAt: string;
  memberCount: number;
}

interface FamilyState {
  currentFamily: Family | null;
  families: Family[];
  members: FamilyMember[];
  currentUserRole: FamilyRole | null;
  isLoading: boolean;

  // Actions
  setCurrentFamily: (family: Family | null) => void;
  setFamilies: (families: Family[]) => void;
  setMembers: (members: FamilyMember[]) => void;
  setCurrentUserRole: (role: FamilyRole | null) => void;
  setLoading: (loading: boolean) => void;
  addMember: (member: FamilyMember) => void;
  removeMember: (memberId: string) => void;
  updateMember: (memberId: string, updates: Partial<FamilyMember>) => void;
  updateFamily: (updates: Partial<Family>) => void;
  switchFamily: (familyId: string) => void;
  reset: () => void;
}

const initialState = {
  currentFamily: null,
  families: [],
  members: [],
  currentUserRole: null,
  isLoading: true,
};

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setCurrentFamily: (family) => set({ currentFamily: family }),

      setFamilies: (families) => set({ families }),

      setMembers: (members) => set({ members }),

      setCurrentUserRole: (role) => set({ currentUserRole: role }),

      setLoading: (isLoading) => set({ isLoading }),

      addMember: (member) =>
        set((state) => ({
          members: [...state.members, member],
        })),

      removeMember: (memberId) =>
        set((state) => ({
          members: state.members.filter((m) => m.id !== memberId),
        })),

      updateMember: (memberId, updates) =>
        set((state) => ({
          members: state.members.map((m) =>
            m.id === memberId ? { ...m, ...updates } : m
          ),
        })),

      updateFamily: (updates) =>
        set((state) => ({
          currentFamily: state.currentFamily
            ? { ...state.currentFamily, ...updates }
            : null,
        })),

      switchFamily: (familyId) => {
        const { families } = get();
        const family = families.find((f) => f.id === familyId);
        if (family) {
          set({ currentFamily: family, members: [], isLoading: true });
        }
      },

      reset: () => set(initialState),
    }),
    {
      name: 'kintree-family',
      partialize: (state) => ({
        currentFamily: state.currentFamily,
        currentUserRole: state.currentUserRole,
      }),
    }
  )
);
