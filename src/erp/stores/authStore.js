import { create } from 'zustand';
import { authApi } from '../api/auth';
import { STORAGE_KEYS, ROLES } from '../utils/constants';
import useRolePermissionStore from './rolePermissionStore';

const useAuthStore = create((set, get) => ({
  // ─── State ───
  token: localStorage.getItem(STORAGE_KEYS.TOKEN) || null,
  user: null,
  isAuthenticated: false,
  isLoading: true, // true on mount until initialize() runs
  isInitialized: false, // Track if first initialization is complete
  error: null,

  // ─── Actions ───

  /**
   * Initialize auth state on app mount
   * Checks localStorage for existing token and validates it
   * Uses retry logic to handle temporary network issues
   */
  initialize: async () => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      set({ isLoading: false, isInitialized: true, isAuthenticated: false, user: null });
      return;
    }

    // Only set loading if we don't have a user already (to avoid flickering)
    if (!get().user) {
      set({ isLoading: true });
    }

    // Retry logic for temporary network issues
    const maxRetries = 3;
    const retryDelay = 1000; // 1 second

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Validate token first
        const response = await authApi.getMe();
        const user = response.data;
        
        // User is valid, now fetch permissions
        await useRolePermissionStore.getState().fetchAllPermissions();
        
        set({
          token,
          user,
          isAuthenticated: true,
          isLoading: false,
          isInitialized: true,
          error: null,
        });
        return; // Success - exit early
      } catch (error) {
        // If this is the last attempt, handle the failure
        if (attempt === maxRetries) {
          console.warn('[Auth] Token validation failed after retries, clearing session');
          
          // Check if it's an authentication error (401) - token is definitely invalid
          if (error.response?.status === 401) {
            localStorage.removeItem(STORAGE_KEYS.TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            useRolePermissionStore.getState().clearPermissions();
            set({
              token: null,
              user: null,
              isAuthenticated: false,
              isLoading: false,
              isInitialized: true,
            });
          } else {
            // Network error or server issue - keep the token and user for now
            // User won't be authenticated but won't lose their session
            const existingUser = localStorage.getItem(STORAGE_KEYS.USER);
            set({
              isLoading: false,
              isInitialized: true,
              isAuthenticated: false,
              user: null, // Clear user but keep token for retry
              error: 'Unable to validate session. Please refresh the page.',
            });
          }
        } else {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, retryDelay * attempt));
        }
      }
    }
  },

  /**
   * Login with email/username and password
   */
  login: async (identifier, password, portal = null) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(identifier, password);
      const { jwt } = response.data;

      // Temporary set token in localStorage for getMe to work
      localStorage.setItem(STORAGE_KEYS.TOKEN, jwt);

      // Fetch full user with role populated
      const meResponse = await authApi.getMe();
      const user = meResponse.data;

      // For ERP login (admin, institute, etc.)
      if (user.roleType === ROLES.STUDENT) {
        localStorage.removeItem(STORAGE_KEYS.TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        throw new Error('Access Denied: Students cannot login to the Administration Portal. Please use the Student Portal.');
      }

      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
      
      await useRolePermissionStore.getState().fetchAllPermissions();

      set({
        token: jwt,
        user,
        isAuthenticated: true,
        isLoading: false,
        isInitialized: true,
        error: null,
      });

      return { success: true, user };
    } catch (error) {
      const message =
        error.response?.data?.error?.message || error.message || 'Invalid credentials';
      set({ isLoading: false, error: message });
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      return { success: false, error: message };
    }
  },

  /**
   * Logout — clear everything
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    useRolePermissionStore.getState().clearPermissions();
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      isInitialized: true,
      error: null,
    });
  },

  /**
   * Update own profile
   */
  updateProfile: async (data) => {
    try {
      const response = await authApi.updateMe(data);
      const refreshedMe = await authApi.getMe();
      set({ user: refreshedMe.data });
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(refreshedMe.data));
      return { success: true, data: response.data?.data || response.data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  uploadProfileImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      const response = await fetch(`${import.meta.env.VITE_STRAPI_URL || ''}/api/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${get().token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      return { success: true, fileId: data[0]?.id, fileData: data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  changeMyPassword: async (password, confirmPassword) => {
    try {
      await authApi.changePassword(null, password, confirmPassword);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  },

  /**
   * Clear error state
   */
  clearError: () => set({ error: null }),

  getRole: () => get().user?.roleType || null,

  getBranch: () => get().user?.branch?.id || null,

  isInstituteAdmin: () => get().user?.roleType === ROLES.INSTITUTE_ADMIN,

  isBranchAdmin: () => get().user?.roleType === ROLES.BRANCH_ADMIN,

  isAdmin: () => {
    const roleType = get().user?.roleType;
    return roleType === ROLES.INSTITUTE_ADMIN || roleType === ROLES.BRANCH_ADMIN;
  },

  isTeacher: () => get().user?.roleType === ROLES.TEACHER,

  isAccountant: () => get().user?.roleType === ROLES.ACCOUNTANT,

  isStudent: () => get().user?.roleType === ROLES.STUDENT,
}));

export default useAuthStore;
