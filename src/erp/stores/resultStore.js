import { create } from 'zustand';
import { resultsApi } from '../api/results';
import client, { extractData, extractPagination } from '../api/client';

const useResultStore = create((set, get) => ({
  results: [],
  currentResult: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchResults: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resultsApi.list({
        populate: { student: true, exam: true, marksheet: true },
        ...params,
      });
      set({
        results: extractData(response) || [],
        pagination: extractPagination(response),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchResultsByStudent: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resultsApi.getByStudent(studentId, {
        populate: { exam: true, marksheet: true },
      });
      set({
        results: extractData(response) || [],
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchResultById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resultsApi.getById(id, {
        populate: { student: true, exam: true },
      });
      set({
        currentResult: extractData(response),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createResult: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resultsApi.create(data);
      const createdData = extractData(response);
      set((state) => ({
        results: [createdData, ...state.results],
        isLoading: false,
      }));
      return { success: true, data: createdData };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  updateResult: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await resultsApi.update(id, data);
      const updatedData = extractData(response);
      set((state) => ({
        results: state.results.map((r) => r.id === id ? updatedData : r),
        isLoading: false,
      }));
      return { success: true, data: updatedData };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  deleteResult: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await resultsApi.delete(id);
      set((state) => ({
        results: state.results.filter((r) => r.id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  createResultWithMarksheet: async (resultData, file) => {
    set({ isLoading: true, error: null });
    try {
      let fileId = null;
      
      // 1. If file provided, upload it first
      if (file) {
        const formData = new FormData();
        formData.append('files', file);
        const uploadRes = await client.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        fileId = uploadRes.data[0].id;
      }

      // 2. Create result with marksheet ID if uploaded
      const payload = { ...resultData };
      if (fileId) payload.marksheet = fileId;

      const response = await resultsApi.create(payload);
      const createdData = extractData(response);

      set((state) => ({
        results: [createdData, ...state.results],
        isLoading: false,
      }));
      return { success: true, data: createdData };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  uploadMarksheet: async (id, file) => {
    set({ isLoading: true, error: null });
    try {
      // 1. Upload to Strapi media library
      const formData = new FormData();
      formData.append('files', file);
      const uploadRes = await client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileId = uploadRes.data[0].id;

      // 2. Link file to result
      const updateRes = await resultsApi.update(id, { marksheet: fileId });
      const updatedData = extractData(updateRes);

      set((state) => ({
        results: state.results.map((r) => r.id === id ? updatedData : r),
        isLoading: false,
      }));
      return { success: true, fileId };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  clearCurrentResult: () => set({ currentResult: null }),
}));

export default useResultStore;
