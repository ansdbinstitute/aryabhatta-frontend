import client from './client';

export const feesApi = {
  listStructures: (params = {}) =>
    client.get('/fee-structures', { params }),

  getStructure: (id, params = {}) =>
    client.get(`/fee-structures/${id}`, { params }),

  createStructure: (data) =>
    client.post('/fee-structures', { data }),

  updateStructure: (id, data) =>
    client.put(`/fee-structures/${id}`, { data }),

  deleteStructure: (id) =>
    client.delete(`/fee-structures/${id}`),
};

export const paymentsApi = {
  list: (params = {}) =>
    client.get('/payments', { params }),

  /**
   * Fetch payments for a specific student.
   * Strapi v5 requires filtering relations by documentId, not plain integer id.
   * We try integer id first (more reliable), then fall back to documentId string.
   */
  listByStudent: (documentId, integerStudentId = null, extraParams = {}) => {
    const filterKey = integerStudentId
      ? 'filters[student][id][$eq]'
      : 'filters[student][documentId][$eq]';
    const filterValue = integerStudentId || documentId;

    return client.get('/payments', {
      params: {
        [filterKey]: filterValue,
        ...extraParams,
      },
    });
  },

  getById: (id, params = {}) =>
    client.get(`/payments/${id}`, { params }),

  create: (data) =>
    client.post('/payments', { data }),

  update: (id, data) =>
    client.put(`/payments/${id}`, { data }),

  getReceipt: (id) =>
    client.get(`/payments/${id}/receipt`),

  getStudentSummary: (studentId) =>
    client.get(`/payments/student/${studentId}/summary`),
};

export default { feesApi, paymentsApi };
