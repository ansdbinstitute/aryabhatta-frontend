import React, { useEffect, useMemo, useState } from 'react';
import useAuthStore from '../../stores/authStore';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { User, Mail, Shield, Key, LogOut, Camera, CheckCircle, Phone } from 'lucide-react';
import { getMediaUrl, JPEG_MIME_TYPES, validateUploadFile } from '../../utils/helpers';

const UserProfilePage = () => {
  const {
    user,
    logout,
    updateProfile,
    uploadProfileImage,
    changeMyPassword,
  } = useAuthStore();

  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    password: '',
    confirmPassword: '',
  });
  const [previewImage, setPreviewImage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    setProfileForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      phone: user?.phone || '',
    });
    setPreviewImage(getMediaUrl(user?.profileImage));
  }, [user]);

  const fullName = useMemo(() => {
    const name = [profileForm.firstName, profileForm.lastName].filter(Boolean).join(' ');
    return name || user?.username || 'User';
  }, [profileForm.firstName, profileForm.lastName, user?.username]);

  const handleProfileChange = (field, value) => {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setErrorMessage('');

    const validationError = validateUploadFile(file, {
      allowedTypes: JPEG_MIME_TYPES,
      label: 'Profile image',
      allowedLabel: 'a JPEG image',
    });
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result);
    reader.readAsDataURL(file);
  };

  const flashMessage = (setter, message) => {
    setter(message);
    window.setTimeout(() => setter(''), 3000);
  };

  const handleSaveProfile = async () => {
    setProfileSaving(true);
    setErrorMessage('');

    try {
      let profileImageId = user?.profileImage?.id;

      if (selectedFile) {
        const uploadResult = await uploadProfileImage(selectedFile);
        if (!uploadResult.success) {
          throw new Error(uploadResult.error || 'Failed to upload profile image');
        }
        profileImageId = uploadResult.fileId;
      }

      const result = await updateProfile({
        ...profileForm,
        profileImage: profileImageId,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile');
      }

      setSelectedFile(null);
      flashMessage(setSuccessMessage, 'Profile updated successfully.');
    } catch (error) {
      flashMessage(setErrorMessage, error.message || 'Failed to save profile');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleSavePassword = async () => {
    setPasswordSaving(true);
    setErrorMessage('');

    if (!passwordForm.password || !passwordForm.confirmPassword) {
      flashMessage(setErrorMessage, 'Please fill in both password fields.');
      setPasswordSaving(false);
      return;
    }

    const result = await changeMyPassword(passwordForm.password, passwordForm.confirmPassword);
    if (!result.success) {
      flashMessage(setErrorMessage, result.error || 'Failed to update password');
      setPasswordSaving(false);
      return;
    }

    setPasswordForm({ password: '', confirmPassword: '' });
    flashMessage(setSuccessMessage, 'Password updated successfully.');
    setPasswordSaving(false);
  };

  return (
    <div className="max-w-5xl mx-auto pb-12 px-4">
      <PageHeader
        title="Profile Settings"
        subtitle="Manage your account identity, avatar, and password directly from the ERP."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-28 h-28 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-black text-indigo-600 border-4 border-indigo-50 overflow-hidden">
                {previewImage ? (
                  <img src={previewImage} alt={fullName} className="w-full h-full object-cover" />
                ) : (
                  user?.username?.[0]?.toUpperCase()
                )}
              </div>
              <label className="absolute bottom-0 right-0 p-2 bg-slate-900 text-white rounded-full shadow-lg hover:scale-110 transition-all border-2 border-white cursor-pointer">
                <Camera className="w-3.5 h-3.5" />
                <input type="file" className="hidden" accept=".jpg,.jpeg,image/jpeg" onChange={handlePhotoChange} />
              </label>
            </div>

            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{fullName}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              {user?.role?.name || 'Academic User'}
            </p>
            <p className="mt-2 text-sm text-slate-500">@{user?.username}</p>

            <div className="mt-8 pt-6 border-t border-slate-50">
              <button
                onClick={logout}
                className="flex items-center justify-center gap-2 w-full py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Terminate Session
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-3xl p-8 text-white">
            <Shield className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="font-black text-lg mb-2">Access Level</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Your account is secured with role-based access. Institute admins can also reset passwords for ERP users from User Accounts.
            </p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          {(successMessage || errorMessage) && (
            <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${successMessage ? 'border-emerald-100 bg-emerald-50 text-emerald-700' : 'border-red-100 bg-red-50 text-red-700'}`}>
              {successMessage || errorMessage}
            </div>
          )}

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <h3 className="font-black text-slate-800 flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                PERSONAL IDENTITY
              </h3>
              {successMessage && (
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Updated
                </div>
              )}
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input label="First Name" value={profileForm.firstName} onChange={(e) => handleProfileChange('firstName', e.target.value)} />
                <Input label="Last Name" value={profileForm.lastName} onChange={(e) => handleProfileChange('lastName', e.target.value)} />
                <Input label="Username / Identifier" value={user?.username || ''} readOnly />
                <Input label="Email Address" type="email" value={profileForm.email} onChange={(e) => handleProfileChange('email', e.target.value)} icon="mail" />
                <div className="md:col-span-2">
                  <Input label="Phone Number" value={profileForm.phone} onChange={(e) => handleProfileChange('phone', e.target.value)} icon="phone" />
                </div>
              </div>

              <div className="pt-6 flex justify-end">
                <Button onClick={handleSaveProfile} loading={profileSaving} icon="save" className="px-10">
                  Save Profile
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 font-black text-slate-800 flex items-center gap-2 uppercase tracking-wide">
              <Key className="w-5 h-5 text-indigo-500" />
              Security & Password
            </div>

            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="New Password"
                  type="password"
                  value={passwordForm.password}
                  onChange={(e) => handlePasswordChange('password', e.target.value)}
                  placeholder="Minimum 6 characters"
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                  placeholder="Repeat new password"
                />
              </div>

              <div className="pt-6 flex justify-end">
                <Button onClick={handleSavePassword} loading={passwordSaving} icon="save" className="px-10">
                  Commit Updates
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
