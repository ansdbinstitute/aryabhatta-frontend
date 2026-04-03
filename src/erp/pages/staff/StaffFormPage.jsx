import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useStaffStore from '../../stores/staffStore';
import useUserStore from '../../stores/userStore';
import useBranchStore from '../../stores/branchStore';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import useToast from '../../hooks/useToast';
import { Phone, Briefcase, MapPin, CreditCard, Camera, Upload, CheckCircle } from 'lucide-react';
import { getMediaUrl, JPEG_MIME_TYPES, validateUploadFile } from '../../utils/helpers';

const StaffFormPage = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();
    const toast = useToast();
    const { currentStaff, fetchStaffById, createStaff, updateStaff, uploadProfileImage, isLoading } = useStaffStore();
    const { users, fetchUsers } = useUserStore();
    const { branches, fetchBranches } = useBranchStore();

    const [photoPreview, setPhotoPreview] = useState(null);
    const [photoFile, setPhotoFile] = useState(null);
    const [photoError, setPhotoError] = useState(null);

    const { register, handleSubmit, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            workLocation: 'parent',
            gender: 'male',
        }
    });

    const workLocation = watch('workLocation');

    useEffect(() => {
        fetchUsers();
        fetchBranches();
        if (isEdit) {
            fetchStaffById(id);
        }
    }, [id, isEdit]);

    useEffect(() => {
        if (isEdit && currentStaff) {
            reset({
                ...currentStaff,
                dob: currentStaff.dob ? currentStaff.dob.split('T')[0] : '',
                joiningDate: currentStaff.joiningDate ? currentStaff.joiningDate.split('T')[0] : '',
                user: currentStaff.user?.id || '',
            });
            if (currentStaff.profileImage) {
                setPhotoPreview(getMediaUrl(currentStaff.profileImage));
            }
        }
    }, [isEdit, currentStaff, reset]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validationError = validateUploadFile(file, {
                allowedTypes: JPEG_MIME_TYPES,
                label: 'Staff photo',
                allowedLabel: 'a JPEG image',
            });
            if (validationError) {
                setPhotoError(validationError);
                return;
            }
            setPhotoError(null);
            setPhotoFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setPhotoPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        // Media relations in Strapi v5 often still require the integer ID for the local junction tables
        let profileImageId = currentStaff?.profileImage?.integerId || null;

        if (photoFile) {
            const uploadRes = await uploadProfileImage(photoFile);
            if (uploadRes.success) profileImageId = uploadRes.fileId;
        }

        const payload = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email?.trim(),
            phone: data.phone,
            jobTitle: data.jobTitle,
            department: data.department,
            joiningDate: data.joiningDate,
            experience: data.experience,
            dob: data.dob,
            gender: data.gender,
            aadharNumber: data.aadharNumber,
            panNumber: data.panNumber,
            salaryBase: data.salaryBase ? Number(data.salaryBase) : null,
            bankName: data.bankName,
            accountNumber: data.accountNumber,
            ifscCode: data.ifscCode,
            // Media fields in Strapi expect the ID directly (can be documentId string or integer)
            profileImage: profileImageId || null,
            // Relation fields in Strapi v5 expect { id: ... } 
            user: data.user ? { id: Number(data.user) } : null,
            workLocation: data.workLocation ? { id: Number(data.workLocation) } : null,
        };

        const res = isEdit ? await updateStaff(id, payload) : await createStaff(payload);

        if (res.success) {
            toast.success(`Staff record ${isEdit ? 'updated' : 'created'} successfully.`);
            navigate(`/erp/staff/${res.data.id}`);
        } else {
            toast.error(res.error || 'Operation failed.');
        }
    };

    return (
        <div className="max-w-5xl mx-auto pb-20">
            <PageHeader 
                title={isEdit ? 'Update Staff Credentials' : 'Enroll New Institution Staff'}
                subtitle="Capture complete personal, professional, and financial records for personnel management."
            />

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Photo & Identity Header */}
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
                    <div className="relative group">
                        <div className="w-40 h-40 rounded-[2.5rem] bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-indigo-400 group-hover:bg-white shadow-inner">
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <div className="text-center">
                                    <Camera className="w-10 h-10 text-slate-300 mx-auto" />
                                    <p className="text-[10px] font-black text-slate-400 uppercase mt-2 tracking-widest">Digital ID</p>
                                </div>
                            )}
                        </div>
                        <label className="absolute -bottom-2 -right-2 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl cursor-pointer hover:bg-slate-900 transition-all active:scale-95">
                            <Upload className="w-5 h-5" />
                            <input type="file" className="hidden" accept=".jpg,.jpeg,image/jpeg" onChange={handlePhotoChange} />
                        </label>
                    </div>
                    {photoError && (
                        <p className="text-sm font-medium text-red-500 md:col-span-2">{photoError}</p>
                    )}

                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                        <Input label="First Name" {...register('firstName', { required: true })} placeholder="e.g. Rahul" />
                        <Input label="Last Name" {...register('lastName', { required: true })} placeholder="e.g. Sharma" />
                        <Input label="Professional Email" {...register('email', { required: true })} type="email" placeholder="rahul@ansdb.org" />
                        <Input label="Primary Phone" {...register('phone', { required: true })} placeholder="+91 98XXX-XXXXX" />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Professional Section */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                            <Briefcase className="w-5 h-5 text-indigo-600" /> Professional Deployment
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Job Title / Designation" {...register('jobTitle')} placeholder="e.g. Senior Lecturer" />
                            <Input label="Department" {...register('department')} placeholder="e.g. Computer Science" />
                            <Input label="Joining Date" type="date" {...register('joiningDate')} />
                            <Input label="Experience (Years)" {...register('experience')} placeholder="e.g. 5+ Years" />
                            <div className="md:col-span-2">
                                <Select 
                                    label="Linked ERP User Account" 
                                    options={users
                                        .filter(u => {
                                            // Show if not a student AND (not linked to anyone OR linked to this current staff)
                                            const isNotStudent = u.roleType !== 'student' && u.role?.type !== 'student';
                                            const isAvailable = !u.staff || (isEdit && (u.staff.id === Number(id) || u.staff.documentId === id));
                                            return isNotStudent && isAvailable;
                                        })
                                        .map(u => ({ 
                                            value: u.id, 
                                            label: `${u.username} (${u.role?.name || 'No Role'})${u.staff ? ' - Currently Linked' : ''}` 
                                        }))
                                    }
                                    {...register('user')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Logistics & Location Section */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                            <MapPin className="w-5 h-5 text-indigo-600" /> Organizational Deployment
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <Select 
                                    label="Assigned Institutional Branch" 
                                    options={branches.map(b => ({ value: b.id, label: b.name }))}
                                    {...register('workLocation', { required: 'Branch assignment is mandatory' })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Identity & Compliance Section */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                            <CheckCircle className="w-5 h-5 text-indigo-600" /> Personal Identity
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Date of Birth" type="date" {...register('dob')} />
                            <Select 
                                label="Gender" 
                                options={[{ value: 'male', label: 'Male' }, { value: 'female', label: 'Female' }, { value: 'other', label: 'Other' }]}
                                {...register('gender')}
                            />
                            <Input label="Aadhar Card Number" {...register('aadharNumber')} placeholder="12-digit numeric identifier" />
                            <Input label="PAN Card Number" {...register('panNumber')} placeholder="Alpha-numeric business ID" />
                        </div>
                    </div>

                    {/* Financial Section */}
                    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6 border-indigo-100">
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 uppercase tracking-tight">
                                <CreditCard className="w-5 h-5 text-emerald-600" /> Payroll & Financials
                            </h3>
                            <div className="px-2 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-black rounded border border-emerald-100 uppercase tracking-widest">Secure Access</div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input label="Monthly Base Salary" type="number" {...register('salaryBase')} placeholder="e.g. 45000" />
                            <Input label="Bank Institution Name" {...register('bankName')} placeholder="e.g. HDFC Bank" />
                            <Input label="Account Number" {...register('accountNumber')} placeholder="000XXX-XXXX-XXXX" />
                            <Input label="IFSC / Branch Code" {...register('ifscCode')} placeholder="HDFC000XXXX" />
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-100 flex justify-end gap-4">
                    <Button variant="ghost" onClick={() => navigate('/erp/staff')} size="lg">Discard</Button>
                    <Button type="submit" size="lg" loading={isLoading} icon="save" className="px-12">
                        {isEdit ? 'Commit Credentials' : 'Enroll Professional Staff'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default StaffFormPage;
