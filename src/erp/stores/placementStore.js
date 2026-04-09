import { create } from 'zustand';
import client from '../api/client';

const usePlacementStore = create((set, get) => ({
  partners: [],
  testimonials: [],
  isLoading: false,
  error: null,

  fetchPartners: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await client.get('/placement-partners', {
        params: {
          'sort': 'createdAt:desc',
          populate: ['logo'],
          ...filters,
        }
      });
      set({ partners: response.data?.data || [], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
    }
  },

  createPartner: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await client.post('/placement-partners', { data: payload });
      await get().fetchPartners();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  updatePartner: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      await client.put(`/placement-partners/${id}`, { data: payload });
      await get().fetchPartners();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  deletePartner: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await client.delete(`/placement-partners/${id}`);
      set(state => ({
        partners: state.partners.filter(p => p.documentId !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  fetchTestimonials: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await client.get('/student-testimonials', {
        params: {
          'sort': 'createdAt:desc',
          populate: '*',
          ...filters,
        }
      });
      set({ testimonials: response.data?.data || [], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
    }
  },

  createTestimonial: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await client.post('/student-testimonials', { data: payload });
      await get().fetchTestimonials();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  updateTestimonial: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      await client.put(`/student-testimonials/${id}`, { data: payload });
      await get().fetchTestimonials();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  deleteTestimonial: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await client.delete(`/student-testimonials/${id}`);
      set(state => ({
        testimonials: state.testimonials.filter(t => t.documentId !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  uploadLogo: async (file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      const response = await client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return { success: true, fileId: response.data[0].id, fileData: response.data[0] };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },
}));

export default usePlacementStore;
