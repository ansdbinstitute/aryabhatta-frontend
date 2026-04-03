import { create } from 'zustand';
import { studentsApi } from '../api/students';
import client from '../api/client';
import { extractData, extractPagination } from '../api/client';

const useStudentStore = create((set, get) => ({
  students: [],
  currentStudent: null,
  pagination: null,
  isLoading: false,
  error: null,

  fetchStudents: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await studentsApi.list({
        populate: {
          course: true,
          batch: true,
          user: true,
          profileImage: true,
          idCardFront: true,
          idCardBack: true,
          certificate: true,
        },
        ...params,
      });
      set({
        students: extractData(response) || [],
        pagination: extractPagination(response),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchStudentById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await studentsApi.getById(id, {
        populate: {
          course: true,
          batch: true,
          user: true,
          profileImage: true,
          idCardFront: true,
          idCardBack: true,
          certificate: true,
          branch: true,
        },
      });
      set({
        currentStudent: extractData(response),
        isLoading: false,
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchMyFullProfile: async (userId) => {
    if (!userId) return;
    set({ isLoading: true, error: null });
    try {
      const response = await studentsApi.list({
        filters: { user: { id: userId } },
        populate: {
          course: true,
          batch: true,
          user: true,
          profileImage: true,
          idCardFront: true,
          idCardBack: true,
          certificate: true,
          branch: true,
        },
      });
      const studentData = extractData(response);
      if (studentData && studentData.length > 0) {
        set({
          currentStudent: studentData[0],
          isLoading: false,
        });
        return studentData[0];
      } else {
        set({ isLoading: false });
        return null;
      }
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  clearCurrentStudent: () => set({ currentStudent: null }),

  createStudent: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await studentsApi.create(data);
      set({ isLoading: false });
      return { success: true, data: extractData(response) };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  updateStudent: async (id, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await studentsApi.update(id, data);
      if (get().currentStudent?.id === id) {
        set({ currentStudent: { ...get().currentStudent, ...extractData(response)} });
      }
      set({ isLoading: false });
      return { success: true, data: extractData(response) };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  deleteStudent: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await studentsApi.delete(id);
      set((state) => ({
        students: state.students.filter((s) => s.id !== id),
        isLoading: false,
      }));
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },
  
  createPortalAccess: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await studentsApi.createPortalAccess(id);
      await get().fetchStudentById(id);
      return { success: true, data: response.data };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  updatePortalAccessStatus: async (id, status) => {
    set({ isLoading: true, error: null });
    try {
      const response = await studentsApi.updatePortalAccessStatus(id, status);
      const updatedStudent = extractData(response);

      set((state) => ({
        students: state.students.map((student) =>
          student.id === id ? { ...student, ...updatedStudent } : student
        ),
        currentStudent: state.currentStudent?.id === id ? { ...state.currentStudent, ...updatedStudent } : state.currentStudent,
        isLoading: false,
      }));

      return { success: true, data: updatedStudent };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.message };
    }
  },

  resetStudentPassword: async (userId, password) => {
    set({ isLoading: true, error: null });
    try {
      await studentsApi.resetStudentPassword(userId, password, password);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { success: false, error: error.response?.data?.error?.message || error.message };
    }
  },
  
  uploadProfileImage: async (file) => {
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
  },

  uploadIdCard: async (studentId, file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      const uploadResponse = await client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileId = uploadResponse.data[0].id;

      const student =
        get().students.find((entry) => entry.id === studentId) || get().currentStudent;

      await studentsApi.update(studentId, {
        idCardFront: fileId,
        idCardUid: student?.uid || null,
      });
      await get().fetchStudentById(studentId);
      return { success: true, fileId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  uploadIdCardFront: async (studentId, file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      const uploadResponse = await client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileId = uploadResponse.data[0].id;

      const student =
        get().students.find((entry) => entry.id === studentId) || get().currentStudent;

      await studentsApi.update(studentId, {
        idCardFront: fileId,
        idCardUid: student?.uid || null,
      });
      await get().fetchStudentById(studentId);
      return { success: true, fileId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  uploadIdCardBack: async (studentId, file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      const uploadResponse = await client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileId = uploadResponse.data[0].id;

      const student =
        get().students.find((entry) => entry.id === studentId) || get().currentStudent;

      await studentsApi.update(studentId, {
        idCardBack: fileId,
        idCardUid: student?.uid || null,
      });
      await get().fetchStudentById(studentId);
      return { success: true, fileId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  uploadCertificate: async (studentId, file) => {
    try {
      const formData = new FormData();
      formData.append('files', file);
      const uploadResponse = await client.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileId = uploadResponse.data[0].id;
      
      await studentsApi.update(studentId, { certificate: fileId });
      await get().fetchStudentById(studentId);
      return { success: true, fileId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  resetStudents: () => set({ 
    students: [], 
    pagination: null, 
    currentStudent: null, 
    isLoading: false, 
    error: null 
  }),

  clearError: () => set({ error: null }),
}));

export default useStudentStore;
