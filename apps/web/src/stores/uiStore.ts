import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

export interface Modal {
  id: string;
  type: string;
  props?: Record<string, unknown>;
}

interface UIState {
  // Theme
  theme: Theme;
  resolvedTheme: 'light' | 'dark';

  // Navigation
  sidebarCollapsed: boolean;
  sidebarOpen: boolean; // Mobile drawer state
  activeNavItem: string;

  // Modals
  modals: Modal[];

  // Toasts
  toasts: Toast[];

  // Loading states
  globalLoading: boolean;
  loadingMessage?: string;

  // Preferences
  compactMode: boolean;
  animationsEnabled: boolean;

  // Actions
  setTheme: (theme: Theme) => void;
  setResolvedTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setSidebarOpen: (open: boolean) => void;
  setActiveNavItem: (item: string) => void;

  openModal: (modal: Omit<Modal, 'id'>) => string;
  closeModal: (id: string) => void;
  closeAllModals: () => void;

  showToast: (toast: Omit<Toast, 'id'>) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;

  setGlobalLoading: (loading: boolean, message?: string) => void;
  setCompactMode: (compact: boolean) => void;
  setAnimationsEnabled: (enabled: boolean) => void;
}

let toastIdCounter = 0;
let modalIdCounter = 0;

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // Initial state
      theme: 'system',
      resolvedTheme: 'light',
      sidebarCollapsed: false,
      sidebarOpen: false,
      activeNavItem: '/',
      modals: [],
      toasts: [],
      globalLoading: false,
      loadingMessage: undefined,
      compactMode: false,
      animationsEnabled: true,

      // Theme actions
      setTheme: (theme) => set({ theme }),

      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),

      // Navigation actions
      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
        })),

      setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),

      setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),

      setActiveNavItem: (activeNavItem) => set({ activeNavItem }),

      // Modal actions
      openModal: (modal) => {
        const id = `modal-${++modalIdCounter}`;
        set((state) => ({
          modals: [...state.modals, { ...modal, id }],
        }));
        return id;
      },

      closeModal: (id) =>
        set((state) => ({
          modals: state.modals.filter((m) => m.id !== id),
        })),

      closeAllModals: () => set({ modals: [] }),

      // Toast actions
      showToast: (toast) => {
        const id = `toast-${++toastIdCounter}`;
        const duration = toast.duration ?? 5000;

        set((state) => ({
          toasts: [...state.toasts, { ...toast, id, duration }],
        }));

        // Auto dismiss
        if (duration > 0) {
          setTimeout(() => {
            get().dismissToast(id);
          }, duration);
        }

        return id;
      },

      dismissToast: (id) =>
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        })),

      clearToasts: () => set({ toasts: [] }),

      // Loading actions
      setGlobalLoading: (globalLoading, loadingMessage) =>
        set({ globalLoading, loadingMessage }),

      // Preference actions
      setCompactMode: (compactMode) => set({ compactMode }),

      setAnimationsEnabled: (animationsEnabled) => set({ animationsEnabled }),
    }),
    {
      name: 'kintree-ui',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        compactMode: state.compactMode,
        animationsEnabled: state.animationsEnabled,
      }),
    }
  )
);

// Convenience hooks for common operations
export const useToast = () => {
  const showToast = useUIStore((state) => state.showToast);

  return {
    success: (title: string, description?: string) =>
      showToast({ type: 'success', title, description }),
    error: (title: string, description?: string) =>
      showToast({ type: 'error', title, description }),
    warning: (title: string, description?: string) =>
      showToast({ type: 'warning', title, description }),
    info: (title: string, description?: string) =>
      showToast({ type: 'info', title, description }),
  };
};

export const useModal = () => {
  const { openModal, closeModal, closeAllModals, modals } = useUIStore();

  return {
    open: openModal,
    close: closeModal,
    closeAll: closeAllModals,
    isOpen: (type: string) => modals.some((m) => m.type === type),
    getModal: (type: string) => modals.find((m) => m.type === type),
  };
};
