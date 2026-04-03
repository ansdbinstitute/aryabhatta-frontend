import client from './client';

export const dashboardApi = {
  getAdminStats: () =>
    client.get('/dashboard/admin'),

  getTeacherStats: () =>
    client.get('/dashboard/teacher'),

  getStudentStats: () =>
    client.get('/dashboard/student'),
};

export default dashboardApi;
