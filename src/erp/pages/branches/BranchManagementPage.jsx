import React, { useEffect, useState } from 'react';
import useBranchStore from '../../stores/staffStore'; // Wait, I created branchStore.js
import useBranchStoreReal from '../../stores/branchStore';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { useForm } from 'react-hook-form';
import { MapPin, Plus, Edit2, Trash2, X, Building } from 'lucide-react';
import useToast from '../../hooks/useToast';

const BranchManagementPage = () => {
    const { branches, isLoading, fetchBranches, createBranch, updateBranch, deleteBranch } = useBranchStoreReal();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState(null);
    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const toast = useToast();

    useEffect(() => {
        fetchBranches();
    }, []);

    const handleOpenModal = (branch = null) => {
        setEditingBranch(branch);
        reset({
            name: branch?.name || '',
            address: branch?.address || '',
        });
        setIsModalOpen(true);
    };

    const onSubmit = async (data) => {
        const res = editingBranch 
            ? await updateBranch(editingBranch.id, data)
            : await createBranch(data);

        if (res.success) {
            toast.success(`Branch ${editingBranch ? 'updated' : 'created'} successfully.`);
            setIsModalOpen(false);
        } else {
            toast.error(res.error || 'Failed to save branch.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to decommission this branch? This will affect all staff assigned to it.')) {
            const res = await deleteBranch(id);
            if (res.success) toast.success('Branch removed.');
        }
    };

    const columns = [
        {
            key: 'name', label: 'Branch Name',
            render: (val) => (
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Building className="w-5 h-5 shadow-sm" />
                    </div>
                    <span className="font-black text-slate-800 uppercase tracking-tight">{val}</span>
                </div>
            )
        },
        {
            key: 'address', label: 'Location Address',
            render: (val) => <span className="text-sm font-semibold text-slate-500 max-w-xs block truncate">{val}</span>
        },
        {
            key: 'staffCount', label: 'Personnel',
            render: (_, row) => (
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200">
                        <span className="text-[10px] font-black text-slate-600">{(row.staffs?.length || 0)}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Staff</span>
                </div>
            )
        },
        {
            key: 'actions', label: '', align: 'right',
            render: (_, row) => (
                <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" icon="edit" onClick={() => handleOpenModal(row)} />
                    <Button variant="ghost" size="sm" icon="delete" onClick={() => handleDelete(row.id)} className="text-rose-600 hover:bg-rose-50" />
                </div>
            )
        }
    ];

    return (
        <div className="max-w-6xl mx-auto pb-12">
            <PageHeader 
                title="Campus Network"
                subtitle="Manage all branches and campuses across the organization."
                actions={
                    <Button icon="add" onClick={() => handleOpenModal()}>
                        Add Branch
                    </Button>
                }
            />

            <div className="mt-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-100/50 overflow-hidden">
                <DataTable 
                    columns={columns}
                    data={branches}
                    loading={isLoading}
                    emptyMessage="No institutional branches configured. Start by creating your first campus."
                />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md border border-slate-100 overflow-hidden">
                        <div className="flex justify-between items-center p-8 bg-slate-50/50 border-b border-slate-100">
                            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight flex items-center gap-3">
                                {editingBranch ? <Edit2 className="w-5 h-5 text-indigo-600" /> : <Plus className="w-5 h-5 text-indigo-600" />}
                                {editingBranch ? 'Update Campus' : 'Build Branch'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Branch Nomenclature</label>
                                    <div className="relative">
                                        <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                        <input 
                                            {...register('name', { required: true })}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700"
                                            placeholder="e.g. North Delhi Campus"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Geographic Address</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-4 w-4 h-4 text-slate-300" />
                                        <textarea 
                                            {...register('address', { required: true })}
                                            rows={3}
                                            className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 transition-all font-bold text-slate-700"
                                            placeholder="Full physical correspondence address..."
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Abort</Button>
                                <Button type="submit" loading={isLoading} className="flex-[2]" icon="save">
                                    {editingBranch ? 'Update Records' : 'Authorize Branch'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BranchManagementPage;
