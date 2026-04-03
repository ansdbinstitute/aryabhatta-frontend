import { create } from 'zustand';
import client, { extractData } from '../api/client';

const useExamStore = create((set, get) => ({
  exams: [],
  results: [],
  isLoading: false,
  error: null,

  fetchExams: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const params = {
        populate: { course: true, batch: true },
        'sort': 'examDate:desc',
      };
      if (filters.batch) params['filters[batch][documentId][$eq]'] = filters.batch;
      if (filters.course) params['filters[course][documentId][$eq]'] = filters.course;
      
      const response = await client.get('/exams', { params });
      set({ exams: extractData(response) || [], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
    }
  },

  createExam: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      await client.post('/exams', { data: payload });
      await get().fetchExams();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  updateExam: async (id, payload) => {
    set({ isLoading: true, error: null });
    try {
      await client.put(`/exams/${id}`, { data: payload });
      await get().fetchExams();
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  fetchExamResults: async (examId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await client.get('/results', {
        params: {
          'filters[exam][documentId][$eq]': examId,
          populate: { student: true },
        }
      });
      const data = extractData(response) || [];
      set({ results: data, isLoading: false });
      return data;
    } catch (err) {
      set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
      return [];
    }
  },

  fetchMyResults: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await client.get('/results', {
        params: {
          'filters[student][documentId][$eq]': studentId,
          populate: { exam: { populate: { course: true } } },
          'sort': 'createdAt:desc',
        }
      });
      set({ results: extractData(response) || [], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.error?.message || err.message, isLoading: false });
    }
  },

  saveResultsBatch: async (examId, studentMarks) => {
    set({ isLoading: true, error: null });
    try {
      // studentMarks expected as array: [{ studentId, marksObtained, remarks }]
      for (const item of studentMarks) {
        // In Strapi v5 with extractData, r.student.id is the documentId
        const existing = get().results.find(r => r.student?.id === item.studentId);
        
        if (existing) {
          await client.put(`/results/${existing.documentId}`, {
            data: {
              marksObtained: item.marksObtained,
              remarks: item.remarks
            }
          });
        } else {
          await client.post('/results', {
            data: {
              exam: examId, // examId is a documentId string
              student: item.studentId, // studentId is a documentId string
              marksObtained: item.marksObtained,
              remarks: item.remarks
            }
          });
        }
      }
      await get().fetchExamResults(examId);
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  },

  deleteExam: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await client.delete(`/exams/${id}`);
      await get().fetchExams();
      set({ isLoading: false });
      return { success: true };
    } catch (err) {
      const errorMsg = err.response?.data?.error?.message || err.message;
      set({ error: errorMsg, isLoading: false });
      return { success: false, error: errorMsg };
    }
  }
}));

export default useExamStore;
