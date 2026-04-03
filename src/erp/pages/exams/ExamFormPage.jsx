import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useExamStore from '../../stores/examStore';
import Toast from '../../components/ui/Toast';
import useCourseStore from '../../stores/courseStore';
import PageHeader from '../../components/common/PageHeader';
import { Save, BookOpen, Clock, Calendar, CheckCircle } from 'lucide-react';

const ExamFormPage = () => {
  const { id } = useParams(); // For edit mode
  const navigate = useNavigate();
  const { exams, createExam, updateExam, isLoading: isExamLoading, fetchExams, error: examError } = useExamStore();
  const { courses, batches, fetchCourses, fetchBatches } = useCourseStore();
  const [toast, setToast] = useState(null);

  const isEditMode = !!id;
  const exam = exams.find(e => e.documentId === id);

  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm();
  const selectedCourse = watch('course');

  useEffect(() => {
    fetchCourses();
    fetchBatches();
    if (isEditMode && !exam) {
      fetchExams();
    }
  }, []);

  useEffect(() => {
    if (isEditMode && exam) {
      reset({
        title: exam.title,
        examDate: exam.examDate,
        maxMarks: exam.maxMarks,
        passingMarks: exam.passingMarks,
        type: exam.type,
        status: exam.status,
        course: exam.course?.documentId,
        batch: exam.batch?.documentId
      });
    }
  }, [exam]);

  const filteredBatches = batches.filter(b => selectedCourse ? b.course?.documentId === selectedCourse : true);

  const onSubmit = async (data) => {
    // Build payload with proper Strapi v5 relation format
    const payload = {
      title: data.title,
      examDate: data.examDate,
      type: data.type,
      status: data.status,
      maxMarks: parseInt(data.maxMarks, 10),
      passingMarks: parseInt(data.passingMarks, 10),
      // Convert relation fields to Strapi v5 object format
      course: data.course ? { documentId: data.course } : null,
      batch: data.batch ? { documentId: data.batch } : null,
    };
    
    let res;
    if (isEditMode) {
      res = await updateExam(id, payload);
    } else {
      res = await createExam(payload);
    }

    if (res.success) {
      setToast({ message: isEditMode ? 'Examination updated successfully!' : 'Assessment scheduled successfully!', type: 'success' });
      setTimeout(() => navigate('/erp/exams'), 1500);
    } else {
      setToast({ message: res.error || 'Failed to save examination', type: 'error' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-12">
      <PageHeader 
        title={isEditMode ? 'Edit Examination' : 'Schedule New Assessment'} 
        subtitle="Configure exam parameters and assignment criteria."
        backTo="/erp/exams"
      />

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Exam Title *</label>
              <div className="relative">
                 <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                 <input
                   {...register('title', { required: true })}
                   type="text"
                   placeholder="Mid-term Theory 2026 / Final Year Project Viva"
                   className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                 />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Scheduled Date *</label>
              <div className="relative">
                 <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                 <input
                   {...register('examDate', { required: true })}
                   type="date"
                   className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                 />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Exam Type</label>
              <div className="relative">
                 <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                 <select
                   {...register('type', { required: true })}
                   className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium appearance-none"
                 >
                   <option value="theory">Theory Assessment</option>
                   <option value="practical">Practical / Viva</option>
                   <option value="internal">Internal Assignment</option>
                   <option value="final">Final Examination</option>
                 </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Maximum Marks *</label>
              <input
                {...register('maxMarks', { required: true, min: 1 })}
                type="number"
                placeholder="100"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold text-indigo-700"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Passing Marks *</label>
              <input
                {...register('passingMarks', { required: true, min: 0 })}
                type="number"
                placeholder="40"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-bold text-emerald-700"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Examination Status</label>
              <div className="relative">
                 <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
                 <select
                   {...register('status', { required: true })}
                   className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium appearance-none"
                 >
                   <option value="upcoming">Upcoming Schedule</option>
                   <option value="conducted">Conducted / Completed</option>
                   <option value="cancelled">Cancelled</option>
                   <option value="postponed">Postponed</option>
                 </select>
              </div>
            </div>

            <div className="md:col-span-2 border-t border-slate-100 pt-6 mt-2">
                 <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Assignment Criteria</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Target Course *</label>
                      <select
                        {...register('course', { required: true })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium"
                      >
                        <option value="">Select Primary Department</option>
                        {courses.map(c => <option key={c.documentId} value={c.documentId}>{c.title}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Target Batch (Optional)</label>
                      <select
                        {...register('batch')}
                        disabled={!selectedCourse}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 transition-all text-sm font-medium disabled:opacity-50"
                      >
                        <option value="">Apply to All Batches in Course</option>
                        {filteredBatches.map(b => <option key={b.documentId} value={b.documentId}>{b.name}</option>)}
                      </select>
                    </div>
                 </div>
            </div>
          </div>

          <div className="pt-8 flex justify-end gap-4 border-t border-slate-100">
            <button 
              type="button" 
              onClick={() => navigate('/erp/exams')}
              className="px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              Discard Changes
            </button>
            <button 
              type="submit" 
              disabled={isExamLoading}
              className="flex items-center gap-2 px-10 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95 disabled:bg-slate-300"
            >
              {isExamLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Committing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  {isEditMode ? 'Commit Updates' : 'Publish Schedule'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default ExamFormPage;
