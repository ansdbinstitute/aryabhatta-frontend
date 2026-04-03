import { create } from 'zustand';
import { authApi } from '../../erp/api/auth';
import { STORAGE_KEYS, ROLES } from '../../erp/utils/constants';

const useStudentAuthStore = create((set, get) => ({
  // ─── State ───
  token: localStorage.getItem(STORAGE_KEYS.STUDENT_TOKEN) || null,
  user: null,
  isAuthenticated: false,
  isLoading: true, // true on mount until initialize() runs
  error: null,

  // ─── Actions ───

  initialize: async () => {
    const token = localStorage.getItem(STORAGE_KEYS.STUDENT_TOKEN);
    if (!token) {
      set({ isLoading: false, isAuthenticated: false });
      return;
    }

    try {
      const response = await authApi.getMe();
      const user = response.data;
      
      if (user.roleType !== ROLES.STUDENT) {
         throw new Error("Invalid student token");
      }

      set({
        token,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch {
      localStorage.removeItem(STORAGE_KEYS.STUDENT_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.STUDENT_USER);
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  login: async (identifier, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(identifier, password);
      const { jwt } = response.data;

      // Temporary set token in ISOLATED student storage for getMe to work correctly over API
      localStorage.setItem(STORAGE_KEYS.STUDENT_TOKEN, jwt);

      // Note: Because we rely strictly on the window path, getMe will pick up STUDENT_TOKEN.
      // But just to be sure, in client.js it defaults to checking url path starting with '/student'.
      // If we are on /student/login, it works.

      const meResponse = await authApi.getMe();
      const user = meResponse.data;

      if (user.roleType !== ROLES.STUDENT) {
        localStorage.removeItem(STORAGE_KEYS.STUDENT_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.STUDENT_USER);
        throw new Error('Access Denied: This is the Student Portal. Please use your Student UID to login.');
      }

      localStorage.setItem(STORAGE_KEYS.STUDENT_USER, JSON.stringify(user));
      
      set({
        token: jwt,
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      return { success: true, user };
    } catch (error) {
      const message = error.response?.data?.error?.message || error.message || 'Invalid credentials';
      set({ isLoading: false, error: message });
      localStorage.removeItem(STORAGE_KEYS.STUDENT_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.STUDENT_USER);
      return { success: false, error: message };
    }
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.STUDENT_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.STUDENT_USER);
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  },

  clearError: () => set({ error: null })
}));

export default useStudentAuthStore;
