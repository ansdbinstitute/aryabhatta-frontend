import client from './client';

export const materialsApi = {
  list: (params = {}) =>
    client.get('/study-materials', { params }),

  getById: (id, params = {}) =>
    client.get(`/study-materials/${id}`, { params }),

  create: (data) =>
    client.post('/study-materials', { data }),

  update: (id, data) =>
    client.put(`/study-materials/${id}`, { data }),

  delete: (id) =>
    client.delete(`/study-materials/${id}`),

  /**
   * Upload file for study material
   * Uses Strapi's upload endpoint
   */
  uploadFile: (file, refId, field = 'file') => {
    const formData = new FormData();
    formData.append('files', file);
    formData.append('ref', 'api::study-material.study-material');
    formData.append('refId', refId);
    formData.append('field', field);
    return client.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default materialsApi;
