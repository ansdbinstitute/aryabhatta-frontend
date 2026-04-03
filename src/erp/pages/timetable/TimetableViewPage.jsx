import React, { useEffect, useState } from 'react';
import useTimetableStore, { DAYS } from '../../stores/timetableStore';
import PageHeader from '../../components/common/PageHeader';
import useCurrentStudent from '../../../student/hooks/useCurrentStudent';
import { Clock, User, BookOpen, Calendar, MapPin, Search } from 'lucide-react';

const TimetableViewPage = () => {
    const { entries, fetchTimetable, isLoading } = useTimetableStore();
    const { student } = useCurrentStudent();
    const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() - 1] || 'Monday');

    useEffect(() => {
        if (student?.batch?.id) {
            fetchTimetable({ batch: student.batch.id });
        }
    }, [student?.batch?.id, fetchTimetable]);

    const activeEntries = entries.filter(e => e.dayOfWeek === selectedDay);

    return (
        <div className="max-w-6xl mx-auto pb-12 px-4">
            <PageHeader 
                title="My Academic Schedule" 
                subtitle={`Weekly timetable for ${student?.batch?.name || 'Assigned Batch'}. Maintain 75% attendance for exam eligibility.`} 
            />

            <div className="flex overflow-x-auto gap-3 py-4 mb-8 no-scrollbar scroll-smooth">
                {DAYS.map(day => (
                    <button
                        key={day}
                        onClick={() => setSelectedDay(day)}
                        className={`flex-shrink-0 px-6 py-3 rounded-2xl font-black text-sm transition-all shadow-sm
                            ${selectedDay === day 
                                ? 'bg-indigo-600 text-white shadow-indigo-200' 
                                : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'}
                        `}
                    >
                        {day.toUpperCase()}
                    </button>
                ))}
            </div>

            <div className="space-y-4">
                {isLoading ? (
                    <div className="p-12 text-center text-slate-400">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                    </div>
                ) : activeEntries.length === 0 ? (
                    <div className="bg-white border text-center border-slate-100 rounded-3xl p-20 shadow-sm border-dashed">
                        <BookOpen className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-slate-400">Rest Day / Holistic Learning</h4>
                        <p className="text-sm text-slate-300 mt-2">No formal lectures scheduled for {selectedDay} in your current academic cycle.</p>
                    </div>
                ) : activeEntries.map((entry, idx) => (
                    <div key={entry.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col md:flex-row group">
                        <div className="md:w-48 bg-slate-50 flex flex-col items-center justify-center p-6 border-b md:border-b-0 md:border-r border-slate-100 group-hover:bg-indigo-50 transition-colors">
                            <Clock className="w-6 h-6 text-indigo-300 mb-2 group-hover:text-indigo-600 group-hover:scale-110 transition-all font-black" />
                            <p className="text-lg font-black text-slate-800 leading-none">{entry.startTime}</p>
                            <div className="h-4 w-px bg-slate-200 my-1"></div>
                            <p className="text-sm font-bold text-slate-400">{entry.endTime}</p>
                        </div>

                        <div className="flex-grow p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex-grow">
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-black rounded-full uppercase tracking-widest mb-3 inline-block">
                                    CORE SUBJECT {idx + 1}
                                </span>
                                <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight leading-none mb-4">{entry.subject}</h1>
                                
                                <div className="flex flex-wrap gap-6 text-sm font-bold text-slate-400 tracking-tight">
                                    <div className="flex items-center gap-2">
                                        <User className="w-4 h-4 text-indigo-400" />
                                        <span>Faculty: <span className="text-slate-600">{entry.teacher?.username || 'Guest Lecturer'}</span></span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-rose-400" />
                                        <span>Room: Main Laboratory A</span>
                                    </div>
                                </div>
                            </div>

                            <div className="shrink-0 flex items-center md:justify-center">
                                <button className="px-8 py-3 bg-slate-900 text-white font-black text-xs rounded-2xl hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-95 uppercase tracking-widest">
                                    View Syllabus
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="mt-12 bg-indigo-50 border border-indigo-100 rounded-3xl p-8 flex gap-6 items-center">
                 <div className="p-4 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-100">
                    <Search className="w-8 h-8 text-white" />
                 </div>
                 <div>
                    <h3 className="font-black text-indigo-900 text-xl">Global Attendance Threshold</h3>
                    <p className="text-indigo-700/60 font-bold text-sm">Please ensure you tap your biometric card at the gate before every lecture start time. Absence from more than 3 consecutive lectures triggers a guardian notification.</p>
                 </div>
            </div>
        </div>
    );
};

export default TimetableViewPage;
