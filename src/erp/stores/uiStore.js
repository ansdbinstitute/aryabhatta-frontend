import { create } from 'zustand';
import { generateId } from '../utils/helpers';
import { STORAGE_KEYS } from '../utils/constants';

const useUIStore = create((set, get) => ({
  // ─── Sidebar ───
  sidebarCollapsed: localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED) === 'true',
  sidebarMobileOpen: false,

  toggleSidebar: () => {
    const next = !get().sidebarCollapsed;
    localStorage.setItem(STORAGE_KEYS.SIDEBAR_COLLAPSED, String(next));
    set({ sidebarCollapsed: next });
  },

  toggleMobileSidebar: () =>
    set({ sidebarMobileOpen: !get().sidebarMobileOpen }),

  closeMobileSidebar: () =>
    set({ sidebarMobileOpen: false }),

  // ─── Toasts ───
  toasts: [],

  addToast: (type, message, duration = 4000) => {
    const id = generateId();
    set((state) => ({
      toasts: [...state.toasts, { id, type, message }],
    }));
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }
    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  // Convenience toast methods
  success: (message) => get().addToast('success', message),
  error: (message) => get().addToast('error', message),
  warning: (message) => get().addToast('warning', message),
  info: (message) => get().addToast('info', message),
  showToast: (message, type = 'info') => get().addToast(type, message),

  // ─── Confirm Dialog ───
  confirmDialog: null,

  showConfirm: (title, message, onConfirm) =>
    set({
      confirmDialog: { title, message, onConfirm },
    }),

  hideConfirm: () =>
    set({ confirmDialog: null }),

  // ─── Global Loading ───
  globalLoading: false,

  setGlobalLoading: (loading) =>
    set({ globalLoading: loading }),
}));

export default useUIStore;
