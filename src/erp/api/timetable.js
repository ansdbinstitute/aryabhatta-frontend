import client from './client';

export const timetableApi = {
  list: (params = {}) =>
    client.get('/timetable-entries', { params }),

  getByBatch: (batchId) =>
    client.get(`/timetable-entries/batch/${batchId}`),

  create: (data) =>
    client.post('/timetable-entries', { data }),

  update: (id, data) =>
    client.put(`/timetable-entries/${id}`, { data }),

  delete: (id) =>
    client.delete(`/timetable-entries/${id}`),
};

export default timetableApi;
