import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useStaffStore from '../../stores/staffStore';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { StatusBadge } from '../../components/ui/Badge';
import { Users, Search, Filter, Plus, User, Briefcase, MapPin, MoreHorizontal } from 'lucide-react';
import { getMediaUrl } from '../../utils/helpers';

const StaffListPage = () => {
    const navigate = useNavigate();
    const { staffs, isLoading, fetchStaffs, deleteStaff } = useStaffStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchStaffs();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this staff record?')) {
            await deleteStaff(id);
        }
    };

    const columns = [
        {
            key: 'name', label: 'Staff Member',
            render: (_, row) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-200">
                        {row.profileImage ? (
                            <img src={getMediaUrl(row.profileImage)} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-6 h-6 text-slate-300" />
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">{row.firstName} {row.lastName}</p>
                        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-tighter">{row.jobTitle || 'Unassigned Role'}</p>
                    </div>
                </div>
            )
        },
        {
            key: 'department', label: 'Department',
            render: (val) => {
                const departmentName = (val && typeof val === 'object') ? val.name : (val || 'General');
                return (
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                            <Briefcase className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-sm font-semibold text-slate-600">{departmentName}</span>
                    </div>
                );
            }
        },
        {
            key: 'workLocation', label: 'Campus',
            render: (val) => {
                const isBranch = val && typeof val === 'object';
                const displayName = isBranch ? val.name : 'Main Institute';
                
                return (
                    <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${isBranch ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-slate-600 capitalize">{displayName}</p>
                            {isBranch && val.address && (
                                <p className="text-[10px] text-slate-400 font-bold truncate max-w-[150px]">
                                    {val.address}
                                </p>
                            )}
                        </div>
                    </div>
                );
            }
        },
        {
            key: 'joiningDate', label: 'Seniority',
            render: (val) => <span className="text-sm font-bold text-slate-500">{val ? new Date(val).toLocaleDateString() : '—'}</span>
        },
        {
            key: 'actions', label: '', align: 'right',
            render: (_, row) => (
                <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        icon="visibility" 
                        onClick={() => navigate(`/erp/staff/${row.id}`)} 
                    />
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        icon="edit" 
                        onClick={() => navigate(`/erp/staff/${row.id}/edit`)} 
                    />
                </div>
            )
        }
    ];

    const filteredStaffs = (staffs || []).filter(s => 
        (s.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (s.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (s.jobTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto pb-12">
            <PageHeader
                title="Professional Staff Directory"
                subtitle="Manage institutional human capital across all departments and branch locations."
                actions={
                    <Button icon="add" onClick={() => navigate('/erp/staff/new')}>
                        Enroll Staff
                    </Button>
                }
            />

            <div className="mb-8 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                        type="search"
                        placeholder="Search by name, role or department..."
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all font-medium text-slate-700"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button className="px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:bg-slate-50 transition-colors font-bold text-slate-600 flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Filters
                    </button>
                    <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl shadow-xl hover:bg-black transition-colors font-bold flex items-center gap-2">
                        <Users className="w-5 h-5" />
                        Analytics
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-100/50 border border-slate-100 overflow-hidden overflow-x-auto">
                <DataTable
                    columns={columns}
                    data={filteredStaffs}
                    loading={isLoading}
                    onRowClick={(row) => navigate(`/erp/staff/${row.id}`)}
                    emptyMessage="No staff records identified. Start by enrolling a new faculty or admin member."
                />
            </div>
        </div>
    );
};

export default StaffListPage;
