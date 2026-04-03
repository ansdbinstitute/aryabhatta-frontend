import React, { useEffect, useState } from 'react';
import useExamApprovalStore from '../../stores/examApprovalStore';
import useExamStore from '../../stores/examStore';
import useAuthStore from '../../stores/authStore';
import PageHeader from '../../components/common/PageHeader';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import useCurrentStudent from '../../../student/hooks/useCurrentStudent';
import { format } from 'date-fns';
import { FileCheck, Clock, CheckCircle, XCircle, Plus, X, Calendar, User, BookOpen } from 'lucide-react';

const ExamRequestsPage = () => {
  const { studentRequests, fetchStudentRequests, createApproval, isLoading } = useExamApprovalStore();
  const { exams, fetchExams } = useExamStore();
  const { user } = useAuthStore();
  const { student } = useCurrentStudent();
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState('');
  const [examDetails, setExamDetails] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchStudentRequests();
    fetchExams();
  }, []);

  const handleOpenRequest = () => {
    setSelectedExam('');
    setExamDetails(null);
    setRequestModalOpen(true);
  };

  const handleCloseRequest = () => {
    setRequestModalOpen(false);
    setSelectedExam('');
    setExamDetails(null);
  };

  const handleExamChange = (examId) => {
    setSelectedExam(examId);
    const exam = exams.find(e => e.id.toString() === examId.toString());
    setExamDetails(exam);
  };

  const generateRequestMessage = () => {
    if (!examDetails || !student) return '';

    const studentName = `${student.firstName || ''} ${student.lastName || ''}`.trim();
    const examName = examDetails.title || 'N/A';
    const examDate = examDetails.scheduledDate 
      ? format(new Date(examDetails.scheduledDate), 'dd MMMM yyyy')
      : 'To be scheduled';
    const courseName = examDetails.course?.title || student.course?.title || 'N/A';
    const batchName = student.batch?.name || 'N/A';
    const studentId = student.uid || student.id || 'N/A';

    return `Subject: Request to Appear in Exam

Dear Sir/Madam,

I hope you are doing well.

I would like to request permission to appear for the ${examName} scheduled on ${examDate}.

Student Details:
• Name: ${studentName}
• Student ID: ${studentId}
• Course: ${courseName}
• Batch: ${batchName}

Kindly approve my request.

Thank you.

Regards,
${studentName}`;
  };

  const handleSubmitRequest = async () => {
    if (!selectedExam) return;
    
    setSubmitting(true);
    
    const requestMessage = generateRequestMessage();

    if (!student) {
      setSubmitting(false);
      return;
    }
    
    const result = await createApproval({
      student: student.id,
      course: examDetails.course?.id || student.course?.id,
      batch: student.batch?.id,
      exam: selectedExam,
      remarks: requestMessage,
      status: 'pending'
    });
    
    setSubmitting(false);
    
    if (result.success) {
      handleCloseRequest();
      fetchStudentRequests();
    }
  };

  const availableExams = exams.filter(exam => {
    const hasExistingRequest = studentRequests.some(
      req => req.exam?.id === exam.id && req.status === 'pending'
    );
    return !hasExistingRequest;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'danger';
      default:
        return 'warning';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="My Exam Requests" 
        subtitle="View and manage your exam appearance requests"
        actions={
          availableExams.length > 0 ? (
            <Button onClick={handleOpenRequest} leftIcon={<Plus className="w-4 h-4" />}>
              Request New Exam
            </Button>
          ) : null
        }
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileCheck className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-slate-800">Your Exam Requests</h3>
          </div>
          <Badge variant="default">
            {studentRequests.length} request{studentRequests.length !== 1 ? 's' : ''}
          </Badge>
        </div>

        {studentRequests.length === 0 ? (
          <div className="p-12 text-center">
            <FileCheck className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700 mb-2">No Exam Requests</h3>
            <p className="text-slate-500 mb-6">
              You haven't requested to appear for any exams yet.
            </p>
            {availableExams.length > 0 && (
              <Button onClick={handleOpenRequest} leftIcon={<Plus className="w-4 h-4" />}>
                Request Your First Exam
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {studentRequests.map((request) => (
              <div key={request.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-800">
                        {request.exam?.title || 'Unknown Exam'}
                      </h4>
                      <Badge variant={getStatusVariant(request.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(request.status)}
                          {request.status?.toUpperCase()}
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        Requested: {request.createdAt ? format(new Date(request.createdAt), 'dd MMM yyyy') : '-'}
                      </span>
                      {request.exam?.scheduledDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Exam Date: {format(new Date(request.exam.scheduledDate), 'dd MMM yyyy')}
                        </span>
                      )}
                    </div>

                    {request.remarks && (
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-line font-mono">
                        {request.remarks}
                      </div>
                    )}
                    
                    {request.approvedBy && (
                      <p className="mt-2 text-xs text-slate-500">
                        Processed by: {request.approvedBy.username || 'Admin'}
                        {request.updatedAt && ` on ${format(new Date(request.updatedAt), 'dd MMM yyyy')}`}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {requestModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl border border-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-primary/5 sticky top-0">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                Request Exam Appearance
              </h3>
              <button 
                onClick={handleCloseRequest}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Select Exam <span className="text-red-500">*</span>
                </label>
                <select
                  value={selectedExam}
                  onChange={(e) => handleExamChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm bg-white"
                >
                  <option value="">Choose an exam...</option>
                  {availableExams.map(exam => (
                    <option key={exam.id} value={exam.id}>
                      {exam.title}
                      {exam.course?.title ? ` - ${exam.course.title}` : ''}
                      {exam.scheduledDate ? ` (${format(new Date(exam.scheduledDate), 'dd MMM yyyy')})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              {selectedExam && examDetails && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Your Request (Auto-generated)
                  </label>
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700 whitespace-pre-line font-mono">
                    {generateRequestMessage()}
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    This request will be sent to the administrator for approval.
                  </p>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseRequest}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRequest}
                  disabled={!selectedExam || submitting}
                  className="flex-1 px-4 py-2.5 bg-primary text-white font-medium rounded-xl transition-colors disabled:opacity-70 hover:bg-secondary"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mx-auto"></div>
                  ) : (
                    'Submit Request'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamRequestsPage;
