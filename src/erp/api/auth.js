import client from './client';

export const authApi = {
  /**
   * Login with identifier (email/username) and password
   */
  login: (identifier, password) =>
    client.post('/auth/local', { identifier, password }),

  /**
   * Get current user profile with role populated
   */
  getMe: () =>
    client.get('/users/me', {
      params: { populate: ['role', 'branch', 'profileImage'] },
    }),

  /**
   * Update current user profile
   */
  updateMe: (data) =>
    client.put('/user-management/profile', data),

  /**
   * Change password (authenticated)
   */
  changePassword: (currentPassword, password, passwordConfirmation) =>
    client.put('/user-management/profile/password', {
      password,
      confirmPassword: passwordConfirmation,
    }),

  /**
   * Request password reset email
   */
  forgotPassword: (email) =>
    client.post('/auth/forgot-password', { email }),

  /**
   * Reset password with token
   */
  resetPassword: (code, password, passwordConfirmation) =>
    client.post('/auth/reset-password', {
      code,
      password,
      passwordConfirmation,
    }),
};

export default authApi;
