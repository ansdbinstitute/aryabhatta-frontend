import client from './client';

export const attendanceApi = {
  list: (params = {}) =>
    client.get('/attendances', { params }),

  markBulk: (batchId, date, records) =>
    client.post('/attendances/bulk', { batchId, date, records }),

  update: (id, data) =>
    client.put(`/attendances/${id}`, { data }),

  getReport: (params = {}) =>
    client.get('/attendances/report', { params }),
};

export default attendanceApi;
