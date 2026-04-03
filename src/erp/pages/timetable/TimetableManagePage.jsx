import React, { useEffect, useState } from 'react';
import useTimetableStore, { DAYS } from '../../stores/timetableStore';
import useCourseStore from '../../stores/courseStore';
import useUserStore from '../../stores/userStore';
import PageHeader from '../../components/common/PageHeader';
import { Calendar, Plus, Trash2, Clock, User, BookOpen, AlertCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';

const TimetableManagePage = () => {
    const { entries, fetchTimetable, createEntry, deleteEntry, isLoading } = useTimetableStore();
    const { batches, fetchBatches } = useCourseStore();
    const { users, fetchUsers } = useUserStore();

    const [selectedBatch, setSelectedBatch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register, handleSubmit, reset } = useForm();

    useEffect(() => {
        fetchBatches();
        fetchUsers();
    }, []);

    useEffect(() => {
        if (selectedBatch) {
            fetchTimetable({ batch: selectedBatch });
        }
    }, [selectedBatch]);

    const onSubmit = async (data) => {
        const payload = {
            ...data,
            batch: selectedBatch,
            course: batches.find(b => b.documentId === selectedBatch)?.course?.documentId
        };
        const res = await createEntry(payload);
        if (res.success) {
            setIsModalOpen(false);
            reset();
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Delete this timetable entry?')) {
            deleteEntry(id, selectedBatch);
        }
    };

    const teachers = users.filter(u => u.role?.type === 'Teacher');

    return (
        <div className="max-w-7xl mx-auto pb-12 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <PageHeader 
                    title="Institutional Timetable" 
                    subtitle="Orchestrate weekly lecture schedules and faculty assignments." 
                />
                <button 
                    disabled={!selectedBatch}
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
                >
                    <Plus className="w-5 h-5" />
                    New Slot
                </button>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm mb-8 flex flex-wrap gap-4 items-center">
                 <div className="flex items-center gap-2 text-slate-500 mr-2">
                    <Calendar className="w-5 h-5" />
                    <span className="font-bold text-sm tracking-tight uppercase">Select Departmental Batch:</span>
                </div>
                <select 
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-indigo-500 transition-all min-w-[300px]"
                >
                    <option value="">Choose Batch Profile...</option>
                    {batches.map(b => <option key={b.documentId} value={b.documentId}>{b.name} ({b.course?.title})</option>)}
                </select>
            </div>

            {!selectedBatch ? (
                <div className="bg-white border text-center border-slate-200 border-dashed rounded-3xl p-20 flex flex-col items-center">
                     <Calendar className="w-16 h-16 text-slate-100 mb-4" />
                     <h3 className="text-xl font-bold text-slate-400">No Batch Selected</h3>
                     <p className="text-sm text-slate-300 max-w-xs mt-2">Select a batch from the dropdown above to manage its weekly academic cycle.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-7 gap-4">
                    {DAYS.map(day => {
                        const dayEntries = entries.filter(e => e.dayOfWeek === day);
                        return (
                            <div key={day} className="flex flex-col gap-3 min-w-[200px]">
                                <div className="p-3 bg-slate-900 rounded-xl text-center shadow-lg transform hover:-translate-y-1 transition-transform cursor-default">
                                    <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{day}</h4>
                                </div>

                                <div className="space-y-3">
                                    {dayEntries.length === 0 ? (
                                        <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center flex flex-col items-center justify-center min-h-[100px]">
                                             <div className="w-1 h-1 bg-slate-200 rounded-full mb-1"></div>
                                             <p className="text-[10px] font-bold text-slate-200 uppercase tracking-widest">No Class</p>
                                        </div>
                                    ) : dayEntries.map(entry => (
                                        <div key={entry.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all group relative">
                                            <button 
                                                onClick={() => handleDelete(entry.documentId)}
                                                className="absolute top-2 right-2 text-slate-200 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>

                                            <div className="flex items-center gap-1.5 text-indigo-600 font-bold text-[10px] mb-2 uppercase tracking-tight">
                                                <Clock className="w-3 h-3" />
                                                {entry.startTime} - {entry.endTime}
                                            </div>

                                            <h5 className="font-bold text-slate-800 text-xs mb-1 line-clamp-1">{entry.subject}</h5>
                                            
                                            <div className="flex items-center gap-2 mt-3 p-2 bg-slate-50 rounded-lg">
                                                 <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600">
                                                     {entry.teacher?.username?.[0].toUpperCase() || 'T'}
                                                 </div>
                                                 <p className="text-[10px] font-bold text-slate-500 line-clamp-1">
                                                     {entry.teacher?.username || 'Guest Faculty'}
                                                 </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md transition-all animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
                        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                            <div>
                                <h1 className="text-2xl font-black text-slate-800 tracking-tight">ADD LECTURE SLOT</h1>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Configure Academic Time-slot</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                                <Plus className="w-8 h-8 rotate-45" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Lecture Subject Name</label>
                                    <input 
                                        {...register('subject', { required: true })}
                                        type="text" 
                                        placeholder="Discrete Mathematics / Advance Java..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all shadow-inner"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Day of Week</label>
                                    <select 
                                        {...register('dayOfWeek', { required: true })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all font-mono"
                                    >
                                        {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Assigned Faculty</label>
                                    <select 
                                        {...register('teacher', { required: true })}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
                                    >
                                        <option value="">Guest Faculty</option>
                                        {teachers.map(t => <option key={t.id} value={t.id}>{t.username}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Start Time</label>
                                    <input 
                                        {...register('startTime', { required: true })}
                                        type="time" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">End Time</label>
                                    <input 
                                        {...register('endTime', { required: true })}
                                        type="time" 
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-600 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 flex gap-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-6 py-3 font-bold text-slate-400 hover:text-slate-600 transition-colors">Abort</button>
                                <button type="submit" className="flex-2 px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm rounded-xl shadow-xl shadow-indigo-100 transform active:scale-95 transition-all">COMMIT TO WEEKLY CYCLE</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimetableManagePage;
