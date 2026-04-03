import { create } from 'zustand';
import client, { extractData } from '../api/client';

const useMaterialStore = create((set, get) => ({
  materials: [],
  isLoading: false,
  error: null,

  fetchMaterials: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = {
        populate: { course: true, batch: true, file: true },
        'sort': 'createdAt:desc',
      };

      if (filters.course) {
        params['filters[course][id][$eq]'] = filters.course;
      }

      if (filters.isStudentView) {
        if (filters.batch) {
          // Students should see materials for their specific batch OR materials with no batch assigned
          params['filters[$or][0][batch][id][$eq]'] = filters.batch;
          params['filters[$or][1][batch][id][$null]'] = true;
        } else {
          // If no batch provided, just show materials with no batch assigned (Global for the course)
          // Actually, we usually want them to see everything for the course if they have no batch.
          // Let's keep it simple: if course matches and batch is null, show it.
          // If we want course match only, we don't add a batch filter.
        }
      } else if (filters.batch) {
        params['filters[batch][id][$eq]'] = filters.batch;
      }

      if (filters.type && filters.type !== 'all') {
        params['filters[type][$eq]'] = filters.type;
      }

      console.log('[MaterialStore] Fetching with params:', JSON.stringify(params, null, 2));

      const response = await client.get('/materials', { params });
      const data = extractData(response) || [];
      
      console.log('[MaterialStore] Raw Response Count:', response.data?.data?.length || 0);
      console.log('[MaterialStore] Extracted Count:', data.length);
      
      set({ materials: data, isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
    }
  },

  uploadMaterial: async (file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      const uploadRes = await client.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return { success: true, fileId: uploadRes.data[0].id, fileData: uploadRes.data[0] };
    } catch (err) {
      return { success: false, error: err.response?.data?.error?.message || err.message };
    }
  },

  createMaterial: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await client.post('/materials', { data: payload });
      await get().fetchMaterials();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },
  
  deleteMaterial: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await client.delete(`/materials/${id}`);
      set(state => ({
        materials: state.materials.filter(m => m.id !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  fetchMaterialsByCourse: async (courseId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await client.get('/materials', {
        params: {
          'filters[course][documentId][$eq]': courseId,
          populate: { course: true, batch: true, file: true },
          sort: 'createdAt:desc',
        },
      });
      set({ materials: response.data?.data || [], isLoading: false });
      return response.data?.data || [];
    } catch (err) {
      set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
      return [];
    }
  }
}));

export default useMaterialStore;
