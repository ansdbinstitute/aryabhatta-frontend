import client from './client';

export const usersApi = {
  list: (params = {}) =>
    client.get('/users', { params }),

  getById: (id) =>
    client.get(`/users/${id}`, { params: { populate: 'role' } }),

  create: (data) =>
    client.post('/users', data),

  update: (id, data) =>
    client.put(`/users/${id}`, data),

  delete: (id) =>
    client.delete(`/users/${id}`),
};

export default usersApi;
