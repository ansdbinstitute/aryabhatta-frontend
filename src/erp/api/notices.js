import client from './client';

export const noticesApi = {
  list: (params = {}) =>
    client.get('/notices', { params }),

  getById: (id, params = {}) =>
    client.get(`/notices/${id}`, { params }),

  create: (data) =>
    client.post('/notices', { data }),

  update: (id, data) =>
    client.put(`/notices/${id}`, { data }),

  delete: (id) =>
    client.delete(`/notices/${id}`),
};

export default noticesApi;
