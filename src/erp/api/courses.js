import client from './client';

export const coursesApi = {
  list: (params = {}) =>
    client.get('/courses', { params }),

  getById: (id, params = {}) =>
    client.get(`/courses/${id}`, { params }),

  create: (data) =>
    client.post('/courses', { data }),

  update: (id, data) =>
    client.put(`/courses/${id}`, { data }),

  delete: (id) =>
    client.delete(`/courses/${id}`),
};

export default coursesApi;
