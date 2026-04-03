import { create } from 'zustand';
import client from '../api/client';
import useUiStore from './uiStore';

const useAttendanceStore = create((set, get) => ({
  attendanceRecords: [],
  isLoading: false,
  error: null,

  fetchAttendance: async (filters = {}) => {
    set({ isLoading: true });
    try {
      const response = await client.get('/attendances', {
        params: {
          populate: { student: true, batch: true },
          ...filters,
        },
      });
      set({ attendanceRecords: response.data.data || [] });
    } catch (error) {
      useUiStore.getState().showToast('Failed to load attendances', 'error');
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  markAttendance: async (date, batchId, records) => {
    set({ isLoading: true });
    try {
      const promises = records.map((record) => 
        client.post('/attendances', {
          data: {
            date,
            batch: batchId,
            student: record.studentId,
            status: record.status,
            remarks: record.remarks || '',
          }
        })
      );
      
      await Promise.all(promises);
      useUiStore.getState().showToast('Attendance marked successfully!', 'success');
      return true;
    } catch (error) {
      useUiStore.getState().showToast('Failed to mark attendance', 'error');
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useAttendanceStore;
