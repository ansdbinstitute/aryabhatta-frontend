import client from './client';

export const examApprovalApi = {
  list: async (params = {}) => {
    const response = await client.get('/exam-approvals', { params });
    return response;
  },

  getById: async (id, params = {}) => {
    const response = await client.get(`/exam-approvals/${id}`, { params });
    return response;
  },

  create: async (data) => {
    const response = await client.post('/exam-approvals', { data });
    return response;
  },

  update: async (id, data) => {
    const response = await client.put(`/exam-approvals/${id}`, { data });
    return response;
  },

  delete: async (id) => {
    const response = await client.delete(`/exam-approvals/${id}`);
    return response;
  },

  getPending: async () => {
    const response = await client.get('/exam-approvals/pending', { 
      params: { 
        populate: { 
          student: { populate: ['course', 'batch'] }, 
          course: true,
          batch: true,
          exam: { populate: ['course'] } 
        } 
      } 
    });
    return response;
  },

  getStudentRequests: async (params = {}) => {
    const response = await client.get('/exam-approvals/student-requests', { 
      params 
    });
    return response;
  },

  approve: async (id, remarks = '') => {
    const response = await client.put(`/exam-approvals/${id}`, { 
      data: { status: 'approved', remarks } 
    });
    return response;
  },

  reject: async (id, remarks = '') => {
    const response = await client.put(`/exam-approvals/${id}`, { 
      data: { status: 'rejected', remarks } 
    });
    return response;
  }
};

export default examApprovalApi;
