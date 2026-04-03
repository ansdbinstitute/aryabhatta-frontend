import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStaffStore from '../../stores/staffStore';
import useAuthStore from '../../stores/authStore';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import LoadingScreen from '../../components/common/LoadingScreen';
import { User, Briefcase, CreditCard, Shield, MapPin, Calendar, Mail, Phone, Building, CheckCircle, ChevronRight, FileText } from 'lucide-react';
import { getMediaUrl } from '../../utils/helpers';

const StaffDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentStaff, fetchStaffById, isLoading } = useStaffStore();
    const { user, isInstituteAdmin } = useAuthStore();
    const [activeTab, setActiveTab] = useState('personal');

    useEffect(() => {
        fetchStaffById(id);
    }, [id]);

    if (isLoading || !currentStaff) return <LoadingScreen />;

    const canViewFinance = isInstituteAdmin() || (user?.branch?.id === currentStaff?.workLocation?.id);

    const tabs = [
        { id: 'personal', label: 'Identity & Profile', icon: User },
        { id: 'employment', label: 'Employment Details', icon: Briefcase },
        ...(canViewFinance ? [{ id: 'finance', label: 'Financial Records', icon: CreditCard }] : []),
    ];

    return (
        <div className="max-w-6xl mx-auto pb-20">
            <PageHeader 
                title={`${currentStaff.firstName} ${currentStaff.lastName}`}
                subtitle={`Institutional Staff Profile • ID: ${currentStaff.id}`}
                actions={
                    <div className="flex gap-3">
                        <Button variant="outline" icon="print">Print Record</Button>
                        <Button variant="primary" icon="edit" onClick={() => navigate(`/erp/staff/${id}/edit`)}>Modify Profile</Button>
                    </div>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
                {/* Sidebar Summary */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm text-center">
                        <div className="w-32 h-32 rounded-[2.5rem] bg-indigo-50 border-4 border-indigo-100 mx-auto overflow-hidden mb-6 shadow-xl">
                            {currentStaff.profileImage ? (
                                <img src={getMediaUrl(currentStaff.profileImage)} className="w-full h-full object-cover" />
                            ) : (
                                <User className="w-12 h-12 text-indigo-300 m-10" />
                            )}
                        </div>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{currentStaff.firstName} {currentStaff.lastName}</h2>
                        <p className="text-[11px] font-black text-indigo-600 bg-indigo-50 rounded-lg px-3 py-1 inline-block mt-2 uppercase tracking-widest">{currentStaff.jobTitle || 'Staff'}</p>
                        
                        <div className="mt-8 space-y-4 pt-6 border-t border-slate-50">
                            <div className="flex items-center gap-3 text-left">
                                <div className="p-2 bg-slate-900 text-white rounded-xl shadow-lg">
                                    <Shield className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Portal User</p>
                                    <p className="text-sm font-black text-slate-700">{currentStaff.user?.username || 'No Access'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-left">
                                <div className="p-2 bg-emerald-600 text-white rounded-xl shadow-lg">
                                    <MapPin className="w-4 h-4" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Base Branch</p>
                                    <p className="text-xs font-black text-slate-700 capitalize">{currentStaff.workLocation?.name || 'Parent Institute'}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[2rem] p-8 text-white relative overflow-hidden group">
                        <div className="relative z-10">
                            <h3 className="font-black text-lg mb-2">Service Period</h3>
                            <p className="text-slate-400 text-xs leading-relaxed mb-4">Member since {new Date(currentStaff.joiningDate).getFullYear() || 'N/A'}.</p>
                            <div className="text-3xl font-black text-indigo-400">Active</div>
                        </div>
                        <Briefcase className="absolute -bottom-6 -right-6 w-32 h-32 text-white/5 group-hover:rotate-12 transition-transform duration-500" />
                    </div>
                </div>

                {/* Main Content Areas */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Native Tabbed Navigation */}
                    <div className="flex bg-white p-2 rounded-2xl border border-slate-100 shadow-sm overflow-x-auto gap-1">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap
                                    ${activeTab === tab.id 
                                        ? 'bg-slate-900 text-white shadow-xl' 
                                        : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-indigo-400' : 'text-slate-400'}`} />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content Panels */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
                        {activeTab === 'personal' && (
                            <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-300">
                                <SectionHeader icon={CheckCircle} title="Civil Identity & Contact" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 mt-10">
                                    <DetailField icon={Mail} label="Professional Email" value={currentStaff.email} />
                                    <DetailField icon={Phone} label="Primary Phone" value={currentStaff.phone} />
                                    <DetailField icon={Calendar} label="Date of Birth" value={currentStaff.dob} isDate />
                                    <DetailField icon={User} label="Gender Identification" value={currentStaff.gender} capitalize />
                                    <DetailField icon={FileText} label="Aadhar ID" value={currentStaff.aadharNumber} />
                                    <DetailField icon={FileText} label="PAN Business ID" value={currentStaff.panNumber} />
                                    <div className="md:col-span-2">
                                        <DetailField icon={MapPin} label="Permanent Residential Address" value={currentStaff.address} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'employment' && (
                            <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-300">
                                <SectionHeader icon={Briefcase} title="Deployment & Allocation" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mt-10">
                                    <DetailField label="Departmental Assignment" value={currentStaff.department} />
                                    <DetailField label="Official Designation" value={currentStaff.jobTitle} />
                                    <DetailField label="Assigned Branch" value={currentStaff.workLocation?.name} />
                                    <DetailField label="Total Experience" value={currentStaff.experience} />
                                    
                                    {currentStaff.workLocation && (
                                        <>
                                            <div className="md:col-span-2 p-6 bg-slate-50 rounded-3xl border border-slate-100 border-dashed">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Branch Office Metadata</h4>
                                                <div className="space-y-4">
                                                    <DetailField label="Correspondance Address" value={currentStaff.workLocation?.address} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}

                        {activeTab === 'finance' && (
                            <div className="p-10 animate-in fade-in slide-in-from-right-4 duration-300">
                                <SectionHeader icon={CreditCard} title="Payroll Ecosystem" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-10 gap-x-12 mt-10">
                                    <div className="md:col-span-2 flex items-center justify-between p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Monthly Cost-to-Company (CTC)</p>
                                            <p className="text-4xl font-black text-emerald-800">₹{currentStaff.salaryBase?.toLocaleString() || '0'}</p>
                                        </div>
                                        <Button variant="accent">Generate Payslip</Button>
                                    </div>
                                    <DetailField icon={Building} label="Banking Institution" value={currentStaff.bankName} />
                                    <DetailField icon={CreditCard} label="Bank Account Number" value={currentStaff.accountNumber} />
                                    <DetailField icon={Shield} label="IFSC Code Identifier" value={currentStaff.ifscCode} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SectionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
        <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Icon className="w-5 h-5 shadow-sm" />
        </div>
        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{title}</h3>
    </div>
);

const DetailField = ({ icon: Icon, label, value, isDate, capitalize }) => (
    <div className="space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            {Icon && <Icon className="w-3 h-3 text-slate-300" />} {label}
        </p>
        <p className={`text-md font-black text-slate-700 ${capitalize ? 'capitalize' : ''}`}>
            {isDate ? (value ? new Date(value).toLocaleDateString() : '—') : (value || '—')}
        </p>
    </div>
);

export default StaffDetailPage;
