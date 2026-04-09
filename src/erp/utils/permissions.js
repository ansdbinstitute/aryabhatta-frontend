import React from 'react';
import { ROLES } from './constants';
import {
  LayoutDashboard,
  GraduationCap,
  BookOpen,
  Users,
  ClipboardList,
  HelpCircle,
  Building,
  Bell,
  Settings,
  Award,
  FolderOpen,
  Calendar,
  Briefcase,
} from 'lucide-react';
import useRolePermissionStore, { DEFAULT_PERMISSIONS } from '../stores/rolePermissionStore';

const routeAllowed = (role, item) => {
  if (!role || !item) return false;

  if (item.roles && !item.roles.includes(role)) {
    return false;
  }

  if (!item.resource) {
    return true;
  }

  const actions = item.actions || (item.action ? [item.action] : ['read']);
  return actions.some((action) => hasPermission(role, item.resource, action));
};

const FALLBACK_PERMISSIONS = {
  [ROLES.INSTITUTE_ADMIN]: {
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
    placements: ['create', 'read', 'update', 'delete'],
    dashboard: ['read'],
  },

  [ROLES.BRANCH_ADMIN]: {
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
    settings: ['read'],
    dashboard: ['read'],
  },

  [ROLES.TEACHER]: {
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

  [ROLES.ACCOUNTANT]: {
    'fee-structures': ['create', 'read', 'update'],
    payments: ['create', 'read', 'update'],
    students: ['read'],
    notices: ['read'],
    dashboard: ['read'],
  },

  [ROLES.STUDENT]: {
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

export const PERMISSION_MATRIX = FALLBACK_PERMISSIONS;

const usePermissions = () => {
  const { permissions, hasPermission: storeHasPermission } = useRolePermissionStore();
  
  const getPermissionMatrix = () => {
    if (permissions) {
      return permissions;
    }
    return FALLBACK_PERMISSIONS;
  };

  const hasPermission = (role, resource, action) => {
    const matrix = getPermissionMatrix();
    const rolePerms = matrix[role];
    if (!rolePerms) return false;
    
    const resourcePerms = rolePerms[resource];
    if (!resourcePerms) return false;
    
    return resourcePerms.includes(action);
  };

  const getAllowedActions = (role, resource) => {
    const matrix = getPermissionMatrix();
    const rolePerms = matrix[role];
    if (!rolePerms) return [];
    
    return rolePerms[resource] || [];
  };

  return { hasPermission, getAllowedActions, getPermissionMatrix };
};

export const hasPermission = (role, resource, action) => {
  try {
    const store = useRolePermissionStore.getState();
    if (store.permissions) {
      const rolePerms = store.permissions[role];
      if (rolePerms) {
        const resourcePerms = rolePerms[resource];
        if (resourcePerms) {
          return resourcePerms.includes(action);
        }
      }
    }
  } catch (e) {
  }
  
  return FALLBACK_PERMISSIONS[role]?.[resource]?.includes(action) ?? false;
};

export const getAllowedActions = (role, resource) => {
  try {
    const store = useRolePermissionStore.getState();
    if (store.permissions) {
      const rolePerms = store.permissions[role];
      if (rolePerms) {
        return rolePerms[resource] || [];
      }
    }
  } catch (e) {
  }
  
  return FALLBACK_PERMISSIONS[role]?.[resource] ?? [];
};

export const isAdminRole = (role) => {
  return role === ROLES.INSTITUTE_ADMIN || role === ROLES.BRANCH_ADMIN;
};

export const isInstituteAdmin = (role) => {
  return role === ROLES.INSTITUTE_ADMIN;
};

export const isBranchAdmin = (role) => {
  return role === ROLES.BRANCH_ADMIN;
};

export const getNavItemsForRole = (role) => {
  const allItems = getSidebarConfig();
  return allItems
    .map((item) => {
      if (item.children) {
        const filteredChildren = item.children.filter(
          (child) => routeAllowed(role, child)
        );
        if (filteredChildren.length === 0) return null;
        return { ...item, children: filteredChildren };
      }
      return routeAllowed(role, item) ? item : null;
    })
    .filter(Boolean);
};

export const getSidebarConfig = () => [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/erp/dashboard',
    resource: 'dashboard',
    action: 'read',
  },
  {
    label: 'Students',
    icon: GraduationCap,
    roles: [ROLES.INSTITUTE_ADMIN, ROLES.BRANCH_ADMIN, ROLES.TEACHER],
    children: [
      { label: 'All Students', path: '/erp/students', resource: 'students', action: 'read' },
      { label: 'Portal Access', path: '/erp/students/portal-access', resource: 'students', action: 'update' },
      { label: 'ID Cards', path: '/erp/students/id-cards', resource: 'id-cards', action: 'read' },
      { label: 'Results', path: '/erp/students/results', resource: 'results', action: 'read' },
      { label: 'Certificates', path: '/erp/students/certificates', resource: 'certificates', action: 'read' },
    ],
  },
  {
    label: 'Courses',
    icon: BookOpen,
    path: '/erp/courses',
    roles: [ROLES.INSTITUTE_ADMIN, ROLES.BRANCH_ADMIN],
    resource: 'courses',
    action: 'read',
  },
  {
    label: 'Batches',
    icon: Users,
    path: '/erp/batches',
    roles: [ROLES.INSTITUTE_ADMIN, ROLES.BRANCH_ADMIN],
    resource: 'batches',
    action: 'read',
  },
  {
    label: 'Attendance',
    icon: ClipboardList,
    path: '/erp/attendance',
    roles: [ROLES.INSTITUTE_ADMIN, ROLES.BRANCH_ADMIN, ROLES.TEACHER],
    resource: 'attendance',
    actions: ['read', 'create', 'update'],
  },
  {
    label: 'Exams & Results',
    icon: HelpCircle,
    path: '/erp/exams',
    roles: [ROLES.INSTITUTE_ADMIN, ROLES.BRANCH_ADMIN, ROLES.TEACHER],
    children: [
      { label: 'All Exams', path: '/erp/exams', resource: 'exams', action: 'read' },
      { label: 'Exam Approvals', path: '/erp/exam-approvals', resource: 'exams', action: 'read' },
    ],
  },
  {
    label: 'Materials',
    icon: FolderOpen,
    path: '/erp/materials',
    roles: [ROLES.INSTITUTE_ADMIN, ROLES.BRANCH_ADMIN, ROLES.TEACHER, ROLES.STUDENT],
    resource: 'materials',
    action: 'read',
  },
  {
    label: 'Fees & Payments',
    icon: Building,
    roles: [ROLES.INSTITUTE_ADMIN, ROLES.ACCOUNTANT],
    children: [
      { label: 'Fee Structures', path: '/erp/fees', resource: 'fee-structures', action: 'read' },
      { label: 'Payments', path: '/erp/payments', resource: 'payments', action: 'read' },
    ],
  },
  {
    label: 'Notices',
    icon: Bell,
    path: '/erp/notices',
    roles: [ROLES.INSTITUTE_ADMIN, ROLES.BRANCH_ADMIN, ROLES.TEACHER, ROLES.ACCOUNTANT],
    resource: 'notices',
    action: 'read',
  },
  { divider: true },
  {
    label: 'Career Management',
    icon: Briefcase,
    roles: [ROLES.INSTITUTE_ADMIN],
    children: [
      { label: 'Placement Partners', path: '/erp/placements/partners', resource: 'placements', action: 'read' },
      { label: 'Student Testimonials', path: '/erp/placements/testimonials', resource: 'placements', action: 'read' },
    ],
  },
  {
    label: 'Staff Management',
    icon: Users,
    roles: [ROLES.INSTITUTE_ADMIN],
    children: [
      { label: 'Staff Directory', path: '/erp/staff', resource: 'staff', action: 'read' },
      { label: 'User Accounts', path: '/erp/users', resource: 'users', action: 'read' },
      { label: 'Access Matrix', path: '/erp/users/permissions', resource: 'access-matrix', action: 'read' },
      { label: 'Campus Network', path: '/erp/branches', roles: [ROLES.INSTITUTE_ADMIN], resource: 'campus-network', action: 'read' },
    ],
  },
  {
    label: 'Settings',
    icon: Settings,
    path: '/erp/settings',
    roles: [ROLES.INSTITUTE_ADMIN],
    resource: 'settings',
    action: 'read',
  },
];

export const getStudentNavConfig = (basePath = '/erp') => [
  { label: 'Dashboard', icon: LayoutDashboard, path: `${basePath}/dashboard` },
  { label: 'Attendance', icon: ClipboardList, path: `${basePath}/attendance/history` },
  { label: 'Fees', icon: Building, path: `${basePath}/fees/summary` },
  { label: 'My Exams', icon: HelpCircle, path: `${basePath}/my-exam-requests` },
  { label: 'Results', icon: Award, path: `${basePath}/results` },
  { label: 'Materials', icon: FolderOpen, path: `${basePath}/materials` },
  { label: 'Timetable', icon: Calendar, path: `${basePath}/timetable/view` },
  { label: 'Notices', icon: Bell, path: `${basePath}/notices` },
  { label: 'Profile', icon: Users, path: `${basePath}/profile` },
];

export { usePermissions };

export default PERMISSION_MATRIX;
