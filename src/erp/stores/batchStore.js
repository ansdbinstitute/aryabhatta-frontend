import { create } from 'zustand';
import { batchesApi } from '../api/batches';

const useBatchStore = create((set, get) => ({
  batches: [],
  currentBatch: null,
  isLoading: false,
  error: null,

  fetchBatches: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await batchesApi.list({
        populate: { course: true, students: true },
        ...params,
      });
      const data = response.data?.data || [];
      set({ batches: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchBatchById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await batchesApi.getById(id, {
        populate: { course: true, students: true },
      });
      set({ currentBatch: response.data?.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createBatch: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await batchesApi.create(data);
      const newBatch = response.data?.data;
      set((state) => ({ batches: [...state.batches, newBatch], isLoading: false }));
      return { success: true, data: newBatch };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  updateBatch: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await batchesApi.update(id, data);
      const updatedBatch = response.data?.data;
      set((state) => ({
        batches: state.batches.map((b) => (b.id === id ? updatedBatch : b)),
        currentBatch: state.currentBatch?.id === id ? updatedBatch : state.currentBatch,
        isLoading: false,
      }));
      return { success: true, data: updatedBatch };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  deleteBatch: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await batchesApi.delete(id);
      set((state) => ({
        batches: state.batches.filter((b) => b.id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  clearCurrentBatch: () => set({ currentBatch: null }),
  clearError: () => set({ error: null }),
}));

export default useBatchStore;
