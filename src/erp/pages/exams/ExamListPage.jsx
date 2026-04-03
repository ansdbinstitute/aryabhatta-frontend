import React, { useEffect, useState } from 'react';
import useExamStore from '../../stores/examStore';
import useCourseStore from '../../stores/courseStore';
import PageHeader from '../../components/common/PageHeader';
import { BookOpen, Calendar, Plus, Filter, FileText, ChevronRight, CheckCircle, Clock, Edit2, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ExamListPage = () => {
  const { exams, fetchExams, deleteExam, isLoading } = useExamStore();
  const { courses, batches, fetchCourses, fetchBatches } = useCourseStore();

  const [activeCourse, setActiveCourse] = useState('');
  const [activeBatch, setActiveBatch] = useState('');

  useEffect(() => {
    fetchCourses();
    fetchBatches();
    fetchExams();
  }, []);

  useEffect(() => {
    fetchExams({ course: activeCourse, batch: activeBatch });
  }, [activeCourse, activeBatch]);

  const getExamTypeLabel = (type) => {
    const types = {
      theory: 'Theory',
      practical: 'Practical',
      internal: 'Internal',
      final: 'Final'
    };
    return types[type] || 'Unknown';
  };

  const isExamUpcoming = (date) => new Date(date) > new Date();

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <PageHeader title="Examinations" subtitle="Schedule assessments and manage student performance records." />
        <Link 
          to="/erp/exams/new"
          className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Schedule New Exam
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-500 mr-2">
          <Filter className="w-5 h-5" />
          <span className="font-semibold text-sm">Filters:</span>
        </div>
        
        <select 
          value={activeCourse} 
          onChange={(e) => setActiveCourse(e.target.value)}
          className="border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Courses</option>
          {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>

        <select 
          value={activeBatch} 
          onChange={(e) => setActiveBatch(e.target.value)}
          className="border-slate-200 rounded-lg text-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">All Batches</option>
          {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>

      {isLoading && exams.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : exams.length === 0 ? (
        <div className="bg-white border text-center border-slate-100 rounded-2xl p-16 shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700">No exams scheduled.</h3>
          <p className="text-sm text-slate-400 mt-2">Initialize your first assessment for the current batch.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Assessment Title</th>
                <th className="px-4 py-4 text-center">Date</th>
                <th className="px-4 py-4 text-center">Marks</th>
                <th className="px-4 py-4">Applied Course / Batch</th>
                <th className="px-4 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {exams.map(exam => {
                const upcoming = isExamUpcoming(exam.examDate);
                return (
                  <tr key={exam.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-800 text-sm">{exam.title}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">
                        {getExamTypeLabel(exam.type)} Assessment
                      </p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <Calendar className="w-4 h-4 text-slate-400 mb-1" />
                        <span className="text-xs font-semibold text-slate-600">{new Date(exam.examDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded">
                          {exam.passingMarks}/{exam.maxMarks}
                        </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm font-medium text-slate-700">{exam.course?.title}</p>
                      <p className="text-xs text-slate-400">{exam.batch?.name || 'All Batches'}</p>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {exam.status === 'conducted' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3" /> Conducted
                        </span>
                      ) : exam.status === 'cancelled' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full uppercase tracking-wider">
                           Cancelled
                        </span>
                      ) : exam.status === 'postponed' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-full uppercase tracking-wider">
                           Postponed
                        </span>
                      ) : upcoming ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-wider">
                          <Clock className="w-3 h-3" /> Upcoming
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">
                          <CheckCircle className="w-3 h-3" /> Conducted
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex items-center justify-end gap-2 whitespace-nowrap">
                      {(exam.status === 'conducted' || (!upcoming && exam.status !== 'cancelled')) ? (
                        <Link 
                          to={`/erp/exams/${exam.documentId}/results`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-colors border border-indigo-100"
                        >
                          <FileText className="w-4 h-4" />
                          Enter Results
                        </Link>
                      ) : (
                        <div className="w-[100px]" /> // Spacer to keep alignment
                      )}
                      
                      <Link 
                        to={`/erp/exams/${exam.documentId}/edit`}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title="Edit Schedule"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Link>

                      <button 
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this exam schedule? This will also remove any associated results.')) {
                            deleteExam(exam.documentId);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Schedule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExamListPage;
