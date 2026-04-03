import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useUserStore from '../../stores/userStore';
import usePermission from '../../hooks/usePermission';
import PageHeader from '../../components/common/PageHeader';
import { UserPlus, X, Shield, Edit2, Trash2, ChevronDown, Check, Building, GraduationCap, User, DollarSign, KeyRound, AlertTriangle } from 'lucide-react';
import { ROLES, ROLE_LABELS } from '../../utils/constants';

const UserManagementPage = () => {
  const { users, branches, roleTypes, isLoading, error, fetchUsers, fetchBranches, fetchRoleTypes, createUser, updateUser, deleteUser, changeUserRole, changeUserPassword, clearError } = useUserStore();
  const { isInstituteAdmin } = usePermission();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [passwordModalUser, setPasswordModalUser] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ password: '', confirmPassword: '' });
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    fetchUsers();
    fetchBranches();
    fetchRoleTypes();
  }, []);

  useEffect(() => {
    if (roleTypes.length === 0) {
      setSelectedRole(null);
    }
    if (branches.length === 0) {
      setSelectedBranch(null);
    }
  }, [roleTypes, branches]);

  const handleOpenModal = (user = null) => {
    setEditingUser(user);
    clearError();
    setSaveSuccess(false);
    setRoleDropdownOpen(false);
    setBranchDropdownOpen(false);
    
    if (user) {
      setSelectedRole(roleTypes.find(r => r.value === user.roleType) || null);
      setSelectedBranch(branches.find(b => b.id === user.branch?.id) || null);
      reset({
        username: user.username || '',
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || '',
        password: ''
      });
    } else {
      setSelectedRole(null);
      setSelectedBranch(null);
      reset({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user? This action is irreversible.')) {
      await deleteUser(id);
    }
  };

  const handleOpenPasswordModal = (user) => {
    clearError();
    setPasswordModalUser(user);
    setPasswordForm({ password: '', confirmPassword: '' });
  };

  const handleResetPassword = async () => {
    if (!passwordModalUser) return;

    const result = await changeUserPassword(
      passwordModalUser.id,
      passwordForm.password,
      passwordForm.confirmPassword
    );

    if (result.success) {
      setPasswordModalUser(null);
      setPasswordForm({ password: '', confirmPassword: '' });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    }
  };

  const onSubmit = async (data) => {
    if (!selectedRole) {
      return;
    }

    const payload = {
      username: data.username,
      email: data.email,
      password: data.password || undefined,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      roleType: selectedRole.value,
      branch: selectedBranch?.id || undefined
    };

    let result;
    if (editingUser) {
      result = await updateUser(editingUser.id, payload);
    } else {
      result = await createUser(payload);
    }

    if (result.success) {
      setSaveSuccess(true);
      setTimeout(() => {
        setIsModalOpen(false);
        fetchUsers();
      }, 1500);
    }
  };

  const getRoleBadgeColor = (roleType) => {
    switch (roleType) {
      case ROLES.INSTITUTE_ADMIN:
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case ROLES.BRANCH_ADMIN:
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case ROLES.TEACHER:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case ROLES.ACCOUNTANT:
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  const getRoleIcon = (roleType) => {
    switch (roleType) {
      case ROLES.INSTITUTE_ADMIN:
        return Shield;
      case ROLES.BRANCH_ADMIN:
        return Shield;
      case ROLES.TEACHER:
        return GraduationCap;
      case ROLES.ACCOUNTANT:
        return DollarSign;
      default:
        return User;
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <PageHeader 
          title="User Accounts" 
          subtitle="Manage staff accounts, roles, and access permissions across the organization." 
        />
        <button
          onClick={() => handleOpenModal()}
          className="mt-4 md:mt-0 flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-secondary text-white font-medium rounded-xl shadow-sm transition-all"
        >
          <UserPlus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {error && !isModalOpen && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl border border-red-200">
          <p className="font-medium">Error:</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/80 text-slate-500 font-medium border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading && users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    Loading users...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                    No users found. Click "Add User" to create one.
                  </td>
                </tr>
              ) : (
                users
                  .filter((u) => u.roleType !== ROLES.STUDENT && u.role?.type !== 'student')
                  .map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                          {u.firstName?.charAt(0)?.toUpperCase() || u.username?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">
                            {u.firstName && u.lastName ? `${u.firstName} ${u.lastName}` : u.username || u.email}
                          </div>
                          <div className="text-xs text-slate-500">@{u.username || 'username'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      <div className="text-sm">{u.email}</div>
                      {u.phone && <div className="text-xs text-slate-400">{u.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${getRoleBadgeColor(u.roleType)}`}>
                        {(() => { const Icon = getRoleIcon(u.roleType); return <Icon className="w-3.5 h-3.5" />; })()}
                        {ROLE_LABELS[u.roleType] || u.roleType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.branch?.name ? (
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Building className="w-4 h-4 text-slate-400" />
                          {u.branch.name}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-sm">All Branches</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {u.isActive !== false ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500">
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                          Inactive
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                            onClick={() => handleOpenModal(u)}
                            className="p-2 text-slate-400 hover:text-primary hover:bg-slate-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {isInstituteAdmin && u.roleType !== ROLES.INSTITUTE_ADMIN && (
                          <button
                            onClick={() => handleOpenPasswordModal(u)}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title="Reset Password"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                        )}
                        {isInstituteAdmin && u.roleType !== ROLES.INSTITUTE_ADMIN && (
                          <button 
                              onClick={() => handleDeleteUser(u.id)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-visible max-h-[90vh]">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                {editingUser ? <Edit2 className="w-5 h-5 text-primary" /> : <UserPlus className="w-5 h-5 text-primary" />}
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 max-h-[80vh] overflow-y-auto">
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}
              {saveSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 text-sm font-medium rounded-lg border border-emerald-100 text-center">
                  User {editingUser ? 'updated' : 'created'} successfully!
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                    <input
                      {...register('firstName', { required: 'First name is required' })}
                      type="text"
                      className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary bg-slate-50"
                      placeholder="John"
                    />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                    <input
                      {...register('lastName', { required: 'Last name is required' })}
                      type="text"
                      className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary bg-slate-50"
                      placeholder="Doe"
                    />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                    <input
                      {...register('username', { required: 'Username is required' })}
                      type="text"
                      className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary bg-slate-50"
                      placeholder="jdoe"
                    />
                    {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <input
                      {...register('email', { required: 'Email is required' })}
                      type="email"
                      className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary bg-slate-50"
                      placeholder="john@institute.edu"
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                    <p className="text-[10px] text-amber-600 mt-1.5 flex items-center gap-1 font-medium bg-amber-50/50 p-1.5 rounded border border-amber-100">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Note: Emails used by existing Student accounts will also cause a conflict.</span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Phone (Optional)</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary bg-slate-50"
                    placeholder="+91 98765 43210"
                  />
                </div>

                {!editingUser && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      {editingUser ? 'New Password (Optional)' : 'Password'}
                    </label>
                    <input
                      {...register('password', { 
                        required: !editingUser ? 'Password is required' : false,
                        minLength: { value: 6, message: 'Minimum 6 characters' }
                      })}
                      type="text"
                      className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary bg-slate-50"
                      placeholder="Min 6 characters"
                    />
                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                    >
                      <span className={selectedRole ? 'text-slate-800' : 'text-slate-400'}>
                        {selectedRole ? ROLE_LABELS[selectedRole.value] : 'Select a role...'}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${roleDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {roleDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg max-h-48 overflow-auto">
                        {roleTypes
                          .filter(role => role.value !== ROLES.STUDENT)
                          .map((role) => (
                          <button
                            key={role.value}
                            type="button"
                            onClick={() => {
                              setSelectedRole(role);
                              setRoleDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between"
                          >
                            <span className="text-sm">{ROLE_LABELS[role.value]}</span>
                            {selectedRole?.value === role.value && <Check className="w-4 h-4 text-primary" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  {!selectedRole && <p className="text-xs text-red-500 mt-1">Role is required</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Branch</label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                      className="w-full flex items-center justify-between px-4 py-2.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-white transition-colors"
                    >
                      <span className={selectedBranch ? 'text-slate-800' : 'text-slate-400'}>
                        {selectedBranch ? selectedBranch.name : 'Select a branch (optional)...'}
                      </span>
                      <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${branchDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {branchDropdownOpen && (
                      <div className="absolute z-10 w-full mt-1 bg-white rounded-lg border border-slate-200 shadow-lg max-h-64 overflow-y-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedBranch(null);
                            setBranchDropdownOpen(false);
                          }}
                          className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between sticky top-0 bg-white border-b border-slate-100"
                        >
                          <span className="text-sm text-slate-500">No specific branch</span>
                          {!selectedBranch && <Check className="w-4 h-4 text-primary" />}
                        </button>
                        {branches.map((branch) => (
                          <button
                            key={branch.id}
                            type="button"
                            onClick={() => {
                              setSelectedBranch(branch);
                              setBranchDropdownOpen(false);
                            }}
                            className="w-full px-4 py-2.5 text-left hover:bg-slate-50 flex items-center justify-between"
                          >
                            <span className="text-sm">{branch.name}</span>
                            {selectedBranch?.id === branch.id && <Check className="w-4 h-4 text-primary" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || saveSuccess || !selectedRole}
                    className="flex-[2] flex justify-center items-center gap-2 px-4 py-2.5 bg-primary hover:bg-secondary text-white font-medium rounded-xl transition-colors disabled:opacity-70"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                    ) : (
                      editingUser ? 'Update User' : 'Create User'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {passwordModalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md border border-slate-100 overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-amber-500" />
                Reset Password
              </h3>
              <button
                onClick={() => setPasswordModalUser(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Reset password for <span className="font-semibold text-slate-800">{passwordModalUser.firstName} {passwordModalUser.lastName}</span>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.password}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary bg-slate-50"
                  placeholder="Minimum 6 characters"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full rounded-lg border-slate-200 focus:border-primary focus:ring-primary bg-slate-50"
                  placeholder="Repeat new password"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setPasswordModalUser(null)}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  disabled={isLoading || !passwordForm.password || !passwordForm.confirmPassword}
                  className="flex-[2] flex justify-center items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-xl transition-colors disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white"></div>
                  ) : (
                    'Reset Password'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
