import client, { extractData, extractPagination } from './client';

export const studentsApi = {
  list: (params = {}) =>
    client.get('/students', { params }),

  getById: (id, params = {}) =>
    client.get(`/students/${id}`, { params }),

  create: (data) =>
    client.post('/students', { data }),

  update: (id, data) =>
    client.put(`/students/${id}`, { data }),

  delete: (id) =>
    client.delete(`/students/${id}`),

  me: () =>
    client.get('/students/me'),

  createPortalAccess: (id) =>
    client.post(`/students/${id}/portal-access`),

  updatePortalAccessStatus: (id, status) =>
    client.put(`/students/${id}/portal-access-status`, { status }),

  resetStudentPassword: (userId, password, confirmPassword) =>
    client.put(`/user-management/users/${userId}/password`, { password, confirmPassword }),

  uploadIdCard: (id, file) => {
    const formData = new FormData();
    formData.append('files', file);
    return client.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },

  uploadCertificate: (id, file) => {
    const formData = new FormData();
    formData.append('files', file);
    return client.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
};

export default studentsApi;
