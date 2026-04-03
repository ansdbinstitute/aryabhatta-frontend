import client from './client';

export const batchesApi = {
  list: (params = {}) =>
    client.get('/batches', { params }),

  getById: (id, params = {}) =>
    client.get(`/batches/${id}`, { params }),

  create: (data) =>
    client.post('/batches', { data }),

  update: (id, data) =>
    client.put(`/batches/${id}`, { data }),

  delete: (id) =>
    client.delete(`/batches/${id}`),
};

export default batchesApi;
