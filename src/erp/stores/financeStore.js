import { create } from 'zustand';
import api from '../api/client';
import useUiStore from './uiStore';

const useFinanceStore = create((set, get) => ({
  feeStructures: [],
  payments: [],
  isLoading: false,
  error: null,

  // --- FEE STRUCTURES ---
  fetchFeeStructures: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get('/fee-structures', {
        params: {
          populate: ['course', 'batch'],
          filters: filters,
          sort: ['dueDate:asc', 'createdAt:desc'],
        },
      });
      set({ feeStructures: response.data.data });
    } catch (error) {
      useUiStore.getState().showToast('Failed to load fee structures', 'error');
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  createFeeStructure: async (data) => {
    set({ isLoading: true });
    try {
      await api.post('/fee-structures', { data });
      useUiStore.getState().showToast('Fee structure created', 'success');
      get().fetchFeeStructures();
      return true;
    } catch (error) {
      useUiStore.getState().showToast(error.response?.data?.error?.message || 'Failed to create fee structure', 'error');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updateFeeStructure: async (id, data) => {
    set({ isLoading: true });
    try {
      await api.put(`/fee-structures/${id}`, { data });
      useUiStore.getState().showToast('Fee structure updated', 'success');
      get().fetchFeeStructures();
      return true;
    } catch (error) {
      useUiStore.getState().showToast(error.response?.data?.error?.message || 'Failed to update', 'error');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  // --- PAYMENTS ---
  fetchPayments: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const response = await api.get('/payments', {
        params: {
          populate: {
            student: { populate: ['course', 'batch'] },
            feeStructure: true,
            recordedBy: true,
            paymentSlip: true,
          },
          filters: filters,
          sort: ['paymentDate:desc'],
        },
      });
      set({ payments: response.data.data });
    } catch (error) {
      useUiStore.getState().showToast('Failed to load payments', 'error');
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  recordPayment: async (data) => {
    set({ isLoading: true });
    try {
      const response = await api.post('/payments', { data });
      useUiStore.getState().showToast('Payment recorded successfully', 'success');
      return response.data;
    } catch (error) {
      useUiStore.getState().showToast(error.response?.data?.error?.message || 'Failed to record payment', 'error');
      return null;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useFinanceStore;
