import React, { lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import useRolePermissionStore from '../stores/rolePermissionStore';
import usePermission from '../hooks/usePermission';
import { ROLES } from '../utils/constants';
import { Loader2, Wrench } from 'lucide-react';

// Eager load critical components (needed for auth check)
import AdminLayout from '../components/layout/AdminLayout';
import StudentLayout from '../components/layout/StudentLayout';

// Lazy load all pages (they don't need to load until accessed)
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const DashboardPage = lazy(() => import('../pages/dashboard/DashboardPage'));
const StudentListPage = lazy(() => import('../pages/students/StudentListPage'));
const StudentFormPage = lazy(() => import('../pages/students/StudentFormPage'));
const StudentDetailPage = lazy(() => import('../pages/students/StudentDetailPage'));
const StudentIDCardPage = lazy(() => import('../pages/students/StudentIDCardPage'));
const IDCardsPage = lazy(() => import('../pages/students/IDCardsPage'));
const PortalAccessPage = lazy(() => import('../pages/students/PortalAccessPage'));
const CertificatesPage = lazy(() => import('../pages/students/CertificatesPage'));
const StudentResultsPageList = lazy(() => import('../pages/students/StudentResultsPage'));
const CertificatePage = lazy(() => import('../pages/students/CertificatePage'));
const CourseListPage = lazy(() => import('../pages/courses/CourseListPage'));
const CourseFormPage = lazy(() => import('../pages/courses/CourseFormPage'));
const CourseDetailPage = lazy(() => import('../pages/courses/CourseDetailPage'));
const StaffListPage = lazy(() => import('../pages/staff/StaffListPage'));
const StaffFormPage = lazy(() => import('../pages/staff/StaffFormPage'));
const StaffDetailPage = lazy(() => import('../pages/staff/StaffDetailPage'));
const BranchManagementPage = lazy(() => import('../pages/branches/BranchManagementPage'));
const ExamListPage = lazy(() => import('../pages/exams/ExamListPage'));
const ExamFormPage = lazy(() => import('../pages/exams/ExamFormPage'));
const ResultsEntryPage = lazy(() => import('../pages/exams/ResultsEntryPage'));
const ExamApprovalPage = lazy(() => import('../pages/exams/ExamApprovalPage'));
const ExamRequestsPage = lazy(() => import('../pages/students/ExamRequestsPage'));
const StudentResultsPage = lazy(() => import('../pages/exams/StudentResultsPage'));
const NoticeListPage = lazy(() => import('../pages/notices/NoticeListPage'));
const NoticeFormPage = lazy(() => import('../pages/notices/NoticeFormPage'));
const NoticeDetailPage = lazy(() => import('../pages/notices/NoticeDetailPage'));
const BatchListPage = lazy(() => import('../pages/batches/BatchListPage'));
const BatchFormPage = lazy(() => import('../pages/batches/BatchFormPage'));
const BatchDetailPage = lazy(() => import('../pages/batches/BatchDetailPage'));
const MarkAttendancePage = lazy(() => import('../pages/attendance/MarkAttendancePage'));
const AttendanceReportPage = lazy(() => import('../pages/attendance/AttendanceReportPage'));
const AttendanceHistoryPage = lazy(() => import('../pages/attendance/AttendanceHistoryPage'));
const FeeStructureListPage = lazy(() => import('../pages/finance/FeeStructureListPage'));
const FeeStructureFormPage = lazy(() => import('../pages/finance/FeeStructureFormPage'));
const PaymentListPage = lazy(() => import('../pages/finance/PaymentListPage'));
const RecordPaymentPage = lazy(() => import('../pages/finance/RecordPaymentPage'));
const PaymentReceiptPage = lazy(() => import('../pages/finance/PaymentReceiptPage'));
const StudentFeeSummaryPage = lazy(() => import('../../student/pages/StudentFeeSummaryPage'));
const GlobalSettingsPage = lazy(() => import('../pages/settings/GlobalSettingsPage'));
const UserManagementPage = lazy(() => import('../pages/users/UserManagementPage'));
const RolePermissionsPage = lazy(() => import('../pages/users/RolePermissionsPage'));
const StudyMaterialPage = lazy(() => import('../pages/materials/StudyMaterialPage'));
const TimetableManagePage = lazy(() => import('../pages/timetable/TimetableManagePage'));
const TimetableViewPage = lazy(() => import('../pages/timetable/TimetableViewPage'));
const PlacementPartnersPage = lazy(() => import('../pages/placements/PlacementPartnersPage'));
const PartnerFormPage = lazy(() => import('../pages/placements/PartnerFormPage'));
const PlacementTestimonialsPage = lazy(() => import('../pages/placements/PlacementTestimonialsPage'));
const TestimonialFormPage = lazy(() => import('../pages/placements/TestimonialFormPage'));
const UserProfilePage = lazy(() => import('../pages/profile/UserProfilePage'));

// Initialize auth on module load
useAuthStore.getState().initialize();

// Loading fallback
const PageLoader = ({ message = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-erp-bg">
    <Loader2 className="w-10 h-10 text-primary animate-spin" />
    <p className="mt-4 text-slate-400 text-sm font-erp">{message}</p>
  </div>
);

const ComingSoon = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
    <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
      <Wrench className="w-8 h-8 text-accent" />
    </div>
    <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
    <p className="text-sm text-slate-400">This module is coming soon.</p>
  </div>
);

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const user = useAuthStore((s) => s.user);

  if (!isInitialized) {
    return <PageLoader message="Securing session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/erp/login" replace />;
  }

  if (user?.roleType === ROLES.STUDENT) {
    return <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

const RoleRoute = ({ roles, children }) => {
  const user = useAuthStore((s) => s.user);
  const role = user?.roleType;

  if (!role || !roles.includes(role)) {
    return <Navigate to="/erp/dashboard" replace />;
  }

  return children;
};

const PermissionRoute = ({ resource, action = 'read', actions, roles, children }) => {
  const { role, can } = usePermission();
  const isPermissionsReady = useRolePermissionStore((s) => s.isInitialized);

  if (!role || !isPermissionsReady) {
    return <PageLoader message="Verifying permissions..." />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/erp/dashboard" replace />;
  }

  const requiredActions = actions || [action];
  const isAllowed = requiredActions.some((requiredAction) => can(requiredAction, resource));

  if (!isAllowed) {
    return <Navigate to="/erp/dashboard" replace />;
  }

  return children;
};

const LayoutSwitch = () => {
  const role = useAuthStore((s) => s.user?.roleType);

  if (role === ROLES.STUDENT) {
    return <StudentLayout />;
  }
  return <AdminLayout />;
};

const ErpRoutes = () => {
  return (
    <React.Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public auth routes */}
        <Route path="login" element={<LoginPage />} />

        {/* Protected routes */}
        <Route
          element={
            <ProtectedRoute>
              <LayoutSwitch />
            </ProtectedRoute>
          }
        >
          {/* Dashboard — All roles */}
          <Route path="dashboard" element={<PermissionRoute resource="dashboard"><DashboardPage /></PermissionRoute>} />

          {/* Students */}
          <Route path="students" element={<PermissionRoute resource="students"><StudentListPage /></PermissionRoute>} />
          <Route path="students/new" element={<PermissionRoute resource="students" action="create"><StudentFormPage /></PermissionRoute>} />
          <Route path="students/:id" element={<PermissionRoute resource="students"><StudentDetailPage /></PermissionRoute>} />
          <Route path="students/:id/edit" element={<PermissionRoute resource="students" action="update"><StudentFormPage /></PermissionRoute>} />
          <Route path="students/portal-access" element={<PermissionRoute resource="students" action="update"><PortalAccessPage /></PermissionRoute>} />
          <Route path="students/id-cards" element={<PermissionRoute resource="id-cards"><IDCardsPage /></PermissionRoute>} />
          <Route path="students/:id/id-card" element={<PermissionRoute resource="id-cards"><StudentIDCardPage /></PermissionRoute>} />
          <Route path="students/certificates" element={<PermissionRoute resource="certificates"><CertificatesPage /></PermissionRoute>} />
          <Route path="students/:id/certificate" element={<PermissionRoute resource="certificates"><CertificatePage /></PermissionRoute>} />
          <Route path="students/results" element={<PermissionRoute resource="results"><StudentResultsPageList /></PermissionRoute>} />

          {/* Courses */}
          <Route path="courses" element={<PermissionRoute resource="courses"><CourseListPage /></PermissionRoute>} />
          <Route path="courses/new" element={<PermissionRoute resource="courses" action="create"><CourseFormPage /></PermissionRoute>} />
          <Route path="courses/:id" element={<PermissionRoute resource="courses"><CourseDetailPage /></PermissionRoute>} />
          <Route path="courses/:id/edit" element={<PermissionRoute resource="courses" action="update"><CourseFormPage /></PermissionRoute>} />

          {/* Staff */}
          <Route path="staff" element={<PermissionRoute resource="staff" roles={[ROLES.INSTITUTE_ADMIN]}><StaffListPage /></PermissionRoute>} />
          <Route path="staff/new" element={<PermissionRoute resource="staff" action="create" roles={[ROLES.INSTITUTE_ADMIN]}><StaffFormPage /></PermissionRoute>} />
          <Route path="staff/:id" element={<PermissionRoute resource="staff" roles={[ROLES.INSTITUTE_ADMIN]}><StaffDetailPage /></PermissionRoute>} />
          <Route path="staff/:id/edit" element={<PermissionRoute resource="staff" action="update" roles={[ROLES.INSTITUTE_ADMIN]}><StaffFormPage /></PermissionRoute>} />

          {/* Campus Network */}
          <Route path="branches" element={<PermissionRoute resource="campus-network" roles={[ROLES.INSTITUTE_ADMIN]}><BranchManagementPage /></PermissionRoute>} />

          {/* Batches */}
          <Route path="batches" element={<PermissionRoute resource="batches"><BatchListPage /></PermissionRoute>} />
          <Route path="batches/new" element={<PermissionRoute resource="batches" action="create"><BatchFormPage /></PermissionRoute>} />
          <Route path="batches/:id" element={<PermissionRoute resource="batches"><BatchDetailPage /></PermissionRoute>} />
          <Route path="batches/:id/edit" element={<PermissionRoute resource="batches" action="update"><BatchFormPage /></PermissionRoute>} />

          {/* Attendance */}
          <Route path="attendance" element={<PermissionRoute resource="attendance" actions={['read', 'create', 'update']}><MarkAttendancePage /></PermissionRoute>} />
          <Route path="attendance/report" element={<PermissionRoute resource="attendance"><AttendanceReportPage /></PermissionRoute>} />
          <Route path="attendance/history" element={<PermissionRoute resource="attendance"><AttendanceHistoryPage /></PermissionRoute>} />

          {/* Fees */}
          <Route path="fees" element={<PermissionRoute resource="fee-structures"><FeeStructureListPage /></PermissionRoute>} />
          <Route path="fees/new" element={<PermissionRoute resource="fee-structures" action="create"><FeeStructureFormPage /></PermissionRoute>} />
          <Route path="fees/:id/edit" element={<PermissionRoute resource="fee-structures" action="update"><FeeStructureFormPage /></PermissionRoute>} />
          <Route path="payments" element={<PermissionRoute resource="payments"><PaymentListPage /></PermissionRoute>} />
          <Route path="payments/new" element={<PermissionRoute resource="payments" action="create"><RecordPaymentPage /></PermissionRoute>} />
          <Route path="payments/:id/receipt" element={<PermissionRoute resource="payments" actions={['read', 'update']}><PaymentReceiptPage /></PermissionRoute>} />
          <Route path="fees/summary" element={<RoleRoute roles={[ROLES.STUDENT]}><StudentFeeSummaryPage basePath="/erp" /></RoleRoute>} />

          {/* Exams */}
          <Route path="exams" element={<PermissionRoute resource="exams"><ExamListPage /></PermissionRoute>} />
          <Route path="exams/new" element={<PermissionRoute resource="exams" action="create"><ExamFormPage /></PermissionRoute>} />
          <Route path="exams/:id/edit" element={<PermissionRoute resource="exams" action="update"><ExamFormPage /></PermissionRoute>} />
          <Route path="exams/:id/results" element={<PermissionRoute resource="results" actions={['create', 'update']}><ResultsEntryPage /></PermissionRoute>} />
          <Route path="exam-approvals" element={<PermissionRoute resource="exams" roles={[ROLES.INSTITUTE_ADMIN, ROLES.BRANCH_ADMIN, ROLES.TEACHER]}><ExamApprovalPage /></PermissionRoute>} />
          <Route path="my-exam-requests" element={<RoleRoute roles={[ROLES.STUDENT]}><ExamRequestsPage basePath="/erp" /></RoleRoute>} />
          <Route path="results" element={<RoleRoute roles={[ROLES.STUDENT]}><StudentResultsPage /></RoleRoute>} />

          {/* Notices */}
          <Route path="notices" element={<PermissionRoute resource="notices"><NoticeListPage /></PermissionRoute>} />
          <Route path="notices/new" element={<PermissionRoute resource="notices" action="create"><NoticeFormPage /></PermissionRoute>} />
          <Route path="notices/:id" element={<PermissionRoute resource="notices"><NoticeDetailPage /></PermissionRoute>} />
          <Route path="notices/:id/edit" element={<PermissionRoute resource="notices" action="update"><NoticeFormPage /></PermissionRoute>} />

          {/* Materials */}
          <Route path="materials" element={<RoleRoute roles={[ROLES.INSTITUTE_ADMIN, ROLES.BRANCH_ADMIN, ROLES.TEACHER, ROLES.STUDENT]}><StudyMaterialPage /></RoleRoute>} />

          {/* Timetable */}
          <Route path="timetable" element={<RoleRoute roles={[ROLES.INSTITUTE_ADMIN, ROLES.BRANCH_ADMIN, ROLES.TEACHER]}><TimetableManagePage /></RoleRoute>} />
          <Route path="timetable/view" element={<RoleRoute roles={[ROLES.INSTITUTE_ADMIN, ROLES.BRANCH_ADMIN, ROLES.TEACHER, ROLES.STUDENT]}><TimetableViewPage /></RoleRoute>} />

          {/* Placements */}
          <Route path="placements/partners" element={<PermissionRoute resource="placements" roles={[ROLES.INSTITUTE_ADMIN]}><PlacementPartnersPage /></PermissionRoute>} />
          <Route path="placements/partners/new" element={<PermissionRoute resource="placements" action="create" roles={[ROLES.INSTITUTE_ADMIN]}><PartnerFormPage /></PermissionRoute>} />
          <Route path="placements/partners/:id/edit" element={<PermissionRoute resource="placements" action="update" roles={[ROLES.INSTITUTE_ADMIN]}><PartnerFormPage /></PermissionRoute>} />
          <Route path="placements/testimonials" element={<PermissionRoute resource="placements" roles={[ROLES.INSTITUTE_ADMIN]}><PlacementTestimonialsPage /></PermissionRoute>} />
          <Route path="placements/testimonials/new" element={<PermissionRoute resource="placements" action="create" roles={[ROLES.INSTITUTE_ADMIN]}><TestimonialFormPage /></PermissionRoute>} />
          <Route path="placements/testimonials/:id/edit" element={<PermissionRoute resource="placements" action="update" roles={[ROLES.INSTITUTE_ADMIN]}><TestimonialFormPage /></PermissionRoute>} />

          {/* Users */}
          <Route path="users" element={<RoleRoute roles={[ROLES.INSTITUTE_ADMIN]}><PermissionRoute resource="users"><UserManagementPage /></PermissionRoute></RoleRoute>} />
          <Route path="users/permissions" element={<RoleRoute roles={[ROLES.INSTITUTE_ADMIN]}><PermissionRoute resource="access-matrix"><RolePermissionsPage /></PermissionRoute></RoleRoute>} />

          {/* Profile */}
          <Route path="profile" element={<UserProfilePage />} />

          {/* Settings */}
          <Route path="settings" element={<RoleRoute roles={[ROLES.INSTITUTE_ADMIN]}><PermissionRoute resource="settings"><GlobalSettingsPage /></PermissionRoute></RoleRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/erp/dashboard" replace />} />
        </Route>
      </Routes>
    </React.Suspense>
  );
};

export default ErpRoutes;
