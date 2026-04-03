import { create } from 'zustand';
import client from '../api/client';

const useUserStore = create((set, get) => ({
  users: [],
  branches: [],
  roleTypes: [],
  isLoading: false,
  error: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await client.get('/user-management/users');
      set({ users: response.data?.data || [], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
    }
  },

  fetchBranches: async () => {
    try {
      const response = await client.get('/user-management/branches');
      set({ branches: response.data?.data || [] });
    } catch (err) {
      console.error('Failed to fetch branches', err);
    }
  },

  fetchRoleTypes: async () => {
    try {
      const response = await client.get('/user-management/role-types');
      set({ roleTypes: response.data?.data || [] });
    } catch (err) {
      console.error('Failed to fetch role types', err);
    }
  },

  createUser: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await client.post('/user-management/users', payload);
      set((state) => ({ 
        users: [...state.users, response.data?.data || response.data], 
        isLoading: false 
      }));
      return { success: true, data: response.data };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  updateUser: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await client.put(`/user-management/users/${id}`, payload);
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, ...response.data?.data || response.data } : u)),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  deleteUser: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await client.delete(`/user-management/users/${id}`);
      set((state) => ({
        users: state.users.filter((u) => u.id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  changeUserRole: async (id, newRoleType) => {
    set({ isLoading: true, error: null });
    try {
      const response = await client.put(`/user-management/users/${id}/role`, { roleType: newRoleType });
      set((state) => ({
        users: state.users.map((u) => (u.id === id ? { ...u, ...response.data?.data || response.data } : u)),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  changeUserPassword: async (id, password, confirmPassword) => {
    set({ isLoading: true, error: null });
    try {
      await client.put(`/user-management/users/${id}/password`, {
        password,
        confirmPassword,
      });
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useUserStore;
