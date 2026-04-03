import api from './client';

export const roleAccessMatrixApi = {
  getAllPermissions: async () => {
    const response = await api.get('/role-access-matrices');
    return response.data;
  },

  getRolePermissions: async (role) => {
    const response = await api.get(`/role-access-matrices/${role}`);
    return response.data;
  },

  updateRolePermissions: async (role, permissions) => {
    const response = await api.put(`/role-access-matrices/${role}`, { data: permissions });
    return response.data;
  },
};

export default roleAccessMatrixApi;
