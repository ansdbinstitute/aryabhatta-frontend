import { create } from 'zustand';
import { authApi } from '../../erp/api/auth';
import { studentsApi } from '../../erp/api/students';
import { STORAGE_KEYS, ROLES } from '../../erp/utils/constants';
import { extractData } from '../../erp/api/client';

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

      // Fetch student profile for image and other details
      const studentRes = await studentsApi.me();
      const profile = extractData(studentRes);

      set({
        token,
        user: { ...user, ...profile },
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

      localStorage.setItem(STORAGE_KEYS.STUDENT_TOKEN, jwt);

      const meResponse = await authApi.getMe();
      const user = meResponse.data;

      if (user.roleType !== ROLES.STUDENT) {
        localStorage.removeItem(STORAGE_KEYS.STUDENT_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.STUDENT_USER);
        throw new Error('Access Denied: This is the Student Portal. Please use your Student UID to login.');
      }

      // Fetch student profile for fully enriched user data (including image)
      const studentRes = await studentsApi.me();
      const profile = extractData(studentRes);
      const enrichedUser = { ...user, ...profile };

      localStorage.setItem(STORAGE_KEYS.STUDENT_USER, JSON.stringify(enrichedUser));
      
      set({
        token: jwt,
        user: enrichedUser,
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
