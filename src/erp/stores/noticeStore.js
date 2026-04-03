import { create } from 'zustand';
import client from '../api/client';

const useNoticeStore = create((set, get) => ({
  notices: [],
  isLoading: false,
  error: null,

  fetchNotices: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await client.get('/notices', {
        params: {
          'sort': 'createdAt:desc',
          populate: {
            targetBatches: true,
            attachments: true,
          },
          ...filters,
        }
      });
      set({ notices: response.data?.data || [], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
    }
  },

  createNotice: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await client.post('/notices', { data: payload });
      await get().fetchNotices();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  deleteNotice: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await client.delete(`/notices/${id}`);
      set(state => ({
        notices: state.notices.filter(n => n.documentId !== id),
        isLoading: false
      }));
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  uploadAttachment: async (file) => {
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
  }
}));

export default useNoticeStore;
