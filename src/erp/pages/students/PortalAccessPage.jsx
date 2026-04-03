import React, { useEffect, useMemo, useState } from 'react';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Modal from '../../components/ui/Modal';
import useStudentStore from '../../stores/studentStore';
import usePermission from '../../hooks/usePermission';
import useToast from '../../hooks/useToast';
import { KeyRound, AlertTriangle, CheckCircle2, Search, Shield, PauseCircle, Ban, PlayCircle, Lock, Eye, EyeOff, RefreshCw, Copy, Check } from 'lucide-react';

const STATUS_STYLES = {
  none: 'bg-slate-100 text-slate-600 border-slate-200',
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  hold: 'bg-amber-100 text-amber-700 border-amber-200',
  stopped: 'bg-rose-100 text-rose-700 border-rose-200',
};

const generateRandomPassword = () => {
  const chars = 'abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const specials = '!@#$%';
  let password = '';
  for (let i = 0; i < 8; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  password += specials.charAt(Math.floor(Math.random() * specials.length));
  return password;
};

const PortalAccessPage = () => {
  const toast = useToast();
  const { can } = usePermission();
  const {
    students,
    fetchStudents,
    createPortalAccess,
    updatePortalAccessStatus,
    resetStudentPassword,
    isLoading,
  } = useStudentStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUid, setSelectedUid] = useState('');
  const [generatedCredentials, setGeneratedCredentials] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);
  const [creatingId, setCreatingId] = useState(null);

  // Reset password modal state
  const [resetPasswordModal, setResetPasswordModal] = useState(false);
  const [resetPasswordStudent, setResetPasswordStudent] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [passwordResetSuccess, setPasswordResetSuccess] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  useEffect(() => {
    fetchStudents({
      'pagination[pageSize]': 500,
      sort: 'createdAt:desc',
    });
  }, [fetchStudents]);

  const normalizedStudents = useMemo(
    () =>
      students
        .filter((student) => student.uid)
        .sort((a, b) => `${a.uid}`.localeCompare(`${b.uid}`)),
    [students]
  );

  const selectedStudent = useMemo(
    () => normalizedStudents.find((student) => student.uid === selectedUid) || null,
    [normalizedStudents, selectedUid]
  );

  const portalStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return normalizedStudents.filter((student) => {
      const fullName = `${student.firstName || ''} ${student.lastName || ''}`.trim().toLowerCase();
      const uid = `${student.uid || ''}`.toLowerCase();
      const course = `${student.course?.title || ''}`.toLowerCase();

      return !query || fullName.includes(query) || uid.includes(query) || course.includes(query);
    });
  }, [normalizedStudents, searchTerm]);

  const hasPortalAccess = Boolean(selectedStudent?.user);
  const selectedStatus = selectedStudent?.portalAccessStatus || (selectedStudent?.user ? 'active' : 'none');

  const handleCreatePortalAccess = async () => {
    if (!selectedStudent) return;

    setCreatingId(selectedStudent.id);
    const result = await createPortalAccess(selectedStudent.id);
    setCreatingId(null);

    if (!result.success) {
      toast.error(result.error || 'Failed to create portal access');
      return;
    }

    setGeneratedCredentials(result.data);
    await fetchStudents({
      'pagination[pageSize]': 500,
      sort: 'createdAt:desc',
    });
    toast.success('Portal access created successfully');
  };

  const handleStatusChange = async (studentId, status) => {
    setStatusUpdatingId(studentId);
    const result = await updatePortalAccessStatus(studentId, status);
    setStatusUpdatingId(null);

    if (!result.success) {
      toast.error(result.error || 'Failed to update portal access status');
      return;
    }

    toast.success(`Portal access set to ${status}`);
  };

  const openResetPasswordModal = (student) => {
    setResetPasswordStudent(student);
    setNewPassword(generateRandomPassword());
    setShowNewPassword(true);
    setPasswordResetSuccess(false);
    setCopiedPassword(false);
    setResetPasswordModal(true);
  };

  const closeResetPasswordModal = () => {
    setResetPasswordModal(false);
    setResetPasswordStudent(null);
    setNewPassword('');
    setShowNewPassword(false);
    setPasswordResetSuccess(false);
    setCopiedPassword(false);
  };

  const handleResetPassword = async () => {
    if (!resetPasswordStudent || !newPassword.trim()) return;

    const userId = resetPasswordStudent.user?.integerId || resetPasswordStudent.user?.id;
    if (!userId) {
      toast.error('Could not find user account for this student');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsResettingPassword(true);
    const result = await resetStudentPassword(userId, newPassword);
    setIsResettingPassword(false);

    if (!result.success) {
      toast.error(result.error || 'Failed to reset password');
      return;
    }

    setPasswordResetSuccess(true);
    toast.success('Student password reset successfully');
  };

  const handleCopyPassword = () => {
    navigator.clipboard.writeText(newPassword);
    setCopiedPassword(true);
    setTimeout(() => setCopiedPassword(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <PageHeader
        title="Student Portal Access"
        subtitle="Create student portal credentials by UID and manage whether an existing student portal stays active, on hold, or stopped."
      />

      <div className="grid grid-cols-1 xl:grid-cols-[420px_minmax(0,1fr)] gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Select Student UID</label>
            <select
              value={selectedUid}
              onChange={(e) => {
                setSelectedUid(e.target.value);
                setGeneratedCredentials(null);
              }}
              className="w-full rounded-xl border-slate-200 bg-slate-50 focus:border-primary focus:ring-primary"
            >
              <option value="">Choose student UID</option>
              {normalizedStudents.map((student) => (
                <option key={student.id} value={student.uid}>
                  {student.uid} - {student.firstName} {student.lastName}
                </option>
              ))}
            </select>
          </div>

          {selectedStudent && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Selected Student</p>
              <h3 className="mt-2 text-lg font-bold text-slate-800">
                {selectedStudent.firstName} {selectedStudent.lastName}
              </h3>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-400">UID</p>
                  <p className="font-mono text-slate-700">{selectedStudent.uid}</p>
                </div>
                <div>
                  <p className="text-slate-400">Course</p>
                  <p className="text-slate-700">{selectedStudent.course?.title || 'Not assigned'}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[selectedStatus] || STATUS_STYLES.none}`}>
                  Portal {selectedStatus}
                </span>
              </div>
            </div>
          )}

          {!selectedStudent && (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
              Select a student UID to create portal credentials or inspect existing portal access.
            </div>
          )}

          {selectedStudent && hasPortalAccess && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">Portal access already exists for this UID.</p>
                  <p className="mt-1 text-sm">
                    A portal ID/password has already been created for this student, so duplicate creation is blocked.
                  </p>
                </div>
              </div>
            </div>
          )}

          {selectedStudent && !hasPortalAccess && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">No portal access exists for this UID.</p>
                  <p className="mt-1 text-sm">
                    You can create portal login credentials for this student now.
                  </p>
                </div>
              </div>
            </div>
          )}

          {can('update', 'students') && (
            <Button
              fullWidth
              size="lg"
              variant="primary"
              icon={<KeyRound className="w-4 h-4" />}
              disabled={!selectedStudent || hasPortalAccess}
              loading={creatingId === selectedStudent?.id}
              onClick={handleCreatePortalAccess}
            >
              Create Student Portal ID & Password
            </Button>
          )}

          {/* Reset Password button for selected student with existing access */}
          {can('update', 'students') && selectedStudent && hasPortalAccess && (
            <Button
              fullWidth
              size="lg"
              variant="outline"
              icon={<Lock className="w-4 h-4" />}
              onClick={() => openResetPasswordModal(selectedStudent)}
            >
              Reset Student Password
            </Button>
          )}

          {generatedCredentials && (
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Generated Credentials</p>
              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <p className="text-slate-500">Username / UID</p>
                  <p className="font-mono font-semibold text-slate-800">{generatedCredentials.username}</p>
                </div>
                <div>
                  <p className="text-slate-500">Password</p>
                  <p className="font-mono font-semibold text-slate-800">{generatedCredentials.password}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Portal Access Ledger</h2>
              <p className="text-sm text-slate-500">Search by UID, student name, or course, then change the student portal state instantly.</p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text"
                placeholder="Search by UID, name, or course"
                className="w-full rounded-xl border-slate-200 bg-slate-50 pl-10 focus:border-primary focus:ring-primary"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px]">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">UID</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Course</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Portal</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {portalStudents.map((student) => {
                  const status = student.portalAccessStatus || (student.user ? 'active' : 'none');
                  const hasAccess = Boolean(student.user);
                  const isBusy = statusUpdatingId === student.id;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{student.firstName} {student.lastName}</p>
                        <p className="text-xs text-slate-500">{student.email || student.phone || 'No contact info'}</p>
                      </td>
                      <td className="px-6 py-4 font-mono text-sm text-slate-700">{student.uid || 'No UID'}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{student.course?.title || 'Not assigned'}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">
                        {hasAccess ? (
                          <span className="inline-flex items-center gap-2 text-emerald-700">
                            <Shield className="w-4 h-4" />
                            Created
                          </span>
                        ) : (
                          <span className="text-slate-400">Not created</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[status] || STATUS_STYLES.none}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {hasAccess ? (
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant={status === 'active' ? 'primary' : 'outline'}
                              icon={<PlayCircle className="w-4 h-4" />}
                              disabled={isBusy || status === 'active'}
                              onClick={() => handleStatusChange(student.id, 'active')}
                            >
                              Active
                            </Button>
                            <Button
                              size="sm"
                              variant={status === 'hold' ? 'accent' : 'outline'}
                              icon={<PauseCircle className="w-4 h-4" />}
                              disabled={isBusy || status === 'hold'}
                              onClick={() => handleStatusChange(student.id, 'hold')}
                            >
                              Hold
                            </Button>
                            <Button
                              size="sm"
                              variant={status === 'stopped' ? 'danger' : 'outline'}
                              icon={<Ban className="w-4 h-4" />}
                              disabled={isBusy || status === 'stopped'}
                              onClick={() => handleStatusChange(student.id, 'stopped')}
                            >
                              Stop
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              icon={<Lock className="w-4 h-4" />}
                              onClick={() => openResetPasswordModal(student)}
                            >
                              Reset Pass
                            </Button>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-400">Create access first</span>
                        )}
                      </td>
                    </tr>
                  );
                })}

                {!isLoading && portalStudents.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-slate-500">
                      No students matched your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <Modal
        isOpen={resetPasswordModal}
        onClose={closeResetPasswordModal}
        title="Reset Student Password"
        size="sm"
        footer={
          passwordResetSuccess ? (
            <Button variant="primary" onClick={closeResetPasswordModal}>
              Done
            </Button>
          ) : (
            <>
              <Button variant="outline" onClick={closeResetPasswordModal}>
                Cancel
              </Button>
              <Button
                variant="primary"
                icon={<Lock className="w-4 h-4" />}
                loading={isResettingPassword}
                disabled={!newPassword.trim() || newPassword.length < 6}
                onClick={handleResetPassword}
              >
                Reset Password
              </Button>
            </>
          )
        }
      >
        {resetPasswordStudent && (
          <div className="space-y-5">
            {/* Student info */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Student</p>
              <p className="mt-1 text-base font-bold text-slate-800">
                {resetPasswordStudent.firstName} {resetPasswordStudent.lastName}
              </p>
              <p className="mt-0.5 font-mono text-sm text-slate-600">{resetPasswordStudent.uid}</p>
            </div>

            {passwordResetSuccess ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 mt-0.5 shrink-0" />
                  <div className="flex-1">
                    <p className="font-semibold text-emerald-800">Password reset successfully!</p>
                    <p className="mt-1 text-sm text-emerald-700">
                      Share the new password with the student securely.
                    </p>
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-white border border-emerald-200 px-3 py-2">
                      <p className="font-mono font-semibold text-slate-800 flex-1">{newPassword}</p>
                      <button
                        onClick={handleCopyPassword}
                        className="p-1.5 rounded-lg hover:bg-emerald-100 transition-colors"
                        title="Copy password"
                      >
                        {copiedPassword ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* New password input */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">
                    New Password
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password (min 6 chars)"
                        className="w-full rounded-xl border-slate-200 bg-slate-50 pr-10 focus:border-primary focus:ring-primary font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => setNewPassword(generateRandomPassword())}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                      title="Generate random password"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                  {newPassword && newPassword.length < 6 && (
                    <p className="mt-1.5 text-xs text-rose-500">Password must be at least 6 characters</p>
                  )}
                </div>

                {/* Copy button */}
                {newPassword && newPassword.length >= 6 && (
                  <button
                    onClick={handleCopyPassword}
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    {copiedPassword ? (
                      <>
                        <Check className="w-4 h-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy password to clipboard
                      </>
                    )}
                  </button>
                )}

                <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                    <p className="text-xs text-amber-700">
                      This will immediately change the student's password. Make sure to share the new password with the student securely.
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PortalAccessPage;
