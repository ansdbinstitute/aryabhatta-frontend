import { create } from 'zustand';
import api, { extractData, extractPagination } from '../api/client';

const useStaffStore = create((set, get) => ({
  staffs: [],
  currentStaff: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchStaffs: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/staffs', { params: { populate: '*', ...params } });
      set({ 
        staffs: extractData(response) || [], 
        pagination: extractPagination(response),
        isLoading: false 
      });
    } catch (err) {
      set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
    }
  },

  fetchStaffById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get(`/staffs/${id}`, { params: { populate: '*' } });
      set({ currentStaff: extractData(response), isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
    }
  },

  createStaff: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post('/staffs', { data: payload });
      const flattened = extractData(response);
      await get().fetchStaffs();
      return { success: true, data: flattened };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  updateStaff: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put(`/staffs/${id}`, { data: payload });
      const flattened = extractData(response);
      if (get().currentStaff?.id === id || get().currentStaff?.integerId === id) {
        set({ currentStaff: flattened });
      }
      await get().fetchStaffs();
      return { success: true, data: flattened };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  deleteStaff: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/staffs/${id}`);
      set(state => ({
        staffs: state.staffs.filter(s => s.id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  uploadProfileImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { success: true, fileId: response.data[0].id, fileData: response.data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}));

export default useStaffStore;
