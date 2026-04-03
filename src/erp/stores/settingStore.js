import { create } from 'zustand';
import api from '../api/client';

const useSettingStore = create((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  fetchSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/institute-setting');
      // In Strapi v5 Single Types, response.data.data contains the object (or null)
      set({ settings: response.data?.data || null, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error?.message || err.message || 'Failed to fetch settings', isLoading: false });
    }
  },

  updateSettings: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put('/institute-setting', { data: payload });
      set({ settings: response.data?.data, isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message || 'Failed to update settings';
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  }
}));

export default useSettingStore;
