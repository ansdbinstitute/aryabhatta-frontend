import { create } from 'zustand';
import { coursesApi } from '../api/courses';
import { batchesApi } from '../api/batches';
import { extractData } from '../api/client';

const useCourseStore = create((set) => ({
  // State
  courses: [],
  batches: [],
  isLoadingCourses: false,
  isLoadingBatches: false,
  error: null,

  // Actions
  fetchCourses: async (params = {}) => {
    set({ isLoadingCourses: true, error: null });
    try {
      const response = await coursesApi.list(params);
      set({ courses: extractData(response) || [], isLoadingCourses: false });
    } catch (error) {
      set({ error: error.message, isLoadingCourses: false });
    }
  },

  fetchBatches: async (params = {}) => {
    set({ isLoadingBatches: true, error: null });
    try {
      const response = await batchesApi.list({
        populate: { course: true },
        ...params
      });
      set({ batches: extractData(response) || [], isLoadingBatches: false });
    } catch (error) {
      set({ error: error.message, isLoadingBatches: false });
    }
  },
}));

export default useCourseStore;
