import React, { useEffect, useState, useMemo } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import useRolePermissionStore, { DEFAULT_PERMISSIONS } from '../../stores/rolePermissionStore';
import useAuthStore from '../../stores/authStore';
import { ROLES, ROLE_LABELS } from '../../utils/constants';
import { Shield, Check, X, Eye, Edit, Trash, Plus, GraduationCap, BookOpen, Building, Users, Settings, Save, RotateCcw, Loader2, AlertCircle } from 'lucide-react';

const ALL_ACTIONS = ['create', 'read', 'update', 'delete'];

const ACTION_LABELS = {
  create: { label: 'Create', icon: Plus, color: 'emerald' },
  read: { label: 'View', icon: Eye, color: 'blue' },
  update: { label: 'Edit', icon: Edit, color: 'amber' },
  delete: { label: 'Delete', icon: Trash, color: 'rose' }
};

const PERMISSION_CATEGORIES = [
  {
    id: 'students',
    title: 'Students',
    icon: GraduationCap,
    resources: ['students', 'id-cards', 'results', 'certificates']
  },
  {
    id: 'academic',
    title: 'Academic',
    icon: BookOpen,
    resources: ['courses', 'batches', 'attendance', 'exams', 'materials']
  },
  {
    id: 'finance',
    title: 'Finance',
    icon: Building,
    resources: ['fee-structures', 'payments']
  },
  {
    id: 'management',
    title: 'Management',
    icon: Users,
    resources: ['staff', 'users', 'branches']
  },
  {
    id: 'system',
    title: 'System',
    icon: Settings,
    resources: ['notices', 'settings', 'access-matrix', 'campus-network', 'institute-settings']
  }
];

const ALL_RESOURCES = PERMISSION_CATEGORIES.flatMap(cat => cat.resources);

