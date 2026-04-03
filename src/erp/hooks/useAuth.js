import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Convenience hook for auth actions
 */
const useAuth = () => {
  const navigate = useNavigate();
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login: storeLogin,
    logout: storeLogout,
    clearError,
  } = useAuthStore();

  const login = useCallback(async (identifier, password, options = {}) => {
    const { redirectTo, portal } = options;
    const result = await storeLogin(identifier, password, portal);
    if (result.success) {
      // Use redirectTo if provided, otherwise use role-based redirect
      const roleType = result.user?.roleType;
      const destination = redirectTo || (roleType === 'student' ? '/student/dashboard' : '/erp/dashboard');
      navigate(destination);
    }
    return result;
  }, [storeLogin, navigate]);

  const logout = useCallback((options = {}) => {
    const { redirectTo = '/erp/login' } = options;
    storeLogout();
    navigate(redirectTo);
  }, [storeLogout, navigate]);

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    clearError,
    role: user?.roleType || null,
  };
};

export default useAuth;
