import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User as SupabaseUser, Session as SupabaseSession } from '@supabase/supabase-js';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  login: (user: User, session: Session) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;

  // Supabase sync
  syncWithSupabase: (supabaseUser: SupabaseUser | null, supabaseSession: SupabaseSession | null) => void;
}

// Helper to convert Supabase user to our User type
function mapSupabaseUser(supabaseUser: SupabaseUser): User {
  const metadata = supabaseUser.user_metadata || {};

  // Try to get first_name/last_name directly (custom signup)
  // Then try given_name/family_name (Google OAuth)
  // Finally fallback to parsing full_name/name
  let firstName = metadata.first_name || metadata.given_name || '';
  let lastName = metadata.last_name || metadata.family_name || '';

  if (!firstName && !lastName) {
    const fullName = metadata.full_name || metadata.name || '';
    const nameParts = fullName.split(' ');
    firstName = nameParts[0] || '';
    lastName = nameParts.slice(1).join(' ') || '';
  }

  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    firstName,
    lastName,
    avatarUrl: metadata.avatar_url || metadata.picture,
  };
}

// Helper to convert Supabase session to our Session type
function mapSupabaseSession(supabaseSession: SupabaseSession): Session {
  return {
    accessToken: supabaseSession.access_token,
    refreshToken: supabaseSession.refresh_token || '',
    expiresAt: supabaseSession.expires_at || 0,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setSession: (session) => set({ session }),

      setLoading: (isLoading) => set({ isLoading }),

      login: (user, session) =>
        set({
          user,
          session,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          session: null,
          isAuthenticated: false,
        }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),

      syncWithSupabase: (supabaseUser, supabaseSession) => {
        if (supabaseUser && supabaseSession) {
          set({
            user: mapSupabaseUser(supabaseUser),
            session: mapSupabaseSession(supabaseSession),
            isAuthenticated: true,
            isLoading: false,
          });
        } else {
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'kintree-auth',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
