import { create } from 'zustand';
import { feesApi, paymentsApi } from '../api/fees';

const usePaymentStore = create((set, get) => ({
  feeStructures: [],
  payments: [],
  currentPayment: null,
  studentSummary: null,
  isLoading: false,
  error: null,

  fetchFeeStructures: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await feesApi.listStructures({
        populate: { course: true },
        ...params,
      });
      set({ feeStructures: response.data?.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createFeeStructure: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await feesApi.createStructure(data);
      const newStructure = response.data?.data;
      set((state) => ({ feeStructures: [...state.feeStructures, newStructure], isLoading: false }));
      return { success: true, data: newStructure };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  updateFeeStructure: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await feesApi.updateStructure(id, data);
      const updated = response.data?.data;
      set((state) => ({
        feeStructures: state.feeStructures.map((f) => (f.id === id ? updated : f)),
        isLoading: false,
      }));
      return { success: true, data: updated };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  deleteFeeStructure: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await feesApi.deleteStructure(id);
      set((state) => ({
        feeStructures: state.feeStructures.filter((f) => f.id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  fetchPayments: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsApi.list({
        populate: {
          student: { populate: ['course', 'batch'] },
          paymentSlip: true,
        },
        ...params,
      });
      set({ payments: response.data?.data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchPaymentsByStudent: async (studentId, integerStudentId = null) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsApi.listByStudent(studentId, integerStudentId, {
        populate: {
          student: { populate: ['course', 'batch'] },
          paymentSlip: true,
        },
        sort: 'createdAt:desc',
      });
      set({ payments: response.data?.data || [], isLoading: false });
      return response.data?.data || [];
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return [];
    }
  },

  fetchPaymentById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsApi.getById(id, {
        populate: {
          student: { populate: ['course', 'batch'] },
          paymentSlip: true,
        },
      });
      set({ currentPayment: response.data?.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  createPayment: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsApi.create(data);
      const newPayment = response.data?.data;
      set((state) => ({ payments: [...state.payments, newPayment], isLoading: false }));
      return { success: true, data: newPayment };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  updatePayment: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsApi.update(id, data);
      const updated = response.data?.data;
      set((state) => ({
        payments: state.payments.map((p) => (p.id === id ? updated : p)),
        currentPayment: state.currentPayment?.id === id ? updated : state.currentPayment,
        isLoading: false,
      }));
      return { success: true, data: updated };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  fetchStudentSummary: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await paymentsApi.getStudentSummary(studentId);
      set({ studentSummary: response.data?.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearCurrentPayment: () => set({ currentPayment: null }),
  clearStudentSummary: () => set({ studentSummary: null }),
  clearError: () => set({ error: null }),
}));

export default usePaymentStore;
