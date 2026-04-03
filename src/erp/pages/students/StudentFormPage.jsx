import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useStudentStore from '../../stores/studentStore';
import useCourseStore from '../../stores/courseStore';
import useToast from '../../hooks/useToast';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Modal from '../../components/ui/Modal';
import LoadingScreen from '../../components/common/LoadingScreen';
import { Camera, X, Upload, User, Phone, GraduationCap, Copy, Check, IdCard } from 'lucide-react';
import { getMediaUrl, JPEG_MIME_TYPES, validateUploadFile } from '../../utils/helpers';

const StudentFormPage = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const toast = useToast();

  const { currentStudent, fetchStudentById, createStudent, updateStudent, isLoading } = useStudentStore();
  const { courses, batches, fetchCourses, fetchBatches } = useCourseStore();

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      status: 'active',
      gender: 'male',
    }
  });
  const [photoPreview, setPhotoPreview] = React.useState(null);
  const [photoFile, setPhotoFile] = React.useState(null);
  const [photoError, setPhotoError] = React.useState(null);
  const [showUidModal, setShowUidModal] = React.useState(false);
  const [savedStudentUid, setSavedStudentUid] = React.useState('');
  const [savedStudentId, setSavedStudentId] = React.useState(null);
  const [copied, setCopied] = React.useState(false);

  const selectedCourseId = watch('course');

  // Initial Load
  useEffect(() => {
    fetchCourses();
    fetchBatches({ 'pagination[pageSize]': 100 }); // load all batches
    if (isEdit) {
      fetchStudentById(id);
    }
  }, [id, isEdit]);

  // Populate form when editing
  useEffect(() => {
    if (isEdit && currentStudent) {
      reset({
        firstName: currentStudent.firstName || '',
        lastName: currentStudent.lastName || '',
        fatherName: currentStudent.fatherName || '',
        motherName: currentStudent.motherName || '',
        dob: currentStudent.dob ? currentStudent.dob.split('T')[0] : '',
        gender: currentStudent.gender || 'male',
        email: currentStudent.email || '',
        phone: currentStudent.phone || '',
        altPhone: currentStudent.altPhone || '',
        aadharNumber: currentStudent.aadharNumber || '',
        address: currentStudent.address || '',
        enrollmentDate: currentStudent.enrollmentDate ? currentStudent.enrollmentDate.split('T')[0] : '',
        course: currentStudent.course?.documentId || currentStudent.course?.id || '',
        batch: currentStudent.batch?.id || '',
        status: currentStudent.status || 'active',
      });
      if (currentStudent.profileImage) {
        setPhotoPreview(getMediaUrl(currentStudent.profileImage));
      }
    }
  }, [isEdit, currentStudent, reset]);

  const handlePhotoChange = (e) => {
    setPhotoError(null);
    const file = e.target.files[0];
    if (file) {
      const validationError = validateUploadFile(file, {
        allowedTypes: JPEG_MIME_TYPES,
        label: 'Student photo',
        allowedLabel: 'a JPEG image',
      });
      if (validationError) {
        setPhotoError(validationError);
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoError(null);
  };

  const onSubmit = async (data) => {
    // Strapi relations format
    let profileImageId = currentStudent?.profileImage?.id || null;

    if (photoFile) {
        const uploadRes = await useStudentStore.getState().uploadProfileImage(photoFile);
        if (uploadRes.success) {
            profileImageId = uploadRes.fileId;
        } else {
            toast.error("Failed to upload photo. " + uploadRes.error);
            return;
        }
    }

    const payload = {
      ...data,
      course: data.course ? { documentId: data.course } : null,
      batch: data.batch ? { documentId: data.batch } : null,
      totalFee: data.totalFee ? Number(data.totalFee) : 0,
      profileImage: profileImageId ? { id: profileImageId } : null,
    };

    // Remove empty strings for optional fields to avoid validation errors
    Object.keys(payload).forEach(key => {
      if (payload[key] === '') payload[key] = null;
    });

    const res = isEdit
      ? await updateStudent(id, payload)
      : await createStudent(payload);

    if (res.success) {
      if (!isEdit) {
        setSavedStudentUid(res.data.uid || res.data.id);
        setSavedStudentId(res.data.id);
        setShowUidModal(true);
      } else {
        toast.success(`Student updated successfully!`);
        navigate(`/erp/students/${res.data.id}`);
      }
    } else {
      toast.error(res.error || 'Failed to save student.');
    }
  };

  const handleCopyUid = () => {
    navigator.clipboard.writeText(savedStudentUid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseUidModal = () => {
    setShowUidModal(false);
    navigate(`/erp/students/${savedStudentId}`);
  };

  if (isLoading && isEdit && !currentStudent) return <LoadingScreen />;

  // Filter batches by selected course
  // Support both documentId (strings) and legacy integer IDs for maximum robustness
  const filteredBatches = batches.filter(b => {
    if (!selectedCourseId) return false;
    
    const batchCourse = b.course;
    if (!batchCourse) return false;

    // Handle case where course is an object (typical Strapi population)
    if (typeof batchCourse === 'object') {
      return (
        batchCourse.documentId === selectedCourseId || 
        String(batchCourse.id) === String(selectedCourseId)
      );
    }

    // Handle case where course is just an ID (not populated)
    return String(batchCourse) === String(selectedCourseId);
  });

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader
        title={isEdit ? 'Edit Student Profile' : 'New Enrollment Form'}
        subtitle={isEdit ? 'Update student details.' : 'Register a new student. UID will be auto-generated.'}
        actions={
          <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Photo Upload Section */}
        <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center">
            <div className="relative group">
                <div className="w-32 h-32 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400">
                    {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                        <div className="text-center">
                            <Camera className="w-8 h-8 text-slate-300 mx-auto" />
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">No Photo</p>
                        </div>
                    )}
                </div>
                
                <label className="absolute -bottom-2 -right-2 p-2 bg-indigo-600 text-white rounded-xl shadow-lg cursor-pointer hover:bg-indigo-700 transition-all active:scale-90">
                    <Upload className="w-4 h-4" />
                    <input type="file" className="hidden" accept=".jpg,.jpeg,image/jpeg" onChange={handlePhotoChange} />
                </label>

                {photoPreview && (
                    <button 
                        type="button"
                        onClick={removePhoto}
                        className="absolute -top-2 -right-2 p-1 bg-rose-500 text-white rounded-lg shadow-md hover:bg-rose-600 transition-all"
                    >
                        <X className="w-3 h-3" />
                    </button>
                )}
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">Passport Size Photo Recommended (JPEG, max 10MB)</p>
            {photoError && (
              <p className="text-xs text-red-500 mt-2">{photoError}</p>
            )}
        </div>

        {/* Personal Details */}
        <div className="bg-white p-6 rounded-xl border border-erp-border shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            Personal Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="First Name"
              {...register('firstName', { required: 'First name is required' })}
              error={errors.firstName?.message}
              required
            />
            <Input
              label="Last Name"
              {...register('lastName', { required: 'Last name is required' })}
              error={errors.lastName?.message}
              required
            />
            <Input
              label="Father's Name"
              {...register('fatherName')}
            />
            <Input
              label="Mother's Name"
              {...register('motherName')}
            />
            <Input
              type="date"
              label="Date of Birth"
              {...register('dob', { required: 'DOB is required' })}
              error={errors.dob?.message}
              required
            />
            <Select
              label="Gender"
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
              ]}
              {...register('gender', { required: 'Gender is required' })}
              error={errors.gender?.message}
              required
            />
          </div>
        </div>

        {/* Contact Details */}
        <div className="bg-white p-6 rounded-xl border border-erp-border shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Phone className="w-5 h-5 text-primary" />
            Contact & ID
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Input
              label="Primary Phone"
              {...register('phone', {
                required: 'Phone is required',
                pattern: { value: /^[6-9]\d{9}$/, message: 'Invalid Indian phone number' }
              })}
              error={errors.phone?.message}
              required
            />
            <Input
              label="Alternative Phone"
              {...register('altPhone')}
            />
            <Input
              label="Email Address"
              type="email"
              {...register('email', {
                pattern: { value: /.+@.+\..+/, message: 'Invalid email' }
              })}
              error={errors.email?.message}
            />
            <Input
              label="Aadhar Number"
              {...register('aadharNumber', {
                pattern: { value: /^\d{12}$/, message: 'Aadhar must be 12 digits' }
              })}
              error={errors.aadharNumber?.message}
            />
            <div className="md:col-span-2">
              <Input
                label="Full Address"
                {...register('address', { required: 'Address is required' })}
                error={errors.address?.message}
                required
              />
            </div>
          </div>
        </div>

        {/* Academic Details */}
        <div className="bg-white p-6 rounded-xl border border-erp-border shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-primary" />
            Academic Assignment
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Select
              label="Course"
              options={courses.map(c => ({ value: c.documentId || c.id, label: c.title }))}
              {...register('course', { required: 'Course is required' })}
              error={errors.course?.message}
              required
            />
            <Select
              label="Batch"
              options={filteredBatches.map(b => ({ value: b.id, label: b.name }))}
              {...register('batch', { required: 'Batch is required' })}
              error={errors.batch?.message}
              required
              disabled={!selectedCourseId}
            />
            <Input
              type="date"
              label="Enrollment Date"
              {...register('enrollmentDate', { required: 'Enrollment date is required' })}
              error={errors.enrollmentDate?.message}
              required
            />
            <Select
              label="Status"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'completed', label: 'Completed' },
                { value: 'dropped', label: 'Dropped' },
                { value: 'suspended', label: 'Suspended' },
              ]}
              {...register('status', { required: 'Status is required' })}
              error={errors.status?.message}
              required
            />
            <Input
              label="Total Fee (₹)"
              type="number"
              {...register('totalFee')}
              placeholder="Enter total course fee"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button variant="ghost" onClick={() => navigate('/erp/students')} disabled={isLoading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={isLoading} icon="save">
            {isEdit ? 'Update Student' : 'Enroll Student'}
          </Button>
        </div>
      </form>

      {/* UID Popup Modal */}
      <Modal
        isOpen={showUidModal}
        onClose={handleCloseUidModal}
        title="Student Enrolled Successfully!"
        size="md"
      >
        <div className="text-center py-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <IdCard className="w-10 h-10 text-green-600" />
          </div>
          <p className="text-slate-600 mb-4">Your student has been enrolled successfully. Please save this UID:</p>
          
          <div className="bg-slate-100 rounded-xl p-4 mb-6">
            <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Student UID</p>
            <p className="text-2xl font-bold text-primary">{savedStudentUid}</p>
          </div>
          
          <p className="text-sm text-slate-500 mb-6">You can find this UID in the student's profile page.</p>
          
          <div className="flex gap-3 justify-center">
            <Button
              variant="outline"
              icon={copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              onClick={handleCopyUid}
            >
              {copied ? 'Copied!' : 'Copy UID'}
            </Button>
            <Button variant="primary" onClick={handleCloseUidModal}>
              Continue to Profile
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StudentFormPage;
