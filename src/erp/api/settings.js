import client from './client';

export const settingsApi = {
  get: () =>
    client.get('/institute-setting'),

  update: (data) =>
    client.put('/institute-setting', { data }),
};

export const academicYearsApi = {
  list: (params = {}) =>
    client.get('/academic-years', { params }),

  getById: (id) =>
    client.get(`/academic-years/${id}`),

  create: (data) =>
    client.post('/academic-years', { data }),

  update: (id, data) =>
    client.put(`/academic-years/${id}`, { data }),

  delete: (id) =>
    client.delete(`/academic-years/${id}`),

  setCurrent: (id) =>
    client.put(`/academic-years/${id}/set-current`),
};

export default { settingsApi, academicYearsApi };
