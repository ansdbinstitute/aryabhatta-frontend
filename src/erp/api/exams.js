import client from './client';

export const examsApi = {
  list: (params = {}) =>
    client.get('/exams', { params }),

  getById: (id, params = {}) =>
    client.get(`/exams/${id}`, { params }),

  create: (data) =>
    client.post('/exams', { data }),

  update: (id, data) =>
    client.put(`/exams/${id}`, { data }),

  delete: (id) =>
    client.delete(`/exams/${id}`),
};

export const resultsApi = {
  list: (params = {}) =>
    client.get('/results', { params }),

  submitBulk: (examId, results) =>
    client.post('/results/bulk', { examId, results }),

  update: (id, data) =>
    client.put(`/results/${id}`, { data }),

  getStudentResults: (studentId) =>
    client.get(`/results/student/${studentId}`),
};

export default { examsApi, resultsApi };
