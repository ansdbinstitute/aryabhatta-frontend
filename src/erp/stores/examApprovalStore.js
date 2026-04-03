import { create } from 'zustand';
import examApprovalApi from '../api/examApprovalApi';

const useExamApprovalStore = create((set, get) => ({
  approvals: [],
  pendingApprovals: [],
  studentRequests: [],
  currentApproval: null,
  isLoading: false,
  error: null,

  fetchApprovals: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await examApprovalApi.getStudentRequests(params);
      set({ approvals: response.data?.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPendingApprovals: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await examApprovalApi.getPending();
      console.log('[ExamApprovalStore] Pending approvals response:', response.data);
      const approvals = response.data?.data || response.data || [];
      set({ pendingApprovals: approvals, isLoading: false });
    } catch (error) {
      console.error('[ExamApprovalStore] Error fetching pending:', error.response?.data || error.message);
      set({ error: error.response?.data?.error?.message || error.message, isLoading: false });
    }
  },

  fetchStudentRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await examApprovalApi.getStudentRequests();
      console.log('[ExamApprovalStore] Student requests response:', response.data);
      const requests = response.data?.data || response.data || [];
      set({ studentRequests: requests, isLoading: false });
    } catch (error) {
      console.error('[ExamApprovalStore] Error fetching requests:', error.response?.data || error.message);
      set({ error: error.response?.data?.error?.message || error.message, isLoading: false });
    }
  },

  createApproval: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await examApprovalApi.create(data);
      console.log('[ExamApprovalStore] Create response:', response.data);
      const newApproval = response.data?.data || response.data;
      set((state) => ({ 
        studentRequests: [...state.studentRequests, newApproval],
        isLoading: false 
      }));
      return { success: true, data: newApproval };
    } catch (error) {
      console.error('[ExamApprovalStore] Error creating approval:', error.response?.data || error.message);
      set({ error: error.response?.data?.error?.message || error.message, isLoading: false });
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  },

  approveRequest: async (id, remarks = '') => {
    set({ isLoading: true, error: null });
    try {
      const response = await examApprovalApi.approve(id, remarks);
      const updated = response.data?.data;
      set((state) => ({
        pendingApprovals: state.pendingApprovals.filter(a => a.id !== id),
        approvals: state.approvals.map(a => a.id === id ? updated : a),
        isLoading: false,
      }));
      return { success: true, data: updated };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  rejectRequest: async (id, remarks = '') => {
    set({ isLoading: true, error: null });
    try {
      const response = await examApprovalApi.reject(id, remarks);
      const updated = response.data?.data;
      set((state) => ({
        pendingApprovals: state.pendingApprovals.filter(a => a.id !== id),
        approvals: state.approvals.map(a => a.id === id ? updated : a),
        isLoading: false,
      }));
      return { success: true, data: updated };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  updateApproval: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await examApprovalApi.update(id, data);
      const updated = response.data?.data;
      set((state) => ({
        approvals: state.approvals.map(a => a.id === id ? updated : a),
        isLoading: false,
      }));
      return { success: true, data: updated };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  deleteApproval: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await examApprovalApi.delete(id);
      set((state) => ({
        approvals: state.approvals.filter(a => a.id !== id),
        pendingApprovals: state.pendingApprovals.filter(a => a.id !== id),
        studentRequests: state.studentRequests.filter(a => a.id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  clearError: () => set({ error: null }),
}));

export default useExamApprovalStore;
