import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useStudentStore from '../../stores/studentStore';
import useResultStore from '../../stores/resultStore';
import usePaymentStore from '../../stores/paymentStore';
import useMaterialStore from '../../stores/materialStore';
import usePermission from '../../hooks/usePermission';
import useToast from '../../hooks/useToast';
import useUIStore from '../../stores/uiStore';
import PageHeader from '../../components/common/PageHeader';
import Button from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import LoadingScreen from '../../components/common/LoadingScreen';
import EmptyState from '../../components/common/EmptyState';
import { formatDate, getMediaUrl } from '../../utils/helpers';
import Modal from '../../components/ui/Modal';
import {
  User,
  Shield,
  CheckCircle,
  Check,
  Award,
  FileText,
  FolderOpen,
  CreditCard,
  Download,
  Eye,
  IndianRupee,
  Clock,
  ExternalLink,
} from 'lucide-react';

const StudentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { can, isInstituteAdmin } = usePermission();
  const showConfirm = useUIStore((s) => s.showConfirm);

  // Use individual selectors to prevent re-renders from global isLoading updates
  const currentStudent = useStudentStore((s) => s.currentStudent);
  const fetchStudentById = useStudentStore((s) => s.fetchStudentById);
  const deleteStudent = useStudentStore((s) => s.deleteStudent);
  const createPortalAccess = useStudentStore((s) => s.createPortalAccess);
  const globalLoading = useStudentStore((s) => s.isLoading);

  const payments = usePaymentStore((s) => s.payments);
  const fetchPaymentsByStudent = usePaymentStore((s) => s.fetchPaymentsByStudent);

  const materials = useMaterialStore((s) => s.materials);
  const fetchMaterialsByCourse = useMaterialStore((s) => s.fetchMaterialsByCourse);

  const results = useResultStore((s) => s.results);
  const fetchResultsByStudent = useResultStore((s) => s.fetchResultsByStudent);
  const isResultsLoading = useResultStore((s) => s.isLoading);

  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isPortalModalOpen, setPortalModalOpen] = useState(false);
  const [portalCredentials, setPortalCredentials] = useState(null);
  const [isGeneratingPortal, setGeneratingPortal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const loadProfile = async () => {
      // Only show full-page loading if we don't already have this student in store
      // This prevents jittering during navigation or re-fetching.
      if (!currentStudent || currentStudent.id !== id) {
        setIsProfileLoading(true);
      }
      await fetchStudentById(id);
      setIsProfileLoading(false);
    };

    loadProfile();
  }, [id, fetchStudentById]);

  useEffect(() => {
    if (!currentStudent?.id) return;

    // Pass both documentId (id) and integer id (integerId) — the payment store
    // will use integerId when available for a reliable Strapi v5 filter.
    fetchPaymentsByStudent(currentStudent.id, currentStudent.integerId);
    if (currentStudent.course?.id) {
      fetchMaterialsByCourse(currentStudent.course.id);
    }
    fetchResultsByStudent(currentStudent.id);
  }, [
    currentStudent?.id,
    currentStudent?.course?.id,
    fetchPaymentsByStudent,
    fetchMaterialsByCourse,
    fetchResultsByStudent,
  ]);

  // Only show full loading screen if we're doing the initial student profile load.
  // This isolates the UI from other global store activity (jitter).
  if (isProfileLoading) {
    return <LoadingScreen />;
  }

  // If we don't have a student and we're not loading, show empty state or 404
  if (!currentStudent && !isProfileLoading) {
    return (
      <div className="max-w-7xl mx-auto pt-20">
        <EmptyState 
          icon="search"
          title="Student Not Found" 
          description="The student you're looking for doesn't exist or you don't have permission to view it."
          action={<Button onClick={() => navigate('/erp/students')}>Back to List</Button>}
        />
      </div>
    );
  }

  const hasPortalAccess = Boolean(currentStudent.user);
  const totalFee = Number(currentStudent.totalFee || 0);
  const totalPaid =
    payments?.reduce((sum, payment) => {
      return payment.status === 'completed' ? sum + Number(payment.amount || 0) : sum;
    }, 0) || 0;
  const balance = Math.max(totalFee - totalPaid, 0);

  const handleDelete = () => {
    showConfirm(
      'Delete Student',
      `Are you sure you want to delete ${currentStudent.firstName}? This action cannot be undone.`,
      async () => {
        const res = await deleteStudent(id);
        if (res.success) {
          toast.success('Student deleted successfully');
          navigate('/erp/students');
          return;
        }
        toast.error(res.error || 'Failed to delete student');
      }
    );
  };

  const handleCreatePortal = async () => {
    setGeneratingPortal(true);
    const res = await createPortalAccess(id);
    setGeneratingPortal(false);

    if (!res.success) {
      toast.error(res.error || 'Failed to generate portal credentials');
      return;
    }

    setPortalCredentials({
      username: res.data.username,
      password: res.data.password,
    });
    setPortalModalOpen(true);
    fetchStudentById(id);
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
      <PageHeader
        title={`${currentStudent.firstName} ${currentStudent.lastName}`}
        subtitle={
          <div className="flex items-center gap-4 mt-1">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold">
              UID: {currentStudent.uid || currentStudent.id}
            </span>
            <StatusBadge status={currentStudent.status} />
          </div>
        }
        actions={
          <>
            <Button
              variant="outline"
              icon="badge"
              onClick={() => navigate(`/erp/students/${id}/id-card`)}
            >
              ID Card
            </Button>
            {can('update', 'students') && (
              <Button
                variant="primary"
                icon="edit"
                onClick={() => navigate(`/erp/students/${id}/edit`)}
              >
                Edit
              </Button>
            )}
            {can('delete', 'students') && (
              <Button
                variant="danger"
                icon="delete"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </>
        }
      />

      <div className="bg-white rounded-xl border border-erp-border shadow-sm mb-6">
        <div className="flex overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'payments', label: 'Payments & Dues', icon: CreditCard },
            { id: 'materials', label: 'Study Materials', icon: FolderOpen },
            { id: 'results', label: 'Results', icon: Award },
            { id: 'certificates', label: 'Certificates', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-erp-border p-6 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold shrink-0 overflow-hidden">
                  {currentStudent.profileImage ? (
                    <img
                      src={getMediaUrl(currentStudent.profileImage)}
                      alt={currentStudent.firstName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    `${currentStudent.firstName?.[0] || ''}${currentStudent.lastName?.[0] || ''}`
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-800">
                    {currentStudent.firstName} {currentStudent.lastName}
                  </h2>
                  <div className="mt-4 grid grid-cols-2 gap-y-3">
                    <div>
                      <p className="text-xs text-slate-400">Course</p>
                      <p className="font-medium text-slate-700">
                        {currentStudent.course?.title || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Batch</p>
                      <p className="font-medium text-slate-700">
                        {currentStudent.batch?.name || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Enrollment Date</p>
                      <p className="font-medium text-slate-700">
                        {formatDate(currentStudent.enrollmentDate) || '-'}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Total Fee</p>
                      <p className="font-medium text-slate-700">
                        ₹{totalFee.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Amount Paid</p>
                      <p className="font-medium text-green-600">
                        ₹{totalPaid.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Balance Due</p>
                      <p className={`font-medium ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        ₹{balance.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-erp-border shadow-sm overflow-hidden">
              <div className="border-b border-erp-border px-6 py-4 bg-slate-50">
                <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Personal Details
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  <DetailRow label="Date of Birth" value={formatDate(currentStudent.dob)} />
                  <DetailRow label="Gender" value={currentStudent.gender} />
                  <DetailRow label="Father's Name" value={currentStudent.fatherName} />
                  <DetailRow label="Mother's Name" value={currentStudent.motherName} />
                  <DetailRow label="Phone" value={currentStudent.phone} />
                  <DetailRow label="Alternative Phone" value={currentStudent.altPhone} />
                  <DetailRow label="Email" value={currentStudent.email} />
                  <DetailRow label="Aadhar Number" value={currentStudent.aadharNumber} />
                  <div className="md:col-span-2">
                    <DetailRow label="Full Address" value={currentStudent.address} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-erp-border p-6 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-slate-800">
                <Shield className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold">Portal Access</h3>
              </div>
              {hasPortalAccess ? (
                <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <div>
                    <p className="text-sm font-semibold text-green-800">Access Enabled</p>
                    <p className="text-xs text-green-700 mt-1">
                      Student can log in using their email or UID.
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-slate-500 mb-4">
                    Generate credentials to grant portal access.
                  </p>
                  {can('update', 'students') && (
                    <div className="space-y-3">
                      <Button
                        variant="accent"
                        fullWidth
                        icon="key"
                        onClick={handleCreatePortal}
                        loading={isGeneratingPortal}
                      >
                        Generate Credentials
                      </Button>
                      <Button
                        variant="outline"
                        fullWidth
                        onClick={() => navigate('/erp/students/portal-access')}
                      >
                        Manage Portal Access
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SummaryCard
              icon={<IndianRupee className="w-6 h-6 text-primary" />}
              iconWrap="bg-primary/10"
              label="Total Fee"
              value={`₹${totalFee.toLocaleString('en-IN')}`}
              valueClassName="text-slate-800"
            />
            <SummaryCard
              icon={<CheckCircle className="w-6 h-6 text-green-600" />}
              iconWrap="bg-green-100"
              label="Amount Paid"
              value={`₹${totalPaid.toLocaleString('en-IN')}`}
              valueClassName="text-green-600"
            />
            <SummaryCard
              icon={<Clock className={`w-6 h-6 ${balance > 0 ? 'text-red-600' : 'text-green-600'}`} />}
              iconWrap={balance > 0 ? 'bg-red-100' : 'bg-green-100'}
              label="Balance Due"
              value={`₹${balance.toLocaleString('en-IN')}`}
              valueClassName={balance > 0 ? 'text-red-600' : 'text-green-600'}
            />
          </div>

          <div className="bg-white rounded-xl border border-erp-border shadow-sm overflow-hidden">
            <div className="border-b border-erp-border px-6 py-4 bg-slate-50 flex items-center justify-between">
              <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                Payment History
              </h3>
              <Button variant="ghost" size="sm" onClick={() => navigate('/erp/payments')}>
                View All
              </Button>
            </div>
            {payments && payments.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Receipt No.</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Method</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500">Documents</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {payments.slice(0, 10).map((payment) => (
                      <tr key={payment.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm font-medium text-slate-800">
                          {payment.receiptNumber || '-'}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {formatDate(payment.paymentDate)}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-slate-800">
                          ₹{Number(payment.amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600 capitalize">
                          {payment.paymentMethod?.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4">
                          <StatusBadge status={payment.status} />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {payment.paymentSlip?.url ? (
                              <a
                                href={getMediaUrl(payment.paymentSlip)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Slip
                              </a>
                            ) : (
                              <span className="text-sm text-slate-400">No slip</span>
                            )}
                            <button
                              type="button"
                              onClick={() => navigate(`/erp/payments/${payment.documentId || payment.id}/receipt`)}
                              className="text-sm font-medium text-slate-600 hover:text-slate-900"
                            >
                              Receipt
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-8">
                <EmptyState
                  icon="inbox"
                  title="No payments found"
                  description="This student has no payment records yet."
                />
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'materials' && (
        <div className="bg-white rounded-xl border border-erp-border shadow-sm overflow-hidden">
          <div className="border-b border-erp-border px-6 py-4 bg-slate-50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-primary" />
              Study Materials
            </h3>
          </div>
          {materials && materials.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {materials.map((material) => (
                <div key={material.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{material.title}</p>
                      <p className="text-sm text-slate-500 capitalize">{material.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {material.url && (
                      <a href={material.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" icon={<Eye className="w-4 h-4" />}>
                          View
                        </Button>
                      </a>
                    )}
                    {material.file?.url && (
                      <a href={getMediaUrl(material.file)} download>
                        <Button variant="ghost" size="sm" icon={<Download className="w-4 h-4" />}>
                          Download
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8">
              <EmptyState
                icon="folder"
                title="No materials found"
                description="No study materials have been uploaded for this course yet."
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'results' && (
        <div className="bg-white rounded-xl border border-erp-border shadow-sm overflow-hidden">
          <div className="border-b border-erp-border px-6 py-4 bg-slate-50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Exam Results
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/erp/students/results')}>
              Manage All
            </Button>
          </div>
          {isResultsLoading ? (
             <div className="p-12 text-center">
               <div className="w-8 h-8 border-4 border-slate-100 border-t-primary rounded-full animate-spin mx-auto" />
             </div>
          ) : results && results.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Examination</th>
                    <th className="px-6 py-4 text-center">Marks</th>
                    <th className="px-6 py-4 text-center">Grade</th>
                    <th className="px-6 py-4 text-right">Documents</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((result) => (
                    <tr key={result.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-800">{result.exam?.title || 'Unknown Exam'}</p>
                        <p className="text-xs text-slate-400 capitalize">{result.exam?.type || 'Theory'}</p>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-700">
                        {result.marksObtained}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold uppercase">
                           {result.grade || '-'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {result.marksheet?.url ? (
                          <a 
                            href={getMediaUrl(result.marksheet)} 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80"
                          >
                            <Download className="w-4 h-4" />
                            Marksheet
                          </a>
                        ) : (
                          <span className="text-sm text-slate-400 italic">No Marksheet</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8">
              <EmptyState
                icon="inbox"
                title="No results found"
                description="This student has no examination records yet."
              />
            </div>
          )}
        </div>
      )}

      {activeTab === 'certificates' && (
        <div className="bg-white rounded-xl border border-erp-border shadow-sm overflow-hidden">
          <div className="border-b border-erp-border px-6 py-4 bg-slate-50 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Certificates
            </h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/erp/students/certificates')}>
              Manage All
            </Button>
          </div>
          {currentStudent.certificate?.url ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-900/5">
                <Award className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-bold text-slate-800 mb-2">Completion Certificate</h4>
              <p className="text-slate-500 mb-8 max-w-sm mx-auto font-medium">
                The student's official academic certificate is available for viewing and download.
              </p>
              <div className="flex items-center justify-center gap-4">
                <a href={getMediaUrl(currentStudent.certificate)} target="_blank" rel="noreferrer">
                  <Button variant="primary" icon={<Eye className="w-4 h-4" />}>
                    View PDF
                  </Button>
                </a>
                <a href={getMediaUrl(currentStudent.certificate)} download>
                  <Button variant="outline" icon={<Download className="w-4 h-4" />}>
                    Download
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-8">
              <EmptyState
                icon="folder"
                title="No certificate issued"
                description="This student has not been issued a completion certificate yet."
              />
            </div>
          )}
        </div>
      )}

      <Modal
        isOpen={isPortalModalOpen}
        onClose={() => setPortalModalOpen(false)}
        title="Portal Credentials Generated"
        footer={<Button onClick={() => setPortalModalOpen(false)}>Done</Button>}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">Access Granted</h3>
          <p className="text-sm text-slate-500 mb-6 px-4">
            Share these credentials with the student securely.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-left max-w-sm mx-auto">
            <div className="mb-3">
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Username / UID
              </p>
              <p className="font-mono text-slate-800 font-medium">{portalCredentials?.username}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">
                Password
              </p>
              <p className="font-mono text-slate-800 font-medium bg-white px-2 py-1 border border-slate-200 rounded">
                {portalCredentials?.password}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

const SummaryCard = ({ icon, iconWrap, label, value, valueClassName }) => (
  <div className="bg-white rounded-xl border border-erp-border p-6 shadow-sm">
    <div className="flex items-center gap-3">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconWrap}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
      </div>
    </div>
  </div>
);

const DetailRow = ({ label, value }) => (
  <div className="mb-1">
    <p className="text-xs text-slate-400 mb-0.5">{label}</p>
    <p className="text-sm font-medium text-slate-800 break-words">{value || '-'}</p>
  </div>
);

export default StudentDetailPage;
