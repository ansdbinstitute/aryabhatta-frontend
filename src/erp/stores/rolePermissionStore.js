import { create } from 'zustand';
import roleAccessMatrixApi from '../api/roleAccessMatrixApi';

const DEFAULT_PERMISSIONS = {
  institute_admin: {
    'institute-settings': ['create', 'read', 'update', 'delete'],
    branches: ['create', 'read', 'update', 'delete'],
    courses: ['create', 'read', 'update', 'delete'],
    batches: ['create', 'read', 'update', 'delete'],
    students: ['create', 'read', 'update', 'delete'],
    'id-cards': ['create', 'read', 'update', 'delete'],
    results: ['create', 'read', 'update', 'delete'],
    certificates: ['create', 'read', 'update', 'delete'],
    attendance: ['create', 'read', 'update', 'delete'],
    exams: ['create', 'read', 'update', 'delete'],
    materials: ['create', 'read', 'update', 'delete'],
    'fee-structures': ['create', 'read', 'update', 'delete'],
    payments: ['create', 'read', 'update', 'delete'],
    notices: ['create', 'read', 'update', 'delete'],
    staff: ['create', 'read', 'update', 'delete'],
    users: ['create', 'read', 'update', 'delete'],
    'access-matrix': ['create', 'read', 'update', 'delete'],
    'campus-network': ['create', 'read', 'update', 'delete'],
    settings: ['create', 'read', 'update', 'delete'],
    dashboard: ['read'],
  },
  branch_admin: {
    branches: ['read'],
    courses: ['read'],
    batches: ['create', 'read', 'update', 'delete'],
    students: ['create', 'read', 'update'],
    'id-cards': ['read'],
    results: ['create', 'read', 'update'],
    certificates: ['read'],
    attendance: ['create', 'read', 'update'],
    exams: ['create', 'read', 'update'],
    materials: ['create', 'read', 'update'],
    'fee-structures': ['read'],
    payments: ['read'],
    notices: ['read'],
    staff: ['read'],
    users: ['read'],
    'campus-network': ['read'],
    settings: ['read'],
    dashboard: ['read'],
  },
  teacher: {
    courses: ['read'],
    batches: ['read'],
    students: ['read'],
    attendance: ['create', 'read'],
    exams: ['read'],
    materials: ['create', 'read', 'update'],
    results: ['create', 'read'],
    notices: ['read'],
    dashboard: ['read'],
  },
  accountant: {
    'fee-structures': ['create', 'read', 'update'],
    payments: ['create', 'read', 'update'],
    students: ['read'],
    notices: ['read'],
    dashboard: ['read'],
  },
  student: {
    courses: ['read'],
    batches: ['read'],
    students: ['read'],
    attendance: ['read'],
    'fee-structures': ['read'],
    payments: ['read'],
    exams: ['read'],
    results: ['read'],
    materials: ['read'],
    notices: ['read'],
    dashboard: ['read'],
  },
};

const ROLE_KEYS = Object.keys(DEFAULT_PERMISSIONS);

const normalizePermissions = (payload) => {
  if (!payload) {
    return DEFAULT_PERMISSIONS;
  }

  const candidate = payload.data && typeof payload.data === 'object'
    ? payload.data
    : payload;

  const hasRoleShape = ROLE_KEYS.some((role) => Object.prototype.hasOwnProperty.call(candidate, role));
  return hasRoleShape ? candidate : DEFAULT_PERMISSIONS;
};

const useRolePermissionStore = create((set, get) => ({
  permissions: null,
  defaultPermissions: DEFAULT_PERMISSIONS,
  loading: false,
  error: null,
  isInitialized: false,

  fetchAllPermissions: async () => {
    set({ loading: true, error: null });
    try {
      const data = await roleAccessMatrixApi.getAllPermissions();
      const normalizedPermissions = normalizePermissions(data);
      set({ 
        permissions: normalizedPermissions, 
        loading: false, 
        isInitialized: true 
      });
      return normalizedPermissions;
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
      set({ 
        error: error.message, 
        loading: false,
        permissions: DEFAULT_PERMISSIONS,
        isInitialized: true 
      });
      return DEFAULT_PERMISSIONS;
    }
  },

  updateRolePermissions: async (role, resource, action, enabled) => {
    const { permissions } = get();
    const currentRolePermissions = permissions?.[role] || {};
    const currentResourcePermissions = currentRolePermissions[resource] || [];
    
    let newResourcePermissions;
    if (enabled) {
      if (!currentResourcePermissions.includes(action)) {
        newResourcePermissions = [...currentResourcePermissions, action];
      } else {
        return permissions;
      }
    } else {
      newResourcePermissions = currentResourcePermissions.filter(a => a !== action);
    }

    const newRolePermissions = {
      ...currentRolePermissions,
      [resource]: newResourcePermissions,
    };

    const newPermissions = {
      ...permissions,
      [role]: newRolePermissions,
    };

    set({ permissions: newPermissions });

    try {
      await roleAccessMatrixApi.updateRolePermissions(role, newRolePermissions);
      return newPermissions;
    } catch (error) {
      console.error('Failed to update permissions:', error);
      set({ permissions });
      throw error;
    }
  },

  saveRolePermissions: async (role, rolePermissions) => {
    const { permissions } = get();
    
    const newPermissions = {
      ...permissions,
      [role]: rolePermissions,
    };

    set({ loading: true, error: null });

    try {
      await roleAccessMatrixApi.updateRolePermissions(role, rolePermissions);
      set({ permissions: newPermissions, loading: false });
      return newPermissions;
    } catch (error) {
      console.error('Failed to save permissions:', error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  resetToDefaults: (role) => {
    const { defaultPermissions, permissions } = get();
    const newPermissions = {
      ...permissions,
      [role]: defaultPermissions[role],
    };
    set({ permissions: newPermissions });
    return roleAccessMatrixApi.updateRolePermissions(role, defaultPermissions[role]);
  },

  getRolePermission: (role, resource, action) => {
    const { permissions, defaultPermissions } = get();
    const rolePerms = permissions?.[role] || defaultPermissions?.[role] || {};
    const resourcePerms = rolePerms[resource] || [];
    return resourcePerms.includes(action);
  },

  hasPermission: (role, resource, action) => {
    return get().getRolePermission(role, resource, action);
  },

  clearPermissions: () =>
    set({
      permissions: null,
      loading: false,
      error: null,
      isInitialized: false,
    }),
}));

export default useRolePermissionStore;
export { DEFAULT_PERMISSIONS };
