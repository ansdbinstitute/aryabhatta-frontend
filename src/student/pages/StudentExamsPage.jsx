import React, { useEffect, useState } from 'react';
import useCurrentStudent from '../hooks/useCurrentStudent';
import useStudentAuthStore from '../stores/studentAuthStore';
import useExamStore from '../../erp/stores/examStore';
import useExamApprovalStore from '../../erp/stores/examApprovalStore';
import useUIStore from '../../erp/stores/uiStore';
import PageHeader from '../../erp/components/common/PageHeader';
import Badge from '../../erp/components/ui/Badge';
import { 
  Bell, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Send,
  AlertCircle,
  FileText,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { format } from 'date-fns';

const StudentExamsPage = () => {
  const { student, isLoading: studentLoading } = useCurrentStudent();
  const { isAuthenticated: isStudentAuth, isLoading: authLoading } = useStudentAuthStore();
  const { exams, fetchExams } = useExamStore();
  const { studentRequests, fetchStudentRequests, createApproval, isLoading: approvalLoading } = useExamApprovalStore();
  const { success, error: showError } = useUIStore();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isStudentAuth && student?.course?.id) {
      fetchExams({
        filters: { course: student.course.id },
        populate: ['course', 'batch']
      });
      fetchStudentRequests();
    }
  }, [isStudentAuth, student]);

  const generateRequestMessage = (exam) => {
    const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
    const examName = exam.title || 'N/A';
    const examDate = exam.examDate 
      ? format(new Date(exam.examDate), 'dd MMMM yyyy')
      : 'TBA';
    const courseName = exam.course?.title || student.course?.title || 'N/A';
    const batchName = student.batch?.name || 'N/A';
    const studentId = student.uid || 'N/A';

    return `Subject: Request to Appear in Exam\n\nDear Sir/Madam,\n\nI hope you are doing well.\n\nI would like to request permission to appear for the ${examName} scheduled on ${examDate}.\n\nStudent Details:\n• Name: ${studentName}\n• Student ID: ${studentId}\n• Course: ${courseName}\n• Batch: ${batchName}\n\nKindly approve my request.\n\nThank you.\n\nRegards,\n${studentName}`;
  };

  const handleRequestApproval = async (exam) => {
    setSubmitting(true);
    const message = generateRequestMessage(exam);
    
    const result = await createApproval({
      student: student.id,
      course: exam.course?.id || student.course?.id,
      batch: student.batch?.id,
      exam: exam.id,
      remarks: message,
      status: 'pending'
    });
    
    if (result.success) {
      success('Exam approval request submitted successfully!');
    } else {
      showError(result.error || 'Failed to submit request');
    }
    
    setSubmitting(false);
    fetchStudentRequests();
  };

  const getApprovalStatus = (examId) => {
    return studentRequests.find(req => 
      req.exam?.id === examId || req.exam?.documentId === examId
    );
  };

  if (studentLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8">
      <div>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-800 flex items-center gap-2 md:gap-3">
           <Bell className="w-6 md:w-7 lg:w-8 h-6 md:h-7 lg:h-8 text-blue-600" />
           Exam Notices & Approvals
        </h2>
        <p className="text-slate-500 font-medium text-xs md:text-sm mt-1 md:mt-2">
          Course: <span className="text-blue-600 underline decoration-blue-200">{student?.course?.title || 'General'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
        {exams.length === 0 ? (
          <div className="xl:col-span-2 py-12 md:py-16 lg:py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
             <AlertCircle className="w-8 md:w-10 lg:w-12 h-8 md:h-10 lg:h-12 text-slate-300 mx-auto mb-3 md:mb-4" />
             <h3 className="text-base md:text-lg font-bold text-slate-800">No Active Exam Campaigns</h3>
             <p className="text-slate-500 font-medium text-xs md:text-sm mt-1">There are no exams currently scheduled for your course.</p>
          </div>
        ) : (
          exams.map((exam) => {
            const approval = getApprovalStatus(exam.id);
            const isPending = approval?.status === 'pending';
            const isApproved = approval?.status === 'approved';
            const isRejected = approval?.status === 'rejected';

            return (
              <div key={exam.id} className="bg-white rounded-2xl md:rounded-3xl border border-slate-100 shadow-sm p-5 md:p-6 lg:p-8 hover:shadow-lg hover:border-blue-100 transition-all group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-slate-50 rounded-full blur-2xl md:blur-3xl -z-10 -mr-12 md:-mr-16 -mt-12 md:-mt-16 group-hover:bg-blue-50 transition-colors" />
                
                <div className="flex items-start justify-between mb-8">
                   <div>
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">{exam.type || 'EXAM'}</p>
                     <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                       {exam.title}
                     </h4>
                   </div>
                   {approval ? (
                      <Badge variant={isApproved ? 'success' : isRejected ? 'danger' : 'warning'}>
                         <div className="flex items-center gap-1.5 py-1 px-1">
                            {isApproved ? <CheckCircle className="w-4 h-4" /> : isRejected ? <XCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                            {approval.status.toUpperCase()}
                         </div>
                      </Badge>
                   ) : (
                      <Badge variant="default">AVAILABLE</Badge>
                   )}
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                   <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Exam Date</p>
                      <p className="text-sm font-black text-slate-700 flex items-center gap-2">
                         <Calendar className="w-4 h-4 text-blue-500" />
                         {exam.examDate ? format(new Date(exam.examDate), 'dd MMM yyyy') : 'TBA'}
                      </p>
                   </div>
                   <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Your Batch</p>
                      <p className="text-sm font-black text-slate-700 flex items-center gap-2 text-blue-600">
                         <ShieldCheck className="w-4 h-4" />
                         {student.batch?.name || 'N/A'}
                      </p>
                   </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 mb-8 max-h-48 overflow-y-auto custom-scrollbar shadow-inner">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 sticky top-0 bg-slate-50 py-1">
                      <FileText className="w-4 h-4 text-blue-400" />
                      Approval Request Body
                   </p>
                   <pre className="text-xs font-mono font-medium text-slate-600 whitespace-pre-wrap leading-relaxed italic">
                      {generateRequestMessage(exam)}
                   </pre>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                   {!approval ? (
                      <button 
                         onClick={() => handleRequestApproval(exam)}
                         disabled={submitting}
                         className="flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white font-black text-sm rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-70 group/btn"
                      >
                         {submitting ? 'PROCESSING...' : 'REQUEST FOR APPROVAL'}
                         <Send className="w-4 h-4 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                      </button>
                   ) : isApproved ? (
                      <p className="text-emerald-600 font-black text-sm flex items-center gap-2 uppercase tracking-tight">
                         <CheckCircle className="w-5 h-5 shadow-emerald-100" />
                         Sitting Confirmed for this Exam
                      </p>
                   ) : isRejected ? (
                      <div className="space-y-1">
                         <p className="text-red-600 font-black text-sm flex items-center gap-2 uppercase tracking-tight">
                           <XCircle className="w-5 h-5" />
                           Application Rejected
                         </p>
                         <p className="text-[10px] text-slate-400 font-bold ml-7 uppercase tracking-widest">Check ERP Remarks</p>
                      </div>
                   ) : (
                      <p className="text-amber-600 font-black text-sm flex items-center gap-2 uppercase tracking-tight">
                         <Clock className="w-5 h-5 animate-pulse" />
                         Awaiting ERP Admin Decision
                      </p>
                   )}
                   
                   <button className="p-2 text-slate-300 hover:text-blue-600 transition-colors">
                      <ChevronRight className="w-6 h-6" />
                   </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Guidance Note */}
      <div className="bg-slate-900 rounded-[40px] p-8 lg:p-12 text-white relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] group-hover:scale-125 transition-transform duration-700" />
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center rotate-12 group-hover:rotate-0 transition-transform shadow-2xl shrink-0">
               <ShieldCheck className="w-10 h-10" />
            </div>
            <div>
               <h3 className="text-2xl font-black tracking-tight mb-3 uppercase">About Approval Process</h3>
               <p className="text-slate-400 font-medium text-sm leading-relaxed max-w-2xl">
                 All exam requests are processed individually based on your attendance, academic standing, and fee clearance. Ensure your submission contains the correct UID and course details before requesting. Once processed by the admin, stats will update here automatically.
               </p>
            </div>
         </div>
      </div>
    </div>
  );
};

export default StudentExamsPage;
