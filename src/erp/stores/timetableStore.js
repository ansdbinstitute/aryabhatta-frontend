import { create } from 'zustand';
import api from '../utils/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const useTimetableStore = create((set, get) => ({
  entries: [],
  isLoading: false,
  error: null,

  fetchTimetable: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      let query = '?populate[course]=*&populate[batch]=*&populate[teacher]=*&sort=startTime:asc';
      if (filters.batch) query += `&filters[batch][id][$eq]=${filters.batch}`;
      if (filters.day) query += `&filters[dayOfWeek][$eq]=${filters.day}`;
      
      const response = await api.get(`/timetable-entries${query}`);
      set({ entries: response.data?.data || [], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
    }
  },

  createEntry: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await api.post('/timetable-entries', { data: payload });
      await get().fetchTimetable({ batch: payload.batch });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  deleteEntry: async (id, batchId) => {
    set({ isLoading: true, error: null });
    try {
      await api.delete(`/timetable-entries/${id}`);
      await get().fetchTimetable({ batch: batchId });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  }
}));

export default useTimetableStore;
export { DAYS };