const RolePermissionsPage = () => {
  const { 
    permissions, 
    defaultPermissions, 
    loading, 
    fetchAllPermissions, 
    saveRolePermissions, 
    resetToDefaults,
    isInitialized 
  } = useRolePermissionStore();
  
  const { user, isInstituteAdmin } = useAuthStore();

  const [editedPermissions, setEditedPermissions] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [activeRole, setActiveRole] = useState(ROLES.INSTITUTE_ADMIN);

  const isSelfEditingRestricted = isInstituteAdmin() && activeRole === ROLES.INSTITUTE_ADMIN;

  useEffect(() => {
    if (!isInitialized) {
      fetchAllPermissions();
    }
  }, [isInitialized, fetchAllPermissions]);

  useEffect(() => {
    if (permissions && !editedPermissions) {
      setEditedPermissions(permissions);
    }
  }, [permissions, editedPermissions]);

  useEffect(() => {
    if (editedPermissions && permissions) {
      const changed = JSON.stringify(editedPermissions) !== JSON.stringify(permissions);
      setHasChanges(changed);
    }
  }, [editedPermissions, permissions]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTogglePermission = (role, resource, action) => {
    setEditedPermissions(prev => {
      const rolePerms = prev?.[role] || {};
      const resourcePerms = rolePerms[resource] || [];
      
      let newResourcePerms;
      if (resourcePerms.includes(action)) {
        newResourcePerms = resourcePerms.filter(a => a !== action);
      } else {
        newResourcePerms = [...resourcePerms, action];
      }

      return {
        ...prev,
        [role]: {
          ...rolePerms,
          [resource]: newResourcePerms
        }
      };
    });
  };

  const handleSave = async () => {
    if (!editedPermissions?.[activeRole]) return;
    
    setSaving(true);
    try {
      await saveRolePermissions(activeRole, editedPermissions[activeRole]);
      showToast('Permissions saved successfully!');
    } catch (error) {
      showToast('Failed to save permissions', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (!confirm(`Reset ${ROLE_LABELS[activeRole]} permissions to default?`)) return;
    
    setSaving(true);
    try {
      await resetToDefaults(activeRole);
      setEditedPermissions({
        ...editedPermissions,
        [activeRole]: defaultPermissions[activeRole]
      });
      showToast('Permissions reset to defaults');
    } catch (error) {
      showToast('Failed to reset permissions', 'error');
    } finally {
      setSaving(false);
    }
  };

  const permissionStats = useMemo(() => {
    if (!permissions) return [];
    
    return Object.keys(ROLES).map(key => {
      const role = ROLES[key];
      const rolePerms = permissions[role] || {};
      let total = 0;
      let granted = 0;
      
      ALL_RESOURCES.forEach(resource => {
        ALL_ACTIONS.forEach(action => {
          total++;
          if (rolePerms[resource]?.includes(action)) {
            granted++;
          }
        });
      });

      return { 
        role, 
        granted, 
        total, 
        pct: total > 0 ? Math.round((granted / total) * 100) : 0 
      };
    });
  }, [permissions]);

  const isPermissionChanged = (role, resource, action) => {
    if (!editedPermissions || !permissions) return false;
    const edited = editedPermissions[role]?.[resource]?.includes(action) || false;
    const original = permissions[role]?.[resource]?.includes(action) || false;
    return edited !== original;
  };

  if (!isInitialized || !editedPermissions) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <PageHeader 
        title="Access Matrix" 
        subtitle="Manage role-based permissions. Changes apply to all users with that role." 
      />

      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-2">
          {Object.keys(ROLES).map(key => {
            const role = ROLES[key];
            const isActive = activeRole === role;
            const stat = permissionStats.find(s => s.role === role);
            return (
              <button
                key={role}
                onClick={() => setActiveRole(role)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                  isActive 
                    ? 'bg-primary text-white shadow-md' 
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                {ROLE_LABELS[role]}
                {stat && (
                  <span className={`ml-2 text-xs ${isActive ? 'text-white/80' : 'text-slate-400'}`}>
                    {stat.granted}/{stat.total}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button
            variant="outline"
            icon={<RotateCcw className="w-4 h-4" />}
            onClick={handleReset}
            disabled={saving || loading || isSelfEditingRestricted}
            className={isSelfEditingRestricted ? 'cursor-not-allowed opacity-50' : ''}
          >
            Reset to Default
          </Button>
          <Button
            variant="primary"
            icon={saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            onClick={handleSave}
            disabled={saving || !hasChanges || isSelfEditingRestricted}
            className={isSelfEditingRestricted ? 'cursor-not-allowed opacity-50' : ''}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/80 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Resource / Action
                </th>
                {ALL_ACTIONS.map(action => {
                  const { icon: Icon, label, color } = ACTION_LABELS[action];
                  return (
                    <th key={action} className="px-4 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider min-w-[80px]">
                      <div className="flex flex-col items-center gap-1">
                        <Icon className={`w-4 h-4 text-${color}-500`} />
                        <span>{label}</span>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {PERMISSION_CATEGORIES.map(category => (
                <React.Fragment key={category.id}>
                  <tr className="bg-slate-50/50">
                    <td colSpan={ALL_ACTIONS.length + 1} className="px-6 py-3">
                      <div className="flex items-center gap-2">
                        <category.icon className="w-5 h-5 text-primary" />
                        <span className="font-bold text-slate-700">{category.title}</span>
                      </div>
                    </td>
                  </tr>
                  {category.resources.map(resource => (
                    <tr key={resource} className="hover:bg-slate-50/30 transition-colors">
                      <td className="px-6 py-3 pl-10 text-sm text-slate-600 capitalize">
                        {resource.replace(/-/g, ' ')}
                      </td>
                      {ALL_ACTIONS.map(action => {
                        const isEnabled = editedPermissions[activeRole]?.[resource]?.includes(action) || false;
                        const isChanged = isPermissionChanged(activeRole, resource, action);
                        const { color } = ACTION_LABELS[action];
                        
                        return (
                          <td key={action} className="px-4 py-3 text-center">
                            <button
                              onClick={() => !isSelfEditingRestricted && handleTogglePermission(activeRole, resource, action)}
                              disabled={isSelfEditingRestricted}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                                isEnabled ? 'bg-primary' : 'bg-slate-200'
                              } ${isChanged ? 'ring-2 ring-offset-2 ring-yellow-400' : ''} ${
                                isSelfEditingRestricted ? 'cursor-not-allowed opacity-60' : ''
                              }`}
                              title={isSelfEditingRestricted ? "Institute Admin permissions cannot be modified from the ERP" : ""}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                              {isChanged && (
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
                                  <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-500"></span>
                                </span>
                              )}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between text-sm text-slate-500">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-emerald-100 text-emerald-600">
              <Check className="w-3.5 h-3.5" />
            </span>
            <span>Allowed</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-100 text-slate-300">
              <X className="w-3.5 h-3.5" />
            </span>
            <span>Denied</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-yellow-500"></span>
            </span>
            <span>Modified (unsaved)</span>
          </div>
        </div>
        {hasChanges && !isSelfEditingRestricted && (
          <span className="text-amber-600 font-medium">
            You have unsaved changes
          </span>
        )}
        {isSelfEditingRestricted && (
          <div className="flex items-center gap-2 text-amber-600 font-medium">
            <AlertCircle className="w-4 h-4" />
            <span>Institute Admin permissions are locked for self-protection.</span>
          </div>
        )}
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default RolePermissionsPage;
