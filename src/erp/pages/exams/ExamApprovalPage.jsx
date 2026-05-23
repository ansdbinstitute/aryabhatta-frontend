import React, { useEffect, useState } from 'react';
import useExamApprovalStore from '../../stores/examApprovalStore';
import useExamStore from '../../stores/examStore';
import useStudentStore from '../../stores/studentStore';
import PageHeader from '../../components/common/PageHeader';
import DataTable from '../../components/ui/DataTable';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, Eye, Search, X, User, BookOpen, Calendar, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const ExamApprovalPage = () => {
  const { pendingApprovals, approvals, fetchPendingApprovals, fetchApprovals, approveRequest, rejectRequest, isLoading } = useExamApprovalStore();
  const { exams, fetchExams } = useExamStore();
  const { students, fetchStudents } = useStudentStore();
  const [activeTab, setActiveTab] = useState('pending');
  const [actionModal, setActionModal] = useState({ open: false, type: null, approval: null });
  const [remarks, setRemarks] = useState('');
  const [processing, setProcessing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedRequest, setExpandedRequest] = useState(null);

  useEffect(() => {
    fetchPendingApprovals();
    fetchApprovals();
    fetchExams();
    fetchStudents({ status: 'active' });
  }, [fetchPendingApprovals, fetchApprovals, fetchExams, fetchStudents]);

  const handleOpenAction = (type, approval) => {
    setActionModal({ open: true, type, approval });
    setRemarks(approval.remarks || '');
  };

  const handleCloseAction = () => {
    setActionModal({ open: false, type: null, approval: null });
    setRemarks('');
  };

  const handleSubmitAction = async () => {
    if (!actionModal.approval) return;
    
    setProcessing(true);
    let result;
    
    if (actionModal.type === 'approve') {
      result = await approveRequest(actionModal.approval.id, remarks);
    } else {
      result = await rejectRequest(actionModal.approval.id, remarks);
    }
    
    setProcessing(false);
    
    if (result.success) {
      handleCloseAction();
      fetchPendingApprovals();
      fetchApprovals();
    }
  };

  const toggleExpand = (id) => {
    setExpandedRequest(expandedRequest === id ? null : id);
  };

  const filteredPending = pendingApprovals.filter(item => {
    if (!searchTerm) return true;
    const studentName = `${item.student?.firstName || ''} ${item.student?.lastName || ''}`.toLowerCase();
    const examName = item.exam?.title?.toLowerCase() || '';
    const studentUid = item.student?.uid?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return studentName.includes(search) || examName.includes(search) || studentUid.includes(search);
  });

  const filteredApprovals = approvals.filter(item => {
    if (!searchTerm) return true;
    const studentName = `${item.student?.firstName || ''} ${item.student?.lastName || ''}`.toLowerCase();
    const examName = item.exam?.title?.toLowerCase() || '';
    const studentUid = item.student?.uid?.toLowerCase() || '';
    const search = searchTerm.toLowerCase();
    return studentName.includes(search) || examName.includes(search) || studentUid.includes(search);
  });

  const renderRequestCard = (approval) => (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm">
      <pre className="whitespace-pre-wrap font-mono text-slate-700 text-xs leading-relaxed">
        {approval.remarks || 'No request message'}
      </pre>
    </div>
  );

  const pendingColumns = [
    {
      label: 'Student',
      render: (_, row) => (
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
              {row.student?.firstName?.charAt(0) || 'S'}
            </div>
            <div>
              <p className="font-medium text-slate-800">
                {row.student?.firstName} {row.student?.lastName}
              </p>
              <p className="text-xs text-slate-500 font-mono">{row.student?.uid || 'No UID'}</p>
            </div>
          </div>
        </div>
      )
    },
    {
      label: 'Exam Details',
      render: (_, row) => (
        <div>
          <p className="font-medium text-slate-800">{row.exam?.title}</p>
          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            {row.course?.title && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {row.course.title}
              </span>
            )}
            {row.student?.batch?.name && (
              <span className="px-2 py-0.5 bg-slate-100 rounded">
                {row.student.batch.name}
              </span>
            )}
          </div>
          {row.exam?.scheduledDate && (
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {format(new Date(row.exam.scheduledDate), 'dd MMM yyyy')}
            </p>
          )}
        </div>
      )
    },
    {
      label: 'Request',
      render: (_, row) => (
        <div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand(row.id);
            }}
            className="flex items-center gap-2 text-primary hover:text-secondary text-sm font-medium"
          >
            <FileText className="w-4 h-4" />
            View Request
            {expandedRequest === row.id ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
          {expandedRequest === row.id && (
            <div className="mt-2 animate-in fade-in slide-in-from-top-2">
              {renderRequestCard(row)}
            </div>
          )}
        </div>
      )
    },
    {
      label: 'Actions',
      align: 'right',
      render: (_, row) => (
        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => handleOpenAction('approve', row)}
            className="p-2 text-emerald-600 hover:text-white hover:bg-emerald-600 transition-colors rounded-lg"
            title="Approve"
          >
            <CheckCircle className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleOpenAction('reject', row)}
            className="p-2 text-red-600 hover:text-white hover:bg-red-600 transition-colors rounded-lg"
            title="Reject"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>
      )
    }
  ];

  const allColumns = [
    {
      label: 'Student',
      render: (_, row) => (
        <div>
          <p className="font-medium text-slate-800">
            {row.student?.firstName} {row.student?.lastName}
          </p>
          <p className="text-xs text-slate-500 font-mono">{row.student?.uid || 'No UID'}</p>
        </div>
      )
    },
    {
      label: 'Exam',
      render: (_, row) => (
        <div>
          <p className="font-medium text-slate-800">{row.exam?.title}</p>
          <p className="text-xs text-slate-500">{row.course?.title || row.exam?.course?.title || 'N/A'}</p>
        </div>
      )
    },
    {
      label: 'Status',
      render: (_, row) => {
        const variants = {
          pending: 'warning',
          approved: 'success',
          rejected: 'danger'
        };
        return (
          <Badge variant={variants[row.status] || 'default'}>
            {row.status?.toUpperCase()}
          </Badge>
        );
      }
    },
    {
      label: 'Processed By',
      render: (_, row) => (
        <span className="text-sm text-slate-600">
          {row.approvedBy?.username || row.approvedBy?.firstName || '-'}
        </span>
      )
    },
    {
      label: 'Processed On',
      render: (_, row) => (
        <span className="text-sm text-slate-600">
          {row.updatedAt ? format(new Date(row.updatedAt), 'dd MMM yyyy') : '-'}
        </span>
      )
    },
    {
      label: 'Request',
      render: (_, row) => (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleExpand(row.id);
          }}
          className="flex items-center gap-1 text-primary hover:text-secondary text-xs"
        >
          <FileText className="w-3 h-3" />
          {expandedRequest === row.id ? 'Hide' : 'View'}
        </button>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Exam Approvals" 
        subtitle="Review and manage student exam requests"
      />

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="border-b border-slate-100">
          <div className="flex items-center justify-between p-4">
            <div className="flex gap-4">
              <button
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeTab === 'pending'
                    ? 'bg-amber-100 text-amber-700'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending
                  {pendingApprovals.length > 0 && (
                    <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {pendingApprovals.length}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeTab === 'all'
                    ? 'bg-slate-100 text-slate-700'
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  All Requests
                </div>
              </button>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
              />
            </div>
          </div>
        </div>

        {expandedRequest && (
          <div className="p-4 bg-slate-50 border-b border-slate-100">
            <p className="text-sm text-slate-600 mb-2">Expanded Request:</p>
            {renderRequestCard((activeTab === 'pending' ? pendingApprovals : approvals).find(p => p.id === expandedRequest) || {})}
          </div>
        )}

        <DataTable
          columns={activeTab === 'pending' ? pendingColumns : allColumns}
          data={activeTab === 'pending' ? filteredPending : filteredApprovals}
          isLoading={isLoading}
          emptyTitle={activeTab === 'pending' ? 'No Pending Approvals' : 'No Requests Found'}
          emptyDescription={activeTab === 'pending' 
            ? 'All exam requests have been processed.' 
            : 'There are no exam requests in the database.'
          }
        />
      </div>

      {actionModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">
            <div className={`flex justify-between items-center p-6 border-b border-slate-100 ${
              actionModal.type === 'approve' ? 'bg-emerald-50' : 'bg-red-50'
            }`}>
              <h3 className={`text-lg font-bold flex items-center gap-2 ${
                actionModal.type === 'approve' ? 'text-emerald-700' : 'text-red-700'
              }`}>
                {actionModal.type === 'approve' ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Approve Exam Request
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5" />
                    Reject Exam Request
                  </>
                )}
              </h3>
              <button 
                onClick={handleCloseAction}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {actionModal.approval?.student?.firstName?.charAt(0) || 'S'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {actionModal.approval?.student?.firstName} {actionModal.approval?.student?.lastName}
                    </p>
                    <p className="text-sm text-slate-500 font-mono">{actionModal.approval?.student?.uid}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500 text-xs">Course</p>
                    <p className="font-medium text-slate-800">
                      {actionModal.approval?.course?.title || actionModal.approval?.student?.course?.title || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">Batch</p>
                    <p className="font-medium text-slate-800">
                      {actionModal.approval?.student?.batch?.name || 'N/A'}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-slate-500 text-xs">Exam</p>
                    <p className="font-medium text-slate-800">
                      {actionModal.approval?.exam?.title}
                      {actionModal.approval?.exam?.scheduledDate && (
                        <span className="text-slate-500 font-normal ml-2">
                          ({format(new Date(actionModal.approval.exam.scheduledDate), 'dd MMM yyyy')})
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Student Request
                </label>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm">
                  <pre className="whitespace-pre-wrap font-mono text-slate-700 text-xs leading-relaxed">
                    {actionModal.approval?.remarks || 'No request message provided'}
                  </pre>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Your Remarks {actionModal.type === 'reject' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={actionModal.type === 'approve' 
                    ? "Add remarks (optional)..." 
                    : "Please provide a reason for rejection..."
                  }
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:border-primary focus:ring-1 focus:ring-primary text-sm"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCloseAction}
                  className="flex-1 px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAction}
                  disabled={processing || (actionModal.type === 'reject' && !remarks.trim())}
                  className={`flex-1 px-4 py-2.5 text-white font-medium rounded-xl transition-colors disabled:opacity-70 ${
                    actionModal.type === 'approve'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {processing ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mx-auto"></div>
                  ) : actionModal.type === 'approve' ? (
                    'Approve'
                  ) : (
                    'Reject'
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

export default ExamApprovalPage;
