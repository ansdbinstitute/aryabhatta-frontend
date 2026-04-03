import useAuthStore from '../stores/authStore';
import { hasPermission, isAdminRole, isInstituteAdmin, isBranchAdmin } from '../utils/permissions';
import { ROLES } from '../utils/constants';

const usePermission = () => {
  const user = useAuthStore((state) => state.user);
  const role = user?.roleType || null;
  const branch = user?.branch?.id || null;

  const can = (action, resource) => {
    if (!role) return false;
    return hasPermission(role, resource, action);
  };

  const isRole = (...roles) => {
    if (!role) return false;
    return roles.includes(role);
  };

  const isAdmin = isAdminRole(role);
  const isInstituteAdminUser = isInstituteAdmin(role);
  const isBranchAdminUser = isBranchAdmin(role);
  const isTeacher = role === ROLES.TEACHER;
  const isAccountant = role === ROLES.ACCOUNTANT;
  const isStudent = role === ROLES.STUDENT;

  return {
    can,
    isRole,
    isAdmin,
    isInstituteAdmin: isInstituteAdminUser,
    isBranchAdmin: isBranchAdminUser,
    isTeacher,
    isAccountant,
    isStudent,
    role,
    branch,
  };
};

export default usePermission;
