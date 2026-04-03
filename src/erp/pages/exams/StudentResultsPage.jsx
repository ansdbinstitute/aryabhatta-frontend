import React, { useEffect } from 'react';
import useExamStore from '../../stores/examStore';
import PageHeader from '../../components/common/PageHeader';
import useCurrentStudent from '../../../student/hooks/useCurrentStudent';
import { Award, BookOpen, Calendar, CheckCircle, AlertCircle, FileText, ChevronRight, TrendingUp } from 'lucide-react';

const StudentResultsPage = () => {
    const { results, fetchMyResults, isLoading } = useExamStore();
    const { student } = useCurrentStudent();

    useEffect(() => {
        if (student?.id) {
            fetchMyResults(student.id);
        }
    }, [student?.id, fetchMyResults]);

    // Simple grade calculator logic (standard for many ERPs)
    const getGrade = (marks, max) => {
        const pct = (marks / max) * 100;
        if (pct >= 90) return { l: 'A+', c: 'text-emerald-700 bg-emerald-50' };
        if (pct >= 80) return { l: 'A', c: 'text-emerald-600 bg-emerald-50' };
        if (pct >= 70) return { l: 'B+', c: 'text-indigo-600 bg-indigo-50' };
        if (pct >= 60) return { l: 'B', c: 'text-indigo-500 bg-indigo-50' };
        if (pct >= 50) return { l: 'C', c: 'text-amber-600 bg-amber-50' };
        return { l: 'F', c: 'text-rose-600 bg-rose-50' };
    };

    const overallAvg = results.length > 0
        ? (results.reduce((acc, r) => acc + (r.marksObtained / (r.exam?.maxMarks || 100)), 0) / results.length * 100).toFixed(1)
        : '0.0';

    return (
        <div className="max-w-6xl mx-auto pb-12 px-4">
            <PageHeader 
                title="My Academic Performance" 
                subtitle="Track your grades and faculty feedback across finalized assessments." 
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl mb-3">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Average Pct</p>
                    <p className="text-3xl font-black text-slate-800">{overallAvg}%</p>
                </div>
                
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-center items-center text-center">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl mb-3">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Assessments</p>
                    <p className="text-3xl font-black text-slate-800">{results.length}</p>
                </div>

                <div className="md:col-span-2 bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl shadow-lg relative overflow-hidden flex items-center">
                    <div className="relative z-10">
                        <h3 className="text-white font-black text-2xl mb-1">Dean's List Status</h3>
                        <p className="text-indigo-100 text-sm opacity-80">You are currently in the top 15% of your batch. Keep it up!</p>
                    </div>
                    <Award className="absolute right-[-20px] bottom-[-20px] w-48 h-48 text-white opacity-10 rotate-12" />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-indigo-500" />
                        Performance Ledger
                    </h3>
                </div>
                
                <div className="divide-y divide-slate-100">
                    {isLoading ? (
                        <div className="p-12 text-center text-slate-400">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                        </div>
                    ) : results.length === 0 ? (
                        <div className="p-16 text-center text-slate-400">
                            <BookOpen className="w-16 h-16 text-slate-100 mx-auto mb-4" />
                            <h4 className="text-lg font-bold text-slate-600">No results found.</h4>
                            <p className="text-sm">Grades will appear here once faculty commits the ledger.</p>
                        </div>
                    ) : results.map(res => {
                        const grade = getGrade(res.marksObtained, res.exam?.maxMarks || 100);
                        return (
                            <div key={res.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                                <div className="flex gap-4 items-start">
                                    <div className={`p-3 rounded-xl shrink-0 font-black text-xl w-14 h-14 flex items-center justify-center ${grade.c}`}>
                                        {grade.l}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 text-lg">{res.exam?.title}</h4>
                                        <div className="flex items-center gap-3 mt-1 text-xs font-bold text-slate-400 uppercase tracking-tighter">
                                            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(res.exam?.examDate).toLocaleDateString()}</span>
                                            <span className="px-1.5 py-0.5 bg-slate-100 rounded">{res.exam?.course?.title}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                                        <p className="text-xl font-black text-slate-800">
                                            {res.marksObtained} <span className="text-sm text-slate-300">/ {res.exam?.maxMarks}</span>
                                        </p>
                                    </div>
                                    <div className="hidden md:block w-px h-10 bg-slate-100"></div>
                                    <div className="max-w-[200px]">
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Feedback</p>
                                        <p className="text-xs italic text-slate-500 line-clamp-2">{res.remarks || "No teacher remarks provided."}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-slate-300" />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StudentResultsPage;
