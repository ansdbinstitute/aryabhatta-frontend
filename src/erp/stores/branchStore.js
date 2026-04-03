import { create } from 'zustand';
import api from '../api/client';

const useBranchStore = create((set, get) => ({
    branches: [],
    currentBranch: null,
    isLoading: false,
    error: null,

    fetchBranches: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/branches', { params: { populate: '*' } });
            set({ branches: response.data?.data || [], isLoading: false });
        } catch (err) {
            set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
        }
    },

    fetchBranchById: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/branches/${id}`, { params: { populate: '*' } });
            set({ currentBranch: response.data?.data, isLoading: false });
        } catch (err) {
            set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
        }
    },

    createBranch: async (payload) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/branches', { data: payload });
            await get().fetchBranches();
            return { success: true, data: response.data?.data };
        } catch (err) {
            const errorMsg = err.response?.data?.error?.message || err.message;
            set({ error: errorMsg, isLoading: false });
            return { success: false, error: errorMsg };
        }
    },

    updateBranch: async (id, payload) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.put(`/branches/${id}`, { data: payload });
            await get().fetchBranches();
            return { success: true, data: response.data?.data };
        } catch (err) {
            const errorMsg = err.response?.data?.error?.message || err.message;
            set({ error: errorMsg, isLoading: false });
            return { success: false, error: errorMsg };
        }
    },

    deleteBranch: async (id) => {
        set({ isLoading: true, error: null });
        try {
            await api.delete(`/branches/${id}`);
            set(state => ({
                branches: state.branches.filter(b => b.id !== id),
                isLoading: false
            }));
            return { success: true };
        } catch (err) {
            const errorMsg = err.response?.data?.error?.message || err.message;
            set({ error: errorMsg, isLoading: false });
            return { success: false, error: errorMsg };
        }
    }
}));

export default useBranchStore;
