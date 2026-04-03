import client, { extractData, extractPagination } from './client';

export const resultsApi = {
  list: (params = {}) =>
    client.get('/results', { params }),

  getById: (id, params = {}) =>
    client.get(`/results/${id}`, { params }),

  create: (data) =>
    client.post('/results', { data }),

  update: (id, data) =>
    client.put(`/results/${id}`, { data }),

  delete: (id) =>
    client.delete(`/results/${id}`),

  getByStudent: (studentId, params = {}) =>
    client.get('/results', { params: { ...params, 'filters[student][documentId][$eq]': studentId } }),
};

export default resultsApi;
